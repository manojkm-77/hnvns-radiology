import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { hasRequiredEnv } from '@/lib/env';
import { escapeHtml } from '@/lib/html';
import { RevealSection } from '@/components/animations/RevealSection';

// Static fallback articles — used when DB is unavailable or article is not in DB yet
const staticArticles = [
  {
    slug: 'ai-matching-reduces-time-to-hire',
    title: 'How AI matching reduces time-to-hire without losing clinical judgement',
    excerpt:
      'A practical look at how specialty-fit scoring can surface the right candidate in hours, not weeks.',
    body: `Finding the right imaging specialist used to mean weeks of back-and-forth: sourcing CVs, verifying licenses, scheduling interviews, and waiting on HR approvals. AI-assisted matching compresses that timeline dramatically — but the value only holds if clinical precision isn't sacrificed in the process.

**How specialty-fit scoring works**

The core idea is straightforward: instead of ranking candidates by recency of application or keyword overlap, specialty-fit models score candidates on a combination of modality expertise, license status, location preference, and shift compatibility. When a hospital posts a Senior MRI Technologist role in Bengaluru, the system doesn't return every candidate who has typed "MRI" somewhere in their profile — it surfaces candidates whose primary modality is MRI, whose license is active and verified in Karnataka, and whose preferred employment type matches the posted role.

**Where human judgement still matters**

Scoring can surface the right candidates faster, but it cannot replace the clinical context a hiring manager brings to an interview. An AI system can confirm that a candidate holds an ARRT credential and has six years of MRI experience — it cannot assess whether their communication style fits a high-pressure trauma imaging environment or whether their career goals align with the department's direction.

The right model is AI for shortlisting, humans for selection. Shortlists delivered in under 18 hours mean hiring teams spend their energy on the final decision, not on the search itself.

**What hospitals see in practice**

Across the HNVNS network, hospitals using AI-ranked shortlists report an average time-to-first-interview of under 24 hours for standard roles, and under 6 hours for urgent or locum coverage needs. The credential verification step — which used to add 3–5 days — is completed before the shortlist is delivered, so hiring teams are evaluating verified candidates from the first interaction.`,
    author: 'HNVNS Editorial',
    category: 'Staffing',
    publishedAt: new Date('2026-06-12'),
  },
  {
    slug: 'hospitals-miss-credential-verification',
    title: 'What hospitals miss when they skip credential verification in healthcare hires',
    excerpt:
      'The credential gaps that cause the most costly mis-hires in clinical staffing programs.',
    body: `Credential verification is one of those steps that feels like administrative overhead — until it isn't. The cases that cause the most disruption aren't dramatic fraud; they are quiet gaps: an expired license that wasn't caught, a certification that lapsed during a career break, or a modality qualification that was assumed rather than confirmed.

**The three most common gaps**

The first is license currency. Many imaging professionals hold licenses in multiple states or regions — but not all of them are active at all times. A candidate who was licensed in Maharashtra two years ago may not have renewed when they relocated. Standard resume screening doesn't catch this.

The second is certification scope. There's a meaningful difference between a radiographer with a general X-ray certification and one with active MRI-specific certification. When departments are under pressure and hiring quickly, this distinction often gets glossed over in the interview process.

The third is employment gap documentation. A candidate who has been out of clinical practice for 18 months due to personal leave or a non-clinical role may have skills that need refreshing. This isn't a disqualifier — but it's information a hiring manager needs before placement.

**What verified shortlists change**

When credential verification is completed before the shortlist is delivered — not after an offer is made — the downstream risk disappears. Hiring teams can move faster precisely because they don't need to build verification time into their own process. The HNVNS verification layer checks license currency, primary-source certification validation, and employment history before any candidate appears on a hospital shortlist.`,
    author: 'HNVNS Editorial',
    category: 'Compliance',
    publishedAt: new Date('2026-05-28'),
  },
  {
    slug: 'build-candidate-profile-shortlisted',
    title: 'How to build a candidate profile that gets shortlisted',
    excerpt: 'Practical steps for specialty professionals to improve their match scores on HNVNS.',
    body: `Your profile is the primary input to how HNVNS matches you to open roles. The more precisely it reflects your actual clinical strengths, the better the match quality — for you and for the hospitals reviewing your profile.

**Lead with your primary modality**

Generalist descriptions reduce match precision. If you work across CT, X-ray, and MRI but your primary strength is CT, say so explicitly. The matching engine weights your stated specialization heavily, and roles that need a CT specialist won't prioritise a profile that lists five modalities without indicating depth.

**Keep your license status current**

An expired or unconfirmed license drops your match score significantly for roles that require active credentials. Upload your current license document and make sure the expiry date is accurately reflected. Profiles with verified, in-date licenses appear at the top of shortlists for high-urgency roles.

**Be specific about location and shift preferences**

Vague location preferences — "anywhere in India" — don't help matching algorithms or hiring managers. If you're open to Bengaluru, Chennai, and Hyderabad but not Delhi, say exactly that. If you prefer day shifts but can take on-call, note it. The more precise your preferences, the less time gets wasted on roles that won't work for you.

**Use the availability field strategically**

If you're currently employed and available from a specific date, say so. If you're on immediate notice, say so. Hospitals filling urgent locum slots prioritise candidates who can start quickly — a profile that clearly signals "available immediately" will appear in urgent shortlists that a vague profile will not.

**Upload your CV — it matters**

Profiles without an uploaded CV are deprioritised for most shortlists. Your CV is the document the hospital HR team will review before reaching out. A clean, up-to-date CV that matches what's in your profile (same employer history, same certifications) removes friction and builds trust.`,
    author: 'HNVNS Editorial',
    category: 'Candidate Guide',
    publishedAt: new Date('2026-05-09'),
  },
];

type Props = {
  params: { slug: string };
};

async function getArticle(slug: string) {
  // Try DB first
  if (hasRequiredEnv('DATABASE_URL')) {
    try {
      const post = await prisma.insightPost.findUnique({ where: { slug } });
      if (post) return post;
    } catch (err) {
      console.warn('InsightPost DB lookup failed, falling back to static:', err);
    }
  }
  // Fall back to static
  return staticArticles.find((a) => a.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return staticArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Article Not Found | HNVNS' };
  return {
    title: `${article.title} | HNVNS Insights`,
    description: article.excerpt,
  };
}

export default async function InsightDetailPage({ params }: Props) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const publishedDate = new Date(article.publishedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Convert simple markdown-ish body to paragraphs (bold + paragraphs only)
  const paragraphs = article.body
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="animate-page-fade min-h-screen bg-bg pt-32 pb-24 md:pt-40">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        {/* Back link */}
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-accent transition-colors mb-10"
        >
          ← Back to Insights
        </Link>

        <RevealSection>
          {/* Meta */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">
              {article.category}
            </span>
            <span className="text-xs text-muted">{publishedDate}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-light tracking-[-0.05em] text-text md:text-5xl leading-tight">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="mt-6 text-lg leading-8 text-muted font-light">
            {article.excerpt}
          </p>

          {/* Author line */}
          <div className="mt-6 flex items-center gap-3 border-b border-border pb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-semibold shrink-0">
              {article.author.charAt(0)}
            </div>
            <span className="text-sm text-muted">{article.author}</span>
          </div>

          {/* Body */}
          <div className="mt-10 space-y-6">
            {paragraphs.map((para, i) => {
              // Headings: lines starting with **text** alone on a line
              const headingMatch = para.match(/^\*\*(.+)\*\*$/);
              if (headingMatch) {
                const headingText = escapeHtml(headingMatch[1]);
                return (
                  <h2
                    key={i}
                    className="text-xl font-medium tracking-[-0.03em] text-text pt-4"
                    dangerouslySetInnerHTML={{ __html: headingText }}
                  />
                );
              }

              // Regular paragraph — escape first, then apply inline bold
              const safe = escapeHtml(para);
              const rendered = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
              return (
                <p
                  key={i}
                  className="text-base leading-8 text-muted"
                  dangerouslySetInnerHTML={{ __html: rendered }}
                />
              );
            })}
          </div>

          {/* Footer CTA */}
          <div className="mt-16 rounded-[2rem] border border-border bg-surface p-8 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-semibold">HNVNS</p>
            <h3 className="mt-3 text-2xl font-light tracking-[-0.04em] text-text">
              Ready to work with a verified staffing partner?
            </h3>
            <p className="mt-3 text-sm text-muted max-w-md mx-auto">
              Whether you are hiring or looking for your next role, HNVNS connects imaging professionals with the right opportunities.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/hospitals"
                className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors"
              >
                Post a Vacancy
              </Link>
              <Link
                href="/candidates"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-surface px-6 text-sm font-medium text-text hover:border-accent/40 transition-colors"
              >
                Register as Candidate
              </Link>
            </div>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}
