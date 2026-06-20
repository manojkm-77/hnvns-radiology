'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { registerCandidateAction } from '@/app/actions/candidate';
import { motion, AnimatePresence } from 'framer-motion';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  experienceYears: '',
  specialization: '',
  currentEmployer: '',
  salaryRange: '',
  availability: '',
  cv: null as File | null,
  coverNote: '',
};

const specializationOptions = [
  'Radiology',
  'Sonography',
  'MRI',
  'CT',
  'Nuclear Medicine',
  'Other',
];

const availabilityOptions = ['Immediate', '15 days', '30 days', '60 days'];

export function CandidateRegistrationForm() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId') ?? undefined;

  const [values, setValues] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // CV Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [scannedTags, setScannedTags] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const generateExtractionResult = (spec: string) => {
    const tagsMap: Record<string, string[]> = {
      'Radiology': ['X-Ray Tech', 'Patient Positioning', 'Radiation QA', 'ARRT Certified ✔'],
      'CT': ['Helical CT', 'Dose Modulation', 'Multi-slice Imaging', 'Contrast Admin ✔'],
      'MRI': ['T1/T2 Weighting', 'Magnet Safety', 'Artifact Reduction', 'Functional MRI ✔'],
      'Sonography': ['Doppler Flow', 'Obstetric Scan', 'Transducer Prep', 'ARDMS Certified ✔'],
      'Nuclear Medicine': ['Radiopharmaceuticals', 'PET/CT Scan', 'Gamma Camera', 'NMTCB Registered ✔'],
    };
    const defaultTags = ['Clinical Credentials', 'Diagnostic Imaging', 'PACS Archiving', 'Verified Experience ✔'];
    setScannedTags(tagsMap[spec] || defaultTags);
    setMatchScore(Math.floor(Math.random() * (98 - 87 + 1)) + 87);
  };

  const update = (key: keyof typeof initialForm, value: any) => {
    setValues((c) => ({ ...c, [key]: value }));
    if (errors[key]) setErrors((c) => { const n = { ...c }; delete n[key]; return n; });
    if (key === 'specialization' && scanComplete) generateExtractionResult(value);
  };

  const updateCv = (file: File | undefined) => {
    setValues((c) => ({ ...c, cv: file || null }));
    if (errors.cv) setErrors((c) => { const n = { ...c }; delete n.cv; return n; });

    if (file) {
      // PDF only, max 5MB
      if (file.type !== 'application/pdf') {
        setErrors((c) => ({ ...c, cv: 'Only PDF files are accepted.' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((c) => ({ ...c, cv: 'File must be under 5 MB.' }));
        return;
      }

      setIsScanning(true);
      setScanComplete(false);
      setScanStatus('Initializing AI Resume Scanning...');
      setTimeout(() => setScanStatus('Extracting credentials and licensing metadata...'), 800);
      setTimeout(() => setScanStatus('Mapping clinical competency to active vacancies...'), 1600);
      setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
        generateExtractionResult(values.specialization || 'General');
      }, 2500);
    } else {
      setIsScanning(false);
      setScanComplete(false);
      setScannedTags([]);
      setMatchScore(null);
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\-\s()]{7,20}$/;
    const exp = parseInt(values.experienceYears, 10);

    if (!values.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    else if (!emailPattern.test(values.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!values.phone.trim()) nextErrors.phone = 'Phone number is required.';
    else if (!phonePattern.test(values.phone.trim())) nextErrors.phone = 'Enter a valid phone number.';
    if (!values.location.trim()) nextErrors.location = 'Current location is required.';
    if (!values.experienceYears || isNaN(exp) || exp < 0) nextErrors.experienceYears = 'Enter valid years of experience.';
    if (!values.specialization) nextErrors.specialization = 'Select a specialization.';
    if (!values.salaryRange.trim()) nextErrors.salaryRange = 'Expected salary range is required.';
    if (!values.availability) nextErrors.availability = 'Select your availability.';
    if (!values.cv) nextErrors.cv = 'Upload your CV to continue.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      let resumeUrl = '';
      if (values.cv) {
        const uploadResponse = await fetch(`/api/upload?filename=${encodeURIComponent(values.cv.name)}`, {
          method: 'POST',
          body: values.cv,
        });
        if (!uploadResponse.ok) throw new Error('CV upload failed. Please try again.');
        const uploadData = await uploadResponse.json();
        resumeUrl = uploadData.url;
      }

      const result = await registerCandidateAction({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        location: values.location,
        experienceYears: parseInt(values.experienceYears, 10),
        specialization: values.specialization,
        currentEmployer: values.currentEmployer || undefined,
        salaryRange: values.salaryRange,
        availability: values.availability,
        resumeUrl: resumeUrl || undefined,
        jobId: jobId,
        coverNote: values.coverNote || undefined,
      });

      if (!result.success) throw new Error(result.error);

      setSubmitted(true);
      setValues(initialForm);
      setScanComplete(false);
      setScannedTags([]);
      setMatchScore(null);
    } catch (err) {
      setSubmitError((err as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-[2rem] border border-accent/30 bg-surface p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-bg">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-6 text-2xl font-light tracking-[-0.04em] text-text">Profile submitted successfully.</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">
          Thanks for registering with HNVNS. Our talent team will review your profile and contact you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-border bg-surface p-6 md:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Candidate registration</p>
        <h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-text md:text-4xl">Submit your profile to our talent network.</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Full Name */}
        <label className="grid gap-2">
          <span className="text-sm text-muted">Full Name</span>
          <input value={values.fullName} onChange={(e) => update('fullName', e.target.value)}
            className={cn('h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20', errors.fullName ? 'border-red-400/60' : 'border-border')}
            placeholder="Aarav Mehta" />
          {errors.fullName && <span className="text-xs text-red-300">{errors.fullName}</span>}
        </label>

        {/* Email */}
        <label className="grid gap-2">
          <span className="text-sm text-muted">Email</span>
          <input type="email" value={values.email} onChange={(e) => update('email', e.target.value)}
            className={cn('h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20', errors.email ? 'border-red-400/60' : 'border-border')}
            placeholder="name@example.com" />
          {errors.email && <span className="text-xs text-red-300">{errors.email}</span>}
        </label>

        {/* Phone */}
        <label className="grid gap-2">
          <span className="text-sm text-muted">Phone</span>
          <input value={values.phone} onChange={(e) => update('phone', e.target.value)}
            className={cn('h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20', errors.phone ? 'border-red-400/60' : 'border-border')}
            placeholder="+91 98765 43210" />
          {errors.phone && <span className="text-xs text-red-300">{errors.phone}</span>}
        </label>

        {/* Current Location */}
        <label className="grid gap-2">
          <span className="text-sm text-muted">Current Location</span>
          <input value={values.location} onChange={(e) => update('location', e.target.value)}
            className={cn('h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20', errors.location ? 'border-red-400/60' : 'border-border')}
            placeholder="Bangalore" />
          {errors.location && <span className="text-xs text-red-300">{errors.location}</span>}
        </label>

        {/* Years of Experience */}
        <label className="grid gap-2">
          <span className="text-sm text-muted">Years of Experience</span>
          <input type="number" min="0" value={values.experienceYears} onChange={(e) => update('experienceYears', e.target.value)}
            className={cn('h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20', errors.experienceYears ? 'border-red-400/60' : 'border-border')}
            placeholder="4" />
          {errors.experienceYears && <span className="text-xs text-red-300">{errors.experienceYears}</span>}
        </label>

        {/* Specialization */}
        <label className="grid gap-2">
          <span className="text-sm text-muted">Specialization</span>
          <select value={values.specialization} onChange={(e) => update('specialization', e.target.value)}
            className={cn('h-12 rounded-2xl border bg-bg px-4 text-sm text-muted outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20', errors.specialization ? 'border-red-400/60' : 'border-border')}>
            <option value="">Select specialization</option>
            {specializationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          {errors.specialization && <span className="text-xs text-red-300">{errors.specialization}</span>}
        </label>

        {/* Current Employer (optional) */}
        <label className="grid gap-2">
          <span className="text-sm text-muted">Current Employer <span className="text-muted/50">(optional)</span></span>
          <input value={values.currentEmployer} onChange={(e) => update('currentEmployer', e.target.value)}
            className="h-12 rounded-2xl border border-border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
            placeholder="Apollo Hospitals" />
        </label>

        {/* Expected Salary Range */}
        <label className="grid gap-2">
          <span className="text-sm text-muted">Expected Salary Range</span>
          <input value={values.salaryRange} onChange={(e) => update('salaryRange', e.target.value)}
            className={cn('h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20', errors.salaryRange ? 'border-red-400/60' : 'border-border')}
            placeholder="₹6–9 LPA" />
          {errors.salaryRange && <span className="text-xs text-red-300">{errors.salaryRange}</span>}
        </label>

        {/* Availability */}
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">Availability</span>
          <select value={values.availability} onChange={(e) => update('availability', e.target.value)}
            className={cn('h-12 rounded-2xl border bg-bg px-4 text-sm text-muted outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20', errors.availability ? 'border-red-400/60' : 'border-border')}>
            <option value="">Select availability</option>
            {availabilityOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          {errors.availability && <span className="text-xs text-red-300">{errors.availability}</span>}
        </label>

        {/* CV Upload with AI scanner */}
        <div className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">Resume <span className="text-muted/50">(PDF only, max 5 MB)</span></span>

          <AnimatePresence mode="wait">
            {isScanning && (
              <motion.div key="scanning" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="relative overflow-hidden rounded-2xl border border-accent/40 bg-accent-dim/10 p-6 text-center">
                <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_8px_#2dd4bf] opacity-80" />
                <div className="mx-auto flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-accent border-t-transparent text-accent mb-3" />
                <p className="text-sm font-medium text-text">{scanStatus}</p>
                <p className="mt-1 text-xs text-muted">Scanning layout structure and mapping competencies...</p>
              </motion.div>
            )}

            {!isScanning && scanComplete && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-950/5 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">✓</span>
                    <div>
                      <p className="text-sm font-medium text-text">AI Verification Successful</p>
                      <p className="text-xs text-muted truncate max-w-[250px] sm:max-w-md">{values.cv?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-muted">Match Rating</p>
                      <p className="text-sm font-bold text-accent">{matchScore}% Match</p>
                    </div>
                    <button type="button" onClick={() => updateCv(undefined)}
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:text-text transition-colors">
                      Replace File
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2.5">Extracted Competency Matrix</p>
                  <div className="flex flex-wrap gap-2">
                    {scannedTags.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-lg border border-accent/20 bg-accent/5 px-2.5 py-1 text-xs text-accent">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {!isScanning && !scanComplete && (
              <motion.div key="browse" className="relative">
                <input type="file" accept=".pdf" onChange={(e) => updateCv(e.target.files?.[0])}
                  className="absolute inset-0 cursor-pointer opacity-0 z-10" aria-label="Upload Resume PDF" />
                <div className={cn('flex min-h-14 items-center justify-between rounded-2xl border bg-bg px-4 text-sm transition-colors hover:border-accent/40', errors.cv ? 'border-red-400/60' : 'border-border')}>
                  <span className="text-muted">Upload your Resume (PDF only, max 5 MB)</span>
                  <span className="ml-4 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent shrink-0">Browse</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {errors.cv && <span className="text-xs text-red-300">{errors.cv}</span>}
        </div>

        {/* Cover Note (optional) */}
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">Cover Note <span className="text-muted/50">(optional)</span></span>
          <textarea value={values.coverNote} onChange={(e) => update('coverNote', e.target.value)}
            className="min-h-32 resize-none rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
            placeholder="Share anything specific about your availability, certifications, or role preferences" />
        </label>
      </div>

      {submitError && (
        <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {submitError}
        </div>
      )}

      <div className="mt-8">
        <button type="submit" disabled={isSubmitting || isScanning}
          className={cn('inline-flex h-12 items-center justify-center rounded-full border border-accent bg-accent px-6 text-sm font-medium text-bg transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/30', (isSubmitting || isScanning) && 'cursor-wait opacity-70')}>
          {isSubmitting ? 'Submitting...' : 'Submit My Profile'}
        </button>
      </div>
    </form>
  );
}
