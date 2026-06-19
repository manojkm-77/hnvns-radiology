# HNVNS Healthcare Staffing Marketplace

Production-ready dark minimal website for HNVNS, a healthcare staffing marketplace focused on imaging, diagnostics, and verified candidate matching.

## Tech stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- Framer Motion page transitions
- Inter font via `next/font`

## Project structure

```txt
app/                  Next.js routes and global styles
components/           Reusable UI, site, section, animation, and form components
lib/                  Shared data and utility functions
providers/            Client-side providers such as Lenis
public/               Static assets, including favicon placeholder
```

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5500

## Deploy to Vercel

### Option 1 (recommended)

- Go to vercel.com → New Project → Import Git repo
- Connect the repository
- Keep the default Next.js build settings
- Deploy

### Option 2 (quick)

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Formspree setup

Both public forms use Formspree with this placeholder endpoint:

```txt
https://formspree.io/f/YOUR_ID
```

To enable real submissions:

1. Create a free Formspree account at formspree.io.
2. Create a new form in your Formspree dashboard.
3. Copy the generated endpoint, for example `https://formspree.io/f/abc123`.
4. Add it to Vercel as an environment variable:

```txt
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/abc123
```

5. Redeploy the project.

The same Formspree endpoint is used by:

- Hospitals vacancy form: `components/forms/VacancyForm.tsx`
- Candidate registration form: `components/forms/CandidateRegistrationForm.tsx`

## Customization Guide

- Update job data: `/lib/data.ts`
- Update colors: `tailwind.config.ts`
- Update copy: each `/app/*/page.tsx`
- Add real form backend: recommend Formspree (free) or EmailJS (free)

## Build and lint

Run the production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Implemented features

- Sticky navigation with transparent-to-blurred scroll state
- Home, Services, About, Insights, Contact, Jobs, Hospitals, and Candidates pages
- Hero word-by-word GSAP reveal
- CSS infinite ticker animation
- GSAP ScrollTrigger section fade-ups
- Scroll-triggered stats count-up
- Lenis smooth scrolling
- Framer Motion page transitions
- Dark minimal design with teal accents and hover border glow
- Client-side form validation and Formspree-ready submission flows
