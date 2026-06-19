export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/insights' },
  { label: 'For Hospitals', href: '/for-hospitals' },
  { label: 'For Candidates', href: '/for-candidates' },
  { label: 'Contact', href: '/contact' }
];

export const tickerItems = [
  'MRI Technologist',
  'Bengaluru',
  'CT Radiographer',
  'Mumbai',
  'Neuro Radiologist',
  'Delhi',
  "Women's Imaging Specialist",
  'Chennai',
  'PACS Administrator',
  'Pune',
  'Pediatric Radiographer',
  'Hyderabad',
  'AI Validation Lead',
  'Bengaluru',
  'MSK Radiologist',
  'Kolkata'
];

export const stats = [
  { label: 'Candidates placed', value: 1400, suffix: '+', decimals: 0 },
  { label: 'Credential verification rate', value: 98.2, suffix: '%', decimals: 1 },
  { label: 'Avg. shortlist delivery', value: 18, prefix: '<', suffix: ' hrs', decimals: 0 },
  { label: 'Partner hospitals', value: 200, suffix: '+', decimals: 0 }
];

export const jobs = [
  {
    id: 'senior-mri-technologist-apollo-bengaluru',
    title: 'Senior MRI Technologist',
    hospital: 'Apollo Hospitals',
    location: 'Bengaluru',
    type: 'Urgent',
    salary: '',
    postedAt: 'Urgent',
    specialization: 'MRI',
    status: 'urgent',
    match: 'AI match 94%'
  },
  {
    id: 'ct-radiographer-manipal-mangaluru',
    title: 'CT Radiographer',
    hospital: 'Manipal Hospital',
    location: 'Mangaluru',
    type: 'New',
    salary: '',
    postedAt: 'New',
    specialization: 'CT',
    status: 'new',
    match: 'AI match 89%'
  },
  {
    id: 'reporting-specialist-narayana-hyderabad',
    title: 'Radiology Reporting Specialist',
    hospital: 'Narayana Health',
    location: 'Hyderabad',
    type: 'Open',
    salary: '',
    postedAt: 'Open',
    specialization: 'Reporting',
    status: 'open',
    match: 'AI match 87%'
  },
  {
    id: 'ct-scan-technologist-fortis-healthcare-delhi',
    title: 'CT Scan Technologist',
    hospital: 'Fortis Healthcare',
    location: 'Delhi',
    type: 'Contract',
    salary: '₹5–7 LPA',
    postedAt: 'Posted 1 day ago',
    specialization: 'CT Scan',
    status: 'urgent'
  },
  {
    id: 'mri-technologist-manipal-hospitals-bangalore',
    title: 'MRI Technologist',
    hospital: 'Manipal Hospitals',
    location: 'Bangalore',
    type: 'Full-Time',
    salary: '₹5.5–8 LPA',
    postedAt: 'Posted 4 days ago',
    specialization: 'MRI',
    status: 'new'
  },
  {
    id: 'sonographer-aster-cmi-bangalore',
    title: 'Sonographer',
    hospital: 'Aster CMI',
    location: 'Bangalore',
    type: 'Full-Time',
    salary: '₹4–6 LPA',
    postedAt: 'Posted 5 days ago',
    specialization: 'Sonography',
    status: 'open'
  },
  {
    id: 'pacs-administrator-max-healthcare-delhi',
    title: 'PACS Administrator',
    hospital: 'Max Healthcare',
    location: 'Delhi',
    type: 'Full-Time',
    salary: '₹7–10 LPA',
    postedAt: 'Posted 3 days ago',
    specialization: 'PACS',
    status: 'featured'
  },
  {
    id: 'nuclear-medicine-tech-tata-memorial-mumbai',
    title: 'Nuclear Medicine Tech',
    hospital: 'Tata Memorial',
    location: 'Mumbai',
    type: 'Full-Time',
    salary: '₹8–12 LPA',
    postedAt: 'Posted 6 days ago',
    specialization: 'Nuclear Medicine',
    status: 'open'
  },
  {
    id: 'radiology-nurse-narayana-health-hyderabad',
    title: 'Radiology Nurse',
    hospital: 'Narayana Health',
    location: 'Hyderabad',
    type: 'Full-Time',
    salary: '₹3.5–5 LPA',
    postedAt: 'Posted today',
    specialization: 'Radiology Nursing',
    status: 'urgent'
  },
  {
    id: 'imaging-manager-columbia-asia-pune',
    title: 'Imaging Manager',
    hospital: 'Columbia Asia',
    location: 'Pune',
    type: 'Full-Time',
    salary: '₹12–18 LPA',
    postedAt: 'Posted 7 days ago',
    specialization: 'Imaging Management',
    status: 'new'
  }
];

export const valueProps = [
  {
    audience: 'For Hospitals',
    title: 'Scale your imaging team without the recruitment noise.',
    description: 'Post vacancies, filter by specialty and urgency, and let our AI surface the top three candidates within hours — not weeks.',
    points: ['Verified credentials and license checks on every candidate', 'AI-ranked shortlists delivered to your HR inbox', '24-hour urgent placement track for critical gaps', 'Audit-ready onboarding documentation']
  },
  {
    audience: 'For Candidates',
    title: 'Work where your specialty is genuinely valued.',
    description: 'Register once, get matched to roles that fit your modality strengths, shift preferences, and career goals.',
    points: ['Specialty-matched alerts for MRI, CT, ultrasound, neuro, and MSK', 'Transparent salary bands on every posting', 'Direct communication with hospital HR', 'Profile stays private until you apply']
  }
];

export const howItWorks = {
  hospitalFlow: {
    title: 'For Hospitals',
    subtitle: 'How it works — Hospitals',
    steps: [
      {
        number: '01',
        title: 'Submit your vacancy',
        description: 'Describe the role, modality, urgency tier, and shift needs.'
      },
      {
        number: '02',
        title: 'AI matches and ranks candidates',
        description: 'Our engine scores candidates and surfaces a shortlist with verification badges.'
      },
      {
        number: '03',
        title: 'Hire and onboard',
        description: 'Connect with candidates, confirm the hire, and receive ready-to-sign onboarding documents.'
      }
    ]
  },
  candidateFlow: {
    title: 'For Candidates',
    subtitle: 'How it works — Candidates',
    steps: [
      {
        number: '01',
        title: 'Register your specialty profile',
        description: 'Share your modality strengths, licenses, location, and availability.'
      },
      {
        number: '02',
        title: 'Get matched to the right roles',
        description: 'AI surfaces roles that genuinely fit, with transparent pay details.'
      },
      {
        number: '03',
        title: 'Apply, interview, place',
        description: 'Apply in one click and get placed with full documentation support.'
      }
    ]
  }
};

export const specializations = [
  {
    tag: 'Priority',
    title: 'Neuroimaging technologists and radiologists',
    description: 'Neuroimaging technologists and radiologists for head, spine, and neurovascular roles. 38 open roles.'
  },
  {
    tag: 'Featured',
    title: 'Thoracic CT and X-ray roles',
    description: 'Thoracic CT and X-ray roles across diagnostic centres and hospital networks. 52 open roles.'
  },
  {
    tag: 'New',
    title: 'Musculoskeletal specialists',
    description: 'Musculoskeletal specialists for sports medicine, injury, and degeneration reporting. 24 open roles.'
  },
  {
    tag: 'Teal',
    title: 'Abdominal and pelvic imaging roles',
    description: 'Abdominal and pelvic imaging roles for multi-organ diagnostic pathways. 19 open roles.'
  },
  {
    tag: 'Urgent',
    title: 'On-call and urgent-triage radiographers',
    description: 'On-call and urgent-triage radiographers for emergency and trauma departments. 31 open roles.'
  },
  {
    tag: 'Featured',
    title: "Women's Imaging specialists",
    description: 'Breast, pelvic, and obstetric imaging specialists with careful reporting expertise. 27 open roles.'
  },
  {
    tag: 'New',
    title: 'Pediatric imaging professionals',
    description: 'Age-aware radiology professionals for pediatric diagnostic and trauma studies. 14 open roles.'
  },
  {
    tag: 'Teal',
    title: 'AI Validation specialists',
    description: 'Radiologists and technologists for model evaluation, annotation review, and AI QA programs. 17 open roles.'
  }
];

export const trustBadges = [
  {
    title: 'Credential-verified candidates',
    description: 'License and certification checks completed before any candidate appears in a shortlist.'
  },
  {
    title: 'AI-matched, human-confirmed',
    description: 'AI ranks candidates on specialty fit and availability; every hire is confirmed by your HR team.'
  },
  {
    title: 'Privacy-first profiles',
    description: 'Candidates control visibility; hospitals only see full details after the candidate applies.'
  },
  {
    title: 'Transparent pay on every role',
    description: 'Every vacancy shows a clear salary band upfront, reducing negotiation friction on both sides.'
  },
  {
    title: 'Onboarding documentation',
    description: 'Confirmed hires trigger automatic generation of offer letters, credential summaries, and onboarding packets.'
  },
  {
    title: 'Real-time HR analytics',
    description: 'Track time-to-fill, pipeline status, and department staffing levels from your admin dashboard.'
  }
];

export const services = [
  {
    number: '01',
    title: 'Imaging',
    description: 'High-fidelity diagnostic imaging workflows across modalities, optimized for speed, consistency, and clinical confidence.',
    capabilities: ['CT and MRI acquisition support', 'Cloud-native study routing', 'Protocol standardization']
  },
  {
    number: '02',
    title: 'AI Diagnostics',
    description: 'AI-assisted detection, prioritization, and decision support designed to augment radiologist judgment without slowing the worklist.',
    capabilities: ['Triage and flagging', 'Lesion and anomaly detection', 'Model performance monitoring']
  },
  {
    number: '03',
    title: 'Reporting',
    description: 'Structured, clear, and actionable reporting services that reduce ambiguity and help care teams act faster.',
    capabilities: ['Radiologist-authored reports', 'Critical result workflows', 'Quality assurance reviews']
  }
];

export const audiences = [
  {
    title: 'Hospitals',
    description: 'Enterprise imaging operations that need scalable reporting, reliable turnaround, and measurable quality control.',
    tag: 'Enterprise'
  },
  {
    title: 'Clinics',
    description: 'Ambulatory and specialty clinics looking for accurate reads, streamlined workflows, and partner-grade communication.',
    tag: 'Ambulatory'
  },
  {
    title: 'Research',
    description: 'Clinical research teams that require annotated imaging data, model evaluation, and reproducible imaging pipelines.',
    tag: 'Clinical AI'
  }
];

export const steps = [
  {
    number: '01',
    title: 'Ingest and normalize',
    description: 'Securely connect PACS, RIS, EHR, or research data sources and normalize studies into a clean operational layer.'
  },
  {
    number: '02',
    title: 'Analyze with AI',
    description: 'Run validated imaging models and radiologist review workflows to prioritize findings and support faster decisions.'
  },
  {
    number: '03',
    title: 'Report and integrate',
    description: 'Deliver structured reports, critical findings, dashboards, and integrations back into your clinical environment.'
  }
];

export const testimonials = [
  {
    quote: 'HNVNS filled our MRI team gap in under 36 hours. The candidates were pre-verified and the platform made the entire HR process completely painless.',
    name: 'Dr. Meera Raman',
    role: 'Chief Radiologist, Metro Imaging Network'
  },
  {
    quote: 'Staffing gaps in imaging used to cost us days of back-and-forth. HNVNS cut that to hours with AI shortlisting that was genuinely accurate.',
    name: 'Arun Patel',
    role: 'Operations Director, Northstar Hospitals'
  },
  {
    quote: 'I registered on Monday, had three relevant interview requests by Wednesday, and accepted an offer by Friday. The pay transparency made HNVNS worth it.',
    name: 'Dr. Lena Ortiz',
    role: 'Radiology Technologist, placed via HNVNS'
  }
];
 

export const insights = [
  {
    date: 'Jun 12, 2026',
    category: 'Staffing',
    title: 'How AI matching reduces time-to-hire in radiology without losing clinical judgement',
    excerpt: 'A practical look at how specialty-fit scoring can surface the right candidate in hours, not weeks.'
  },
  {
    date: 'May 28, 2026',
    category: 'Compliance',
    title: 'What hospitals miss when they skip credential verification in imaging hires',
    excerpt: 'The credential gaps that cause the most costly mis-hires in diagnostic imaging departments.'
  },
  {
    date: 'May 09, 2026',
    category: 'Candidate Guide',
    title: 'How to build a radiology profile that gets shortlisted',
    excerpt: 'Practical steps for MRI, CT, and ultrasound professionals to improve their match scores on HNVNS.'
  }
];
 

export const footerLinks = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/insights' },
    { label: 'Contact', href: '/contact' }
  ],
  services: [
    { label: 'Candidate Matching', href: '/services#candidate-matching' },
    { label: 'Vacancy Management', href: '/services#vacancy-management' },
    { label: 'HR Dashboard', href: '/services#hr-dashboard' },
    { label: 'Credential Verification', href: '/services#credential-verification' }
  ],
  resources: [
    { label: 'Candidate guide', href: '/insights' },
    { label: 'AI matching explained', href: '/insights' },
    { label: 'Credential standards', href: '/insights' }
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'HIPAA readiness', href: '/about' }
  ]
};
