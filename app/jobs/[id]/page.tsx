import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { jobs as staticJobs } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RevealSection } from '@/components/animations/RevealSection';
import { hasRequiredEnv } from '@/lib/env';

type Props = {
  params: {
    id: string;
  };
};

function formatRelativeTime(dateInput: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - dateInput.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }
}

async function getJobById(id: string) {
  if (!hasRequiredEnv('DATABASE_URL')) {
    return staticJobs.find((j) => j.id === id) || null;
  }

  try {
    const dbJob = await prisma.job.findUnique({
      where: { id },
    });
    if (dbJob) {
      return {
        ...dbJob,
        postedAt: formatRelativeTime(new Date(dbJob.postedAt)),
      };
    }
  } catch (error) {
    console.warn('Database findUnique failed, falling back to static jobs:', error);
  }
  return staticJobs.find((j) => j.id === id) || null;
}

export async function generateStaticParams() {
  if (!hasRequiredEnv('DATABASE_URL')) {
    return staticJobs.map((job) => ({
      id: job.id,
    }));
  }

  try {
    const dbJobs = await prisma.job.findMany({
      select: { id: true }
    });
    if (dbJobs.length > 0) {
      return dbJobs.map((job) => ({
        id: job.id,
      }));
    }
  } catch (error) {
    console.warn('generateStaticParams fallback:', error);
  }
  return staticJobs.map((job) => ({
    id: job.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobById(params.id);
  if (!job) {
    return {
      title: 'Job Not Found | HNVNS',
    };
  }
  return {
    title: `${job.title} at ${job.hospital} | HNVNS`,
    description: `Apply for ${job.title} (${job.type}) in ${job.location} with ${job.hospital}. Specialization: ${job.specialization}.`,
  };
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJobById(params.id);
  if (!job) {
    notFound();
  }

  // Pre-generate some mock content for a rich, wow-factor user experience
  const responsibilities = [
    `Perform high-quality ${job.specialization} procedures and diagnostic imaging studies according to established protocols.`,
    'Ensure patient comfort, safety, and clear communication throughout the imaging process.',
    'Collaborate closely with radiologists and clinical teams to optimize protocols and ensure diagnostic precision.',
    'Maintain and QA diagnostic equipment, reporting any technical issues promptly.',
    'Document procedure details accurately in the PACS and electronic health records (EHR).',
  ];

  const requirements = [
    `Registered Radiologic Technologist with active credentials/licensure in ${job.location} or equivalent state board.`,
    `Minimum 2 years of clinical experience in ${job.specialization} imaging.`,
    'Strong knowledge of radiation safety, patient positioning, and anatomy.',
    'Proficiency with modern PACS systems and advanced post-processing workstations.',
    'Excellent patient care, communication, and team collaboration skills.',
  ];

  const benefits = [
    `Competitive compensation package (${job.salary}) with shift differential pay.`,
    'Comprehensive healthcare, dental, and vision insurance options.',
    'Continuing education and professional development support.',
    'State-of-the-art diagnostic facilities and cutting-edge equipment.',
    'Flexible scheduling and generous paid time off.',
  ];

  const statusLabels = {
    featured: 'Featured',
    urgent: 'Urgent',
    new: 'New',
    open: 'Open'
  };

  return (
    <div className="animate-page-fade min-h-screen bg-bg pt-32 pb-24 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs text-muted">
            <li>
              <Link href="/jobs" className="hover:text-accent transition-colors">
                Jobs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-text font-medium truncate max-w-[200px] md:max-w-xs">
              {job.title}
            </li>
          </ol>
        </nav>

        {/* Job Header Info */}
        <RevealSection className="border-b border-border pb-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={job.status === 'open' ? 'teal' : (job.status as any)}>{statusLabels[job.status as keyof typeof statusLabels] || 'Open'}</Badge>
                <span className="text-xs text-muted">Posted {job.postedAt === 'Urgent' || job.postedAt === 'New' || job.postedAt === 'Open' ? 'recently' : job.postedAt}</span>
              </div>
              <h1 className="mt-5 text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
                {job.title}
              </h1>
              <p className="mt-3 text-lg text-muted">
                {job.hospital} · <span className="text-text">{job.location}</span>
              </p>
            </div>
            
            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="rounded-2xl border border-border bg-surface p-4 text-center md:text-left">
                <p className="text-xs text-muted">Compensation</p>
                <p className="mt-1 text-lg font-medium text-accent">{job.salary}</p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4 text-center md:text-left">
                <p className="text-xs text-muted">Employment Type</p>
                <span className="mt-2 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  {job.type}
                </span>
              </div>
            </div>
          </div>
        </RevealSection>

        {/* Two Column Layout */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-light tracking-[-0.04em] text-text">Role Overview</h2>
              <p className="text-base leading-8 text-muted">
                We are seeking a skilled and dedicated {job.title} to join the imaging team at {job.hospital} in {job.location}. In this role, you will be responsible for executing high-quality diagnostics under our patient-centric care protocols. As part of our clinical network, you will work with advanced modalities and collaborate with board-certified radiologists to support rapid, accurate clinical decisions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-light tracking-[-0.04em] text-text">Key Responsibilities</h2>
              <ul className="list-inside list-disc space-y-3 text-base leading-7 text-muted">
                {responsibilities.map((item, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="text-text">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-light tracking-[-0.04em] text-text">Qualifications & Credentials</h2>
              <ul className="list-inside list-disc space-y-3 text-base leading-7 text-muted">
                {requirements.map((item, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="text-text">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-light tracking-[-0.04em] text-text">Compensation & Benefits</h2>
              <ul className="list-inside list-disc space-y-3 text-base leading-7 text-muted">
                {benefits.map((item, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="text-text">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-surface p-7 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-light tracking-[-0.03em] text-text">Interested in this role?</h3>
                <p className="text-sm text-muted">
                  Submit your candidate registration to get fast-tracked for this role.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button href={`/candidates?jobId=${job.id}`} className="w-full justify-center">
                  Apply via HNVNS
                </Button>
                <Button href="/contact" variant="outline" className="w-full justify-center">
                  Inquire about role
                </Button>
              </div>

              <div className="border-t border-border pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-2 w-2 rounded-full bg-accent" />
                  <p className="text-xs leading-5 text-muted">
                    <strong className="text-text">Credential-verified:</strong> Active license and primary-source credential verification check completed before interviews.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-2 w-2 rounded-full bg-accent" />
                  <p className="text-xs leading-5 text-muted">
                    <strong className="text-text">Direct HR contact:</strong> Your application matches directly with the hiring team at {job.hospital}.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border p-7 space-y-4 text-center">
              <h4 className="text-sm font-medium text-text">Need assistance?</h4>
              <p className="text-xs leading-5 text-muted">
                Our operations coordinators are available to answer credentialing, scheduling, or contract questions.
              </p>
              <Button href="/contact" variant="ghost" className="text-xs">
                Contact Staffing Support →
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
