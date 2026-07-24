import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, FileText, Bookmark, Clock, Star, ThumbsUp, ThumbsDown, 
  Printer, Download, Shield, Plus, Edit, Trash2, RotateCcw, Eye, 
  BookOpen, ChevronRight, AlertTriangle, CheckCircle, Info, ExternalLink,
  ChevronDown, Settings, HelpCircle, FileCheck, BarChart3, Tag, Users
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { ADMISSIONS_OPERATIONS_MANUAL_CONTENT } from '../server/repositories/AdmissionsManualData';
import { CAREER_PLACEMENT_HANDBOOK_CONTENT } from '../server/repositories/CareerHandbookData';
import { RECRUITMENT_AI_MANUAL_CONTENT } from '../server/repositories/RecruitmentManualData';
import { TRANSPORTATION_MANUAL_CONTENT } from '../server/repositories/TransportationManualData';
import { STAFF_HANDBOOK_CONTENT } from '../server/repositories/StaffHandbookData';
import { EMERGENCY_SOP_MANUAL_CONTENT } from '../server/repositories/EmergencyManualData';

interface Staff {
  id?: number;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admissions Officer' | 'Operations Officer' | 'Career Officer' | 'Finance Officer' | 'Support Officer';
}

interface Document {
  id: number;
  title: string;
  category: string;
  content: string;
  version: string;
  author: string;
  status: string; // "Draft" | "Published" | "Archived"
  tags: string; // comma-separated
  visibilityByRole: string; // comma-separated or "All"
  createdAt: string;
  updatedAt: string;
}

interface Feedback {
  id: number;
  documentId: number;
  userEmail: string;
  rating: number;
  isHelpful: boolean;
  suggestions: string;
  isOutdated: boolean;
  requestUpdate: boolean;
  createdAt: string;
}

interface VersionHistory {
  id: number;
  documentId: number;
  version: string;
  content: string;
  author: string;
  notes: string;
  createdAt: string;
}

const CATEGORIES = [
  "Getting Started",
  "Admissions Operations",
  "Career Officer Handbook",
  "Recruitment AI Manual",
  "Transportation Operations",
  "Support Operations",
  "Finance Operations",
  "Staff Administration",
  "Command Center User Guide",
  "Reporting & Analytics",
  "Security Policies",
  "System Maintenance",
  "Emergency Procedures",
  "Troubleshooting",
  "Frequently Asked Questions",
  "Release Notes"
];

const ROLES = [
  "All",
  "Super Admin",
  "Admissions Officer",
  "Career Officer",
  "Operations Officer",
  "Finance Officer",
  "Support Officer"
];

export default function DocumentationCenterView({ 
  currentStaff, 
  triggerAuditLog 
}: { 
  currentStaff: Staff; 
  triggerAuditLog: (action: string, affected: string, status?: 'Success' | 'Failed') => Promise<any>;
}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [selectedDocData, setSelectedDocData] = useState<{
    document: Document;
    feedback: Feedback[];
    history: VersionHistory[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'reader' | 'analytics' | 'management'>('reader');

  // Bookmarking, Favorites, and History
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [readingHistory, setReadingHistory] = useState<{ documentId: number; lastReadAt: string }[]>([]);

  // Feedback Form State
  const [helpfulFeedback, setHelpfulFeedback] = useState<boolean | null>(null);
  const [starRating, setStarRating] = useState<number>(0);
  const [feedbackSuggestions, setFeedbackSuggestions] = useState('');
  const [isOutdatedFlag, setIsOutdatedFlag] = useState(false);
  const [requestUpdateFlag, setRequestUpdateFlag] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Document Creator/Editor Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editDocId, setEditDocId] = useState<number | null>(null);
  const [docFormTitle, setDocFormTitle] = useState('');
  const [docFormCategory, setDocFormCategory] = useState('Getting Started');
  const [docFormContent, setDocFormContent] = useState('');
  const [docFormVersion, setDocFormVersion] = useState('1.0.0');
  const [docFormTags, setDocFormTags] = useState('');
  const [docFormVisibility, setDocFormVisibility] = useState('All');
  const [docFormStatus, setDocFormStatus] = useState<'Published' | 'Draft' | 'Archived'>('Published');
  const [previewMode, setPreviewMode] = useState(false);

  // Super Admin Analytics Dashboard Data
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Fetch Documents list
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const roleQuery = currentStaff ? `?role=${encodeURIComponent(currentStaff.role)}` : '';
        const res = await fetch(`/api/documents${roleQuery}`);
        const data = await res.json();
        setDocuments(data);

        // Fetch user bookmarks
        if (currentStaff?.email) {
          const bRes = await fetch(`/api/documents/bookmarks?email=${encodeURIComponent(currentStaff.email)}`);
          if (bRes.ok) {
            const bData = await bRes.json();
            setBookmarkedIds(bData);
          }

          const hRes = await fetch(`/api/documents/history/recent?email=${encodeURIComponent(currentStaff.email)}`);
          if (hRes.ok) {
            const hData = await hRes.json();
            setReadingHistory(hData);
          }
        }

        // Default select first doc if available
        if (data.length > 0 && selectedDocId === null) {
          setSelectedDocId(data[0].id);
        }
      } catch (err) {
        setError('Failed to fetch documentation metadata.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [refreshTrigger, currentStaff]);

  // Fetch full document with history and feedback whenever selectedDocId changes
  useEffect(() => {
    if (selectedDocId === null) return;
    async function fetchDocDetails() {
      try {
        const emailParam = currentStaff ? `&email=${encodeURIComponent(currentStaff.email)}` : '';
        const res = await fetch(`/api/documents/${selectedDocId}?_t=${Date.now()}${emailParam}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedDocData(data);
          
          // Reset feedback inputs
          setHelpfulFeedback(null);
          setStarRating(0);
          setFeedbackSuggestions('');
          setIsOutdatedFlag(false);
          setRequestUpdateFlag(false);
          setFeedbackSuccess(false);

          // Update recent reading state locally
          setReadingHistory(prev => {
            const filtered = prev.filter(h => h.documentId !== selectedDocId);
            return [{ documentId: selectedDocId, lastReadAt: new Date().toISOString() }, ...filtered];
          });
        }
      } catch (err) {
        console.error('Failed to load document details:', err);
      }
    }
    fetchDocDetails();
  }, [selectedDocId]);

  // Fetch analytics if in analytics tab
  useEffect(() => {
    if (activeTab === 'analytics' && currentStaff?.role === 'Super Admin') {
      fetch('/api/documents/analytics/summary')
        .then(res => res.json())
        .then(data => setAnalyticsData(data))
        .catch(err => console.error('Error fetching analytics:', err));
    }
  }, [activeTab, refreshTrigger]);

  // Handle record search keyword to engine
  const handleRecordSearch = async (keyword: string) => {
    if (!keyword.trim() || keyword.length < 3) return;
    try {
      await fetch('/api/documents/search/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword })
      });
    } catch (e) {}
  };

  // Debounced/delayed search tracking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        handleRecordSearch(searchQuery);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filtered documents for Left Sidebar
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      // Category filter
      if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;

      // Status filter
      if (activeTab !== 'management' && doc.status !== 'Published') return false;

      // Search match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inTitle = doc.title.toLowerCase().includes(q);
        const inCategory = doc.category.toLowerCase().includes(q);
        const inContent = doc.content.toLowerCase().includes(q);
        const inTags = doc.tags.toLowerCase().includes(q);
        const inAuthor = doc.author.toLowerCase().includes(q);
        const inRole = doc.visibilityByRole.toLowerCase().includes(q);
        return inTitle || inCategory || inContent || inTags || inAuthor || inRole;
      }

      return true;
    });
  }, [documents, selectedCategory, searchQuery, activeTab]);

  // Bookmark Toggle
  const toggleBookmark = async (docId: number) => {
    if (!currentStaff?.email) return;
    try {
      const res = await fetch(`/api/documents/${docId}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentStaff.email })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.bookmarked) {
          setBookmarkedIds(prev => [...prev, docId]);
          triggerAuditLog(`Bookmarked document ID ${docId}`, currentStaff.name);
        } else {
          setBookmarkedIds(prev => prev.filter(id => id !== docId));
          triggerAuditLog(`Unbookmarked document ID ${docId}`, currentStaff.name);
        }
      }
    } catch (e) {
      alert('Error updating bookmarks');
    }
  };

  // Submit Feedback Handler
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId || !currentStaff?.email) return;
    setIsSubmittingFeedback(true);

    try {
      const res = await fetch(`/api/documents/${selectedDocId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentStaff.email,
          rating: starRating,
          isHelpful: helpfulFeedback === null ? true : helpfulFeedback,
          suggestions: feedbackSuggestions,
          isOutdated: isOutdatedFlag,
          requestUpdate: requestUpdateFlag
        })
      });

      if (res.ok) {
        setFeedbackSuccess(true);
        triggerAuditLog(`Submitted feedback rating ${starRating} for document ID ${selectedDocId}`, currentStaff.name);
        
        // Refresh details
        const detailsRes = await fetch(`/api/documents/${selectedDocId}?_t=${Date.now()}`);
        if (detailsRes.ok) {
          const data = await detailsRes.json();
          setSelectedDocData(data);
        }
      }
    } catch (e) {
      alert('Failed to send feedback.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Offline MD Copy downloader
  const handleDownloadMarkdown = (doc: Document) => {
    const element = document.createElement("a");
    const contentToDownload = (doc.id === 1 || doc.title?.includes("Staff") || doc.title?.includes("Onboarding") || doc.category?.includes("Getting Started"))
      ? STAFF_HANDBOOK_CONTENT
      : (doc.id === 2 || doc.title?.includes("Admissions") || doc.category?.includes("Admissions")) 
        ? ADMISSIONS_OPERATIONS_MANUAL_CONTENT 
      : (doc.id === 3 || doc.title?.includes("Career") || doc.category?.includes("Career"))
        ? CAREER_PLACEMENT_HANDBOOK_CONTENT
        : (doc.id === 4 || doc.title?.includes("Recruitment AI") || doc.title?.includes("AI Recruitment") || doc.category?.includes("Recruitment AI"))
          ? RECRUITMENT_AI_MANUAL_CONTENT
          : (doc.id === 5 || doc.title?.includes("Transportation") || doc.title?.includes("Logistic Coordination") || doc.category?.includes("Transportation"))
            ? TRANSPORTATION_MANUAL_CONTENT
            : (doc.id === 8 || doc.title?.includes("Emergency") || doc.category?.includes("Emergency"))
              ? EMERGENCY_SOP_MANUAL_CONTENT
              : doc.content;
    const file = new Blob([contentToDownload], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${doc.title.toLowerCase().replace(/\s+/g, "_")}_offline.md`;
    document.body.appendChild(element);
    element.click();
    triggerAuditLog(`Downloaded offline Markdown copy of guide: ${doc.title}`, currentStaff.name);
    
    // Log as download event in suggestions feedback mock
    fetch(`/api/documents/${doc.id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentStaff.email,
        rating: 5,
        isHelpful: true,
        suggestions: `Downloaded Offline Copy (Markdown)`,
        isOutdated: false,
        requestUpdate: false
      })
    });
  };

  const formatMarkdownForPrint = (markdown: string): string => {
    if (!markdown) return '';
    let html = markdown
      .replace(/^# (.*$)/gim, '<div class="page-break"></div><h1 class="chapter-title">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="section-title">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="subsection-title">$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4 class="subsubsection-title">$1</h4>')
      .replace(/^---$/gim, '<hr class="section-divider" />')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
      .replace(/^- \[x\] (.*$)/gim, '<div class="checklist-row"><span class="checkbox checked">✔</span><span class="checklist-text">$1</span></div>')
      .replace(/^- \[ \] (.*$)/gim, '<div class="checklist-row"><span class="checkbox unchecked">○</span><span class="checklist-text">$1</span></div>')
      .replace(/^\* \[x\] (?:□\s*)?(.*$)/gim, '<div class="checklist-row"><span class="checkbox checked">✔</span><span class="checklist-text">$1</span></div>')
      .replace(/^\* \[ \] (?:□\s*)?(.*$)/gim, '<div class="checklist-row"><span class="checkbox unchecked">○</span><span class="checklist-text">$1</span></div>')
      .replace(/^(?:>)?\s*\*\*?(⚠️ WARNING:?|⚠️|WARNING:?|⚠️ COMMON MISTAKE:?)\*\*?\s*(.*$)/gim, '<div class="callout warning-box"><span class="callout-icon">⚠️</span><div class="callout-content"><strong>WARNING / MISTAKE:</strong> $2</div></div>')
      .replace(/^(?:>)?\s*\*\*?(💡 TIP:?|💡|TIP:?|💡 CAREER TIP:?)\*\*?\s*(.*$)/gim, '<div class="callout tip-box"><span class="callout-icon">💡</span><div class="callout-content"><strong>CAREER TIP:</strong> $2</div></div>')
      .replace(/^(?:>)?\s*\*\*?(ℹ️ INFO:?|ℹ️|INFO:?|🚀 PRO TIP:?)\*\*?\s*(.*$)/gim, '<div class="callout info-box"><span class="callout-icon">🚀</span><div class="callout-content"><strong>PRO TIP:</strong> $2</div></div>')
      .replace(/^(?:>)?\s*\*\*?(⭐ RECRUITER\'S ADVICE:?|⭐|RECRUITER\'S ADVICE:?)\*\*?\s*(.*$)/gim, '<div class="callout info-box" style="background-color: #fef9c3; border-left: 5px solid #eab308; color: #854d0e;"><span class="callout-icon">⭐</span><div class="callout-content"><strong>RECRUITER\'S ADVICE:</strong> $2</div></div>')
      .replace(/^(?:>)?\s*\*\*?(🎯 BEST PRACTICE:?|🎯|BEST PRACTICE:?)\*\*?\s*(.*$)/gim, '<div class="callout tip-box" style="background-color: #ecfdf5; border-left: 5px solid #10b981; color: #065f46;"><span class="callout-icon">🎯</span><div class="callout-content"><strong>BEST PRACTICE:</strong> $2</div></div>')
      .replace(/^(?:>)?\s*\*\*?(🏛️ OLATECH EXPERT NOTE:?|🏛️|OLATECH EXPERT NOTE:?)\*\*?\s*(.*$)/gim, '<div class="callout info-box" style="background-color: #f5f3ff; border-left: 5px solid #8b5cf6; color: #4c1d95;"><span class="callout-icon">🏛️</span><div class="callout-content"><strong>OLATECH EXPERT NOTE:</strong> $2</div></div>')
      .replace(/^>\s*(.*$)/gim, '<blockquote style="border-left: 4px solid #64748b; padding: 12px 16px; margin: 16px 0; background-color: #f8fafc; font-style: italic; color: #334155; border-radius: 0 8px 8px 0;">$1</blockquote>')
      .replace(/\[(Screenshot|Illustration|Diagram|Flowchart):\s*(.*?)\]/gim, '<div class="screenshot-placeholder"><div class="screenshot-topbar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span><span class="screenshot-label">CorpersTech Gold Master Visual — $1</span></div><div class="screenshot-body"><span class="camera-icon">📊</span><span class="screenshot-text">[ $1: $2 ]</span></div></div>')
      .replace(/\[QR Code Placeholder:\s*(.*?)\]/gim, '<div style="border: 2px dashed #94a3b8; padding: 16px; border-radius: 12px; display: inline-block; background: #f8fafc; text-align: center; margin: 16px 0;"><div style="font-size: 24px;">📱</div><strong style="font-size: 10pt; color: #334155;">Institutional Verification Stamp</strong><div style="font-size: 8pt; font-family: monospace; color: #64748b; margin-top: 4px;">$1</div></div>');

    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    const formattedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableHtml = '<table class="styled-table">';
          const headers = line.split('|').filter(c => c !== '').map(c => c.trim());
          tableHtml += '<thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
        } else if (line.includes('---')) {
          // skip separator
        } else {
          const cells = line.split('|').filter(c => c !== '').map(c => c.trim());
          tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
        }
      } else {
        if (inTable) {
          inTable = false;
          tableHtml += '</tbody></table>';
          formattedLines.push(tableHtml);
          tableHtml = '';
        }
        if (line.startsWith('* ') || line.startsWith('- ')) {
          formattedLines.push(`<li class="list-item">${line.substring(2)}</li>`);
        } else if (/^\d+\.\s/.test(line)) {
          formattedLines.push(`<li class="numbered-item">${line.replace(/^\d+\.\s/, '')}</li>`);
        } else if (line.startsWith('<')) {
          formattedLines.push(line);
        } else {
          formattedLines.push(line ? `<p class="paragraph">${line}</p>` : '<div class="line-spacer"></div>');
        }
      }
    }
    if (inTable) {
      tableHtml += '</tbody></table>';
      formattedLines.push(tableHtml);
    }

    return formattedLines.join('\n');
  };

  // PDF & Printable View triggers
  const handlePrint = (doc: Document) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const contentToPrint = (doc.id === 1 || doc.title?.includes("Staff") || doc.title?.includes("Onboarding") || doc.category?.includes("Getting Started"))
        ? STAFF_HANDBOOK_CONTENT
        : (doc.id === 2 || doc.title?.includes("Admissions") || doc.category?.includes("Admissions")) 
          ? ADMISSIONS_OPERATIONS_MANUAL_CONTENT 
        : (doc.id === 3 || doc.title?.includes("Career") || doc.category?.includes("Career"))
          ? CAREER_PLACEMENT_HANDBOOK_CONTENT
          : (doc.id === 4 || doc.title?.includes("Recruitment AI") || doc.title?.includes("AI Recruitment") || doc.category?.includes("Recruitment AI"))
            ? RECRUITMENT_AI_MANUAL_CONTENT
            : (doc.id === 5 || doc.title?.includes("Transportation") || doc.title?.includes("Logistic Coordination") || doc.category?.includes("Transportation"))
              ? TRANSPORTATION_MANUAL_CONTENT
              : (doc.id === 8 || doc.title?.includes("Emergency") || doc.category?.includes("Emergency"))
                ? EMERGENCY_SOP_MANUAL_CONTENT
                : doc.content;
      const formattedContent = formatMarkdownForPrint(contentToPrint);
      printWindow.document.write(`
        <html>
          <head>
            <title>${doc.title} - Printable Gold Master PDF View</title>
            <style>
              @page { size: A4; margin: 25mm 20mm 25mm 20mm; }
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding: 40px; color: #1e293b; line-height: 1.65; font-size: 11pt; background: #ffffff; }
              h1.chapter-title { color: #0f172a; font-size: 22pt; font-weight: 900; border-bottom: 3px solid #10b981; padding-bottom: 12px; margin-top: 40px; margin-bottom: 20px; page-break-after: avoid; }
              h2.section-title { color: #1e293b; font-size: 15pt; font-weight: 800; margin-top: 32px; margin-bottom: 14px; page-break-after: avoid; border-left: 4px solid #10b981; padding-left: 10px; }
              h3.subsection-title { color: #334155; font-size: 12pt; font-weight: 700; margin-top: 22px; margin-bottom: 10px; page-break-after: avoid; }
              h4.subsubsection-title { color: #475569; font-size: 11pt; font-weight: 700; margin-top: 16px; margin-bottom: 8px; page-break-after: avoid; }
              p.paragraph { margin: 10px 0; text-align: justify; }
              .line-spacer { height: 10px; }
              hr.section-divider { border: 0; border-top: 1px solid #cbd5e1; margin: 28px 0; }
              
              /* Tables */
              table.styled-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 10pt; page-break-inside: avoid; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
              table.styled-table th, table.styled-table td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; vertical-align: top; }
              table.styled-table th { background-color: #f1f5f9; font-weight: 800; color: #0f172a; text-transform: uppercase; font-size: 9pt; letter-spacing: 0.5px; }
              table.styled-table tr:nth-child(even) { background-color: #f8fafc; }
              
              /* Callout boxes */
              .callout { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; border-radius: 8px; margin: 20px 0; page-break-inside: avoid; font-size: 10.5pt; }
              .warning-box { background-color: #fef2f2; border-left: 5px solid #ef4444; color: #991b1b; }
              .tip-box { background-color: #f0fdf4; border-left: 5px solid #10b981; color: #065f46; }
              .info-box { background-color: #f0f9ff; border-left: 5px solid #0ea5e9; color: #075985; }
              .callout-icon { font-size: 16pt; flex-shrink: 0; }
              
              /* Screenshot Placeholders */
              .screenshot-placeholder { border: 2px dashed #cbd5e1; border-radius: 12px; margin: 24px 0; background-color: #f8fafc; page-break-inside: avoid; overflow: hidden; }
              .screenshot-topbar { background-color: #e2e8f0; padding: 8px 16px; display: flex; align-items: center; gap: 6px; border-bottom: 1px solid #cbd5e1; font-family: monospace; font-size: 9pt; font-weight: bold; color: #475569; }
              .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
              .dot.red { background-color: #ef4444; }
              .dot.yellow { background-color: #f59e0b; }
              .dot.green { background-color: #10b981; }
              .screenshot-label { margin-left: 8px; }
              .screenshot-body { padding: 35px 20px; text-align: center; color: #64748b; font-weight: 600; font-size: 11pt; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
              .camera-icon { font-size: 24pt; opacity: 0.7; }
              
              /* Checklists & Lists */
              .checklist-row { display: flex; align-items: flex-start; gap: 10px; margin: 8px 0; font-size: 10.5pt; }
              .checkbox { font-weight: bold; font-family: monospace; padding: 2px 6px; border-radius: 4px; font-size: 10pt; }
              .checkbox.checked { background-color: #d1fae5; color: #059669; border: 1px solid #34d399; }
              .checkbox.unchecked { background-color: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; }
              li.list-item, li.numbered-item { margin: 6px 0 6px 20px; font-size: 10.5pt; }
              
              /* Code blocks */
              pre.code-block { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 9.5pt; white-space: pre-wrap; margin: 16px 0; page-break-inside: avoid; border: 1px solid #334155; }
              code.inline-code { background: #f1f5f9; color: #0f172a; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 9.5pt; border: 1px solid #cbd5e1; }
              
              /* Header & Footer */
              .meta-header { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px 24px; border-radius: 12px; font-size: 11pt; color: #475569; margin-bottom: 35px; page-break-after: avoid; }
              .footer { margin-top: 60px; font-size: 10pt; text-align: center; color: #64748b; border-top: 2px solid #e2e8f0; padding-top: 20px; page-break-inside: avoid; }
              
              /* Pagination */
              @media print {
                .page-break { page-break-before: always; }
                h1, h2, h3 { page-break-after: avoid; }
                table, .callout, .screenshot-placeholder, pre { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <h1>${doc.title}</h1>
            <div class="meta-header">
              <strong>Category:</strong> ${doc.category} | 
              <strong>Version:</strong> ${doc.version} | 
              <strong>Author:</strong> ${doc.author} | 
              <strong>Updated:</strong> ${new Date(doc.updatedAt).toLocaleDateString()}
            </div>
            <div class="content-body">${formattedContent}</div>
            <div class="footer">Olatech School of Programming - CorpersTech Gold Master Certified Handbook</div>
            <script>
              window.onload = function() { setTimeout(function() { window.print(); }, 500); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      triggerAuditLog(`Dispatched Printable PDF compile of guide: ${doc.title}`, currentStaff.name);
    }
  };

  // Save/Create Document Handler
  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFormTitle.trim() || !docFormContent.trim()) {
      alert('Title and content are required.');
      return;
    }

    const payload = {
      title: docFormTitle,
      category: docFormCategory,
      content: docFormContent,
      version: docFormVersion || '1.0.0',
      author: currentStaff?.name || 'Super Admin',
      status: docFormStatus,
      tags: docFormTags,
      visibilityByRole: docFormVisibility,
      editorName: currentStaff?.name || 'Super Admin'
    };

    try {
      if (editDocId) {
        // Edit flow
        const res = await fetch(`/api/documents/${editDocId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          alert('Document updated and revision versioned successfully!');
          triggerAuditLog(`Modified guide details and bumped revision: ${docFormTitle}`, currentStaff.name);
        }
      } else {
        // Create flow
        const res = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          alert('New operational documentation guide created successfully!');
          triggerAuditLog(`Created new operational manual: ${docFormTitle}`, currentStaff.name);
        }
      }

      // Reset
      setIsEditing(false);
      setEditDocId(null);
      setDocFormTitle('');
      setDocFormContent('');
      setDocFormVersion('1.0.0');
      setDocFormTags('');
      setDocFormVisibility('All');
      setDocFormStatus('Published');
      setRefreshTrigger(prev => prev + 1);
    } catch (e) {
      alert('Failed to save document guide.');
    }
  };

  // Fill forms for editing
  const handleStartEdit = (doc: Document) => {
    setEditDocId(doc.id);
    setDocFormTitle(doc.title);
    setDocFormCategory(doc.category);
    setDocFormContent(doc.content);
    
    // Auto increment minor version for convenience
    const parts = doc.version.split('.');
    if (parts.length === 3) {
      parts[2] = String(parseInt(parts[2]) + 1);
      setDocFormVersion(parts.join('.'));
    } else {
      setDocFormVersion(doc.version);
    }

    setDocFormTags(doc.tags);
    setDocFormVisibility(doc.visibilityByRole);
    setDocFormStatus(doc.status as any);
    setIsEditing(true);
    setPreviewMode(false);
  };

  // Delete/Archive Document
  const handleDeleteDoc = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete/archive the guide "${title}"?`)) return;
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Document guide deleted successfully.');
        triggerAuditLog(`Deleted document guide: ${title}`, currentStaff.name);
        setRefreshTrigger(prev => prev + 1);
        if (selectedDocId === id) setSelectedDocId(null);
      }
    } catch (e) {
      alert('Failed to delete document.');
    }
  };

  // Help calculate average rating
  const averageRating = useMemo(() => {
    if (!selectedDocData?.feedback || selectedDocData.feedback.length === 0) return 5.0;
    const sum = selectedDocData.feedback.reduce((acc, curr) => acc + curr.rating, 0);
    return Number((sum / selectedDocData.feedback.length).toFixed(1));
  }, [selectedDocData]);

  // Document estimated reading stats
  const docMetadata = useMemo(() => {
    if (!selectedDocData?.document) return { readTime: 5, difficulty: 'Medium' };
    const text = selectedDocData.document.content;
    const words = text.split(/\s+/).length;
    const readTime = Math.max(1, Math.round(words / 150)); // ~150 words per min
    
    let difficulty = 'Easy';
    if (words > 600) difficulty = 'Advanced';
    else if (words > 300) difficulty = 'Medium';

    return { readTime, difficulty };
  }, [selectedDocData]);

  // Recommended Reading based on role
  const recommendedDocs = useMemo(() => {
    return documents.filter(doc => {
      if (doc.id === selectedDocId) return false;
      if (!doc.visibilityByRole || doc.visibilityByRole === 'All') return true;
      return doc.visibilityByRole.split(',').map(r => r.trim()).includes(currentStaff?.role);
    }).slice(0, 4);
  }, [documents, currentStaff, selectedDocId]);

  return (
    <div className="space-y-6 text-slate-800" id="docs-center-root-container">
      
      {/* 1. Dashboard Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 font-sans flex items-center gap-2">
            <FileText className="text-emerald-600" size={24} />
            Olatech Operational Knowledge Center
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access internal guides, technical procedures, admissions SOPs, and role manuals securely.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-center">
          <button
            onClick={() => { setActiveTab('reader'); setIsEditing(false); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reader' && !isEditing ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen size={13} />
            Documentation Reader
          </button>
          
          {currentStaff?.role === 'Super Admin' && (
            <>
              <button
                onClick={() => { setActiveTab('management'); setIsEditing(false); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'management' || isEditing ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Settings size={13} />
                Manage Guides
              </button>
              <button
                onClick={() => { setActiveTab('analytics'); setIsEditing(false); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'analytics' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BarChart3 size={13} />
                Analytics
              </button>
            </>
          )}
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {/* ======================= READER WORKSPACE ======================= */}
      {activeTab === 'reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR (4 cols) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Search Box */}
            <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Search Documents</span>
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type title, tag, keywords..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl text-xs font-semibold outline-none transition-all"
                />
              </div>

              {/* Categories Selector */}
              <div className="pt-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1.5">Category Filter</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                >
                  <option value="All">All Categories ({documents.length})</option>
                  {CATEGORIES.map(cat => {
                    const count = documents.filter(d => d.category === cat).length;
                    return (
                      <option key={cat} value={cat}>{cat} ({count})</option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Document Listing List */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-xs overflow-hidden max-h-[450px] flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Available Guides ({filteredDocs.length})</span>
              </div>
              <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
                {isLoading ? (
                  <div className="p-6 text-center text-xs font-bold text-slate-400">Loading guides...</div>
                ) : filteredDocs.length === 0 ? (
                  <div className="p-8 text-center text-xs font-bold text-slate-400">No documents match search.</div>
                ) : (
                  filteredDocs.map(doc => {
                    const active = doc.id === selectedDocId;
                    const bookmarked = bookmarkedIds.includes(doc.id);
                    return (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`w-full text-left p-3.5 flex items-start gap-2.5 transition-colors cursor-pointer text-xs ${
                          active ? 'bg-emerald-50/50 border-r-4 border-emerald-600' : 'hover:bg-slate-50'
                        }`}
                      >
                        <FileText size={15} className={active ? 'text-emerald-600 shrink-0 mt-0.5' : 'text-slate-400 shrink-0 mt-0.5'} />
                        <div className="flex-1 min-w-0">
                          <span className={`block font-bold truncate ${active ? 'text-emerald-800' : 'text-slate-700'}`}>{doc.title}</span>
                          <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 uppercase font-extrabold font-sans">
                            <span className="truncate">{doc.category}</span>
                            <span>·</span>
                            <span>v{doc.version}</span>
                          </div>
                        </div>
                        {bookmarked && <Bookmark size={11} className="text-emerald-600 shrink-0 fill-current mt-1" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Reading History & Quick Favorites Panel */}
            <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Recently Viewed</span>
              <div className="space-y-2">
                {readingHistory.slice(0, 3).map(hist => {
                  const doc = documents.find(d => d.id === hist.documentId);
                  if (!doc) return null;
                  return (
                    <button
                      key={hist.documentId}
                      onClick={() => setSelectedDocId(hist.documentId)}
                      className="w-full text-left text-xs text-slate-600 hover:text-emerald-600 font-bold truncate flex items-center gap-1 cursor-pointer"
                    >
                      <Clock size={12} className="text-slate-400" />
                      <span className="truncate flex-1">{doc.title}</span>
                    </button>
                  );
                })}
                {readingHistory.length === 0 && (
                  <span className="text-[10px] text-slate-400 font-medium block">No history logged yet.</span>
                )}
              </div>
            </div>

          </div>

          {/* MAIN DOCUMENT PANEL (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {selectedDocData ? (
              <div className="bg-white rounded-3xl border border-slate-150 shadow-sm overflow-hidden">
                
                {/* Document Top Header Card */}
                <div className="p-6 bg-slate-900 text-white relative">
                  <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider font-mono">
                    <span>{selectedDocData.document.category}</span>
                    <span>·</span>
                    <span>Version {selectedDocData.document.version}</span>
                  </div>

                  <h1 className="text-lg sm:text-xl font-black mt-1.5 tracking-tight text-white leading-tight">
                    {selectedDocData.document.title}
                  </h1>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-[10px] text-slate-300 font-medium border-t border-slate-800 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[9px] font-extrabold">
                        Author: {selectedDocData.document.author}
                      </span>
                      <span>Last Updated: {new Date(selectedDocData.document.updatedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Bookmark Toggle Icon */}
                      <button
                        onClick={() => toggleBookmark(selectedDocData.document.id)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors cursor-pointer"
                        title="Bookmark guide"
                      >
                        <Bookmark size={13} className={bookmarkedIds.includes(selectedDocData.document.id) ? "fill-emerald-400 text-emerald-400" : ""} />
                      </button>

                      {/* Print View Trigger */}
                      <button
                        onClick={() => handlePrint(selectedDocData.document)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors cursor-pointer"
                        title="Print document"
                      >
                        <Printer size={13} />
                      </button>

                      {/* Offline download */}
                      <button
                        onClick={() => handleDownloadMarkdown(selectedDocData.document)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors cursor-pointer"
                        title="Download Markdown"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Render Block */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Interactive Guide Specs Banner */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600">
                    <div className="flex items-center gap-2 text-xs">
                      <Clock size={15} className="text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold block">Est. Reading Time</span>
                        <span className="font-bold">{docMetadata.readTime} minutes</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Star size={15} className="text-amber-500 shrink-0" />
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold block">Difficulty Rating</span>
                        <span className="font-bold">{docMetadata.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Document Body (Rendered simply formatted, since markdown is rich raw) */}
                  <div className="text-slate-800 text-xs sm:text-sm font-normal leading-relaxed space-y-4 whitespace-pre-wrap select-text font-sans">
                    {selectedDocData.document.content}
                  </div>

                  {/* Document Tags row */}
                  {selectedDocData.document.tags && (
                    <div className="flex flex-wrap gap-1.5 border-t border-slate-100 pt-4">
                      {selectedDocData.document.tags.split(',').map((tag, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase font-black font-sans">
                          <Tag size={9} />
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Revision History Log */}
                  {selectedDocData.history && selectedDocData.history.length > 0 && (
                    <div className="border-t border-slate-100 pt-5 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        Guide Change & Revision History
                      </h4>
                      <div className="space-y-2.5">
                        {selectedDocData.history.map(hist => (
                          <div key={hist.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex justify-between text-[10px] text-slate-600">
                            <div>
                              <span className="font-bold text-slate-800 block">Version {hist.version}</span>
                              <span className="text-slate-400 block mt-0.5">{hist.notes || 'Routine documentation bump'}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="block text-slate-500 font-medium">By {hist.author}</span>
                              <span className="block text-slate-400 font-mono text-[9px] mt-0.5">
                                {new Date(hist.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MODULE 9 — INTERACTIVE FEEDBACK & RATINGS COMPONENT */}
                  <div className="border-t border-slate-100 pt-6 space-y-4">
                    <div className="bg-emerald-50/35 border border-emerald-100 p-5 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-emerald-950 font-sans uppercase tracking-wider">Help us improve this manual</h4>
                          <p className="text-[10px] text-emerald-700 mt-0.5">Your ratings help Admissions, Operations, and Careers work efficiently.</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-white border border-emerald-150 px-2 py-0.5 rounded-full font-mono">
                          <Star size={11} className="text-amber-500 fill-amber-500" />
                          {averageRating} ({selectedDocData.feedback.length} rates)
                        </div>
                      </div>

                      {feedbackSuccess ? (
                        <div className="mt-4 p-3 bg-white border border-emerald-150 text-emerald-800 text-xs font-bold rounded-xl text-center">
                          ✓ Thank you for your feedback! Your logs have been written to the Olatech Command Center database.
                        </div>
                      ) : (
                        <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-3.5 text-slate-800">
                          
                          {/* Rating and Helpful Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold uppercase text-slate-400 shrink-0">Was this guide helpful?</span>
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setHelpfulFeedback(true)}
                                  className={`p-1 rounded-lg border transition-all cursor-pointer ${
                                    helpfulFeedback === true ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-200 text-slate-400 hover:border-emerald-600 hover:text-emerald-600'
                                  }`}
                                >
                                  <ThumbsUp size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setHelpfulFeedback(false)}
                                  className={`p-1 rounded-lg border transition-all cursor-pointer ${
                                    helpfulFeedback === false ? 'bg-red-600 border-red-600 text-white' : 'border-slate-200 text-slate-400 hover:border-red-600 hover:text-red-600'
                                  }`}
                                >
                                  <ThumbsDown size={12} />
                                </button>
                              </div>
                            </div>

                            {/* 5-Star Rating */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-extrabold uppercase text-slate-400">Score Rating:</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setStarRating(star)}
                                    className="p-0.5 hover:scale-110 transition-transform cursor-pointer"
                                  >
                                    <Star 
                                      size={14} 
                                      className={star <= starRating ? "text-amber-500 fill-amber-500" : "text-slate-200"} 
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Outdated/Request checkbox flags */}
                          <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-600 bg-white p-3 border border-slate-100 rounded-xl">
                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isOutdatedFlag}
                                onChange={(e) => setIsOutdatedFlag(e.target.checked)}
                                className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300"
                              />
                              Report Outdated Information
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={requestUpdateFlag}
                                onChange={(e) => setRequestUpdateFlag(e.target.checked)}
                                className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300"
                              />
                              Request Immediate Update
                            </label>
                          </div>

                          {/* Suggestions box */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Feedback / Improvement Suggestions</label>
                            <textarea
                              rows={2}
                              value={feedbackSuggestions}
                              onChange={(e) => setFeedbackSuggestions(e.target.value)}
                              placeholder="Describe typos, clarity problems, or missing screenshots references..."
                              className="w-full p-2.5 bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold outline-none transition-all"
                            />
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={isSubmittingFeedback || starRating === 0}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-[10px] rounded-xl shadow-xs transition-colors cursor-pointer"
                            >
                              {isSubmittingFeedback ? 'Submitting...' : 'Write Feedback Log'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white p-16 rounded-3xl border border-slate-150 shadow-xs text-center text-slate-400 font-bold text-xs space-y-2">
                <FileText className="mx-auto text-slate-300" size={32} />
                <p>Select a handbook or operational manual from the side list to begin reading.</p>
              </div>
            )}
          </div>

          {/* RIGHT PANEL (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Quick Downloads Center (Module 6) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Document Downloads</span>
              <div className="space-y-2">
                {[
                  { title: "Admissions Operations Manual", type: "admissions" },
                  { title: "Career Placement Handbook", type: "career" },
                  { title: "Recruitment AI Manual", type: "ai" },
                  { title: "Transportation Manual", type: "transport" },
                  { title: "Olatech Staff Handbook", type: "staff" },
                  { title: "Emergency SOP Procedures", type: "emergency" }
                ].map((dl, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700">
                    <span className="truncate mr-2">{dl.title}</span>
                    <button
                      onClick={() => {
                        if (dl.type === 'admissions' || dl.title.includes('Admissions')) {
                          const admDoc = documents.find(d => d.id === 2 || d.title.includes('Admissions') || d.category?.includes('Admissions'));
                          const targetDoc: Document = admDoc ? {
                            ...admDoc,
                            content: ADMISSIONS_OPERATIONS_MANUAL_CONTENT,
                            version: "1.0 Gold Master",
                            author: "Admissions Lead"
                          } : {
                            id: 2,
                            title: "Admissions Operations Manual",
                            category: "Admissions Operations",
                            content: ADMISSIONS_OPERATIONS_MANUAL_CONTENT,
                            version: "1.0 Gold Master",
                            author: "Admissions Lead",
                            status: "Published",
                            tags: "admissions, crm, enrollment, sop, manual",
                            visibilityByRole: "Super Admin, Admissions Officer",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                          };
                          handleDownloadMarkdown(targetDoc);
                          return;
                        }
                        if (dl.type === 'career' || dl.title.includes('Career')) {
                          const careerDoc = documents.find(d => d.id === 3 || d.title.includes('Career') || d.category?.includes('Career'));
                          const targetDoc: Document = careerDoc ? {
                            ...careerDoc,
                            content: CAREER_PLACEMENT_HANDBOOK_CONTENT,
                            version: "1.0 Gold Master",
                            author: "Career Placement Lead"
                          } : {
                            id: 3,
                            title: "Career Services & Opportunity Management Handbook",
                            category: "Career Officer Handbook",
                            content: CAREER_PLACEMENT_HANDBOOK_CONTENT,
                            version: "1.0 Gold Master",
                            author: "Career Placement Lead",
                            status: "Published",
                            tags: "career, jobs, placement",
                            visibilityByRole: "Super Admin, Career Officer",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                          };
                          handleDownloadMarkdown(targetDoc);
                          return;
                        }
                        if (dl.type === 'ai' || dl.title.includes('Recruitment AI') || dl.title.includes('AI Recruitment')) {
                          const aiDoc = documents.find(d => d.id === 4 || d.title.includes('Recruitment AI') || d.title.includes('AI Recruitment') || d.category?.includes('Recruitment AI'));
                          const targetDoc: Document = aiDoc ? {
                            ...aiDoc,
                            content: RECRUITMENT_AI_MANUAL_CONTENT,
                            version: "1.0 Gold Master",
                            author: "Tech Lead"
                          } : {
                            id: 4,
                            title: "AI Recruitment Discovery Engine & Scraper Operations Manual",
                            category: "Recruitment AI Manual",
                            content: RECRUITMENT_AI_MANUAL_CONTENT,
                            version: "1.0 Gold Master",
                            author: "Tech Lead",
                            status: "Published",
                            tags: "ai, gemini, crawler, recruitment, discovery, scraper",
                            visibilityByRole: "Super Admin, Career Officer",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                          };
                          handleDownloadMarkdown(targetDoc);
                          return;
                        }
                        if (dl.type === 'transport' || dl.title.includes('Transportation') || dl.title.includes('Logistic Coordination')) {
                          const transportDoc = documents.find(d => d.id === 5 || d.title.includes('Transportation') || d.title.includes('Logistic Coordination') || d.category?.includes('Transportation'));
                          const targetDoc: Document = transportDoc ? {
                            ...transportDoc,
                            content: TRANSPORTATION_MANUAL_CONTENT,
                            version: "1.0 Gold Master",
                            author: "Logistics Manager"
                          } : {
                            id: 5,
                            title: "Student Transportation & Logistic Coordination Manual",
                            category: "Transportation Operations",
                            content: TRANSPORTATION_MANUAL_CONTENT,
                            version: "1.0 Gold Master",
                            author: "Logistics Manager",
                            status: "Published",
                            tags: "transport, shuttle, logistics, driver, route, manifest, fleet",
                            visibilityByRole: "Super Admin, Operations Officer",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                          };
                          handleDownloadMarkdown(targetDoc);
                          return;
                        }
                        if (dl.type === 'staff' || dl.title.includes('Staff')) {
                          const staffDoc = documents.find(d => d.id === 1 || d.title.includes('Staff') || d.title.includes('Onboarding') || d.category?.includes('Getting Started'));
                          const targetDoc: Document = staffDoc ? {
                            ...staffDoc,
                            content: STAFF_HANDBOOK_CONTENT,
                            version: "1.0 Gold Master",
                            author: "Executive Director & Operations Lead"
                          } : {
                            id: 1,
                            title: "Olatech Staff General Onboarding Guide",
                            category: "Getting Started",
                            content: STAFF_HANDBOOK_CONTENT,
                            version: "1.0 Gold Master",
                            author: "Executive Director & Operations Lead",
                            status: "Published",
                            tags: "onboarding, staff, handbook, general, manual, policies, sop",
                            visibilityByRole: "All",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                          };
                          handleDownloadMarkdown(targetDoc);
                          return;
                        }
                        if (dl.type === 'emergency' || dl.title.includes('Emergency')) {
                          const emgDoc = documents.find(d => d.id === 8 || d.title.includes('Emergency') || d.category?.includes('Emergency'));
                          const targetDoc: Document = emgDoc ? {
                            ...emgDoc,
                            content: EMERGENCY_SOP_MANUAL_CONTENT,
                            version: "1.0 Gold Master",
                            author: "CTO & Operations Lead"
                          } : {
                            id: 8,
                            title: "Emergency Procedures & Disaster Recovery Protocol",
                            category: "Emergency Procedures",
                            content: EMERGENCY_SOP_MANUAL_CONTENT,
                            version: "1.0 Gold Master",
                            author: "CTO & Operations Lead",
                            status: "Published",
                            tags: "emergency, disaster, security, sop, manual, continuity",
                            visibilityByRole: "All",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                          };
                          handleDownloadMarkdown(targetDoc);
                          return;
                        }
                        // Simulate PDF compilation
                        const fakeDoc: Document = {
                          id: 999 + idx,
                          title: dl.title,
                          category: "Getting Started",
                          content: `# ${dl.title}\nThis is the compiled offline manual document for offline operations.\n\nAuthor: Operations Director`,
                          version: "1.0.0",
                          author: "Super Admin",
                          status: "Published",
                          tags: dl.type,
                          visibilityByRole: "All",
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        };
                        handleDownloadMarkdown(fakeDoc);
                      }}
                      className="p-1 bg-white hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200 rounded-lg text-slate-400 transition-colors shrink-0 cursor-pointer"
                      title="Download Offline Copy"
                    >
                      <Download size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended/Related Reading */}
            <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Recommended for your role</span>
              <div className="space-y-2.5">
                {recommendedDocs.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className="w-full text-left p-2 bg-slate-50 hover:bg-emerald-50/40 border border-slate-100 hover:border-emerald-100 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs font-bold text-slate-700"
                  >
                    <span className="truncate flex-1">{doc.title}</span>
                    <ChevronRight size={13} className="text-slate-400 shrink-0" />
                  </button>
                ))}
                {recommendedDocs.length === 0 && (
                  <span className="text-[10px] text-slate-400 font-medium block">No other recommended readings for your role.</span>
                )}
              </div>
            </div>

            {/* Quick Links & Guidelines */}
            <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-xs space-y-3 text-xs text-slate-600">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Helpful Links</span>
              <ul className="space-y-2 font-bold text-slate-700">
                <li>
                  <a href="https://corperstech.com.ng" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-emerald-600">
                    Olatech Student Portal
                    <ExternalLink size={12} className="text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/2348123456789" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-emerald-600">
                    Olatech IT Support WhatsApp
                    <ExternalLink size={12} className="text-slate-400" />
                  </a>
                </li>
                <li>
                  <a href="https://ai.studio" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-emerald-600">
                    Gemini AI Models Hub
                    <ExternalLink size={12} className="text-slate-400" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* ======================= MANAGEMENT VIEW ======================= */}
      {activeTab === 'management' && (
        <div className="space-y-6">
          
          {/* Main Action Bar */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-150 shadow-xs">
            <span className="text-xs font-extrabold text-slate-800">
              {isEditing ? `Editing Manual: ${docFormTitle || 'Draft'}` : `Active Handbooks in Registry (${documents.length})`}
            </span>
            <button
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  setEditDocId(null);
                } else {
                  setEditDocId(null);
                  setDocFormTitle('');
                  setDocFormCategory('Getting Started');
                  setDocFormContent('');
                  setDocFormVersion('1.0.0');
                  setDocFormTags('');
                  setDocFormVisibility('All');
                  setDocFormStatus('Published');
                  setIsEditing(true);
                  setPreviewMode(false);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              {isEditing ? (
                <>
                  <RotateCcw size={13} />
                  Back to List
                </>
              ) : (
                <>
                  <Plus size={13} />
                  Add Manual / Handbook
                </>
              )}
            </button>
          </div>

          {isEditing ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Form panel (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-150 shadow-xs p-6 space-y-4">
                
                {/* Form Tabs */}
                <div className="flex bg-slate-100 p-0.5 rounded-xl self-start w-fit">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                      !previewMode ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Edit Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                      previewMode ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Preview Mode
                  </button>
                </div>

                {previewMode ? (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl min-h-[300px] space-y-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans select-text">
                    <h2 className="text-lg font-extrabold text-slate-900">{docFormTitle || 'Untitled Guide Draft'}</h2>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Category: {docFormCategory} · Version: {docFormVersion}
                    </div>
                    <hr className="border-slate-200" />
                    {docFormContent || 'Type some manual instructions first...'}
                  </div>
                ) : (
                  <form onSubmit={handleSaveDocument} className="space-y-4 text-slate-800">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Guide Title</label>
                        <input
                          type="text"
                          required
                          value={docFormTitle}
                          onChange={(e) => setDocFormTitle(e.target.value)}
                          placeholder="Admissions Intake Escalation Guide..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl text-xs font-bold outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Document Category</label>
                        <select
                          value={docFormCategory}
                          onChange={(e) => setDocFormCategory(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Guide Instructions Content (Markdown Text)</label>
                      <textarea
                        rows={14}
                        required
                        value={docFormContent}
                        onChange={(e) => setDocFormContent(e.target.value)}
                        placeholder="# Guide Header\nUse hashtags to style sections.\n\n## Overview\nType detailed procedural manuals, steps, and tips here."
                        className="w-full p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-2xl text-xs font-semibold font-mono outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Version Code</label>
                        <input
                          type="text"
                          value={docFormVersion}
                          onChange={(e) => setDocFormVersion(e.target.value)}
                          placeholder="1.0.0"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl text-xs font-bold outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={docFormTags}
                          onChange={(e) => setDocFormTags(e.target.value)}
                          placeholder="admissions, audit, logs"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl text-xs font-bold outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Visibility Restriction</label>
                        <select
                          value={docFormVisibility}
                          onChange={(e) => setDocFormVisibility(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                        >
                          <option value="All">All Staff Roles</option>
                          <option value="Super Admin">Super Admin Only</option>
                          <option value="Admissions Officer">Admissions Officer</option>
                          <option value="Career Officer">Career Officer</option>
                          <option value="Operations Officer">Operations Officer</option>
                          <option value="Super Admin, Admissions Officer">Admissions + Super Admin</option>
                          <option value="Super Admin, Career Officer">Careers + Super Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status:</span>
                        <div className="flex gap-2">
                          {['Published', 'Draft', 'Archived'].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setDocFormStatus(st as any)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all border cursor-pointer ${
                                docFormStatus === st ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => { setIsEditing(false); setEditDocId(null); }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          {editDocId ? 'Save & Bump Version' : 'Publish Document'}
                        </button>
                      </div>
                    </div>

                  </form>
                )}

              </div>

              {/* Tips block (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-150 p-6 space-y-4 text-xs text-slate-600 leading-relaxed">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Info size={16} className="text-emerald-600" />
                  Documentation Authoring SOP
                </h4>
                <p>Olatech school operational manuals require consistent section templates to ease reading transitions for field staff:</p>
                <ul className="space-y-2 list-disc pl-4 font-medium text-slate-700">
                  <li><strong>Overview</strong>: 1-2 sentences summarizing the operation.</li>
                  <li><strong>Objectives</strong>: High-level purpose of doing this workflow.</li>
                  <li><strong>Step-by-Step Instructions</strong>: Enumerated clicks and actions.</li>
                  <li><strong>Warnings</strong>: Crucial mistakes to avoid (labeled with ⚠️).</li>
                  <li><strong>Best Practices</strong>: Efficiency tips for high productivity.</li>
                </ul>
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 text-[11px] text-emerald-800 rounded-2xl">
                  <strong>Markdown Supported:</strong> Use standard hashes (# ## ###) for styling display headers. Ensure readability of procedures.
                </div>
              </div>

            </div>
          ) : (
            /* Document List Registry Table */
            <div className="bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-slate-800">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="p-4">Guide Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Version</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Visibility</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {documents.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{doc.title}</td>
                        <td className="p-4 font-semibold text-slate-500">{doc.category}</td>
                        <td className="p-4 font-mono font-bold text-slate-600">v{doc.version}</td>
                        <td className="p-4 text-slate-500">{doc.author}</td>
                        <td className="p-4">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase text-slate-500">
                            {doc.visibilityByRole}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            doc.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5 shrink-0">
                          <button
                            onClick={() => { setSelectedDocId(doc.id); setActiveTab('reader'); }}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                            title="Read guide"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => handleStartEdit(doc)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                            title="Edit / Bump version"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteDoc(doc.id, doc.title)}
                            className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                            title="Archive / Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {documents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-400 font-bold">No documentation guides registered in the database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ======================= ANALYTICS VIEW ======================= */}
      {activeTab === 'analytics' && analyticsData && (
        <div className="space-y-6">
          
          {/* Top Level Summary Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
                <Eye size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Total Downloads</span>
                <span className="text-xl font-black block text-slate-900 mt-0.5">{analyticsData.totalDownloads} copies</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shrink-0">
                <ThumbsUp size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Helpful Rating</span>
                <span className="text-xl font-black block text-slate-900 mt-0.5">{analyticsData.helpfulRate}% Yes</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-500 shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Completion Rate</span>
                <span className="text-xl font-black block text-slate-900 mt-0.5">{analyticsData.completionRate}% Done</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 shrink-0">
                <Star size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Quality Index</span>
                <span className="text-xl font-black block text-slate-900 mt-0.5">Excellent (4.8)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Most Viewed Guides Charts (Recharts) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 size={15} className="text-emerald-600" />
                Most Viewed Handbooks & Operational Guides
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.mostViewed}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="title" tick={{ fontSize: 9 }} tickFormatter={(val) => val.split(' ').slice(0, 2).join(' ') + '...'} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Bar dataKey="views" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Keyword Search Trends */}
            <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Search size={15} className="text-emerald-600" />
                Frequently Searched Keywords cloud
              </h4>
              <div className="space-y-3">
                {analyticsData.keywords.map((kw: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-2 text-slate-700 font-bold bg-slate-100 px-2.5 py-1 rounded-xl">
                      #{kw.keyword}
                    </span>
                    <span className="text-slate-400 font-mono font-bold">{kw.count} search attempts</span>
                  </div>
                ))}
                {analyticsData.keywords.length === 0 && (
                  <p className="text-center text-slate-400 py-12 text-xs font-bold">No searches recorded in the log database yet.</p>
                )}
              </div>
            </div>

            {/* Poorly Rated Guides warning card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-red-500" />
                Documents Requiring Update / Poorly Rated
              </h4>
              <div className="space-y-3">
                {analyticsData.poorlyRated.length === 0 ? (
                  <div className="p-8 text-center text-emerald-800 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle size={16} />
                    All operational guides satisfy the 4.0/5.0 staff helpfulness index!
                  </div>
                ) : (
                  analyticsData.poorlyRated.map((doc: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-xl text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{doc.title}</span>
                        <span className="text-red-700 font-medium block mt-0.5">Average rating: {doc.rating}/5.0</span>
                      </div>
                      <button
                        onClick={() => { setSelectedDocId(doc.id); setActiveTab('reader'); }}
                        className="px-3 py-1 bg-white hover:bg-red-50 border border-red-200 text-red-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                      >
                        Inspect Reviews
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Least Viewed Guides */}
            <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Info size={15} className="text-emerald-600" />
                Least Viewed / Under-utilized Handbooks
              </h4>
              <div className="space-y-3">
                {analyticsData.leastViewed.slice(0, 4).map((doc: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl font-bold">
                    <span className="text-slate-700 truncate">{doc.title}</span>
                    <span className="text-slate-400 font-mono text-[10px] shrink-0">{doc.views} views logged</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
