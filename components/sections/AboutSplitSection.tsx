import { RevealSection } from '@/components/animations/RevealSection';

const bullets = [
  'Radiologist-led AI validation and continuous quality review',
  'HIPAA-ready workflows for imaging data, reporting, and integrations',
  'Multi-site PACS, RIS, EHR, and research pipeline connectivity',
  'Transparent reporting standards with measurable turnaround and accuracy'
];

export function AboutSplitSection() {
  return (
    <RevealSection id="about" className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">About HNVNS</p>
          <h2 className="mt-4 text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
            Full-stack radiology built around precision, speed, and trust.
          </h2>
          <p className="mt-6 text-base leading-8 text-muted md:text-lg">
            HNVNS connects imaging operations, AI-assisted diagnostics, and structured reporting into a single platform for healthcare teams that cannot afford ambiguity.
          </p>
          <p className="mt-6 text-base leading-8 text-muted md:text-lg">
            We help hospitals, clinics, and research teams standardize imaging workflows, prioritize urgent findings, and deliver clear reports that move care forward.
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-surface p-8">
          <ul className="space-y-6">
            {bullets.map((bullet) => (
              <li key={bullet} className="rounded-2xl border-l-2 border-accent bg-bg/40 p-5 text-sm leading-7 text-muted">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RevealSection>
  );
}
