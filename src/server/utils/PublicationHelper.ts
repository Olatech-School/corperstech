/**
 * PublicationHelper.ts
 * 
 * Formatting and building utilities for CorpersTech & Olatech School of Programming
 * Gold Master Career Resources and publications. Generates publication-grade Markdown
 * structures (cover pages, TOCs, callout boxes, comparison matrices, editable templates).
 */

export class PublicationHelper {
  public static buildCoverPage(
    title: string,
    subtitle: string,
    category: string,
    version: string = "2026 Gold Master (v4.2)",
    year: string = "2026"
  ): string {
    return [
      "# ==============================================================================",
      "# 🏛️ CORPERSTECH & OLATECH SCHOOL OF PROGRAMMING",
      "# PROFESSIONAL CAREER RESOURCE & PUBLICATION HANDBOOK",
      "# ==============================================================================",
      `# ${title.toUpperCase()}`,
      `## ${subtitle}`,
      "",
      `**Version:** ${version} | **Year:** ${year}  `,
      "**Published By:** Olatech School of Programming Career Advancement Hub  ",
      `**Category:** ${category} | **Target Audience:** NYSC Engineers, Tech Fellows, & Enterprise Candidates  `,
      "**Standard:** Enterprise Gold Master Publication (Validated for Google, Microsoft, AWS, & Coursera Benchmarks)  ",
      "==============================================================================",
      "",
      "---",
      ""
    ].join("\n");
  }

  public static buildTableOfContents(items: { id: string; title: string }[]): string {
    return [
      "## 📑 TABLE OF CONTENTS",
      ...items.map((item, idx) => `* [${idx + 1}. ${item.title}](#${item.id})`),
      "",
      "---",
      ""
    ].join("\n");
  }

  public static buildCallout(
    type: 'tip' | 'recruiter' | 'warning' | 'best_practice' | 'pro_tip' | 'expert',
    text: string
  ): string {
    const prefixMap: Record<string, string> = {
      tip: "💡 CAREER TIP:",
      recruiter: "⭐ RECRUITER'S ADVICE:",
      warning: "⚠️ COMMON MISTAKE:",
      best_practice: "🎯 BEST PRACTICE:",
      pro_tip: "🚀 PRO TIP:",
      expert: "🏛️ OLATECH EXPERT NOTE:"
    };
    return `> **${prefixMap[type]}** ${text}\n`;
  }

  public static buildComparisonTable(
    headers: [string, string, string],
    rows: [string, string, string][]
  ): string {
    return [
      `| ${headers[0]} | ${headers[1]} | ${headers[2]} |`,
      "| :--- | :--- | :--- |",
      ...rows.map(r => `| ${r[0]} | ${r[1]} | ${r[2]} |`),
      ""
    ].join("\n");
  }

  public static buildPracticalExample(
    title: string,
    bad: string,
    improved: string,
    excellent: string
  ): string {
    return [
      `### ${title}`,
      "",
      "#### ❌ Bad Example (Generic & Weak)",
      `> *"${bad}"*`,
      "",
      "#### ⚠️ Improved Example (Standard Competency)",
      `> *"${improved}"*`,
      "",
      "#### ⭐ Excellent Example (ATS & Recruiter Gold Standard - XYZ Formula)",
      `> *"${excellent}"*`,
      ""
    ].join("\n");
  }

  public static buildDiagramPlaceholder(
    type: 'Illustration' | 'Screenshot' | 'Diagram' | 'Flowchart',
    title: string
  ): string {
    return `\n[${type}: ${title}]\n`;
  }

  public static buildChecklist(
    title: string,
    items: { label: string; desc: string }[]
  ): string {
    return [
      `## ${title}`,
      "",
      ...items.map(item => `* [ ] **□ ${item.label}:** ${item.desc}`),
      "",
      "---",
      ""
    ].join("\n");
  }

  public static buildClosingPage(title: string): string {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return [
      "---",
      "",
      "## CLOSING ADVICE, NEXT STEPS & LEARNING PATH",
      "",
      "### 🏛️ Final Career Advice from Olatech Directors",
      '*"Your technical competencies get your application noticed, but your structural presentation, quantifiable evidence, and professional rigor win the offer. Treat every career document and portfolio artifact with the exact same engineering discipline, modularity, and architectural excellence as your production codebase."*',
      "",
      "### 🚀 Recommended Next Steps & Implementation Roadmap",
      "1. **Immediate Execution (0–48 Hours):** Audit your current career assets against the interactive checklists and comparison matrices in this publication. Implement the Gold Master templates immediately.",
      "2. **Peer Review & Verification (Days 3–5):** Submit your revised CV, LinkedIn profile, or code portfolio to the CorpersTech Discord `#career-reviews` channel for technical validation by Olatech Senior Fellows.",
      "3. **1-on-1 Placement Check-in (Day 7):** Schedule a formal portfolio review and mock interview with your assigned Olatech Career Placement Officer.",
      "",
      "### 🌐 Olatech Contact Information & Institutional Support",
      "* **Organization:** Olatech School of Programming & CorpersTech NYSC Hub",
      "* **Headquarters:** Silicon Valley Campus, Lagos & Abuja Corporate Enclaves, Nigeria",
      "* **Email Support:** olatechschoolofprogramming@gmail.com | careers@corporate.nysc.ng",
      "* **Live Command Center:** https://ai.studio/build/corporate-nysc-hub",
      `* **Institutional Verification:** \`[QR Code Placeholder: https://ai.studio/verify-publication/2026-GM-${slug}]\``,
      "",
      "---",
      "*Prepared by Olatech School of Programming — Transforming NYSC Engineers into Global Enterprise Leaders.*"
    ].join("\n");
  }
}
