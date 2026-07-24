import React, { useState, useEffect } from 'react';
import { 
  Shield, FileSpreadsheet, Terminal, Code, Cpu, Smartphone, Zap, Palette, 
  Sparkles, Video, Briefcase, TrendingUp, FileText, Search, Filter, ArrowRight, 
  CheckCircle2, Clock, DollarSign, Globe, Award, Layers, Building, Users, Star,
  Eye, Bookmark, ExternalLink
} from 'lucide-react';
import { CareerProfileModal } from './CareerProfileModal.tsx';

interface CareerExplorerModuleProps {
  onRegisterClick?: (programId?: string) => void;
  userEmail?: string;
}

export const CareerExplorerModule: React.FC<CareerExplorerModuleProps> = ({
  onRegisterClick,
  userEmail = 'student@corperstech.ng'
}) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Paths (13)');
  const [selectedModalProfile, setSelectedModalProfile] = useState<any | null>(null);

  // Fallback 13 profiles array for offline or immediate rendering
  const fallbackProfilesArray = [
    {
      courseId: 'cybersecurity',
      title: 'Cybersecurity Analyst',
      category: 'Software & Web',
      description: 'Secure enterprise networks, conduct vulnerability diagnostics, monitor SIEM packet flows, and neutralize system intrusion threats.',
      whoItSuits: 'Individuals with strong analytical logic, high attention to detail, and a passion for network defense and system integrity.',
      salary: {
        nigeriaEntry: '₦250,000 - ₦400,000 / month',
        nigeriaMid: '₦450,000 - ₦750,000 / month',
        nigeriaSenior: '₦900,000 - ₦1,800,000 / month',
        africaAverage: '$1,200 - $3,000 / month',
        remoteInternational: '$55,000 - $95,000 / year',
        freelanceRate: '$35 - $80 / hour'
      },
      remote: 'Extremely high remote availability with global corporate SOC networks.',
      freelance: 'Moderate to High (Consultancy security audits and penetration testing reports).',
      skills: ['Intrusion Diagnostics', 'Threat Intelligence', 'Vulnerability Auditing', 'SIEM Operations', 'Network Cryptography'],
      softSkills: ['Analytical Problem Solving', 'Crisis Management', 'Technical Reporting'],
      duration: '16 Weeks Intensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'Security Fundamentals', description: 'Understand OSI networking layers, TCP/IP protocols, and standard encryption.' },
        { stage: 'Intermediate', title: 'Network Defense & Linux', description: 'Master Linux command line, system hardening, and Wireshark analysis.' },
        { stage: 'Project Building', title: 'Penetration Diagnostics', description: 'Conduct simulated ethical vulnerability assessments using Burp Suite.' },
        { stage: 'Portfolio', title: 'SOC Monitoring Logs', description: 'Deploy and configure a Splunk SIEM dashboard to monitor server logs.' },
        { stage: 'Internship', title: 'NYSC Security Attachment', description: 'Join corporate security teams at fintech or banking partners.' },
        { stage: 'Freelancing', title: 'Vulnerability Consultancy', description: 'Offer website vulnerability audits to local businesses.' },
        { stage: 'Remote Job', title: 'Global SOC Analyst', description: 'Secure full-time remote contracts with cloud security monitoring networks.' },
        { stage: 'Full-Time Career', title: 'Senior Security Engineer', description: 'Lead enterprise security architecture and incident response.' }
      ],
      companies: ['MainOne', 'Interswitch Group', 'PwC Nigeria', 'KPMG', 'Flutterwave', 'Moniepoint'],
      tools: ['Wireshark', 'Burp Suite', 'Kali Linux', 'Metasploit', 'Splunk', 'Nmap'],
      nyscReason: 'Financial institutions lock in cybersecurity trainees early; acquiring SIEM skills during NYSC guarantees immediate high-paying placement.',
      difficulty: 'Intermediate to Advanced',
      demandRating: 'Critical Demand',
      typicalProjects: [
        'Enterprise SIEM log monitor capturing unauthorized login attempts and DDoS patterns',
        'Full website vulnerability audit report using OWASP Top 10 guidelines',
        'Automated Linux server security hardening script with firewall rules'
      ],
      portfolioRecs: ['Publish a detailed technical breakdown of a simulated CVE vulnerability investigation on GitHub.'],
      certifications: ['CompTIA Security+', 'CompTIA CySA+', 'Certified Ethical Hacker (CEH)'],
      globalPotential: 'Outstanding. Global talent shortage exceeds 3.5 million unfilled roles.',
      longTermGrowth: 'Progress from Junior Security Analyst to SOC Team Lead, Penetration Tester, or CISO.',
      recommendedCourse: { courseId: 'cybersecurity', name: 'Cybersecurity Analyst Track', duration: '16 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed SOC Portfolio Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'data-analysis',
      title: 'Data Analysis & Business Intelligence',
      category: 'Data & AI',
      description: 'Query SQL relational databases, clean messy enterprise datasets, construct interactive Power BI and Tableau dashboards, and drive business decisions.',
      whoItSuits: 'Perfect for logical problem-solvers, business graduates, statisticians, and analytical minds who love discovering actionable trends in numbers.',
      salary: {
        nigeriaEntry: '₦200,000 - ₦380,000 / month',
        nigeriaMid: '₦400,000 - ₦650,000 / month',
        nigeriaSenior: '₦750,000 - ₦1,500,000 / month',
        africaAverage: '$1,000 - $2,500 / month',
        remoteInternational: '$48,000 - $85,000 / year',
        freelanceRate: '$30 - $65 / hour'
      },
      remote: 'Very high. High demand for remote decision-support analysts and BI report developers.',
      freelance: 'High (Building customized executive dashboards and automating spreadsheets).',
      skills: ['Relational SQL Queries', 'Data Cleaning Protocols', 'Interactive BI Dashboarding', 'Statistical Trend Analysis', 'Excel Pivot Automation'],
      softSkills: ['Data Storytelling', 'Executive Presentation', 'Critical Thinking'],
      duration: '12 Weeks Intensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'Advanced Excel & Sheets', description: 'Master XLOOKUP, pivot tables, and statistical formula modeling.' },
        { stage: 'Intermediate', title: 'Relational SQL Querying', description: 'Write complex JOINs, window functions, and aggregations across PostgreSQL.' },
        { stage: 'Project Building', title: 'Power BI / Tableau BI', description: 'Design interactive visual reports with drill-down KPIs.' },
        { stage: 'Portfolio', title: 'End-to-End Case Study', description: 'Deliver customer churn prediction and revenue insight presentation.' },
        { stage: 'Internship', title: 'Corporate BI Analyst Intern', description: 'Support marketing and finance teams with daily reporting metrics.' },
        { stage: 'Freelancing', title: 'Freelance Dashboard Builder', description: 'Construct automated sales trackers for SMEs on Upwork.' },
        { stage: 'Remote Job', title: 'Remote Data Analyst', description: 'Provide daily data intelligence for international SaaS brands.' },
        { stage: 'Full-Time Career', title: 'Lead BI Manager', description: 'Oversee corporate data warehousing and analytics pipelines.' }
      ],
      companies: ['Kuda Bank', 'Chevron Nigeria', 'Moniepoint', 'Tek Experts Nigeria', 'Paystack'],
      tools: ['SQL (PostgreSQL/MySQL)', 'Excel / Power Query', 'Power BI', 'Tableau', 'Python Pandas'],
      nyscReason: 'Every company generates massive data but lacks analysts; data analysis offers the fastest route from non-CS degrees into tech.',
      difficulty: 'Beginner to Intermediate',
      demandRating: 'Critical Demand',
      typicalProjects: [
        'Interactive Power BI financial dashboard tracking multi-currency banking revenue',
        'SQL database cleaning pipeline analyzing 100,000+ customer transactions',
        'Python statistical report modeling user retention and churn drivers'
      ],
      portfolioRecs: ['Host an interactive portfolio featuring 3 Power BI / Tableau dashboards with executive summary PDF slides.'],
      certifications: ['Google Data Analytics Certificate', 'Microsoft Power BI Data Analyst Associate (PL-300)'],
      globalPotential: 'Exceptional. Universal corporate language with immense remote contracting demand.',
      longTermGrowth: 'Transition from Junior Analyst to Senior BI Developer, Data Scientist, or CDO.',
      recommendedCourse: { courseId: 'data-analysis', name: 'Data Analysis & BI Track', duration: '12 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed BI Portfolio Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'web-dev',
      title: 'Full-Stack Web Development',
      category: 'Software & Web',
      description: 'Code responsive user interfaces, manage dynamic client state, and construct scalable backend REST APIs and database structures.',
      whoItSuits: 'Those who enjoy combining visual creativity with programmatic logic. Highly rewarding for makers who want to build web apps from scratch.',
      salary: {
        nigeriaEntry: '₦220,000 - ₦450,000 / month',
        nigeriaMid: '₦500,000 - ₦850,000 / month',
        nigeriaSenior: '₦900,000 - ₦2,000,000 / month',
        africaAverage: '$1,200 - $3,500 / month',
        remoteInternational: '$50,000 - $90,000 / year',
        freelanceRate: '$35 - $75 / hour'
      },
      remote: 'Extremely high. Standard global tech remote structure with thousands of active opportunities.',
      freelance: 'Outstandingly high. Unlimited local and global client agency gigs and web app contracts.',
      skills: ['Frontend HTML/CSS/JS', 'React.js SPAs & Hooks', 'Node.js & Express APIs', 'Relational Database Architecture', 'Tailwind CSS UI Styling'],
      softSkills: ['Agile Collaboration', 'Code Review Etiquette', 'User-Centric Design Thinking'],
      duration: '20 Weeks Comprehensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'HTML5, CSS3 & Tailwind', description: 'Build responsive layouts and clean modern interfaces.' },
        { stage: 'Intermediate', title: 'JavaScript & DOM Logic', description: 'Master ES6+ syntax, asynchronous fetch requests, and state.' },
        { stage: 'Project Building', title: 'React.js Single Page Apps', description: 'Develop interactive web applications using React hooks and context.' },
        { stage: 'Portfolio', title: 'Full-Stack Express & MySQL', description: 'Connect React frontends to Node.js APIs with JWT authentication.' },
        { stage: 'Internship', title: 'NYSC Engineering Fellow', description: 'Collaborate with engineering squads on production codebases.' },
        { stage: 'Freelancing', title: 'Custom Web Developer', description: 'Build e-commerce stores and booking portals for local businesses.' },
        { stage: 'Remote Job', title: 'International Full-Stack Engineer', description: 'Work remotely for US and European tech companies.' },
        { stage: 'Full-Time Career', title: 'Senior Software Architect', description: 'Lead frontend and backend engineering teams.' }
      ],
      companies: ['Andela', 'PiggyVest', 'Flutterwave', 'Decagon', 'Moniepoint', 'Paystack'],
      tools: ['HTML5 / CSS3', 'React.js', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS', 'Git & GitHub'],
      nyscReason: 'Web development enables you to build custom platforms, freelance instantly from your lodge, and qualifies you for technical engineering roles.',
      difficulty: 'Beginner to Intermediate',
      demandRating: 'Critical Demand',
      typicalProjects: [
        'Fully responsive SaaS application dashboard with live charts and dark mode',
        'Full-stack e-commerce marketplace featuring shopping cart and checkout',
        'Collaborative task management portal with drag-and-drop boards and REST API'
      ],
      portfolioRecs: ['Launch a custom portfolio website hosting 3 live deployed full-stack applications with open-source repositories.'],
      certifications: ['Meta Front-End Developer Certificate', 'Meta Back-End Developer Certificate', 'AWS Certified Developer'],
      globalPotential: 'Outstanding. Extremely liquid remote job market worldwide.',
      longTermGrowth: 'Progress from Junior Developer to Full-Stack Engineer, Technical Lead, or CTO.',
      recommendedCourse: { courseId: 'web-dev', name: 'Full-Stack Web Dev Track', duration: '20 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed Full-Stack Portfolio Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'software-eng',
      title: 'Software Engineering & Cloud Architecture',
      category: 'Software & Web',
      description: 'Design enterprise-grade software systems, implement microservices, manage cloud infrastructure (AWS/GCP), and optimize database pipelines.',
      whoItSuits: 'Ideal for deep technical thinkers, system architects, and engineers who love solving complex algorithmic and infrastructural challenges.',
      salary: {
        nigeriaEntry: '₦300,000 - ₦550,000 / month',
        nigeriaMid: '₦600,000 - ₦1,200,000 / month',
        nigeriaSenior: '₦1,500,000 - ₦3,500,000 / month',
        africaAverage: '$1,800 - $4,500 / month',
        remoteInternational: '$65,000 - $120,000 / year',
        freelanceRate: '$45 - $100 / hour'
      },
      remote: 'Extremely high. Core software engineering remains the highest paid remote skill worldwide.',
      freelance: 'Very High (Enterprise backend refactoring, cloud migration, and architecture advisory).',
      skills: ['Data Structures & Algorithms', 'System Architecture Design', 'Microservices & Docker', 'Cloud Infrastructure (AWS/GCP)', 'CI/CD Pipelines'],
      softSkills: ['Architectural Vision', 'Cross-Team Mentorship', 'Technical Documentation'],
      duration: '24 Weeks Advanced Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'Core CS Logic & OOP', description: 'Master data structures, complexity analysis, and design patterns.' },
        { stage: 'Intermediate', title: 'Backend Systems & APIs', description: 'Build high-concurrency Node.js, Python, or Go servers with PostgreSQL.' },
        { stage: 'Project Building', title: 'Microservices & Docker', description: 'Containerize applications and deploy orchestrated cloud services.' },
        { stage: 'Portfolio', title: 'Enterprise Scalability Project', description: 'Engineer automated CI/CD pipelines and database replication.' },
        { stage: 'Internship', title: 'Junior Cloud Systems Engineer', description: 'Work with DevOps teams at leading Nigerian banks and fintechs.' },
        { stage: 'Freelancing', title: 'Cloud Migration Consultant', description: 'Assist startups in migrating legacy servers to serverless cloud.' },
        { stage: 'Remote Job', title: 'Global Software Engineer', description: 'Join international teams building mission-critical cloud software.' },
        { stage: 'Full-Time Career', title: 'Principal Architect / CTO', description: 'Direct organization-wide technology strategy and cloud security.' }
      ],
      companies: ['Interswitch Group', 'Flutterwave', 'Paystack', 'Opay', 'Moniepoint', 'Microsoft Africa'],
      tools: ['TypeScript / Node.js', 'Python / Go', 'Docker & Kubernetes', 'AWS / GCP', 'PostgreSQL / Redis'],
      nyscReason: 'Banks and telecom giants need cloud-native engineers; mastering cloud architecture during NYSC sets you up for tier-1 engineering salaries.',
      difficulty: 'Advanced',
      demandRating: 'Critical Demand',
      typicalProjects: [
        'High-throughput payment routing gateway handling 500+ requests/sec with Redis caching',
        'Automated Docker CI/CD deployment pipeline deploying microservices to Cloud Run',
        'Secure OAuth 2.0 and RBAC enterprise authentication server with audit logging'
      ],
      portfolioRecs: ['Publish an open-source GitHub repository showcasing a containerized microservice backend with unit tests.'],
      certifications: ['AWS Certified Solutions Architect', 'Google Cloud Associate Cloud Engineer', 'CKA'],
      globalPotential: 'Exceptional. Cloud architects command top-tier compensation packages globally.',
      longTermGrowth: 'Advance from Systems Engineer to Staff Engineer, Principal Architect, or CTO.',
      recommendedCourse: { courseId: 'software-eng', name: 'Software Eng & Cloud Track', duration: '24 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed Systems Portfolio Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'python',
      title: 'Python Programming & Automation',
      category: 'Software & Web',
      description: 'Construct versatile programmatic scripts, automate manual enterprise workflows, build custom web scrapers, and lay the foundations for data science.',
      whoItSuits: 'Anyone interested in clean syntax, automation scripting, data manipulation, and building backend software utilities.',
      salary: {
        nigeriaEntry: '₦180,000 - ₦380,000 / month',
        nigeriaMid: '₦400,000 - ₦700,000 / month',
        nigeriaSenior: '₦800,000 - ₦1,600,000 / month',
        africaAverage: '$1,000 - $2,800 / month',
        remoteInternational: '$50,000 - $88,000 / year',
        freelanceRate: '$30 - $70 / hour'
      },
      remote: 'High remote compatibility for backend data processing and automation tasks.',
      freelance: 'Very High (Constructing customized web scrapers, API connectors, and automated reporting bots).',
      skills: ['Python 3 OOP Syntax', 'REST API Consumption', 'Custom Web Scraping (BeautifulSoup)', 'Server Scripting Automation', 'Django / Flask Frameworks'],
      softSkills: ['Process Optimization', 'Logical Debugging', 'Efficiency Mindset'],
      duration: '12 Weeks Intensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'Python Core Syntax', description: 'Understand variables, functions, file I/O, and exception handling.' },
        { stage: 'Intermediate', title: 'Web Scraping & APIs', description: 'Build automated scripts that extract data and communicate with REST APIs.' },
        { stage: 'Project Building', title: 'Backend APIs with Django', description: 'Develop backend servers with ORM database querying and auth.' },
        { stage: 'Portfolio', title: 'Automated Workflow Pipeline', description: 'Deploy background schedulers processing data and sending email digests.' },
        { stage: 'Internship', title: 'Python Automation Engineer', description: 'Help corporate operations teams automate manual spreadsheet workflows.' },
        { stage: 'Freelancing', title: 'Freelance Script Writer', description: 'Build custom data extraction bots for international clients on Upwork.' },
        { stage: 'Remote Job', title: 'Remote Backend Developer', description: 'Build backend microservices and data pipelines for global startups.' },
        { stage: 'Full-Time Career', title: 'Lead Automation Engineer', description: 'Direct corporate automation strategies and backend data processing.' }
      ],
      companies: ['Shell Nigeria', 'MTN Nigeria', 'SeamlessHR', 'Vendease', 'Interswitch Group'],
      tools: ['Python 3', 'Django', 'Flask / FastAPI', 'BeautifulSoup & Selenium', 'Pandas'],
      nyscReason: 'Python is the easiest language to learn and offers immediate freelance utility automating repetitive tasks for businesses during your service year.',
      difficulty: 'Beginner to Intermediate',
      demandRating: 'Very High Demand',
      typicalProjects: [
        'Automated web scraper extracting real estate pricing data and generating CSV reports',
        'REST API backend built with Django REST Framework featuring user auth and rate limiting',
        'Custom Slack notification bot monitoring server health pings and alerting teams'
      ],
      portfolioRecs: ['Showcase a GitHub repository with 3 Python automation scripts and a live Django backend API.'],
      certifications: ['PCEP Entry-Level Python Programmer', 'PCAP Associate in Python Programming'],
      globalPotential: 'Exceptional. Python is the world’s most popular programming language.',
      longTermGrowth: 'Progress from Python Developer to Backend Lead, Data Scientist, or ML Engineer.',
      recommendedCourse: { courseId: 'python', name: 'Python Programming Track', duration: '12 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed Python Portfolio Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'app-dev',
      title: 'Mobile App Development (Flutter & React Native)',
      category: 'Software & Web',
      description: 'Build native iOS and Android mobile applications using cross-platform frameworks, integrate cloud databases, and deploy polished apps to mobile app stores.',
      whoItSuits: 'Creative developers and mobile enthusiasts who want to create tangible applications that people use on their smartphones every day.',
      salary: {
        nigeriaEntry: '₦200,000 - ₦420,000 / month',
        nigeriaMid: '₦450,000 - ₦800,000 / month',
        nigeriaSenior: '₦850,000 - ₦1,800,000 / month',
        africaAverage: '$1,200 - $3,200 / month',
        remoteInternational: '$50,000 - $90,000 / year',
        freelanceRate: '$35 - $75 / hour'
      },
      remote: 'Extremely high. High demand for remote mobile engineers across international companies and startups.',
      freelance: 'Very High (Building custom mobile MVPs for local startups and e-commerce stores).',
      skills: ['Cross-Platform Dev (Flutter/React Native)', 'Declarative UI Architecture', 'State Management (Bloc/Redux)', 'Firebase Cloud Storage', 'App Store Publishing'],
      softSkills: ['UX Intuition', 'Attention to Visual Detail', 'Agile Testing'],
      duration: '18 Weeks Comprehensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'Dart / React Native Basics', description: 'Master declarative widgets, screen layouts, and navigation stacks.' },
        { stage: 'Intermediate', title: 'State Management & Storage', description: 'Implement Bloc/Provider state management and SQLite caching.' },
        { stage: 'Project Building', title: 'Cloud Backend Integration', description: 'Connect apps to Firebase databases, push notifications, and storage.' },
        { stage: 'Portfolio', title: 'App Store Release', description: 'Optimize app bundle size and publish applications to Google Play Store.' },
        { stage: 'Internship', title: 'NYSC Mobile Developer Attaché', description: 'Join mobile engineering teams at Nigerian fintech banks.' },
        { stage: 'Freelancing', title: 'Mobile MVP Creator', description: 'Build MVP prototypes and mobile store apps for local entrepreneurs.' },
        { stage: 'Remote Job', title: 'International Mobile Engineer', description: 'Work remotely for global tech companies maintaining cross-platform codebases.' },
        { stage: 'Full-Time Career', title: 'Lead Mobile Architect', description: 'Direct mobile product engineering across enterprise applications.' }
      ],
      companies: ['OPay Nigeria', 'Palmpay', 'Moniepoint', 'PiggyVest', 'Kuda Bank'],
      tools: ['Flutter / Dart', 'React Native / TypeScript', 'Firebase Authentication', 'Android Studio / Xcode'],
      nyscReason: 'Nigeria is a mobile-first economy; startups and banks require skilled mobile engineers to build and maintain iOS and Android applications.',
      difficulty: 'Intermediate',
      demandRating: 'Critical Demand',
      typicalProjects: [
        'Full-featured mobile banking prototype with live transfer state and biometric auth simulation',
        'E-commerce mobile app with live shopping cart and Firebase real-time database inventory',
        'Location-aware task tracking mobile app with offline SQLite persistence'
      ],
      portfolioRecs: ['Publish at least 2 fully functional mobile applications on Google Play Store with open-source repositories.'],
      certifications: ['Meta Android Developer Certificate', 'Google Associate Android Developer', 'Meta iOS Developer Certificate'],
      globalPotential: 'Outstanding. Cross-platform mobile developers save companies time and money, making them highly sought after.',
      longTermGrowth: 'Advance from Junior Mobile Engineer to Senior Mobile Developer, Mobile Solutions Architect, or VP of Engineering.',
      recommendedCourse: { courseId: 'app-dev', name: 'Mobile App Development Track', duration: '18 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed Mobile Portfolio Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'ai-automation',
      title: 'AI & Automation Engineering',
      category: 'Data & AI',
      description: 'Integrate generative AI models (Gemini/OpenAI), build automated business workflows with Make.com/Zapier, develop custom RAG chatbots, and eliminate manual labor.',
      whoItSuits: 'Forward-thinking innovators, tech enthusiasts, and problem solvers who want to leverage artificial intelligence to transform business productivity.',
      salary: {
        nigeriaEntry: '₦250,000 - ₦500,000 / month',
        nigeriaMid: '₦550,000 - ₦950,000 / month',
        nigeriaSenior: '₦1,000,000 - ₦2,500,000 / month',
        africaAverage: '$1,500 - $3,800 / month',
        remoteInternational: '$60,000 - $110,000 / year',
        freelanceRate: '$40 - $90 / hour'
      },
      remote: 'Extremely high. AI engineering and workflow automation are the fastest-growing remote contracting sectors globally.',
      freelance: 'Phenomenal (Immediate high-paying contracts building AI customer service bots and automating internal corporate operations).',
      skills: ['Generative AI API Integration', 'No-Code Workflow Automation (Make/Zapier)', 'Custom Chatbots (RAG/Vector DBs)', 'Prompt Engineering', 'Webhook Orchestration'],
      softSkills: ['Innovation Mindset', 'Strategic Process Mapping', 'Rapid Prototyping'],
      duration: '14 Weeks Intensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'AI Foundations & Prompting', description: 'Master advanced prompt engineering and structured JSON outputs.' },
        { stage: 'Intermediate', title: 'Workflow Orchestration', description: 'Connect CRM systems and spreadsheets using Make.com and Zapier webhooks.' },
        { stage: 'Project Building', title: 'AI API Integration & RAG Bots', description: 'Build scripts integrating Gemini API and vectorizing internal documents.' },
        { stage: 'Portfolio', title: 'Enterprise Automation Case', description: 'Deploy an automated lead qualification pipeline saving 20 hours per week.' },
        { stage: 'Internship', title: 'AI Operations Fellow', description: 'Join innovation teams automating customer support and marketing workflows.' },
        { stage: 'Freelancing', title: 'AI & Workflow Consultant', description: 'Build custom WhatsApp AI agents and automation funnels for SMEs.' },
        { stage: 'Remote Job', title: 'Global AI Workflow Engineer', description: 'Work remotely designing AI-powered enterprise automation pipelines.' },
        { stage: 'Full-Time Career', title: 'Chief AI Officer (CAIO)', description: 'Lead enterprise AI adoption, automation architecture, and transformation.' }
      ],
      companies: ['Paystack', 'Flutterwave', 'Moniepoint', 'Sterling Bank', 'SeamlessHR'],
      tools: ['Google Gemini API', 'OpenAI / Anthropic APIs', 'Make.com & Zapier', 'n8n Workflow Automation', 'LangChain / LlamaIndex'],
      nyscReason: 'AI is reshaping employment; becoming an AI & Automation Specialist makes you irreplaceable to any modern employer seeking operational efficiency.',
      difficulty: 'Beginner to Intermediate',
      demandRating: 'Critical Demand',
      typicalProjects: [
        'Automated customer lead generator syncing Facebook Ads to Google Sheets, scoring leads with Gemini AI',
        'Custom AI customer support chatbot grounded on internal PDF manuals using vector search',
        'Automated social media content engine researching news and drafting branded posts'
      ],
      portfolioRecs: ['Create a video demo showcase illustrating 3 automated business pipelines running end-to-end.'],
      certifications: ['Google Cloud AI Certificate', 'Make.com Academy Certification', 'Azure AI Fundamentals'],
      globalPotential: 'Exceptional. Global companies pay premium rates for AI engineers who can instantly reduce operational costs.',
      longTermGrowth: 'Progress from AI Workflow Engineer to AI Solutions Architect, Head of Automation, or CAIO.',
      recommendedCourse: { courseId: 'ai-automation', name: 'AI & Automation Track', duration: '14 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed AI Portfolio Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'ui-ux',
      title: 'UI/UX & Product Design',
      category: 'Design & Creative',
      description: 'Conduct user research, design wireframes and interactive high-fidelity prototypes in Figma, and craft seamless digital product experiences.',
      whoItSuits: 'Visual thinkers, empathetic problem-solvers, and creative minds who want to design beautiful, user-friendly digital products.',
      salary: {
        nigeriaEntry: '₦180,000 - ₦380,000 / month',
        nigeriaMid: '₦400,000 - ₦700,000 / month',
        nigeriaSenior: '₦750,000 - ₦1,600,000 / month',
        africaAverage: '$1,000 - $2,600 / month',
        remoteInternational: '$48,000 - $85,000 / year',
        freelanceRate: '$30 - $70 / hour'
      },
      remote: 'Extremely high. Product design is digital and seamlessly executed across global remote teams.',
      freelance: 'Phenomenal (High demand for website redesigns, mobile app UI wireframing, and brand design systems).',
      skills: ['User Research & Usability Testing', 'Wireframing & Architecture', 'High-Fidelity UI in Figma', 'Interactive Prototyping', 'Design Systems'],
      softSkills: ['User Empathy', 'Design Critique & Feedback', 'Visual Communication'],
      duration: '12 Weeks Intensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'Design Thinking & UX Basics', description: 'Understand user empathy, persona creation, and journey mapping.' },
        { stage: 'Intermediate', title: 'Figma Mastery & Wireframing', description: 'Master Figma vector tools, auto-layout, components, and variables.' },
        { stage: 'Project Building', title: 'High-Fidelity App Prototyping', description: 'Design polished mobile and web interfaces with interactive transitions.' },
        { stage: 'Portfolio', title: 'Complete UX Case Study', description: 'Produce a comprehensive portfolio case study solving a real problem.' },
        { stage: 'Internship', title: 'Product Design Fellow', description: 'Collaborate with frontend engineers at tech startups refining live interfaces.' },
        { stage: 'Freelancing', title: 'Freelance UI/UX Designer', description: 'Offer mobile app design and website redesign services on Upwork/Behance.' },
        { stage: 'Remote Job', title: 'Remote Product Designer', description: 'Join international design teams building intuitive SaaS interfaces.' },
        { stage: 'Full-Time Career', title: 'VP of Design / Head of Product UX', description: 'Lead corporate design systems and user experience strategy.' }
      ],
      companies: ['OPay Nigeria', 'Chaka', 'Risevest', 'Moniepoint', 'PiggyVest', 'Flutterwave'],
      tools: ['Figma', 'FigJam / Miro', 'Adobe XD', 'Proto.io', 'Notion'],
      nyscReason: 'No product succeeds without great design; UI/UX requires no coding background yet commands salaries equal to software engineering.',
      difficulty: 'Beginner to Intermediate',
      demandRating: 'Very High Demand',
      typicalProjects: [
        'Complete end-to-end UX case study for a peer-to-peer mobile app with usability reports',
        'High-fidelity interactive Figma prototype for an African e-commerce marketplace featuring auto-layout',
        'Comprehensive SaaS dashboard redesign improving visual hierarchy and contrast'
      ],
      portfolioRecs: ['Publish 2 detailed UX case studies on Behance or Dribbble showing research, wireframes, and prototypes.'],
      certifications: ['Google UX Design Certificate', 'Figma Certified Professional', 'NN/g UX Certification'],
      globalPotential: 'Outstanding. Skilled product designers who can explain their design decisions are hired globally.',
      longTermGrowth: 'Progress from Junior UI/UX Designer to Senior Product Designer, UX Lead, or Head of Design.',
      recommendedCourse: { courseId: 'ui-ux', name: 'UI/UX & Product Design Track', duration: '12 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed Design Portfolio Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'graphics',
      title: 'Graphics Design & Brand Strategy',
      category: 'Design & Creative',
      description: 'Create compelling visual brand identities, design marketing typography, manipulate vector assets, and craft corporate advertising materials.',
      whoItSuits: 'Creative storytellers, artistic minds, and visual communicators who want to shape how brands are perceived across digital media.',
      salary: {
        nigeriaEntry: '₦150,000 - ₦300,000 / month',
        nigeriaMid: '₦350,000 - ₦550,000 / month',
        nigeriaSenior: '₦600,000 - ₦1,200,000 / month',
        africaAverage: '$800 - $2,000 / month',
        remoteInternational: '$40,000 - $70,000 / year',
        freelanceRate: '$25 - $60 / hour'
      },
      remote: 'Very high. Highly flexible visual agency contract roles and remote brand identity design positions.',
      freelance: 'Phenomenal. Immediate ability to command logo, social media asset, and branding retainers.',
      skills: ['Typography & Alignment', 'Vector Asset Composition (Illustrator)', 'Photo Retouching (Photoshop)', 'Corporate Brand Guidelines', 'Social Media Campaign Visuals'],
      softSkills: ['Visual Storytelling', 'Client Brief Interpretation', 'Attention to Detail'],
      duration: '10 Weeks Intensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'Design Principles & Color Theory', description: 'Understand visual balance, contrast, typography pairing, and grid systems.' },
        { stage: 'Intermediate', title: 'Photoshop & Illustrator', description: 'Master vector illustration, clipping masks, photo retouching, and logos.' },
        { stage: 'Project Building', title: 'Corporate Brand Identity Systems', description: 'Design a complete brand kit including logo, guidelines, and social templates.' },
        { stage: 'Portfolio', title: 'Advertising & Marketing Campaign', description: 'Produce visual banners, billboards, and social creatives for a brand.' },
        { stage: 'Internship', title: 'Creative Agency Attaché', description: 'Join advertising agencies or internal corporate marketing teams.' },
        { stage: 'Freelancing', title: 'Freelance Brand Designer', description: 'Secure monthly design retainer contracts with local businesses and startups.' },
        { stage: 'Remote Job', title: 'Remote Brand & Visual Designer', description: 'Work remotely for international marketing agencies designing digital assets.' },
        { stage: 'Full-Time Career', title: 'Art Director / Creative Director', description: 'Lead brand identity strategy and creative advertising teams.' }
      ],
      companies: ['Anakle', 'Insight Publicis', 'Wild Fusion', 'Softcom', 'Genevix Creative Agency'],
      tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma / Canva Pro', 'Behance'],
      nyscReason: 'Every business needs daily social media banners and branding; acquiring graphic design skills gives you an immediate income stream from your PPA.',
      difficulty: 'Beginner-Friendly',
      demandRating: 'High Demand',
      typicalProjects: [
        'Complete brand identity book for a startup including logo vectors and typography rules',
        'High-impact social media ad carousel series designed for Instagram and LinkedIn campaigns',
        'Corporate annual report layout and digital brochure with custom vector iconography'
      ],
      portfolioRecs: ['Maintain a curated Behance portfolio displaying 3 comprehensive brand identity projects and marketing creatives.'],
      certifications: ['Adobe Certified Professional: Visual Design using Photoshop', 'Adobe Certified Professional: Illustrator'],
      globalPotential: 'Excellent. International businesses constantly outsource visual design and branding tasks.',
      longTermGrowth: 'Progress from Graphic Designer to Senior Visual Designer, Art Director, or Creative Director.',
      recommendedCourse: { courseId: 'graphics', name: 'Graphics Design Track', duration: '10 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed Visual Portfolio Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'video-editing',
      title: 'Video Editing & Motion Graphics',
      category: 'Design & Creative',
      description: 'Edit commercial video productions, design narrative motion graphics, arrange sound design tracks, and output clean rendering files for marketing channels.',
      whoItSuits: 'Ideal for creative visual storytellers, content creators, and social media enthusiasts with an eye for timing and digital aesthetics.',
      salary: {
        nigeriaEntry: '₦150,000 - ₦350,000 / month',
        nigeriaMid: '₦380,000 - ₦600,000 / month',
        nigeriaSenior: '₦650,000 - ₦1,400,000 / month',
        africaAverage: '$900 - $2,200 / month',
        remoteInternational: '$42,000 - $75,000 / year',
        freelanceRate: '$25 - $65 / hour'
      },
      remote: 'Extremely high remote availability for YouTube creators, marketing agencies, and global TikTok/Reels channels.',
      freelance: 'Phenomenal (Immediate high-paying video editing contracts on Upwork, Fiverr, and local corporate agencies).',
      skills: ['Timeline Trimming & Sequencing', 'Color Correction & Grading', 'Audio Syncing & Mixing', 'Motion Graphics (After Effects)', 'Social Media Reels Optimization'],
      softSkills: ['Narrative Pacing', 'Visual Pacing', 'Creative Storytelling', 'Deadline Discipline'],
      duration: '10 Weeks Intensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'Video Basics & Premiere Pro', description: 'Understand frame rates, project organization, timeline cutting, and transitions.' },
        { stage: 'Intermediate', title: 'Audio Mixing & Color Grading', description: 'Master Lumetri color correction, cinematic grading, and sound design layering.' },
        { stage: 'Project Building', title: 'Motion Graphics in After Effects', description: 'Create animated lower thirds, kinetic typography, and logo reveals.' },
        { stage: 'Portfolio', title: 'Commercial & Reel Showcase', description: 'Produce a promotional video and a series of viral social media Reels.' },
        { stage: 'Internship', title: 'Media Production Assistant', description: 'Join media agencies or tech companies editing weekly broadcasts.' },
        { stage: 'Freelancing', title: 'Freelance YouTube & Reels Editor', description: 'Secure monthly retainers editing content for global creators and brands.' },
        { stage: 'Remote Job', title: 'Remote Video Producer', description: 'Work remotely for international digital marketing agencies producing commercials.' },
        { stage: 'Full-Time Career', title: 'Creative Director / Head of Video', description: 'Direct commercial film shoots, motion graphic teams, and documentaries.' }
      ],
      companies: ['Wild Fusion', 'Pulse Nigeria', 'Anakle', 'Ebonylife Media', 'Global YouTube Brands'],
      tools: ['Adobe Premiere Pro', 'Adobe After Effects', 'DaVinci Resolve', 'CapCut Pro', 'Audition'],
      nyscReason: 'Video is the dominant content form on the internet; video editors command steady freelance income from foreign clients who need weekly edits.',
      difficulty: 'Beginner to Intermediate',
      demandRating: 'Very High Demand',
      typicalProjects: [
        'High-converting 60-second social media product advertisement with dynamic captions',
        'Cinematic multi-camera interview cut featuring professional Lumetri color grading',
        'Animated corporate logo reveal and kinetic typography explainer video'
      ],
      portfolioRecs: ['Host an interactive 2-minute showreel on YouTube or Behance highlighting your best cuts and motion transitions.'],
      certifications: ['Adobe Certified Professional: Video Communication (Premiere Pro)', 'DaVinci Resolve Certified Editor'],
      globalPotential: 'Excellent. International creators and agencies routinely outsource video editing tasks starting at $25 - $65 / hour.',
      longTermGrowth: 'Progress from Junior Video Editor to Lead Editor, Motion Graphics Specialist, or Production Director.',
      recommendedCourse: { courseId: 'video-editing', name: 'Video Editing & Motion Track', duration: '10 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed Video Showreel Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'virtual-assistant',
      title: 'Virtual Executive Assistant & Tech Ops',
      category: 'Business & Operations',
      description: 'Orchestrate executive schedules, manage remote communication channels, administer CRM tools, organize Notion workspaces, and provide operational support to executives.',
      whoItSuits: 'Highly organized individuals, excellent communicators, administrators, and problem-solvers who thrive on structuring operations.',
      salary: {
        nigeriaEntry: '₦150,000 - ₦300,000 / month',
        nigeriaMid: '₦320,000 - ₦550,000 / month',
        nigeriaSenior: '₦600,000 - ₦1,100,000 / month',
        africaAverage: '$800 - $1,800 / month',
        remoteInternational: '$36,000 - $65,000 / year',
        freelanceRate: '$20 - $45 / hour'
      },
      remote: 'Extremely high. Virtual assisting is 100% remote by definition, offering direct access to international CEOs.',
      freelance: 'Phenomenal. Easy to secure multiple foreign client retainers ($500 - $1,500/month per client) working from home.',
      skills: ['Executive Calendar & Inbox Management', 'Workspace Administration (Google/365)', 'CRM Management (HubSpot/Salesforce)', 'Notion/Trello/Asana Setup', 'Basic AI Workflow Automation'],
      softSkills: ['Time Management', 'Professional Etiquette', 'Confidentiality & Discretion', 'Proactive Problem Solving'],
      duration: '8 Weeks Comprehensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'Executive Comm & Workspace', description: 'Master Google Workspace, inbox zero strategies, and advanced scheduling.' },
        { stage: 'Intermediate', title: 'Notion & Project Tools', description: 'Configure Notion workspaces, Asana Kanban boards, and Slack communication.' },
        { stage: 'Project Building', title: 'CRM Administration & AI Tools', description: 'Manage customer records in HubSpot and use AI tools to automate notes.' },
        { stage: 'Portfolio', title: 'Virtual Executive Dossier', description: 'Create an operational manual and sample executive dashboard demonstrating rigor.' },
        { stage: 'Internship', title: 'NYSC Administrative Attaché', description: 'Support executive directors or department heads at partner organizations.' },
        { stage: 'Freelancing', title: 'Remote Executive VA on Upwork', description: 'Create professional profiles on Upwork and Fiverr to secure foreign retainers.' },
        { stage: 'Remote Job', title: 'Full-Time Remote Executive Assistant', description: 'Partner with international CEOs and startup founders as their operational right-hand.' },
        { stage: 'Full-Time Career', title: 'Chief of Staff / Head of Ops', description: 'Manage company-wide operations, executive initiatives, and strategic execution.' }
      ],
      companies: ['Spars Tech UK', 'Outsource Global', 'Worka Nigeria', 'Wave VA Networks', 'Remote Startups Worldwide'],
      tools: ['Google Workspace / Office 365', 'Notion / Asana / Trello', 'Slack & Zoom', 'Calendly', 'HubSpot CRM', 'Otter.ai'],
      nyscReason: 'Virtual Assisting requires standard laptop hardware and zero coding, making it the fastest and most reliable way to earn foreign currency in USD/GBP during your NYSC year.',
      difficulty: 'Beginner-Friendly',
      demandRating: 'High Demand',
      typicalProjects: [
        'Customized Notion executive workspace featuring automated task boards and meeting archives',
        'Comprehensive executive travel itinerary with time-zone synchronization and budget spreadsheet',
        'Automated email inbox triage protocol and SOP document for client communications'
      ],
      portfolioRecs: ['Present a digital portfolio detailing your mastery of organizational software, sample SOPs, and scheduling solutions.'],
      certifications: ['Google Workspace Administrator Certified', 'HubSpot CRM Certification', 'Microsoft Office Specialist (MOS)'],
      globalPotential: 'Exceptional. Western founders actively hire African VAs for their English communication and work ethic.',
      longTermGrowth: 'Progress from Executive Virtual Assistant to Senior Operations Manager, Project Manager, or Chief of Staff.',
      recommendedCourse: { courseId: 'virtual-assistant', name: 'Virtual Executive Assistant Track', duration: '8 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed Executive Portfolio Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'digital-marketing',
      title: 'Digital Marketing & Growth Hacking',
      category: 'Business & Operations',
      description: 'Execute data-driven SEO campaigns, manage high-ROI paid advertising on Google and Meta, build automated email marketing funnels, and accelerate revenue.',
      whoItSuits: 'Strategic thinkers, creative communicators, data analysts, and marketers who want to drive customer acquisition and revenue.',
      salary: {
        nigeriaEntry: '₦180,000 - ₦380,000 / month',
        nigeriaMid: '₦400,000 - ₦650,000 / month',
        nigeriaSenior: '₦700,000 - ₦1,500,000 / month',
        africaAverage: '$1,000 - $2,500 / month',
        remoteInternational: '$45,000 - $80,000 / year',
        freelanceRate: '$30 - $70 / hour'
      },
      remote: 'Very high remote opportunities across worldwide brands, marketing agencies, and e-commerce companies.',
      freelance: 'Phenomenal. Growing local and global business revenue through monthly advertising and SEO retainers.',
      skills: ['SEO Keyword Research & On-Page Tech', 'Meta & Google Paid Ads Architecture', 'Email Funnel Copywriting', 'Social Content Strategy', 'Google Analytics (GA4) Tracking'],
      softSkills: ['Persuasive Storytelling', 'Consumer Psychology', 'Analytical Rigor', 'Strategic Planning'],
      duration: '10 Weeks Comprehensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'Brand Strategy & Copywriting', description: 'Understand customer personas, value propositions, and marketing funnel stages.' },
        { stage: 'Intermediate', title: 'SEO & Content Marketing', description: 'Master keyword research, on-page SEO, and organic traffic growth using SEMrush.' },
        { stage: 'Project Building', title: 'Paid Ads on Meta & Google', description: 'Design, launch, and optimize high-converting paid campaigns on Facebook and Google Search.' },
        { stage: 'Portfolio', title: 'Complete Growth Marketing Plan', description: 'Execute a comprehensive digital marketing strategy and analytics report for an active brand.' },
        { stage: 'Internship', title: 'Digital Marketing Attaché', description: 'Manage social channels and ad campaigns for Nigerian startups and partner agencies.' },
        { stage: 'Freelancing', title: 'Freelance Growth & Ads Specialist', description: 'Manage monthly ad spend and email newsletters for international e-commerce clients.' },
        { stage: 'Remote Job', title: 'Remote Growth Marketer', description: 'Lead user acquisition and retention campaigns for global tech companies.' },
        { stage: 'Full-Time Career', title: 'Chief Marketing Officer (CMO)', description: 'Direct corporate marketing budget, brand positioning, and revenue expansion.' }
      ],
      companies: ['Wild Fusion', 'Hera Marketing', 'Pulse Nigeria', 'Anakle', 'Sterling Bank'],
      tools: ['Google Ads Manager', 'Meta Business Suite', 'Google Analytics 4 (GA4)', 'Mailchimp / Klaviyo', 'SEMrush / Ahrefs'],
      nyscReason: 'Every business needs more customers; acquiring digital marketing skills allows you to directly increase corporate revenue, making you an indispensable asset during NYSC.',
      difficulty: 'Beginner to Intermediate',
      demandRating: 'Very High Demand',
      typicalProjects: [
        'Comprehensive Google Ads search campaign targeting high-intent fintech keywords with conversion tracking',
        'Automated 5-stage email welcome and cart-abandonment funnel built in Mailchimp with copy blocks',
        'Full SEO technical audit and content ranking strategy for an African e-commerce store'
      ],
      portfolioRecs: ['Present a documented case study showing how your ad campaign or SEO strategy increased website traffic or conversions.'],
      certifications: ['Google Ads Search Certification', 'Google Analytics Individual Qualification (GAIQ)', 'HubSpot Marketing Certification'],
      globalPotential: 'Exceptional. Digital marketers who understand how to achieve high ROAS can work from anywhere for global brands.',
      longTermGrowth: 'Advance from Digital Marketing Specialist to Growth Lead, Performance Marketing Director, or CMO.',
      recommendedCourse: { courseId: 'digital-marketing', name: 'Digital Marketing Track', duration: '10 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed Marketing Portfolio Evaluation' },
      status: 'Published'
    },
    {
      courseId: 'ms-office',
      title: 'Microsoft Office Specialist & Business Analytics',
      category: 'Business & Operations',
      description: 'Master advanced Microsoft Excel data modeling, construct compelling PowerPoint presentations, streamline Word documentation, and automate office reporting.',
      whoItSuits: 'Graduates of any discipline seeking to master the universal software suite required by every modern corporate office, bank, and government institution.',
      salary: {
        nigeriaEntry: '₦150,000 - ₦300,000 / month',
        nigeriaMid: '₦320,000 - ₦500,000 / month',
        nigeriaSenior: '₦550,000 - ₦950,000 / month',
        africaAverage: '$700 - $1,500 / month',
        remoteInternational: '$35,000 - $60,000 / year',
        freelanceRate: '$20 - $45 / hour'
      },
      remote: 'High. Administrative, reporting, and data entry roles across global corporations rely heavily on Microsoft Office mastery.',
      freelance: 'High (Excel spreadsheet cleanup, automated financial templates, and professional presentation formatting).',
      skills: ['Advanced Excel Formulas (XLOOKUP)', 'Pivot Tables & Power Query Automation', 'Executive PowerPoint Architecture', 'Professional Word Formatting', 'Data Visualization & Charts'],
      softSkills: ['Corporate Professionalism', 'Accuracy & Precision', 'Data Organization', 'Time Efficiency'],
      duration: '8 Weeks Comprehensive Mentorship',
      roadmap: [
        { stage: 'Beginner', title: 'Excel Basics & Word Structure', description: 'Understand formatting, basic formulas, tables, mail merge, and document standards.' },
        { stage: 'Intermediate', title: 'Advanced Formulas & Pivot Tables', description: 'Master logical formulas, VLOOKUP/XLOOKUP, conditional formatting, and pivot reports.' },
        { stage: 'Project Building', title: 'Power Query & Executive PowerPoint', description: 'Automate data cleanup with Power Query and design persuasive executive slide decks.' },
        { stage: 'Portfolio', title: 'Corporate Report & Dashboard', description: 'Build an automated financial reporting spreadsheet and accompanying board presentation.' },
        { stage: 'Internship', title: 'NYSC Corporate Operations Attaché', description: 'Serve as an indispensable administrative and reporting officer at banks and offices.' },
        { stage: 'Freelancing', title: 'Spreadsheet & Deck Consultant', description: 'Offer Excel template creation and PowerPoint makeover services to professionals.' },
        { stage: 'Remote Job', title: 'Remote Operations & Reporting Analyst', description: 'Manage corporate data sheets and reports for international remote teams.' },
        { stage: 'Full-Time Career', title: 'Senior Operations Manager / Business Analyst', description: 'Oversee department reporting, corporate administration, and operations.' }
      ],
      companies: ['PwC Nigeria', 'KPMG', 'Deloitte', 'Sterling Bank', 'Access Bank', 'Corporate Organizations Nationwide'],
      tools: ['Microsoft Excel (Advanced)', 'Microsoft PowerPoint', 'Microsoft Word', 'Microsoft Outlook', 'SharePoint / OneDrive'],
      nyscReason: '95% of corporate jobs in Nigeria test candidates on Excel and Office proficiency; mastering these tools guarantees you will excel in any PPA office environment.',
      difficulty: 'Beginner-Friendly',
      demandRating: 'High Demand',
      typicalProjects: [
        'Automated corporate sales tracking spreadsheet utilizing XLOOKUP, dynamic pivot charts, and conditional alerts',
        'Professional 15-slide executive presentation deck designed with custom layouts, consistent branding, and infographics',
        'Standardized corporate policy document structured in Word with automated table of contents and headers'
      ],
      portfolioRecs: ['Present a clean digital portfolio showcasing your before-and-after Excel dashboard makeovers and slide deck templates.'],
      certifications: ['Microsoft Office Specialist: Excel Expert', 'Microsoft Office Specialist: PowerPoint Associate'],
      globalPotential: 'Very High. Microsoft Office is the global operating system of business; advanced proficiency opens doors across administration and finance worldwide.',
      longTermGrowth: 'Progress from Corporate Associate to Senior Business Analyst, Operations Lead, or Administration Director.',
      recommendedCourse: { courseId: 'ms-office', name: 'Microsoft Office Specialist Track', duration: '8 Weeks Sprints', mode: '100% Online & CDS Access', outcome: 'Guaranteed Office Proficiency Evaluation' },
      status: 'Published'
    }
  ];

  useEffect(() => {
    fetch('/api/career-explorer/profiles')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProfiles(data.data);
        } else {
          setProfiles(fallbackProfilesArray);
        }
      })
      .catch(() => {
        setProfiles(fallbackProfilesArray);
      })
      .finally(() => setLoading(false));
  }, []);

  const getCategoryIcon = (category: string) => {
    if (category.includes('Software')) return Terminal;
    if (category.includes('Data')) return FileSpreadsheet;
    if (category.includes('Design')) return Palette;
    return Briefcase;
  };

  const getCourseIcon = (courseId: string) => {
    switch (courseId) {
      case 'cybersecurity': return Shield;
      case 'data-analysis': return FileSpreadsheet;
      case 'web-dev': return Terminal;
      case 'software-eng': return Code;
      case 'python': return Cpu;
      case 'app-dev': return Smartphone;
      case 'ai-automation': return Zap;
      case 'ui-ux': return Palette;
      case 'graphics': return Briefcase;
      case 'video-editing': return Video;
      case 'virtual-assistant': return Briefcase;
      case 'digital-marketing': return TrendingUp;
      case 'ms-office': return FileText;
      default: return Shield;
    }
  };

  const categories = [
    'All Paths (13)',
    'Software & Web',
    'Data & AI',
    'Design & Creative',
    'Business & Operations'
  ];

  const filteredProfiles = profiles.filter(p => {
    const matchesCategory = selectedCategory.startsWith('All') || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      (p.skills && p.skills.some((sk: string) => sk.toLowerCase().includes(q))) ||
      (p.tools && p.tools.some((tl: string) => tl.toLowerCase().includes(q)));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="career-explorer-section" className="space-y-8 text-left animate-fadeIn">
      {/* Section Header */}
      <div className="border-l-4 border-emerald-500 pl-4 py-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase tracking-wider rounded-full inline-block mb-1">
            CorpersTech Technology Career Explorer
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Explore 13 High-Yielding Career Profiles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Every button below opens a complete, professional Career Profile including day-to-day role overviews, NYSC service year advantages, 8-stage learning roadmaps, realistic USD & Naira salaries, and AI Career Coach consultation.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200/80 text-emerald-900 text-xs font-extrabold flex-shrink-0">
          <Award className="text-emerald-600" size={18} />
          <span>All 13 Tracks Active & Endorsed</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none pb-1 md:pb-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-extrabold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] sm:min-w-[320px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, skills (e.g. SQL, Figma, Python)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Career Profiles Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-100">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500">Loading comprehensive career profiles from CorpersTech database...</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
          <p className="text-sm font-bold text-slate-700">No career profile matched your search "{searchQuery}"</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All Paths (13)'); }}
            className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((p) => {
            const Icon = getCourseIcon(p.courseId);
            return (
              <div 
                key={p.courseId}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-500/60 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                {/* Top status badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-800 font-extrabold text-[10px] uppercase tracking-wider rounded-full transition-colors border border-slate-200/60">
                      {p.category || 'Technology Track'}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-700 font-extrabold text-[10px] rounded-full border border-emerald-500/20">
                      {p.demandRating || 'Critical Demand'}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg group-hover:text-emerald-700 transition-colors tracking-tight leading-snug">
                        {p.title}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock size={12} /> {p.duration || '12-16 Weeks'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-4 line-clamp-3 leading-relaxed font-normal">
                    {p.description}
                  </p>

                  {/* Salary & Earning Box */}
                  <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-150/70 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Entry Salary (NG):</span>
                      <span className="font-black text-emerald-700">{p?.salary?.nigeriaEntry || '₦250,000 / mo'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Remote Int'l USD:</span>
                      <span className="font-extrabold text-slate-800">{p?.salary?.remoteInternational || '$50,000 / yr'}</span>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {(p.skills || ['Core Logic', 'Diagnostics', 'API Integration']).slice(0, 3).map((sk: string, sIdx: number) => (
                      <span key={sIdx} className="px-2.5 py-1 bg-slate-100/80 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200/60">
                        ✓ {sk}
                      </span>
                    ))}
                    {(p.skills && p.skills.length > 3) && (
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-lg">
                        +{p.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTONS (MANDATORY REQUIREMENT: ALWAYS FUNCTIONAL LEARN MORE) */}
                <div className="mt-6 pt-4 border-t border-slate-200/80 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedModalProfile(p)}
                    className="w-full py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-98"
                    title="Open Complete Career Profile"
                  >
                    <Eye size={14} className="text-emerald-400" />
                    <span>Learn More</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onRegisterClick) onRegisterClick(p.courseId);
                    }}
                    className="w-full py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/20 active:scale-98"
                  >
                    <span>Quick Enroll</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* COMPLETE CAREER PROFILE DETAILS MODAL */}
      {selectedModalProfile && (
        <CareerProfileModal
          profile={selectedModalProfile}
          onClose={() => setSelectedModalProfile(null)}
          onRegisterClick={onRegisterClick}
          userEmail={userEmail}
        />
      )}
    </div>
  );
};
