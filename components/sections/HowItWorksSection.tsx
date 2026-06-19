import { RevealSection } from '@/components/animations/RevealSection';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { Badge } from '@/components/ui/Badge';
import { howItWorks } from '@/lib/data';

type FlowKey = keyof typeof howItWorks;

const flowOrder: FlowKey[] = ['hospitalFlow', 'candidateFlow'];

export function HowItWorksSection() {
  return (
    <RevealSection id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">How it works</p>
          <h2 className="mt-4 text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
            Two parallel flows, one accountable staffing network.
          </h2>
          <p className="mt-6 text-base leading-8 text-muted md:text-lg">
            Hospitals get a controlled path from vacancy submission to credentialed hire. Candidates get a clear path from specialty fit to placement.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {flowOrder.map((flowKey, flowIndex) => {
            const flow = howItWorks[flowKey];

            return (
              <StaggerChildren key={flowKey} delay={flowIndex * 0.12} className="rounded-[2rem] border border-border bg-surface p-6 md:p-8">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <Badge variant={flowKey === 'hospitalFlow' ? 'teal' : 'urgent'}>{flow.title}</Badge>
                    <h3 className="mt-5 text-2xl font-light tracking-[-0.04em] text-text">{flow.subtitle}</h3>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-border">{flow.steps.length} steps</span>
                </div>

                <div className="space-y-0">
                  {flow.steps.map((step) => (
                    <div key={step.title} className="flex gap-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-xs text-accent">
                        {step.number}
                      </span>
                      <div>
                        <h4 className="text-base font-medium text-text">{step.title}</h4>
                        <p className="mt-2 text-sm leading-7 text-muted">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </StaggerChildren>
            );
          })}
        </div>
      </div>
    </RevealSection>
  );
}
