export interface Program {
  id: string;
  title: string;
  icon: string;
  description: string;
  duration: string;
  careerPath: string;
  tools: string[];
  demand: 'High' | 'Very High' | 'Critical';
  benefits: string[];
}

export interface ValueCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Remote' | 'Hybrid' | 'On-site';
  roleType: 'Internship' | 'Entry-level' | 'Graduate Trainee';
  description: string;
  stipend: string;
  datePosted: string;
  skills: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  stateOfService: string;
  batch: string;
  program: string;
  text: string;
  rating: number;
  avatar: string;
}

export interface Registration {
  name: string;
  email: string;
  phone: string;
  stateOfService: string;
  batch: string;
  programOfInterest: string;
  qualification: string;
  source: string;
}
