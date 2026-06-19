const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial jobs...');

  // Delete all existing jobs first to avoid duplicate keys on re-seeding
  await prisma.job.deleteMany({});

  const initialJobs = [
    {
      id: 'senior-mri-technologist-apollo-hospitals-bengaluru',
      title: 'Senior MRI Technologist',
      hospital: 'Apollo Hospitals',
      location: 'Bengaluru',
      type: 'Full-Time',
      salary: '₹12,00,000 - ₹16,00,000 / year',
      specialization: 'MRI',
      status: 'featured',
      description: 'We are seeking a skilled and dedicated Senior MRI Technologist to join the imaging team at Apollo Hospitals in Bengaluru.',
      responsibilities: [
        'Perform high-quality MRI procedures and diagnostic imaging studies according to established protocols.',
        'Ensure patient comfort, safety, and clear communication throughout the imaging process.',
        'Collaborate closely with radiologists and clinical teams to optimize protocols and ensure diagnostic precision.',
        'Maintain and QA diagnostic equipment, reporting any technical issues promptly.',
        'Document procedure details accurately in the PACS and electronic health records (EHR).'
      ],
      requirements: [
        'Registered Radiologic Technologist with active credentials/licensure in Bengaluru or equivalent state board.',
        'Minimum 2 years of clinical experience in MRI imaging.',
        'Strong knowledge of radiation safety, patient positioning, and anatomy.',
        'Proficiency with modern PACS systems and advanced post-processing workstations.',
        'Excellent patient care, communication, and team collaboration skills.'
      ],
      benefits: [
        'Competitive compensation package (₹12,00,000 - ₹16,00,000 / year) with shift differential pay.',
        'Comprehensive healthcare, dental, and vision insurance options.',
        'Continuing education and professional development support.',
        'State-of-the-art diagnostic facilities and cutting-edge equipment.',
        'Flexible scheduling and generous paid time off.'
      ]
    },
    {
      id: 'ct-radiographer-manipal-hospital-mangaluru',
      title: 'CT Radiographer',
      hospital: 'Manipal Hospital',
      location: 'Mangaluru',
      type: 'Contract',
      salary: '₹8,00,000 - ₹11,00,000 / year',
      specialization: 'CT',
      status: 'new',
      description: 'We are seeking a skilled and dedicated CT Radiographer to join the imaging team at Manipal Hospital in Mangaluru.',
      responsibilities: [
        'Perform high-quality CT procedures and diagnostic imaging studies according to established protocols.',
        'Ensure patient comfort, safety, and clear communication throughout the imaging process.',
        'Collaborate closely with radiologists and clinical teams to optimize protocols and ensure diagnostic precision.',
        'Maintain and QA diagnostic equipment, reporting any technical issues promptly.',
        'Document procedure details accurately in the PACS and electronic health records (EHR).'
      ],
      requirements: [
        'Registered Radiologic Technologist with active credentials/licensure in Mangaluru or equivalent state board.',
        'Minimum 2 years of clinical experience in CT imaging.',
        'Strong knowledge of radiation safety, patient positioning, and anatomy.',
        'Proficiency with modern PACS systems and advanced post-processing workstations.',
        'Excellent patient care, communication, and team collaboration skills.'
      ],
      benefits: [
        'Competitive compensation package (₹8,00,000 - ₹11,00,000 / year) with shift differential pay.',
        'Comprehensive healthcare, dental, and vision insurance options.',
        'Continuing education and professional development support.',
        'State-of-the-art diagnostic facilities and cutting-edge equipment.',
        'Flexible scheduling and generous paid time off.'
      ]
    },
    {
      id: 'reporting-specialist-narayana-health-hyderabad',
      title: 'Reporting Specialist',
      hospital: 'Narayana Health',
      location: 'Hyderabad',
      type: 'Locum',
      salary: '₹4,000 / hour',
      specialization: 'Reporting',
      status: 'urgent',
      description: 'We are seeking a skilled and dedicated Reporting Specialist to join the imaging team at Narayana Health in Hyderabad.',
      responsibilities: [
        'Perform high-quality Reporting procedures and diagnostic imaging studies according to established protocols.',
        'Ensure patient comfort, safety, and clear communication throughout the imaging process.',
        'Collaborate closely with radiologists and clinical teams to optimize protocols and ensure diagnostic precision.',
        'Maintain and QA diagnostic equipment, reporting any technical issues promptly.',
        'Document procedure details accurately in the PACS and electronic health records (EHR).'
      ],
      requirements: [
        'Registered Radiologic Technologist with active credentials/licensure in Hyderabad or equivalent state board.',
        'Minimum 2 years of clinical experience in Reporting imaging.',
        'Strong knowledge of radiation safety, patient positioning, and anatomy.',
        'Proficiency with modern PACS systems and advanced post-processing workstations.',
        'Excellent patient care, communication, and team collaboration skills.'
      ],
      benefits: [
        'Competitive compensation package (₹4,000 / hour) with shift differential pay.',
        'Comprehensive healthcare, dental, and vision insurance options.',
        'Continuing education and professional development support.',
        'State-of-the-art diagnostic facilities and cutting-edge equipment.',
        'Flexible scheduling and generous paid time off.'
      ]
    }
  ];

  for (const job of initialJobs) {
    await prisma.job.create({
      data: job
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
