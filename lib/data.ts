export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/insights' },
  { label: 'For Hospitals', href: '/hospitals' },
  { label: 'For Candidates', href: '/candidates' },
  { label: 'Contact', href: '/contact' }
];

export const tickerItems = [
  'MRI Technologist · Bengaluru',
  'CT Radiographer · Mumbai',
  'Clinical Operations Lead · Delhi',
  "Women's Health Specialist · Chennai",
  'PACS Administrator · Pune',
  'Pediatric Care Coordinator · Hyderabad',
  'AI Validation Lead · Bengaluru',
  'MSK Specialist · Kolkata'
];

export const jobs = [
  {
    id: 'senior-mri-technologist-apollo-hospitals-bengaluru',
    title: 'Senior MRI Technologist',
    hospital: 'Apollo Hospitals',
    location: 'Bengaluru',
    type: 'Full-Time',
    salary: '₹12,00,000 - ₹16,00,000 / year',
    postedAt: '2 hours ago',
    specialization: 'MRI',
    status: 'featured'
  },
  {
    id: 'ct-radiographer-manipal-hospital-mangaluru',
    title: 'CT Radiographer',
    hospital: 'Manipal Hospital',
    location: 'Mangaluru',
    type: 'Contract',
    salary: '₹8,00,000 - ₹11,00,000 / year',
    postedAt: '1 day ago',
    specialization: 'CT',
    status: 'new'
  },
  {
    id: 'reporting-specialist-narayana-health-hyderabad',
    title: 'Reporting Specialist',
    hospital: 'Narayana Health',
    location: 'Hyderabad',
    type: 'Locum',
    salary: '₹4,000 / hour',
    postedAt: '3 days ago',
    specialization: 'Reporting',
    status: 'urgent'
  }
];

export const valueProps = [
  {
    audience: 'For Hospitals',
    title: 'Scale your staffing pipeline without the recruitment noise.',
    description: 'Post vacancies, filter by specialty and urgency, and let our AI surface the top three candidates within hours — not weeks.',
    points: [
      'Verified credentials and license checks on every candidate',
      'AI-ranked shortlists delivered to your HR inbox',
      '24-hour urgent placement track for critical gaps',
      'Audit-ready onboarding documentation'
    ]
  },
  {
    audience: 'For Candidates',
    title: 'Work where your specialty is genuinely valued.',
    description: 'Register once, get matched to roles that fit your modality strengths, shift preferences, and career goals.',
    points: [
      'Specialty-matched alerts for MRI, CT, ultrasound, neuro, and MSK',
      'Transparent salary bands on every posting',
      'Direct communication with hospital HR',
      'Profile stays private until you apply'
    ]
  }
];

export const howItWorks = {
  hospitalFlow: {
    title: 'For Hospitals',
    subtitle: 'From study intake to final report',
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
    subtitle: 'From application to active reads',
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
    title: 'Neuro Imaging',
    description: 'Neuroimaging specialists and clinicians for head, spine, and neurovascular roles. 38 open roles.'
  },
  {
    tag: 'Featured',
    title: 'Chest Imaging',
    description: 'Thoracic CT and X-ray roles across clinical teams and hospital networks. 52 open roles.'
  },
  {
    tag: 'New',
    title: 'MSK Imaging',
    description: 'Musculoskeletal specialists for sports medicine, injury, and movement disorder roles. 24 open roles.'
  },
  {
    tag: 'Teal',
    title: 'Body Imaging',
    description: 'Abdominal and pelvic imaging roles for multi-organ diagnostic pathways. 19 open roles.'
  },
  {
    tag: 'Urgent',
    title: 'Emergency Coverage',
    description: 'On-call and urgent-triage specialists for emergency and trauma department coverage. 31 open roles.'
  },
  {
    tag: 'Featured',
    title: "Women's Health Imaging",
    description: 'Breast, pelvic, and obstetric specialists with carefully vetted credentials. 27 open roles.'
  },
  {
    tag: 'New',
    title: 'Pediatric Imaging',
    description: 'Age-aware clinical imaging professionals for pediatric care and trauma support. 14 open roles.'
  },
  {
    tag: 'Teal',
    title: 'AI Validation',
    description: 'Clinical reviewers and technologists for model evaluation, annotation review, and AI QA programs. 17 open roles.'
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
    title: 'Candidate matching',
    description: 'Specialty-first matching for imaging and diagnostic roles, surfacing only credential-verified candidates who meet your shift and coverage needs.',
    capabilities: ['AI-driven specialty scoring', 'Availability-first shortlists', 'Verified candidate profiles']
  },
  {
    number: '02',
    title: 'Vacancy management',
    description: 'A structured vacancy workflow that captures role details, urgency, and coverage gaps so hiring moves faster with less back-and-forth.',
    capabilities: ['Standardized role briefs', 'Urgency-based routing', 'Shortlist tracking']
  },
  {
    number: '03',
    title: 'Credential verification',
    description: 'Automated license and certification checks for every candidate, so your team can trust every shortlist with compliance-ready talent.',
    capabilities: ['License checks', 'Credential document audit', 'Background status tracking']
  }
];

export const audiences = [
  {
    title: 'Hospitals',
    description: 'Enterprise hospital systems that need reliable imaging coverage, streamlined hiring, and credential compliance.',
    tag: 'Enterprise'
  },
  {
    title: 'Clinics',
    description: 'Ambulatory and specialty clinics looking for timely staffing, clearer candidate visibility, and faster fill rates.',
    tag: 'Ambulatory'
  },
  {
    title: 'Research',
    description: 'Clinical research teams that require qualified imaging specialists, verified credentials, and flexible staffing support.',
    tag: 'Clinical AI'
  }
];

export const steps = [
  {
    number: '01',
    title: 'Ingest and normalize',
    description: 'Securely connect hiring data sources and normalize candidate profiles into a clean operational layer.'
  },
  {
    number: '02',
    title: 'Analyze with AI',
    description: 'Run validated staffing models and review workflows to prioritize candidates and support faster decisions.'
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
    role: 'Chief Staffing Officer, Metro Imaging Network'
  },
  {
    quote: 'Staffing gaps in imaging used to cost us days of back-and-forth. HNVNS cut that to hours with AI shortlisting that was genuinely accurate.',
    name: 'Arun Patel',
    role: 'Operations Director, Northstar Hospitals'
  },
  {
    quote: 'I registered on Monday, had three relevant interview requests by Wednesday, and accepted an offer by Friday. The pay transparency made HNVNS worth it.',
    name: 'Dr. Lena Ortiz',
    role: 'Technologist, placed via HNVNS'
  }
];

export const insights = [
  {
    date: 'Jun 12, 2026',
    category: 'Staffing',
    title: 'How AI matching reduces time-to-hire without losing clinical judgement',
    excerpt: 'A practical look at how specialty-fit scoring can surface the right candidate in hours, not weeks.'
  },
  {
    date: 'May 28, 2026',
    category: 'Compliance',
    title: 'What hospitals miss when they skip credential verification in healthcare hires',
    excerpt: 'The credential gaps that cause the most costly mis-hires in clinical staffing programs.'
  },
  {
    date: 'May 09, 2026',
    category: 'Candidate Guide',
    title: 'How to build a candidate profile that gets shortlisted',
    excerpt: 'Practical steps for specialty professionals to improve their match scores on HNVNS.'
  }
];

export const footerLinks = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Insights', href: '/insights' },
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
