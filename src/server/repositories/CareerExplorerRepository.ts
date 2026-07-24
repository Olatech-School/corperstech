import { getPrisma } from '../db.ts';
import fs from 'fs';
import path from 'path';

export interface CareerTrackProfileData {
  courseId: string;
  title: string;
  category: string;
  description: string;
  whoItSuits: string;
  salary: {
    nigeriaEntry: string;
    nigeriaMid: string;
    nigeriaSenior: string;
    africaAverage: string;
    remoteInternational: string;
    freelanceRate: string;
  };
  remote: string;
  freelance: string;
  skills: string[];
  softSkills: string[];
  duration: string;
  roadmap: {
    stage: string;
    title: string;
    description: string;
  }[];
  companies: string[];
  tools: string[];
  nyscReason: string;
  difficulty: string;
  demandRating: string;
  typicalProjects: string[];
  portfolioRecs: string[];
  certifications: string[];
  globalPotential: string;
  longTermGrowth: string;
  recommendedCourse: {
    courseId: string;
    name: string;
    duration: string;
    mode: string;
    outcome: string;
  };
  status: string;
  viewsCount: number;
  registrationsCount: number;
}

const FALLBACK_PROFILES_FILE = path.join(process.cwd(), 'career-profiles-fallback-db.json');
const FALLBACK_BOOKMARKS_FILE = path.join(process.cwd(), 'saved-careers-fallback-db.json');
const FALLBACK_ANALYTICS_FILE = path.join(process.cwd(), 'career-analytics-fallback-db.json');

const DEFAULT_CAREER_PROFILES: CareerTrackProfileData[] = [
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
    remote: 'Extremely high remote availability with global corporate SOC (Security Operations Center) networks.',
    freelance: 'Moderate to High (Consultancy security audits, penetration testing reports, and compliance assessments).',
    skills: ['Intrusion Diagnostics', 'Threat Intelligence', 'Vulnerability Auditing', 'SIEM Operations', 'Network Cryptography', 'Firewall Architecture'],
    softSkills: ['Analytical Problem Solving', 'Crisis Management', 'Technical Reporting', 'Ethical Judgment', 'Attention to Detail'],
    duration: '16 Weeks Intensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'Security Fundamentals', description: 'Understand OSI networking layers, TCP/IP protocols, and standard encryption standards.' },
      { stage: 'Intermediate', title: 'Network Defense & Linux', description: 'Master Linux command line, system hardening, and Wireshark packet capture analysis.' },
      { stage: 'Project Building', title: 'Penetration Diagnostics', description: 'Conduct simulated ethical vulnerability assessments using Burp Suite and Metasploit.' },
      { stage: 'Portfolio', title: 'SOC Monitoring Logs', description: 'Deploy and configure a Splunk SIEM dashboard to monitor live server intrusion logs.' },
      { stage: 'Internship', title: 'NYSC Security Attachment', description: 'Join corporate security teams at fintech or banking partners for live defense drills.' },
      { stage: 'Freelancing', title: 'Vulnerability Consultancy', description: 'Offer website vulnerability audits and security checklists to local businesses.' },
      { stage: 'Remote Job', title: 'Global SOC Analyst', description: 'Secure full-time remote contracts with global cloud security monitoring networks.' },
      { stage: 'Full-Time Career', title: 'Senior Security Engineer', description: 'Lead enterprise security architecture and incident response teams.' }
    ],
    companies: ['MainOne', 'Interswitch Group', 'PwC Nigeria', "KPMG", 'Flutterwave', 'Moniepoint'],
    tools: ['Wireshark', 'Burp Suite', 'Kali Linux', 'Metasploit', 'Splunk', 'Nmap', 'Microsoft Defender'],
    nyscReason: 'Nigerian financial institutions lock in cybersecurity graduate trainees early; acquiring practical SIEM skills during NYSC guarantees immediate high-paying placement.',
    difficulty: 'Intermediate to Advanced (Requires systematic network understanding and investigative mindset).',
    demandRating: 'Critical Demand',
    typicalProjects: [
      'Enterprise SIEM log monitor capturing unauthorized login attempts and flagging DDoS patterns',
      'Full website vulnerability audit report using OWASP Top 10 guidelines with remediation steps',
      'Automated Linux server security hardening script with firewall rules and SSH key encryption'
    ],
    portfolioRecs: [
      'Publish a detailed technical breakdown of a simulated CVE vulnerability investigation on GitHub or Medium, showcasing your Wireshark and Splunk dashboards.'
    ],
    certifications: ['CompTIA Security+', 'CompTIA CySA+', 'Certified Ethical Hacker (CEH)', 'Microsoft Certified: Security Operations Analyst Associate'],
    globalPotential: 'Outstanding. Global cybersecurity talent shortage exceeds 3.5 million unfilled roles, making qualified analysts highly recruited across borders.',
    longTermGrowth: 'Progress from Junior Security Analyst to SOC Team Lead, Penetration Tester, Security Architect, and Chief Information Security Officer (CISO).',
    recommendedCourse: {
      courseId: 'cybersecurity',
      name: 'Cybersecurity Analyst Training Track',
      duration: '16 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed SOC Portfolio Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 420,
    registrationsCount: 48
  },
  {
    courseId: 'data-analysis',
    title: 'Data Analysis & Business Intelligence',
    category: 'Data & AI',
    description: 'Query SQL relational databases, clean messy enterprise datasets, construct interactive Power BI and Tableau dashboards, and drive strategic business decisions.',
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
    freelance: 'High (Building customized executive dashboards, automating Excel sheets, and data cleaning gigs).',
    skills: ['Relational SQL Queries', 'Data Cleaning Protocols', 'Interactive BI Dashboarding', 'Statistical Trend Analysis', 'Excel Pivot Automation', 'Python Pandas Logic'],
    softSkills: ['Data Storytelling', 'Executive Presentation', 'Critical Thinking', 'Business Acumen', 'Stakeholder Communication'],
    duration: '12 Weeks Intensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'Advanced Excel & Sheets', description: 'Master XLOOKUP, pivot tables, power query automation, and statistical formula modeling.' },
      { stage: 'Intermediate', title: 'Relational SQL Querying', description: 'Write complex JOINs, window functions, and aggregations across PostgreSQL and MySQL databases.' },
      { stage: 'Project Building', title: 'Power BI / Tableau BI', description: 'Design interactive, high-contrast visual reports with drill-down KPIs and DAX measures.' },
      { stage: 'Portfolio', title: 'End-to-End Analytics Case Study', description: 'Deliver a complete customer churn prediction and revenue insight presentation for a retail brand.' },
      { stage: 'Internship', title: 'Corporate BI Analyst Intern', description: 'Support marketing and finance teams at Nigerian tech companies with daily reporting metrics.' },
      { stage: 'Freelancing', title: 'Freelance Dashboard Builder', description: 'Construct automated sales trackers and inventory boards for SMEs on Upwork and local retainers.' },
      { stage: 'Remote Job', title: 'Remote Data Analyst', description: 'Provide daily data intelligence for international e-commerce and SaaS brands.' },
      { stage: 'Full-Time Career', title: 'Lead Business Intelligence Manager', description: 'Oversee corporate data warehousing, analytics pipelines, and strategic revenue modeling.' }
    ],
    companies: ['Kuda Bank', 'Chevron Nigeria', 'Moniepoint', 'Tek Experts Nigeria', 'Paystack', 'Sterling Bank'],
    tools: ['SQL (PostgreSQL/MySQL)', 'Microsoft Excel / Power Query', 'Power BI', 'Tableau', 'Python (Pandas/NumPy)', 'Google BigQuery'],
    nyscReason: 'Every company generates massive data but lacks skilled analysts to interpret it; data analysis offers the fastest route from non-computer science degrees into tech.',
    difficulty: 'Beginner-Friendly to Intermediate (No prior programming required; starts with spreadsheets and logical SQL structure).',
    demandRating: 'Critical Demand',
    typicalProjects: [
      'Interactive Power BI financial dashboard tracking multi-currency banking revenue and loan default rates',
      'SQL database cleaning and segmentation pipeline analyzing 100,000+ e-commerce customer transactions',
      'Python statistical report modeling user retention and churn drivers for a Nigerian SaaS platform'
    ],
    portfolioRecs: [
      'Host a live Notion or GitHub portfolio featuring 3 interactive Power BI / Tableau dashboards with accompanying executive summary PDF slides.'
    ],
    certifications: ['Google Data Analytics Professional Certificate', 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)', 'AWS Certified Data Analytics'],
    globalPotential: 'Exceptional. Data analysis is a universal corporate language with immense remote contracting demand across Europe and North America.',
    longTermGrowth: 'Transition from Junior Data Analyst to Senior BI Developer, Data Scientist, Analytics Engineering Lead, or Chief Data Officer (CDO).',
    recommendedCourse: {
      courseId: 'data-analysis',
      name: 'Data Analysis & Business Intelligence Track',
      duration: '12 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed BI Portfolio Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 510,
    registrationsCount: 62
  },
  {
    courseId: 'web-dev',
    title: 'Full-Stack Web Development',
    category: 'Software & Web',
    description: 'Code responsive user interfaces, manage dynamic client state, and construct scalable backend REST APIs and database structures.',
    whoItSuits: 'Those who enjoy combining visual creativity with programmatic logic. Highly rewarding for makers who want to build complete web applications from scratch.',
    salary: {
      nigeriaEntry: '₦220,000 - ₦450,000 / month',
      nigeriaMid: '₦500,000 - ₦850,000 / month',
      nigeriaSenior: '₦900,000 - ₦2,000,000 / month',
      africaAverage: '$1,200 - $3,500 / month',
      remoteInternational: '$50,000 - $90,000 / year',
      freelanceRate: '$35 - $75 / hour'
    },
    remote: 'Extremely high. Standard global tech remote structure with thousands of active job opportunities.',
    freelance: 'Outstandingly high. Unlimited local and global client agency gigs and web app contracts.',
    skills: ['Frontend HTML/CSS/JS', 'React.js SPAs & Hooks', 'Node.js & Express APIs', 'Relational Database Architecture', 'Tailwind CSS UI Styling', 'Git & Production Deployment'],
    softSkills: ['Agile Collaboration', 'Code Review Etiquette', 'User-Centric Design Thinking', 'Time Management', 'Continuous Learning'],
    duration: '20 Weeks Comprehensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'HTML5, CSS3 & Tailwind', description: 'Build responsive layouts, CSS grid systems, and clean modern mobile-first interfaces.' },
      { stage: 'Intermediate', title: 'JavaScript & DOM Logic', description: 'Master ES6+ syntax, asynchronous fetch requests, array methods, and browser state management.' },
      { stage: 'Project Building', title: 'React.js Single Page Apps', description: 'Develop interactive web applications using React components, custom hooks, and context state.' },
      { stage: 'Portfolio', title: 'Full-Stack Express & MySQL', description: 'Connect React frontends to Node.js backend APIs with JWT authentication and database schemas.' },
      { stage: 'Internship', title: 'NYSC Frontend / Backend Fellow', description: 'Collaborate with engineering squads on production codebases during your primary assignment.' },
      { stage: 'Freelancing', title: 'Custom Web App Developer', description: 'Build e-commerce stores, booking portals, and landing pages for Nigerian businesses.' },
      { stage: 'Remote Job', title: 'International Full-Stack Engineer', description: 'Work remotely for US, UK, and European tech companies building scalable SaaS platforms.' },
      { stage: 'Full-Time Career', title: 'Senior Software Architect', description: 'Lead frontend and backend engineering teams and define cloud platform architecture.' }
    ],
    companies: ['Andela', 'PiggyVest', 'Flutterwave', 'Decagon', 'Moniepoint', 'Brass Bank', 'Paystack'],
    tools: ['HTML5 / CSS3', 'React.js', 'Node.js', 'Express', 'MySQL / Prisma', 'Tailwind CSS', 'Git & GitHub', 'Vite / Next.js'],
    nyscReason: 'Web development is the foundational digital skill; it enables you to build custom client platforms, freelance instantly from your lodge, and qualifies you for any technical engineering role.',
    difficulty: 'Beginner to Intermediate (Structured pathway starting from simple visual layouts moving into backend server logic).',
    demandRating: 'Critical Demand',
    typicalProjects: [
      'Fully responsive SaaS application dashboard with live chart components and Tailwind dark mode',
      'Full-stack e-commerce marketplace featuring live shopping cart state, Stripe payment checkout, and order history',
      'Collaborative project task management portal with drag-and-drop boards, REST API endpoints, and MySQL database persistence'
    ],
    portfolioRecs: [
      'Launch a personal custom portfolio website hosting 3 live deployed full-stack web applications on Vercel or Cloud Run, with clean open-source code on GitHub.'
    ],
    certifications: ['Meta Front-End Developer Professional Certificate', 'Meta Back-End Developer Professional Certificate', 'AWS Certified Developer - Associate'],
    globalPotential: 'Outstanding. Extremely liquid remote job market with starting salaries ranging from $45,000 to $85,000 / year.',
    longTermGrowth: 'Progress from Junior Web Developer to Full-Stack Engineer, Technical Lead, Solutions Architect, or Chief Technology Officer (CTO).',
    recommendedCourse: {
      courseId: 'web-dev',
      name: 'Full-Stack Web Development Track',
      duration: '20 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed Full-Stack Portfolio Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 680,
    registrationsCount: 94
  },
  {
    courseId: 'software-eng',
    title: 'Software Engineering & Cloud Architecture',
    category: 'Software & Web',
    description: 'Design enterprise-grade software systems, implement microservices, manage cloud infrastructure (AWS/GCP), and optimize database query pipelines.',
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
    skills: ['Data Structures & Algorithms', 'System Architecture Design', 'Microservices & Docker Containers', 'Cloud Infrastructure (AWS/GCP)', 'CI/CD Automated Pipelines', 'High-Performance Backend Coding'],
    softSkills: ['Architectural Vision', 'Cross-Team Mentorship', 'Technical Documentation', 'System Trade-off Analysis', 'Leadership'],
    duration: '24 Weeks Advanced Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'Core Computer Science Logic', description: 'Master object-oriented programming, data structures, complexity analysis, and design patterns.' },
      { stage: 'Intermediate', title: 'Backend Systems & APIs', description: 'Build high-concurrency Node.js, Python, or Go servers with PostgreSQL and caching layers.' },
      { stage: 'Project Building', title: 'Microservices & Containerization', description: 'Containerize applications with Docker and deploy orchestrated services to Google Cloud / AWS.' },
      { stage: 'Portfolio', title: 'Enterprise Scalability Project', description: 'Engineer an automated CI/CD pipeline and distributed database replication system.' },
      { stage: 'Internship', title: 'Junior Cloud Systems Engineer', description: 'Work with DevOps and Core Infrastructure teams at leading Nigerian banks and fintechs.' },
      { stage: 'Freelancing', title: 'Cloud Migration Consultant', description: 'Assist local startups in migrating legacy servers to modern serverless cloud infrastructure.' },
      { stage: 'Remote Job', title: 'Global Software Engineer', description: 'Join international distributed engineering teams building mission-critical cloud software.' },
      { stage: 'Full-Time Career', title: 'Principal Systems Architect / CTO', description: 'Direct organization-wide technology strategy, cloud security, and engineering execution.' }
    ],
    companies: ['Interswitch Group', 'Flutterwave', 'Paystack', 'Opay', 'Moniepoint', 'Microsoft Africa', 'Google Nigeria'],
    tools: ['TypeScript / Node.js', 'Python / Go', 'Docker & Kubernetes', 'AWS / Google Cloud Platform', 'PostgreSQL / Redis', 'Git & CI/CD Actions', 'Linux Kernel Shell'],
    nyscReason: 'Nigerian banks and telecom giants desperately need cloud-native software engineers; mastering cloud architecture during NYSC sets you up for tier-1 engineering salaries.',
    difficulty: 'Advanced (Requires rigorous logical thinking and commitment to engineering best practices).',
    demandRating: 'Critical Demand',
    typicalProjects: [
      'High-throughput distributed payment routing gateway handling 500+ concurrent API requests per second with Redis caching',
      'Automated Docker CI/CD deployment pipeline deploying multi-container microservices to Google Cloud Run with zero downtime',
      'Secure OAuth 2.0 and RBAC enterprise authentication server with rate limiting and automated audit logging'
    ],
    portfolioRecs: [
      'Publish an open-source GitHub repository showcasing a containerized microservice backend with comprehensive unit tests, Dockerfiles, and architectural diagrams.'
    ],
    certifications: ['AWS Certified Solutions Architect - Associate', 'Google Cloud Associate Cloud Engineer', 'Certified Kubernetes Administrator (CKA)'],
    globalPotential: 'Exceptional. Software engineers with cloud architecture expertise command top-tier compensation packages globally.',
    longTermGrowth: 'Advance from Systems Engineer to Staff Engineer, Principal Architect, VP of Engineering, or CTO.',
    recommendedCourse: {
      courseId: 'software-eng',
      name: 'Software Engineering & Cloud Architecture Track',
      duration: '24 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed Systems Portfolio Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 490,
    registrationsCount: 58
  },
  {
    courseId: 'python',
    title: 'Python Programming & Automation',
    category: 'Software & Web',
    description: 'Construct versatile programmatic scripts, automate manual enterprise workflows, build custom web scrapers, and lay the foundations for data science pipelines.',
    whoItSuits: 'Anyone interested in clean syntax, automation scripting, data manipulation, and building backend software utilities.',
    salary: {
      nigeriaEntry: '₦180,000 - ₦380,000 / month',
      nigeriaMid: '₦400,000 - ₦700,000 / month',
      nigeriaSenior: '₦800,000 - ₦1,600,000 / month',
      africaAverage: '$1,000 - $2,800 / month',
      remoteInternational: '$50,000 - $88,000 / year',
      freelanceRate: '$30 - $70 / hour'
    },
    remote: 'High remote compatibility for backend data processing and automation engineering tasks.',
    freelance: 'Very High (Constructing customized web scrapers, API connectors, and automated Excel/email reporting bots).',
    skills: ['Python 3 Object-Oriented Syntax', 'REST API Consumption & Creation', 'Custom Web Scraping (BeautifulSoup/Selenium)', 'Server Scripting Automation', 'Django / Flask Web Frameworks', 'Automated Testing (Pytest)'],
    softSkills: ['Process Optimization', 'Logical Debugging', 'Efficiency Mindset', 'Technical Explanation', 'Self-Direction'],
    duration: '12 Weeks Intensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'Python Core Syntax', description: 'Understand variables, functions, dictionaries, file I/O, and exception handling.' },
      { stage: 'Intermediate', title: 'Web Scraping & APIs', description: 'Build automated scripts that extract data from websites and communicate with REST APIs.' },
      { stage: 'Project Building', title: 'Backend APIs with Django / Flask', description: 'Develop robust backend servers with ORM database querying and user authentication.' },
      { stage: 'Portfolio', title: 'Automated Workflow Pipeline', description: 'Deploy an automated background scheduler that processes data and sends daily email digests.' },
      { stage: 'Internship', title: 'Python Automation Engineer Intern', description: 'Help corporate operations teams automate manual spreadsheet and email workflows.' },
      { stage: 'Freelancing', title: 'Freelance Automation Script Writer', description: 'Build custom data extraction bots and automation scripts for international clients on Fiverr/Upwork.' },
      { stage: 'Remote Job', title: 'Remote Backend Python Developer', description: 'Build backend microservices and data pipelines for global startups.' },
      { stage: 'Full-Time Career', title: 'Lead Automation Engineer / Data Architect', description: 'Direct corporate automation strategies and backend data processing infrastructure.' }
    ],
    companies: ['Shell Nigeria', 'MTN Nigeria', 'SeamlessHR', 'Vendease', 'Hotels.ng', 'Interswitch Group'],
    tools: ['Python 3', 'Django', 'Flask / FastAPI', 'BeautifulSoup & Selenium', 'Pandas', 'Pytest', 'Git & GitHub'],
    nyscReason: 'Python is the easiest programming language to learn and offers immediate freelance utility by automating repetitive tasks for businesses during your service year.',
    difficulty: 'Beginner-Friendly to Intermediate (Clean readable syntax makes Python the best starting point for programming).',
    demandRating: 'Very High Demand',
    typicalProjects: [
      'Automated web scraper extracting real estate pricing data and generating clean weekly CSV reports',
      'REST API backend built with Django REST Framework featuring user auth, database querying, and rate limiting',
      'Custom Slack notification bot that monitors server health pings and alerts engineering teams instantly'
    ],
    portfolioRecs: [
      'Showcase a GitHub repository with 3 Python automation scripts and a live Django backend API deployed on Google Cloud Run.'
    ],
    certifications: ['PCEP - Certified Entry-Level Python Programmer', 'PCAP - Certified Associate in Python Programming', 'Microsoft Certified: Azure Data Fundamentals'],
    globalPotential: 'Exceptional. Python is the world’s most popular programming language, powering both general web development and AI/Data pipelines.',
    longTermGrowth: 'Progress from Python Developer to Backend Lead, Data Scientist, Machine Learning Engineer, or Systems Architect.',
    recommendedCourse: {
      courseId: 'python',
      name: 'Python Programming & Automation Track',
      duration: '12 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed Python Portfolio Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 380,
    registrationsCount: 42
  },
  {
    courseId: 'app-dev',
    title: 'Mobile App Development (Flutter & React Native)',
    category: 'Software & Web',
    description: 'Build native iOS and Android mobile applications using cross-platform frameworks, integrate cloud databases, and deploy polished apps to Google Play and Apple App Stores.',
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
    freelance: 'Very High (Building custom mobile MVPs for local startups, e-commerce stores, and freelance clients).',
    skills: ['Cross-Platform Development (Flutter / React Native)', 'Declarative UI Screen Architecture', 'State Management (Bloc / Redux / Provider)', 'Firebase & Supabase Cloud Storage', 'REST API & WebSocket Integration', 'App Store & Play Store Publishing'],
    softSkills: ['User Experience Intuition', 'Attention to Visual Detail', 'Agile Testing', 'Client Pitching', 'Problem Solving'],
    duration: '18 Weeks Comprehensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'Dart / React Native Fundamentals', description: 'Master declarative UI widgets, responsive mobile screen layouts, and navigation stacks.' },
      { stage: 'Intermediate', title: 'State Management & Local Storage', description: 'Implement Bloc or Provider state management, SQLite local caching, and user authentication.' },
      { stage: 'Project Building', title: 'Cloud Backend Integration', description: 'Connect mobile apps to Firebase real-time databases, push notifications, and cloud storage.' },
      { stage: 'Portfolio', title: 'App Store Production Release', description: 'Optimize app bundle size, conduct beta testing, and publish applications to Google Play Store.' },
      { stage: 'Internship', title: 'NYSC Mobile Developer Attaché', description: 'Join mobile engineering teams at Nigerian fintech banks building customer-facing apps.' },
      { stage: 'Freelancing', title: 'Mobile MVP Creator for Startups', description: 'Build MVP prototypes and mobile store apps for local entrepreneurs and global retainers.' },
      { stage: 'Remote Job', title: 'International Mobile Engineer', description: 'Work remotely for global tech companies maintaining cross-platform iOS/Android codebases.' },
      { stage: 'Full-Time Career', title: 'Lead Mobile Architect / Engineering VP', description: 'Direct mobile product engineering, architecture, and team delivery across enterprise apps.' }
    ],
    companies: ['Opay Nigeria', 'Palmpay', 'Moniepoint', 'PiggyVest', 'Kuda Bank', 'FairMoney'],
    tools: ['Flutter / Dart', 'React Native / TypeScript', 'Firebase Authentication & Firestore', 'Android Studio / Xcode', 'Redux / Bloc', 'Git & GitHub'],
    nyscReason: 'Nigeria is a mobile-first economy; every startup and bank requires skilled mobile engineers to build and maintain their iOS and Android applications.',
    difficulty: 'Intermediate (Requires understanding component lifecycles, asynchronous data fetching, and mobile screen constraints).',
    demandRating: 'Critical Demand',
    typicalProjects: [
      'Full-featured mobile banking prototype with live transfer state, biometric auth simulation, and transaction history',
      'E-commerce mobile app with live shopping cart, Firebase real-time database inventory, and push notification alerts',
      'Location-aware task and fitness tracking mobile app with offline SQLite data persistence and interactive progress charts'
    ],
    portfolioRecs: [
      'Publish at least 2 fully functional mobile applications on Google Play Store or APKshare with clean open-source repositories on GitHub.'
    ],
    certifications: ['Meta Android Developer Professional Certificate', 'Google Associate Android Developer', 'Meta iOS Developer Professional Certificate'],
    globalPotential: 'Outstanding. Cross-platform mobile developers save companies time and money, making Flutter and React Native engineers highly sought after globally.',
    longTermGrowth: 'Advance from Junior Mobile Engineer to Senior Mobile Developer, Mobile Solutions Architect, or VP of Engineering.',
    recommendedCourse: {
      courseId: 'app-dev',
      name: 'Mobile App Development (Flutter & React Native) Track',
      duration: '18 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed Mobile Portfolio Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 450,
    registrationsCount: 52
  },
  {
    courseId: 'ai-automation',
    title: 'AI & Automation Engineering',
    category: 'Data & AI',
    description: 'Integrate generative AI models (Gemini/OpenAI), build automated business workflows with Make.com/Zapier, develop custom RAG chatbots, and eliminate manual enterprise labor.',
    whoItSuits: 'Forward-thinking innovators, tech enthusiasts, and problem solvers who want to leverage cutting-edge artificial intelligence to transform business productivity.',
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
    skills: ['Generative AI API Integration (Gemini/OpenAI)', 'No-Code/Low-Code Workflow Automation (Make.com/Zapier)', 'Custom Chatbot Architecture (RAG / Vector DBs)', 'Prompt Engineering & System Instructions', 'Webhook & REST API Orchestration', 'Business Process Optimization'],
    softSkills: ['Innovation Mindset', 'Strategic Process Mapping', 'Client ROI Communication', 'Rapid Prototyping', 'Continuous Adaptation'],
    duration: '14 Weeks Intensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'AI Foundations & Prompting', description: 'Master advanced prompt engineering, structured JSON outputs, and LLM behavior control.' },
      { stage: 'Intermediate', title: 'Workflow Automation Orchestration', description: 'Connect CRM systems, email tools, and spreadsheets using Make.com, Zapier, and n8n webhooks.' },
      { stage: 'Project Building', title: 'AI API Integration & RAG Bots', description: 'Build Python/Node scripts that integrate Gemini API and vectorize internal business documents.' },
      { stage: 'Portfolio', title: 'Enterprise Automation Case Study', description: 'Deploy an automated lead qualification pipeline that saves a sales team 20 hours per week.' },
      { stage: 'Internship', title: 'AI Operations Fellow', description: 'Join corporate innovation teams automating customer support and marketing workflows.' },
      { stage: 'Freelancing', title: 'AI & Workflow Consultant', description: 'Build custom WhatsApp AI agents and automation funnels for Nigerian SMEs and international clients.' },
      { stage: 'Remote Job', title: 'Global AI Workflow Engineer', description: 'Work remotely for tech companies designing AI-powered enterprise automation pipelines.' },
      { stage: 'Full-Time Career', title: 'Head of AI Transformation / Chief AI Officer', description: 'Lead enterprise AI adoption, automation architecture, and digital transformation.' }
    ],
    companies: ['Paystack', 'Flutterwave', 'Moniepoint', 'Sterling Bank', 'SeamlessHR', 'Tech Startups Worldwide'],
    tools: ['Google Gemini API', 'OpenAI / Anthropic APIs', 'Make.com & Zapier', 'n8n Workflow Automation', 'LangChain / LlamaIndex', 'Vector Databases (Pinecone/Chroma)', 'Python / TypeScript'],
    nyscReason: 'AI is reshaping global employment; becoming an AI & Automation Specialist during your NYSC year makes you irreplaceable to any modern employer seeking operational efficiency.',
    difficulty: 'Beginner to Intermediate (High focus on logical workflow design, webhooks, and API orchestration without needing deep calculus).',
    demandRating: 'Critical Demand',
    typicalProjects: [
      'Automated customer lead generator syncing Facebook Ads to Google Sheets, scoring leads with Gemini AI, and alerting sales reps via Slack',
      'Custom AI customer support chatbot grounded on internal business PDF manuals using vector search and automated support ticketing',
      'Automated weekly social media content engine that researches industry news, drafts branded posts, and queues them for publication'
    ],
    portfolioRecs: [
      'Create a video demo showcase or dynamic web catalog illustrating 3 automated business pipelines running end-to-end, detailing time and cost savings.'
    ],
    certifications: ['Google Cloud AI Professional Certificate', 'Make.com Academy Certification', 'Microsoft Certified: Azure AI Fundamentals'],
    globalPotential: 'Exceptional. Global companies pay premium contracting rates for AI engineers who can instantly reduce operational labor costs.',
    longTermGrowth: 'Progress from AI Workflow Engineer to AI Solutions Architect, Head of Process Automation, or Chief AI Officer (CAIO).',
    recommendedCourse: {
      courseId: 'ai-automation',
      name: 'AI & Automation Engineering Track',
      duration: '14 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed AI Portfolio Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 580,
    registrationsCount: 78
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
    remote: 'Extremely high. Product design is completely digital and seamlessly executed across global remote teams.',
    freelance: 'Phenomenal (High demand for website redesigns, mobile app UI wireframing, and brand design systems).',
    skills: ['User Research & Usability Testing', 'Information Architecture & Wireframing', 'High-Fidelity UI Design in Figma', 'Interactive Prototyping', 'Design Systems & Component Libraries', 'Developer Hand-off Protocols'],
    softSkills: ['User Empathy', 'Design Critique & Feedback', 'Visual Communication', 'Storytelling', 'Collaborative Pitching'],
    duration: '12 Weeks Intensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'Design Thinking & UX Basics', description: 'Understand user empathy, persona creation, user journey mapping, and usability principles.' },
      { stage: 'Intermediate', title: 'Figma Mastery & Wireframing', description: 'Master Figma vector tools, auto-layout, components, variables, and low-fidelity wireframing.' },
      { stage: 'Project Building', title: 'High-Fidelity App Prototyping', description: 'Design polished mobile and web interfaces with interactive transitions and micro-animations.' },
      { stage: 'Portfolio', title: 'Complete UX Case Study', description: 'Produce a comprehensive portfolio case study solving a real Nigerian fintech or e-commerce problem.' },
      { stage: 'Internship', title: 'Product Design Fellow', description: 'Collaborate with frontend engineers and product managers at tech startups refining live interfaces.' },
      { stage: 'Freelancing', title: 'Freelance UI/UX Designer', description: 'Offer mobile app design and website redesign services to international clients on Upwork/Behance.' },
      { stage: 'Remote Job', title: 'Remote Product Designer', description: 'Join international design teams building intuitive SaaS and mobile application interfaces.' },
      { stage: 'Full-Time Career', title: 'Lead Product Designer / VP of Design', description: 'Lead corporate design systems, user experience strategy, and creative direction.' }
    ],
    companies: ['OPay Nigeria', 'Chaka', 'Risevest', 'Moniepoint', 'PiggyVest', 'Flutterwave', 'Kuda Bank'],
    tools: ['Figma', 'FigJam / Miro', 'Adobe XD', 'Proto.io', 'Zeplin', 'Notion'],
    nyscReason: 'No product can succeed without great design; UI/UX requires no coding background yet commands salaries equal to software engineering, making it a premier transition path.',
    difficulty: 'Beginner-Friendly to Intermediate (No coding or advanced math required; focus is on user empathy, layout aesthetics, and tool proficiency).',
    demandRating: 'Very High Demand',
    typicalProjects: [
      'Complete end-to-end UX case study for a peer-to-peer foreign exchange mobile application with user testing reports',
      'High-fidelity interactive Figma prototype for an African e-commerce marketplace featuring auto-layout design systems',
      'Comprehensive SaaS dashboard redesign improving visual hierarchy, accessibility contrast, and user onboarding flow'
    ],
    portfolioRecs: [
      'Publish 2 detailed UX case studies on Behance, Dribbble, or a personal Notion site showing user research, wireframes, and final interactive prototypes.'
    ],
    certifications: ['Google UX Design Professional Certificate', 'Figma Certified Professional', 'Nielsen Norman Group UX Certification'],
    globalPotential: 'Outstanding. Skilled product designers who can explain their design decisions and create clean Figma systems are hired globally.',
    longTermGrowth: 'Progress from Junior UI/UX Designer to Senior Product Designer, UX Lead, Head of Design, or Chief Creative Officer.',
    recommendedCourse: {
      courseId: 'ui-ux',
      name: 'UI/UX & Product Design Track',
      duration: '12 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed Design Portfolio Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 460,
    registrationsCount: 56
  },
  {
    courseId: 'graphics',
    title: 'Graphics Design & Brand Strategy',
    category: 'Design & Creative',
    description: 'Create compelling visual brand identities, design marketing typography, manipulate vector assets, and craft high-converting corporate advertising materials.',
    whoItSuits: 'Creative storytellers, artistic minds, and visual communicators who want to shape how brands are perceived across digital and print media.',
    salary: {
      nigeriaEntry: '₦150,000 - ₦300,000 / month',
      nigeriaMid: '₦350,000 - ₦550,000 / month',
      nigeriaSenior: '₦600,000 - ₦1,200,000 / month',
      africaAverage: '$800 - $2,000 / month',
      remoteInternational: '$40,000 - $70,000 / year',
      freelanceRate: '$25 - $60 / hour'
    },
    remote: 'Very high. Highly flexible visual agency contract roles and remote brand identity design positions.',
    freelance: 'Phenomenal. Immediate ability to command high-paying logo, social media asset, and branding retainers from local and global businesses.',
    skills: ['Typography & Layout Alignment Principles', 'Vector Asset Composition (Adobe Illustrator)', 'Photo Manipulation & Retouching (Photoshop)', 'Corporate Brand Guidelines & Identity', 'Social Media Campaign Visuals', 'Print & Packaging Prep Details'],
    softSkills: ['Visual Storytelling', 'Client Brief Interpretation', 'Creative Pacing', 'Attention to Detail', 'Time Management'],
    duration: '10 Weeks Intensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'Design Principles & Color Theory', description: 'Understand visual balance, contrast, typography pairing, grid systems, and color psychology.' },
      { stage: 'Intermediate', title: 'Adobe Photoshop & Illustrator', description: 'Master vector illustration, clipping masks, photo retouching, logo design, and asset composition.' },
      { stage: 'Project Building', title: 'Corporate Brand Identity Systems', description: 'Design a complete brand kit including logo, typography guidelines, business cards, and social templates.' },
      { stage: 'Portfolio', title: 'Advertising & Marketing Campaign', description: 'Produce high-converting visual banners, billboards, and social media ad creatives for a major brand.' },
      { stage: 'Internship', title: 'Creative Agency Attaché', description: 'Join advertising agencies or internal corporate marketing teams designing daily media campaigns.' },
      { stage: 'Freelancing', title: 'Freelance Brand Designer', description: 'Secure monthly design retainer contracts with local businesses, startups, and influencers.' },
      { stage: 'Remote Job', title: 'Remote Brand & Visual Designer', description: 'Work remotely for international marketing agencies designing digital assets.' },
      { stage: 'Full-Time Career', title: 'Art Director / Creative Director', description: 'Lead brand identity strategy, creative advertising teams, and visual communications across corporations.' }
    ],
    companies: ['Anakle', 'Insight Publicis', 'Wild Fusion', 'Softcom', 'Genevix Creative Agency', 'Sterling Bank Marketing Team'],
    tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma / Canva Pro', 'CorelDRAW', 'Behance'],
    nyscReason: 'Every business needs daily social media banners and branding; acquiring graphic design skills gives you an immediate income stream from your PPA lodge during NYSC.',
    difficulty: 'Beginner-Friendly (No math or coding required; focus is on artistic creativity and software tool mastery).',
    demandRating: 'High Demand',
    typicalProjects: [
      'Complete brand identity book for a new African fintech startup including logo vectors, color palettes, and typography rules',
      'High-impact social media ad carousel series designed for Instagram and LinkedIn marketing campaigns',
      'Corporate annual report layout and digital promotional brochure with custom vector iconography'
    ],
    portfolioRecs: [
      'Maintain a curated Behance or Dribbble portfolio displaying 3 comprehensive brand identity projects and marketing creatives.'
    ],
    certifications: ['Adobe Certified Professional: Visual Design using Photoshop', 'Adobe Certified Professional: Graphic Design using Illustrator'],
    globalPotential: 'Excellent. International businesses constantly outsource visual graphic design and branding tasks to talented freelance artists.',
    longTermGrowth: 'Progress from Graphic Designer to Senior Visual Designer, Art Director, Creative Director, or running your own design agency.',
    recommendedCourse: {
      courseId: 'graphics',
      name: 'Graphics Design & Brand Strategy Track',
      duration: '10 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed Visual Portfolio Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 390,
    registrationsCount: 44
  },
  {
    courseId: 'video-editing',
    title: 'Video Editing & Motion Graphics',
    category: 'Design & Creative',
    description: 'Edit high-impact commercial video productions, design narrative motion graphics, arrange sound design tracks, and output clean rendering files for digital marketing channels.',
    whoItSuits: 'Ideal for creative visual storytellers, content creators, and social media enthusiasts with an eye for timing, color pacing, and digital aesthetics.',
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
    skills: ['Timeline Trimming & Sequencing', 'Color Correction & Cinematic Grading', 'Audio Syncing, Mixing & SFX Design', 'Motion Graphics & VFX (After Effects)', 'Multi-Camera Commercial Editing', 'Social Media Reels / Shorts Optimization'],
    softSkills: ['Narrative Pacing', 'Visual Pacing', 'Creative Storytelling', 'Client Deadline Discipline', 'Adaptability'],
    duration: '10 Weeks Intensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'Video Basics & Premiere Pro Interface', description: 'Understand frame rates, resolutions, project organization, timeline cutting, and basic transitions.' },
      { stage: 'Intermediate', title: 'Audio Mixing & Color Grading', description: 'Master Lumetri color correction, cinematic grading, sound design layering, and noise reduction.' },
      { stage: 'Project Building', title: 'Motion Graphics in After Effects', description: 'Create animated lower thirds, kinetic typography, logo reveals, and visual effects overlays.' },
      { stage: 'Portfolio', title: 'Commercial & Social Media Reel', description: 'Produce a high-octane promotional video and a series of viral social media Reels/Shorts.' },
      { stage: 'Internship', title: 'Media Production Assistant', description: 'Join media agencies, tech companies, or YouTube channels editing weekly video broadcasts.' },
      { stage: 'Freelancing', title: 'Freelance YouTube & Reels Editor', description: 'Secure monthly retainers editing content for global creators, podcasts, and corporate brands.' },
      { stage: 'Remote Job', title: 'Remote Video & Motion Producer', description: 'Work remotely for international digital marketing agencies producing commercial advertisements.' },
      { stage: 'Full-Time Career', title: 'Head of Video Production / Creative Director', description: 'Direct commercial film shoots, motion graphic teams, and corporate brand documentaries.' }
    ],
    companies: ['Wild Fusion', 'Pulse Nigeria', 'Anakle', 'Ebonylife Media', 'Tech Startups Marketing Teams', 'Global YouTube Brands'],
    tools: ['Adobe Premiere Pro', 'Adobe After Effects', 'DaVinci Resolve', 'CapCut Desktop / Pro', 'Audacity / Adobe Audition', 'Frame.io'],
    nyscReason: 'Video is the dominant form of content on the internet; video editors command steady freelance income from foreign clients who need their content edited weekly.',
    difficulty: 'Beginner-Friendly to Intermediate (No coding required; focus is on narrative timing, visual pacing, and software proficiency).',
    demandRating: 'Very High Demand',
    typicalProjects: [
      'High-converting 60-second social media product advertisement with dynamic captions and motion graphics',
      'Cinematic multi-camera interview cut featuring professional Lumetri color grading and multi-track sound design',
      'Animated corporate logo reveal and kinetic typography explainer video built in Adobe After Effects'
    ],
    portfolioRecs: [
      'Host an interactive 2-minute showreel on YouTube or Behance highlighting your best cuts, color before/afters, and motion transitions.'
    ],
    certifications: ['Adobe Certified Professional: Video Communication using Premiere Pro', 'DaVinci Resolve Certified Editor'],
    globalPotential: 'Excellent. International content creators and agencies routinely outsource video editing tasks starting at $25 - $60 / hour.',
    longTermGrowth: 'Progress from Junior Video Editor to Lead Editor, Motion Graphics Specialist, Production Director, or running your own media agency.',
    recommendedCourse: {
      courseId: 'video-editing',
      name: 'Video Editing & Motion Graphics Track',
      duration: '10 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed Video Showreel Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 410,
    registrationsCount: 46
  },
  {
    courseId: 'virtual-assistant',
    title: 'Virtual Executive Assistant & Tech Ops',
    category: 'Business & Operations',
    description: 'Orchestrate executive schedules, manage remote communication channels, administer CRM tools, organize Notion workspaces, and provide seamless operational support to global executives.',
    whoItSuits: 'Highly organized individuals, excellent communicators, administrators, and problem-solvers who thrive on structuring operations and multitasking.',
    salary: {
      nigeriaEntry: '₦150,000 - ₦300,000 / month',
      nigeriaMid: '₦320,000 - ₦550,000 / month',
      nigeriaSenior: '₦600,000 - ₦1,100,000 / month',
      africaAverage: '$800 - $1,800 / month',
      remoteInternational: '$36,000 - $65,000 / year',
      freelanceRate: '$20 - $45 / hour'
    },
    remote: 'Extremely high. Virtual assisting is 100% remote by definition, offering direct access to international CEOs and founders.',
    freelance: 'Phenomenal. Easy to secure multiple foreign client retainers ($500 - $1,500/month per client) working from home.',
    skills: ['Executive Calendar & Inbox Management', 'Workspace Administration (Google Workspace/365)', 'CRM & Lead Management (HubSpot/Salesforce)', 'Project Management Setup (Notion/Trello/Asana)', 'Travel Orchestration & Meeting Minutes', 'Basic AI Workflow Automation'],
    softSkills: ['Time Management', 'Professional Etiquette', 'Confidentiality & Discretion', 'Proactive Problem Solving', 'Clear Communication'],
    duration: '8 Weeks Comprehensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'Executive Communication & Workspace', description: 'Master Google Workspace, professional email etiquette, inbox zero strategies, and advanced calendar scheduling.' },
      { stage: 'Intermediate', title: 'Notion & Project Management Tools', description: 'Configure Notion workspaces, Asana Kanban boards, Trello trackers, and Slack team communication channels.' },
      { stage: 'Project Building', title: 'CRM Administration & AI Tools', description: 'Manage customer records in HubSpot, draft executive presentations, and use AI tools to automate meeting notes.' },
      { stage: 'Portfolio', title: 'Virtual Executive Dossier', description: 'Create a comprehensive operational manual and sample executive dashboard demonstrating your administrative rigor.' },
      { stage: 'Internship', title: 'NYSC Administrative Attaché', description: 'Support executive directors or department heads at partner organizations during your service year.' },
      { stage: 'Freelancing', title: 'Remote Executive VA on Upwork', description: 'Create professional profiles on Upwork, Fiverr, and LinkedIn to secure foreign executive retainers.' },
      { stage: 'Remote Job', title: 'Full-Time Remote Executive Assistant', description: 'Partner with international CEOs and startup founders as their primary operational right-hand.' },
      { stage: 'Full-Time Career', title: 'Chief of Staff / Head of People Operations', description: 'Manage company-wide operations, executive initiatives, and strategic business execution.' }
    ],
    companies: ['Spars Tech UK', 'Outsource Global', 'Worka Nigeria', 'Wave VA Networks', 'Remote Startups Worldwide', 'Indeed VA Networks'],
    tools: ['Google Workspace / Office 365', 'Notion / Trello / Asana', 'Slack & Zoom', 'Calendly', 'HubSpot CRM', 'ChatGPT / Otter.ai'],
    nyscReason: 'Virtual Assisting requires standard laptop hardware and zero coding, making it the fastest and most reliable way to earn foreign currency in USD/GBP during your NYSC year.',
    difficulty: 'Beginner-Friendly (No coding required; focus is on superior organizational skills, communication, and digital software command).',
    demandRating: 'High Demand',
    typicalProjects: [
      'Customized Notion executive workspace featuring automated task boards, meeting note archives, and CRM trackers',
      'Comprehensive executive travel and conference itinerary with time-zone synchronization and budget spreadsheet',
      'Automated email inbox triage protocol and SOP (Standard Operating Procedure) document for client communications'
    ],
    portfolioRecs: [
      'Present a clean digital portfolio or Notion resume detailing your mastery of organizational software, sample SOPs, and mock scheduling solutions.'
    ],
    certifications: ['Google Workspace Administrator Certified', 'HubSpot CRM Certification', 'Microsoft Office Specialist (MOS)'],
    globalPotential: 'Exceptional. Western founders and executives actively hire African Virtual Assistants for their exceptional English communication and work ethic.',
    longTermGrowth: 'Progress from Executive Virtual Assistant to Senior Operations Manager, Project Manager, or Chief of Staff.',
    recommendedCourse: {
      courseId: 'virtual-assistant',
      name: 'Virtual Executive Assistant & Tech Ops Track',
      duration: '8 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed Executive Portfolio Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 350,
    registrationsCount: 40
  },
  {
    courseId: 'digital-marketing',
    title: 'Digital Marketing & Growth Hacking',
    category: 'Business & Operations',
    description: 'Execute data-driven SEO campaigns, manage high-ROI paid advertising on Google and Meta, build automated email marketing funnels, and accelerate revenue growth.',
    whoItSuits: 'Strategic thinkers, creative communicators, data analysts, and marketers who want to drive customer acquisition and revenue for businesses.',
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
    skills: ['SEO Keyword Research & On-Page Optimization', 'Meta & Google Paid Advertising Architecture', 'Email Funnel Copywriting & Automation', 'Social Media Content Strategy', 'Google Analytics & Conversion Tracking', 'A/B Testing & Growth Hacking'],
    softSkills: ['Persuasive Storytelling', 'Consumer Psychology', 'Analytical Rigor', 'Strategic Planning', 'Agile Execution'],
    duration: '10 Weeks Comprehensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'Brand Strategy & Copywriting', description: 'Understand customer personas, value propositions, persuasive copywriting, and marketing funnel stages.' },
      { stage: 'Intermediate', title: 'SEO & Content Marketing', description: 'Master keyword research, on-page SEO, blog optimization, and organic traffic growth using SEMrush.' },
      { stage: 'Project Building', title: 'Paid Ads on Meta & Google', description: 'Design, launch, and optimize high-converting paid ad campaigns on Facebook, Instagram, and Google Search.' },
      { stage: 'Portfolio', title: 'Complete Growth Marketing Plan', description: 'Execute a comprehensive digital marketing strategy and analytics report for an active brand.' },
      { stage: 'Internship', title: 'Digital Marketing Attaché', description: 'Manage social channels and ad campaigns for Nigerian startups and partner agencies.' },
      { stage: 'Freelancing', title: 'Freelance Growth & Ads Specialist', description: 'Manage monthly ad spend and email newsletters for international e-commerce clients.' },
      { stage: 'Remote Job', title: 'Remote Growth Marketer', description: 'Lead user acquisition and retention campaigns for global tech companies.' },
      { stage: 'Full-Time Career', title: 'Chief Marketing Officer (CMO) / VP of Growth', description: 'Direct corporate marketing budget, brand positioning, and international revenue expansion.' }
    ],
    companies: ['Wild Fusion', 'Hera Marketing', 'Pulse Nigeria', 'Anakle', 'Sterling Bank', 'PiggyVest Marketing Team'],
    tools: ['Google Ads Manager', 'Meta Business Suite', 'Google Analytics 4 (GA4)', 'Mailchimp / Klaviyo', 'SEMrush / Ahrefs', 'Canva / Figma'],
    nyscReason: 'Every business needs more customers; acquiring digital marketing skills allows you to directly increase corporate revenue, making you an indispensable asset during NYSC.',
    difficulty: 'Beginner-Friendly to Intermediate (Combines creative copywriting with analytical data tracking and audience budgeting).',
    demandRating: 'Very High Demand',
    typicalProjects: [
      'Comprehensive Google Ads search campaign targeting high-intent fintech keywords with conversion tracking setups',
      'Automated 5-stage email welcome and cart-abandonment funnel built in Mailchimp with copywriting copy blocks',
      'Full SEO technical audit and content ranking strategy for an African e-commerce store using SEMrush'
    ],
    portfolioRecs: [
      'Present a documented case study showing how your ad campaign or SEO content strategy increased website traffic or lead conversions.'
    ],
    certifications: ['Google Ads Search Certification', 'Google Analytics Individual Qualification (GAIQ)', 'HubSpot Content Marketing Certification'],
    globalPotential: 'Exceptional. Digital marketers who understand how to achieve high Return on Ad Spend (ROAS) can work from anywhere for global brands.',
    longTermGrowth: 'Advance from Digital Marketing Specialist to Growth Lead, Performance Marketing Director, or Chief Marketing Officer (CMO).',
    recommendedCourse: {
      courseId: 'digital-marketing',
      name: 'Digital Marketing & Growth Hacking Track',
      duration: '10 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed Marketing Portfolio Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 430,
    registrationsCount: 50
  },
  {
    courseId: 'ms-office',
    title: 'Microsoft Office Specialist & Business Analytics',
    category: 'Business & Operations',
    description: 'Master advanced Microsoft Excel data modeling, construct compelling PowerPoint presentations, streamline Word documentation, and automate corporate office reporting.',
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
    skills: ['Advanced Excel Formulas (XLOOKUP/INDEX-MATCH)', 'Pivot Tables & Power Query Automation', 'Executive PowerPoint Slide Deck Architecture', 'Professional Word Document Formatting', 'Data Visualization & Charts', 'Basic Outlook & SharePoint Workflow'],
    softSkills: ['Corporate Professionalism', 'Accuracy & Precision', 'Data Organization', 'Time Efficiency', 'Written Communication'],
    duration: '8 Weeks Comprehensive Mentorship',
    roadmap: [
      { stage: 'Beginner', title: 'Excel Fundamentals & Word Structure', description: 'Understand formatting, basic formulas, tables, mail merge, and professional document standards.' },
      { stage: 'Intermediate', title: 'Advanced Excel Formulas & Pivot Tables', description: 'Master nested logical formulas, VLOOKUP/XLOOKUP, conditional formatting, and pivot table reporting.' },
      { stage: 'Project Building', title: 'Power Query & Executive PowerPoint', description: 'Automate data cleanup with Power Query and design persuasive executive PowerPoint slide decks.' },
      { stage: 'Portfolio', title: 'Corporate Business Report & Dashboard', description: 'Build an automated financial reporting spreadsheet and accompanying board presentation deck.' },
      { stage: 'Internship', title: 'NYSC Corporate Operations Attaché', description: 'Serve as an indispensable administrative and reporting officer at banks and corporate offices.' },
      { stage: 'Freelancing', title: 'Spreadsheet & Presentation Consultant', description: 'Offer Excel template creation and PowerPoint makeover services to professionals and businesses.' },
      { stage: 'Remote Job', title: 'Remote Operations & Reporting Analyst', description: 'Manage corporate data sheets and reports for international remote teams.' },
      { stage: 'Full-Time Career', title: 'Senior Operations Manager / Business Analyst', description: 'Oversee department reporting, corporate administration, and business operations.' }
    ],
    companies: ['PwC Nigeria', 'KPMG', 'Deloitte', 'Sterling Bank', 'Access Bank', 'Corporate Organizations Nationwide'],
    tools: ['Microsoft Excel (Advanced)', 'Microsoft PowerPoint', 'Microsoft Word', 'Microsoft Outlook', 'SharePoint / OneDrive', 'Google Sheets Equivalent'],
    nyscReason: '95% of corporate jobs in Nigeria test candidates on Excel and Office proficiency; mastering these tools guarantees you will excel in any PPA office environment.',
    difficulty: 'Beginner-Friendly (No prior coding required; step-by-step practical command of corporate software tools).',
    demandRating: 'High Demand',
    typicalProjects: [
      'Automated corporate sales tracking spreadsheet utilizing XLOOKUP, dynamic pivot charts, and conditional formatting alerts',
      'Professional 15-slide executive presentation deck designed with custom slide layouts, consistent branding, and visual infographics',
      'Standardized corporate policy document structured in Word with automated table of contents, headers, and mail-merge setup'
    ],
    portfolioRecs: [
      'Present a clean digital portfolio showcasing your before-and-after Excel dashboard makeovers and slide deck templates.'
    ],
    certifications: ['Microsoft Office Specialist: Excel Expert (Office 365)', 'Microsoft Office Specialist: PowerPoint Associate', 'Microsoft Certified: Fundamentals'],
    globalPotential: 'Very High. Microsoft Office is the global operating system of business; advanced proficiency opens doors across administration and finance worldwide.',
    longTermGrowth: 'Progress from Corporate Associate to Senior Business Analyst, Operations Lead, or Administration Director.',
    recommendedCourse: {
      courseId: 'ms-office',
      name: 'Microsoft Office Specialist & Business Analytics Track',
      duration: '8 Weeks Intensive Sprints',
      mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
      outcome: 'Guaranteed Office Proficiency Evaluation + NYSC Corporate Placement Support'
    },
    status: 'Published',
    viewsCount: 340,
    registrationsCount: 38
  }
];

export class CareerExplorerRepository {
  private static ensureFallbackFilesExist() {
    try {
      if (!fs.existsSync(FALLBACK_PROFILES_FILE)) {
        fs.writeFileSync(FALLBACK_PROFILES_FILE, JSON.stringify(DEFAULT_CAREER_PROFILES, null, 2), 'utf-8');
      }
      if (!fs.existsSync(FALLBACK_BOOKMARKS_FILE)) {
        fs.writeFileSync(FALLBACK_BOOKMARKS_FILE, JSON.stringify([], null, 2), 'utf-8');
      }
      if (!fs.existsSync(FALLBACK_ANALYTICS_FILE)) {
        fs.writeFileSync(FALLBACK_ANALYTICS_FILE, JSON.stringify([], null, 2), 'utf-8');
      }
    } catch (err) {
      console.error("Error creating fallback career files:", err);
    }
  }

  static async getAllProfiles(): Promise<CareerTrackProfileData[]> {
    this.ensureFallbackFilesExist();
    try {
      const prisma = getPrisma();
      const dbProfiles = await prisma.careerTrackProfile.findMany({
        orderBy: { title: 'asc' }
      });
      if (dbProfiles && dbProfiles.length > 0) {
        return dbProfiles.map(p => ({
          courseId: p.courseId,
          title: p.title,
          category: p.category || 'Software & Web',
          description: p.description,
          whoItSuits: p.whoItSuits,
          salary: typeof p.salary === 'string' && p.salary.startsWith('{') ? JSON.parse(p.salary) : {
            nigeriaEntry: p.salary,
            nigeriaMid: '₦450,000 - ₦750,000 / month',
            nigeriaSenior: '₦900,000 - ₦1,800,000 / month',
            africaAverage: '$1,200 - $3,000 / month',
            remoteInternational: '$50,000 - $90,000 / year',
            freelanceRate: '$30 - $75 / hour'
          },
          remote: p.remote,
          freelance: p.freelance,
          skills: typeof p.skills === 'string' && p.skills.startsWith('[') ? JSON.parse(p.skills) : (p.skills || '').split(',').map(s => s.trim()).filter(Boolean),
          softSkills: ['Analytical Thinking', 'Problem Solving', 'Communication', 'Time Management', 'Collaboration'],
          duration: p.duration,
          roadmap: typeof p.roadmap === 'string' && p.roadmap.startsWith('[') ? JSON.parse(p.roadmap) : [],
          companies: typeof p.companies === 'string' && p.companies.startsWith('[') ? JSON.parse(p.companies) : (p.companies || '').split(',').map(s => s.trim()).filter(Boolean),
          tools: typeof p.tools === 'string' && p.tools.startsWith('[') ? JSON.parse(p.tools) : (p.tools || '').split(',').map(s => s.trim()).filter(Boolean),
          nyscReason: p.nyscReason || '',
          difficulty: p.difficulty || 'Intermediate',
          demandRating: p.demandRating || 'High Demand',
          typicalProjects: typeof p.typicalProjects === 'string' && p.typicalProjects?.startsWith('[') ? JSON.parse(p.typicalProjects) : [],
          portfolioRecs: typeof p.portfolioRecs === 'string' && p.portfolioRecs?.startsWith('[') ? JSON.parse(p.portfolioRecs) : [],
          certifications: typeof p.certifications === 'string' && p.certifications?.startsWith('[') ? JSON.parse(p.certifications) : [],
          globalPotential: p.globalPotential || 'High global remote hiring potential.',
          longTermGrowth: p.longTermGrowth || 'Continuous career advancement opportunities across tech leadership.',
          recommendedCourse: {
            courseId: p.courseId,
            name: `${p.title} Training Track`,
            duration: p.duration,
            mode: '100% Online / Hybrid + Offline CDS Downloadable Video Access',
            outcome: 'Guaranteed Portfolio Evaluation + NYSC Corporate Placement Support'
          },
          status: p.status || 'Published',
          viewsCount: p.viewsCount || 0,
          registrationsCount: p.registrationsCount || 0
        }));
      }
    } catch (err) {
      // Offline fallback
    }

    try {
      if (fs.existsSync(FALLBACK_PROFILES_FILE)) {
        const content = fs.readFileSync(FALLBACK_PROFILES_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error("Error reading fallback career profiles:", err);
    }
    return DEFAULT_CAREER_PROFILES;
  }

  static async getProfileById(courseId: string): Promise<CareerTrackProfileData | null> {
    const all = await this.getAllProfiles();
    return all.find(p => p.courseId === courseId) || null;
  }

  static async updateProfile(courseId: string, data: Partial<CareerTrackProfileData>): Promise<CareerTrackProfileData | null> {
    const all = await this.getAllProfiles();
    const index = all.findIndex(p => p.courseId === courseId);
    if (index === -1) return null;

    const updated = { ...all[index], ...data };
    all[index] = updated;

    try {
      fs.writeFileSync(FALLBACK_PROFILES_FILE, JSON.stringify(all, null, 2), 'utf-8');
    } catch (err) {
      console.error("Failed writing updated profile to fallback:", err);
    }

    try {
      const prisma = getPrisma();
      await prisma.careerTrackProfile.upsert({
        where: { courseId },
        update: {
          title: updated.title,
          category: updated.category,
          description: updated.description,
          whoItSuits: updated.whoItSuits,
          salary: JSON.stringify(updated.salary),
          remote: updated.remote,
          freelance: updated.freelance,
          skills: JSON.stringify(updated.skills),
          duration: updated.duration,
          roadmap: JSON.stringify(updated.roadmap),
          companies: JSON.stringify(updated.companies),
          tools: JSON.stringify(updated.tools),
          nyscReason: updated.nyscReason,
          difficulty: updated.difficulty,
          demandRating: updated.demandRating,
          typicalProjects: JSON.stringify(updated.typicalProjects),
          portfolioRecs: JSON.stringify(updated.portfolioRecs),
          certifications: JSON.stringify(updated.certifications),
          globalPotential: updated.globalPotential,
          longTermGrowth: updated.longTermGrowth,
          status: updated.status
        },
        create: {
          courseId: updated.courseId,
          title: updated.title,
          category: updated.category,
          description: updated.description,
          whoItSuits: updated.whoItSuits,
          salary: JSON.stringify(updated.salary),
          remote: updated.remote,
          freelance: updated.freelance,
          skills: JSON.stringify(updated.skills),
          duration: updated.duration,
          roadmap: JSON.stringify(updated.roadmap),
          companies: JSON.stringify(updated.companies),
          tools: JSON.stringify(updated.tools),
          nyscReason: updated.nyscReason,
          difficulty: updated.difficulty,
          demandRating: updated.demandRating,
          typicalProjects: JSON.stringify(updated.typicalProjects),
          portfolioRecs: JSON.stringify(updated.portfolioRecs),
          certifications: JSON.stringify(updated.certifications),
          globalPotential: updated.globalPotential,
          longTermGrowth: updated.longTermGrowth,
          status: updated.status
        }
      });
    } catch (err) {
      // Offline
    }

    return updated;
  }

  static async recordMetric(courseId: string, metricType: string, userEmail?: string): Promise<void> {
    this.ensureFallbackFilesExist();
    const all = await this.getAllProfiles();
    const index = all.findIndex(p => p.courseId === courseId);
    if (index !== -1) {
      if (metricType === 'VIEW') all[index].viewsCount = (all[index].viewsCount || 0) + 1;
      if (metricType === 'REGISTER_CLICK') all[index].registrationsCount = (all[index].registrationsCount || 0) + 1;
      try {
        fs.writeFileSync(FALLBACK_PROFILES_FILE, JSON.stringify(all, null, 2), 'utf-8');
      } catch (err) {}
    }

    try {
      if (fs.existsSync(FALLBACK_ANALYTICS_FILE)) {
        const analytics = JSON.parse(fs.readFileSync(FALLBACK_ANALYTICS_FILE, 'utf-8') || '[]');
        analytics.push({ id: Date.now(), courseId, metricType, userEmail: userEmail || 'anonymous', createdAt: new Date().toISOString() });
        fs.writeFileSync(FALLBACK_ANALYTICS_FILE, JSON.stringify(analytics, null, 2), 'utf-8');
      }
    } catch (err) {}

    try {
      const prisma = getPrisma();
      if (index !== -1) {
        if (metricType === 'VIEW') {
          await prisma.careerTrackProfile.update({
            where: { courseId },
            data: { viewsCount: { increment: 1 } }
          }).catch(() => {});
        } else if (metricType === 'REGISTER_CLICK') {
          await prisma.careerTrackProfile.update({
            where: { courseId },
            data: { registrationsCount: { increment: 1 } }
          }).catch(() => {});
        }
      }
      await prisma.careerProfileAnalytics.create({
        data: { courseId, metricType, userEmail }
      }).catch(() => {});
    } catch (err) {}
  }

  static async saveBookmark(userEmail: string, courseId: string, courseTitle: string, notes: string = ''): Promise<any> {
    this.ensureFallbackFilesExist();
    let savedList: any[] = [];
    try {
      if (fs.existsSync(FALLBACK_BOOKMARKS_FILE)) {
        savedList = JSON.parse(fs.readFileSync(FALLBACK_BOOKMARKS_FILE, 'utf-8') || '[]');
      }
    } catch (err) {}

    const existingIdx = savedList.findIndex(b => b.userEmail === userEmail && b.courseId === courseId);
    let item;
    if (existingIdx !== -1) {
      savedList[existingIdx].notes = notes;
      item = savedList[existingIdx];
    } else {
      item = { id: Date.now(), userEmail, courseId, courseTitle, notes, compared: false, createdAt: new Date().toISOString() };
      savedList.push(item);
    }

    try {
      fs.writeFileSync(FALLBACK_BOOKMARKS_FILE, JSON.stringify(savedList, null, 2), 'utf-8');
    } catch (err) {}

    try {
      const prisma = getPrisma();
      await prisma.savedCareerBookmark.upsert({
        where: { userEmail_courseId: { userEmail, courseId } },
        update: { notes },
        create: { userEmail, courseId, courseTitle, notes }
      });
    } catch (err) {}

    await this.recordMetric(courseId, 'SAVE', userEmail);
    return item;
  }

  static async removeBookmark(userEmail: string, courseId: string): Promise<boolean> {
    this.ensureFallbackFilesExist();
    try {
      if (fs.existsSync(FALLBACK_BOOKMARKS_FILE)) {
        let savedList: any[] = JSON.parse(fs.readFileSync(FALLBACK_BOOKMARKS_FILE, 'utf-8') || '[]');
        savedList = savedList.filter(b => !(b.userEmail === userEmail && b.courseId === courseId));
        fs.writeFileSync(FALLBACK_BOOKMARKS_FILE, JSON.stringify(savedList, null, 2), 'utf-8');
      }
    } catch (err) {}

    try {
      const prisma = getPrisma();
      await prisma.savedCareerBookmark.delete({
        where: { userEmail_courseId: { userEmail, courseId } }
      });
    } catch (err) {}

    return true;
  }

  static async getBookmarks(userEmail: string): Promise<any[]> {
    this.ensureFallbackFilesExist();
    try {
      const prisma = getPrisma();
      const dbList = await prisma.savedCareerBookmark.findMany({
        where: { userEmail },
        orderBy: { createdAt: 'desc' }
      });
      if (dbList && dbList.length > 0) return dbList;
    } catch (err) {}

    try {
      if (fs.existsSync(FALLBACK_BOOKMARKS_FILE)) {
        const savedList: any[] = JSON.parse(fs.readFileSync(FALLBACK_BOOKMARKS_FILE, 'utf-8') || '[]');
        return savedList.filter(b => b.userEmail === userEmail || userEmail === 'all');
      }
    } catch (err) {}

    return [];
  }

  static async getCommandCenterStats(): Promise<any> {
    const all = await this.getAllProfiles();
    let totalViews = 0;
    let totalRegistrations = 0;
    const popularRanking = [...all].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 5);

    all.forEach(p => {
      totalViews += (p.viewsCount || 0);
      totalRegistrations += (p.registrationsCount || 0);
    });

    let totalSaved = 0;
    try {
      if (fs.existsSync(FALLBACK_BOOKMARKS_FILE)) {
        const savedList = JSON.parse(fs.readFileSync(FALLBACK_BOOKMARKS_FILE, 'utf-8') || '[]');
        totalSaved = savedList.length;
      }
    } catch (err) {}

    try {
      const prisma = getPrisma();
      const count = await prisma.savedCareerBookmark.count();
      if (count > totalSaved) totalSaved = count;
    } catch (err) {}

    return {
      totalViews,
      totalRegistrations,
      totalSaved,
      popularRanking: popularRanking.map(p => ({
        courseId: p.courseId,
        title: p.title,
        viewsCount: p.viewsCount || 0,
        registrationsCount: p.registrationsCount || 0
      })),
      allProfilesCount: all.length
    };
  }
}
