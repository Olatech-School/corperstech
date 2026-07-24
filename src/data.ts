import { Program, ValueCard, StatItem, Opportunity, Testimonial } from './types';

export const PROGRAMS: Program[] = [
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: 'Shield',
    description: 'Learn to protect networks, systems, and data from cyber threats. Cover network security, ethical hacking, and threat intelligence.',
    duration: '16 Weeks',
    careerPath: 'Security Analyst, Penetration Tester, Incident Responder',
    tools: ['Wireshark', 'Kali Linux', 'Metasploit', 'Nmap'],
    demand: 'Critical',
    benefits: ['International certification path', 'High remote work opportunities', 'High starting compensation']
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    icon: 'BarChart3',
    description: 'Transform raw data into meaningful business insights. Learn database querying, spreadsheet analysis, and rich data storytelling.',
    duration: '12 Weeks',
    careerPath: 'Data Analyst, Business Intelligence Analyst, Reporting Engineer',
    tools: ['Advanced Excel', 'SQL', 'Power BI', 'Tableau', 'Python'],
    demand: 'Very High',
    benefits: ['Applicable in every industry sector', 'High demand for decision support', 'Fastest path to entry-level roles']
  },
  {
    id: 'web-dev',
    title: 'Web Development',
    icon: 'Code2',
    description: 'Master the art of building responsive websites and dynamic web applications. Learn frontend layout and full-stack architecture.',
    duration: '20 Weeks',
    careerPath: 'Frontend Developer, Full-Stack Developer, Web Specialist',
    tools: ['HTML & CSS', 'JavaScript', 'React.js', 'Node.js', 'TailwindCSS'],
    demand: 'Very High',
    benefits: ['Excellent for freelance agency work', 'High startup hiring rate', 'Build and deploy real products']
  },
  {
    id: 'python',
    title: 'Python Programming',
    icon: 'Terminal',
    description: 'Build a rock-solid foundation in Python programming. Expand into automation, backend scripting, or artificial intelligence.',
    duration: '12 Weeks',
    careerPath: 'Python Developer, Automation Engineer, Backend Apprentice',
    tools: ['Python 3', 'VS Code', 'Git', 'Django', 'Flask'],
    demand: 'High',
    benefits: ['Extremely versatile development language', 'The standard for automation scripting', 'Gateway to Machine Learning']
  },
  {
    id: 'graphics-design',
    title: 'Graphics Design',
    icon: 'Palette',
    description: 'Master visual communication. Learn to create professional branding, social media assets, typography layouts, and user interface mockups.',
    duration: '10 Weeks',
    careerPath: 'Graphic Designer, UI Designer, Visual Brand Strategist',
    tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Canva Pro'],
    demand: 'High',
    benefits: ['Immediate high-value freelance potential', 'Creative self-expression', 'Essential skill for social media marketing']
  },
  {
    id: 'app-dev',
    title: 'App Development',
    icon: 'Smartphone',
    description: 'Build native and cross-platform mobile apps for iOS and Android. Master modern declarative user interfaces and local storage integrations.',
    duration: '18 Weeks',
    careerPath: 'Mobile App Developer, Flutter Developer, iOS/Android Engineer',
    tools: ['Flutter', 'Dart', 'React Native', 'Firebase', 'XCode'],
    demand: 'Very High',
    benefits: ['Direct deployment to Google Play & App Store', 'Huge demand from tech startups', 'High personal SaaS potential']
  },
  {
    id: 'ms-office',
    title: 'Microsoft Office',
    icon: 'FileSpreadsheet',
    description: 'Achieve advanced command over corporate productivity essentials. Excel in pivot tables, automated documentation, and professional presentations.',
    duration: '6 Weeks',
    careerPath: 'Administrative Lead, Operations Associate, Executive Assistant',
    tools: ['Excel Advanced', 'Word Formatting', 'PowerPoint Styling', 'Teams'],
    demand: 'High',
    benefits: ['The baseline for all corporate workspaces', 'Saves hours of daily office labor', 'Immediate booster on administrative CVs']
  },
  {
    id: 'virtual-assistant',
    title: 'Virtual Assistant',
    icon: 'UserCheck',
    description: 'Learn remote operations management, calendar scheduling, customer relations, and digital organization for international clients.',
    duration: '8 Weeks',
    careerPath: 'Virtual Executive Assistant, Remote Client Success Lead',
    tools: ['Google Workspace', 'Notion', 'Slack', 'Trello', 'Calendly'],
    demand: 'Very High',
    benefits: ['Fastest path to earning in foreign currencies', 'Fully remote working conditions', 'Low initial technical barrier']
  }
];

export const VALUES: ValueCard[] = [
  {
    id: 'practical',
    title: 'Practical Training',
    description: 'Skip dry theoretical slides. You will write actual code, query live databases, and configure functional architectures from day one.',
    icon: 'Layers'
  },
  {
    id: 'mentors',
    title: 'Experienced Mentors',
    description: 'Learn from seasoned professionals who build software for international firms and are passionate about guide-based pedagogy.',
    icon: 'Users'
  },
  {
    id: 'projects',
    title: 'Real Projects',
    description: 'Build a production-grade portfolio. Graduate with concrete projects that demonstrate your competence to hiring managers.',
    icon: 'Briefcase'
  },
  {
    id: 'readiness',
    title: 'Job Readiness',
    description: 'Includes intensive resume reviews, LinkedIn profile branding, tech portfolio optimization, and live technical interview prep sessions.',
    icon: 'Award'
  },
  {
    id: 'community',
    title: 'Lively Community',
    description: 'Join thousands of like-minded corps members who share resources, form hackathon squads, and exchange local service insights.',
    icon: 'Compass'
  },
  {
    id: 'support',
    title: 'Olatech Support',
    description: 'Benefit from Olatech School of Programming\'s strong reputation and network across the Nigerian tech ecosystem.',
    icon: 'Briefcase'
  }
];

export const STATS: StatItem[] = [
  {
    id: 'students',
    label: 'Corpers Trained',
    value: 4850,
    suffix: '+',
    icon: 'GraduationCap'
  },
  {
    id: 'courses',
    label: 'Tech Programs',
    value: 8,
    suffix: '',
    icon: 'BookOpen'
  },
  {
    id: 'mentors',
    label: 'Expert Mentors',
    value: 24,
    suffix: '+',
    icon: 'Award'
  },
  {
    id: 'jobs',
    label: 'Placements & Internships',
    value: 1240,
    suffix: '+',
    icon: 'Briefcase'
  }
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Junior Data Analyst Intern',
    company: 'Interswitch Group',
    location: 'Lagos (Hybrid)',
    type: 'Hybrid',
    roleType: 'Internship',
    description: 'Help the business intelligence squad analyze transaction streams and create interactive visual dashboards to support merchant analytics.',
    stipend: '₦150,000 / month',
    datePosted: '2 days ago',
    skills: ['SQL', 'Power BI', 'Excel Advanced']
  },
  {
    id: 'opp-2',
    title: 'Associate Web Developer (NYSC Corp Member)',
    company: 'Kuda Bank',
    location: 'Lagos / Remote',
    type: 'Remote',
    roleType: 'Graduate Trainee',
    description: 'Collaborate with the growth engineering team to craft responsive landing pages, handle secondary API integrations, and debug UI issues.',
    stipend: '₦180,000 / month',
    datePosted: '5 days ago',
    skills: ['React.js', 'TailwindCSS', 'JavaScript']
  },
  {
    id: 'opp-3',
    title: 'Cybersecurity Associate Specialist',
    company: 'MainOne',
    location: 'Abuja (On-site)',
    type: 'On-site',
    roleType: 'Entry-level',
    description: 'Perform real-time alert monitoring, network traffic flow analysis, and help coordinate incident response steps under the security operations center.',
    stipend: '₦220,000 / month',
    datePosted: '1 week ago',
    skills: ['Nmap', 'Threat Analysis', 'Wireshark']
  },
  {
    id: 'opp-4',
    title: 'Remote Executive Assistant & VA',
    company: 'Spars Tech UK',
    location: 'Remote (Nigeria)',
    type: 'Remote',
    roleType: 'Internship',
    description: 'Provide virtual operational support to the co-founders, handle email communications, draft project boards, and manage external outreach.',
    stipend: '£250 / month (~₦470,000)',
    datePosted: '3 days ago',
    skills: ['Notion', 'Calendar Scheduling', 'Google Workspace']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Chinedu Okeke',
    stateOfService: 'Lagos State',
    batch: 'Batch A, Stream 1',
    program: 'Web Development',
    text: 'I started NYSC with zero coding skills. Olatech program was intensive but extremely clear. By my passing out parade (POP), I already secured a remote junior developer contract with a fintech. Best investment of my service year!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'test-2',
    name: 'Amina Yusuf',
    stateOfService: 'FCT Abuja',
    batch: 'Batch B, Stream 2',
    program: 'Data Analysis',
    text: 'Serving in Abuja gave me a lot of free time in the afternoons. CorpersTech helped me channel that time into studying SQL and Power BI. The mentors are patient and explain complex analytics concepts beautifully. Highly recommended!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'test-3',
    name: 'Tunde Adeleke',
    stateOfService: 'Rivers State',
    batch: 'Batch C, Stream 1',
    program: 'Cybersecurity',
    text: 'The absolute worst mistake is doing NYSC without acquiring a practical digital skill. I studied Geology but transition to Cybersecurity through CorpersTech. The curriculum prepared me for actual certifications. It is outstanding!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

export const NYSC_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe', 'Imo', 'Jiagawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export const NYSC_BATCHES = [
  '2026 Batch A - Stream 1',
  '2026 Batch A - Stream 2',
  '2026 Batch B - Stream 1',
  '2026 Batch B - Stream 2',
  '2025 Batch C - Stream 1',
  '2025 Batch C - Stream 2',
  'Other / Prospective Corps Member'
];
