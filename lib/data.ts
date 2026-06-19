export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' }
];

export const tickerItems = [
  'AI Diagnostics',
  'Advanced Imaging',
  'Precision Reporting',
  'Workflow Optimization'
];

export const stats = [
  { label: 'Scans analyzed', value: 10000, suffix: '+', decimals: 0 },
  { label: 'Diagnostic accuracy', value: 98.7, suffix: '%', decimals: 1 },
  { label: 'Turnaround time', value: 24, prefix: '<', suffix: 'hr', decimals: 0 },
  { label: 'Partner sites', value: 50, suffix: '+', decimals: 0 }
];

export const jobs = [
  {
    id: 'senior-radiographer-apollo-hospitals-mumbai',
    title: 'Senior Radiographer',
    hospital: 'Apollo Hospitals',
    location: 'Mumbai',
    type: 'Full-Time',
    salary: '₹6–9 LPA',
    postedAt: 'Posted 2 days ago',
    specialization: 'Radiography',
    status: 'featured'
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
    title: 'Scale imaging operations without losing clinical control.',
    description: 'Keep studies moving from acquisition to final report with routing, AI triage, and quality workflows built for multi-site care.',
    points: ['24/7 reporting coverage', 'PACS, RIS, and EHR routing', 'Audit-ready quality loops']
  },
  {
    audience: 'For Candidates',
    title: 'Work where reads are prioritized, contextual, and measurable.',
    description: 'Join a platform that gives radiologists cleaner worklists, stronger case context, and transparent feedback on impact.',
    points: ['Focused urgent and routine queues', 'AI-assisted case context', 'Clear quality and throughput signals']
  }
];

export const howItWorks = {
  hospitalFlow: {
    title: 'For Hospitals',
    subtitle: 'From study intake to final report',
    steps: [
      {
        number: '01',
        title: 'Connect your imaging network',
        description: 'Normalize studies from PACS, RIS, EHR, and research sources into one secure workflow.'
      },
      {
        number: '02',
        title: 'Prioritize with AI and rules',
        description: 'Route urgent studies, match protocols, and flag findings before they sit idle.'
      },
      {
        number: '03',
        title: 'Report back into operations',
        description: 'Return structured reports, critical findings, dashboards, and QA signals to the right teams.'
      }
    ]
  },
  candidateFlow: {
    title: 'For Candidates',
    subtitle: 'From application to active reads',
    steps: [
      {
        number: '01',
        title: 'Share your specialty fit',
        description: 'Tell us your modality strengths, availability, and reporting preferences.'
      },
      {
        number: '02',
        title: 'Match to the right queue',
        description: 'Get paired with studies that fit your expertise and urgency profile.'
      },
      {
        number: '03',
        title: 'Read with confidence',
        description: 'Use AI context, peer review, and quality feedback to deliver clearer reports faster.'
      }
    ]
  }
};

export const specializations = [
  {
    tag: 'Priority',
    title: 'Neuro Imaging',
    description: 'Urgent head, spine, and neurovascular reads with structured critical finding workflows.'
  },
  {
    tag: 'Featured',
    title: 'Chest Imaging',
    description: 'Thoracic CT, X-ray, and nodule workflows with AI-assisted measurement support.'
  },
  {
    tag: 'New',
    title: 'MSK Radiology',
    description: 'Musculoskeletal injury, degeneration, and sports medicine reporting pathways.'
  },
  {
    tag: 'Teal',
    title: 'Body Imaging',
    description: 'Abdominal and pelvic imaging workflows for complex multi-organ review.'
  },
  {
    tag: 'Urgent',
    title: 'Emergency Radiology',
    description: 'Rapid triage for time-sensitive findings, critical results, and on-call coverage.'
  },
  {
    tag: 'Featured',
    title: "Women's Imaging",
    description: 'Breast, pelvic, and OB-related imaging workflows with careful reporting standards.'
  },
  {
    tag: 'New',
    title: 'Pediatric Imaging',
    description: 'Age-aware protocols and reporting for pediatric diagnostic studies.'
  },
  {
    tag: 'Teal',
    title: 'AI Validation',
    description: 'Model evaluation, annotation review, and performance monitoring for clinical AI programs.'
  }
];

export const trustBadges = [
  {
    title: 'Radiologist-led review',
    description: 'Final interpretations stay under expert clinical oversight.'
  },
  {
    title: 'AI-assisted, not AI-replaced',
    description: 'Decision support augments radiologist judgment and accountability.'
  },
  {
    title: 'Workflow integrations',
    description: 'Designed around PACS, RIS, EHR, and reporting handoffs.'
  },
  {
    title: 'Quality loops',
    description: 'Audit trails, feedback, and structured reporting support continuous improvement.'
  },
  {
    title: 'Secure handoffs',
    description: 'Clear routing and communication patterns for sensitive clinical data.'
  },
  {
    title: 'Measurable throughput',
    description: 'Dashboards and metrics help teams track turnaround and capacity.'
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
    quote: 'HNVNS gave our imaging team the clarity, speed, and AI support we needed without adding complexity to daily operations.',
    name: 'Dr. Meera Raman',
    role: 'Chief Radiologist, Metro Imaging Network'
  },
  {
    quote: 'The reporting quality is exceptional. Their workflow reduced our turnaround bottlenecks and improved referring physician trust.',
    name: 'Arun Patel',
    role: 'Operations Director, Northstar Hospitals'
  },
  {
    quote: 'Their AI diagnostics platform helped us prioritize urgent studies while keeping radiologists firmly in control of the final read.',
    name: 'Dr. Lena Ortiz',
    role: 'Research Lead, Aurora Clinical AI Lab'
  }
];

export const insights = [
  {
    date: 'Jun 12, 2026',
    category: 'AI Diagnostics',
    title: 'How AI triage improves urgent imaging workflows without replacing radiologists',
    excerpt: 'A practical look at how AI flagging can reduce time-to-review while preserving clinical accountability.'
  },
  {
    date: 'May 28, 2026',
    category: 'Reporting',
    title: 'The anatomy of a high-value radiology report',
    excerpt: 'Structured reporting principles that make findings easier to interpret, act on, and measure.'
  },
  {
    date: 'May 09, 2026',
    category: 'Imaging Operations',
    title: 'Designing imaging pipelines for multi-site healthcare networks',
    excerpt: 'Operational patterns for routing, normalization, and quality assurance across distributed imaging centers.'
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
    { label: 'Imaging', href: '/services#imaging' },
    { label: 'AI Diagnostics', href: '/services#ai-diagnostics' },
    { label: 'Reporting', href: '/services#reporting' }
  ],
  resources: [
    { label: 'Workflow guide', href: '/insights' },
    { label: 'AI safety', href: '/insights' },
    { label: 'Quality reporting', href: '/insights' }
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'HIPAA readiness', href: '/about' }
  ]
};
