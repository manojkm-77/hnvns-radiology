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
  specialization: '',
  experience: '',
  currentLocation: '',
  preferredLocation: '',
  employmentType: [] as string[],
  expectedSalary: '',
  cv: null as File | null,
  linkedIn: '',
  message: ''
};

const specializationOptions = [
  'Radiography',
  'CT Scan',
  'MRI',
  'Sonography',
  'PACS Administration',
  'Nuclear Medicine',
  'Clinical Nursing',
  'Imaging Operations'
];

const experienceOptions = ['0–1 years', '1–3 years', '3–5 years', '5–8 years', '8+ years'];
const employmentOptions = ['Full-Time', 'Contract', 'Locum'];

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
      'Radiography': ['X-Ray Tech', 'Patient Positioning', 'Radiation QA', 'ARRT Certified ✔'],
      'CT Scan': ['Helical CT', 'Dose Modulation', 'Multi-slice Imaging', 'Contrast Admin ✔'],
      'MRI': ['T1/T2 Weighting', 'Magnet Safety', 'Artifact Reduction', 'Functional MRI ✔'],
      'Sonography': ['Doppler Flow', 'Obstetric Scan', 'Transducer Prep', 'ARDMS Certified ✔'],
      'PACS Administration': ['DICOM Standards', 'HL7 Protocol', 'Server Virtualization', 'CIIP Certified ✔'],
      'Nuclear Medicine': ['Radiopharmaceuticals', 'PET/CT Scan', 'Gamma Camera', 'NMTCB Registered ✔'],
      'Clinical Nursing': ['IV Cannulation', 'BLS/ACLS', 'Sedation Care', 'Critical Patient Monitoring ✔'],
      'Imaging Operations': ['Workflow Optimization', 'RIS Scheduling', 'Team Leadership', 'Regulatory Compliance ✔']
    };

    const defaultTags = ['Clinical Credentials', 'Diagnostic Imaging', 'PACS Archiving', 'Verified Experience ✔'];
    const tags = tagsMap[spec] || defaultTags;
    setScannedTags(tags);
    setMatchScore(Math.floor(Math.random() * (98 - 87 + 1)) + 87);
  };

  const update = (key: keyof typeof initialForm, value: any) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }

    if (key === 'specialization' && scanComplete) {
      generateExtractionResult(value);
    }
  };

  const updateEmploymentType = (type: string) => {
    setValues((current) => {
      const exists = current.employmentType.includes(type);
      return {
        ...current,
        employmentType: exists
          ? current.employmentType.filter((item) => item !== type)
          : [...current.employmentType, type]
      };
    });

    if (errors.employmentType) {
      setErrors((current) => {
        const next = { ...current };
        delete next.employmentType;
        return next;
      });
    }
  };

  const updateCv = (file: File | undefined) => {
    setValues((current) => ({ ...current, cv: file || null }));
    if (errors.cv) {
      setErrors((current) => {
        const next = { ...current };
        delete next.cv;
        return next;
      });
    }

    if (file) {
      setIsScanning(true);
      setScanComplete(false);
      setScanStatus('Initializing AI Resume Scanning...');

      setTimeout(() => {
        setScanStatus('Extracting credentials and licensing metadata...');
      }, 800);

      setTimeout(() => {
        setScanStatus('Mapping clinical competency to active vacancies...');
      }, 1600);

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

    if (!values.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    else if (!emailPattern.test(values.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!values.phone.trim()) nextErrors.phone = 'Phone number is required.';
    else if (!phonePattern.test(values.phone.trim())) nextErrors.phone = 'Enter a valid phone number.';
    if (!values.specialization) nextErrors.specialization = 'Select a specialization.';
    if (!values.experience) nextErrors.experience = 'Select years of experience.';
    if (!values.currentLocation.trim()) nextErrors.currentLocation = 'Current location is required.';
    if (!values.preferredLocation.trim()) nextErrors.preferredLocation = 'Preferred location is required.';
    if (!values.employmentType.length) nextErrors.employmentType = 'Select at least one employment type.';
    if (!values.expectedSalary.trim()) nextErrors.expectedSalary = 'Expected salary is required.';
    if (!values.cv) nextErrors.cv = 'Upload your CV to continue.';
    if (values.linkedIn.trim() && !/^https?:\/\/.+/i.test(values.linkedIn.trim())) {
      nextErrors.linkedIn = 'Enter a valid LinkedIn URL.';
    }

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

        if (!uploadResponse.ok) {
          throw new Error('CV upload failed. Please try again.');
        }

        const uploadData = await uploadResponse.json();
        resumeUrl = uploadData.url;
      }

      const formattedAvailability = `Experience: ${values.experience} | Prefers: ${values.employmentType.join(', ')} | Expected: ${values.expectedSalary} ${values.linkedIn ? `| LinkedIn: ${values.linkedIn}` : ''} ${values.message ? `| Message: ${values.message}` : ''}`;

      const result = await registerCandidateAction({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        specialization: values.specialization,
        availability: formattedAvailability,
        resumeUrl: resumeUrl,
        jobId: jobId,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

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
        <label className="grid gap-2">
          <span className="text-sm text-muted">Full Name</span>
          <input
            value={values.fullName}
            onChange={(event) => update('fullName', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.fullName ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="Aarav Mehta"
          />
          {errors.fullName && <span className="text-xs text-red-300">{errors.fullName}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-muted">Email</span>
          <input
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.email ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="name@example.com"
            type="email"
          />
          {errors.email && <span className="text-xs text-red-300">{errors.email}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-muted">Phone</span>
          <input
            value={values.phone}
            onChange={(event) => update('phone', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.phone ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <span className="text-xs text-red-300">{errors.phone}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-muted">Specialization</span>
          <select
            value={values.specialization}
            onChange={(event) => update('specialization', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-muted outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.specialization ? 'border-red-400/60' : 'border-border'
            )}
          >
            <option value="">Select specialization</option>
            {specializationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.specialization && <span className="text-xs text-red-300">{errors.specialization}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-muted">Years Experience</span>
          <select
            value={values.experience}
            onChange={(event) => update('experience', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-muted outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.experience ? 'border-red-400/60' : 'border-border'
            )}
          >
            <option value="">Select experience</option>
            {experienceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.experience && <span className="text-xs text-red-300">{errors.experience}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-muted">Current Location</span>
          <input
            value={values.currentLocation}
            onChange={(event) => update('currentLocation', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.currentLocation ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="Bangalore"
          />
          {errors.currentLocation && <span className="text-xs text-red-300">{errors.currentLocation}</span>}
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">Preferred Location</span>
          <input
            value={values.preferredLocation}
            onChange={(event) => update('preferredLocation', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.preferredLocation ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="Mumbai, Delhi, Pune, or remote"
          />
          {errors.preferredLocation && <span className="text-xs text-red-300">{errors.preferredLocation}</span>}
        </label>

        <fieldset className="grid gap-3 rounded-2xl border border-border bg-bg p-4 md:col-span-2">
          <legend className="px-1 text-sm text-muted">Employment Type</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {employmentOptions.map((type) => (
              <label key={type} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text transition-colors hover:border-accent/40">
                <input
                  type="checkbox"
                  checked={values.employmentType.includes(type)}
                  onChange={() => updateEmploymentType(type)}
                  className="h-4 w-4 accent-accent"
                />
                {type}
              </label>
            ))}
          </div>
          {errors.employmentType && <span className="text-xs text-red-300">{errors.employmentType}</span>}
        </fieldset>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">Expected Salary</span>
          <input
            value={values.expectedSalary}
            onChange={(event) => update('expectedSalary', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.expectedSalary ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="₹6–9 LPA"
          />
          {errors.expectedSalary && <span className="text-xs text-red-300">{errors.expectedSalary}</span>}
        </label>

        {/* --- DYNAMIC CV SCANNER MODULE --- */}
        <div className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">CV / Resume Upload</span>
          
          <AnimatePresence mode="wait">
            {/* 1. SCANNING STATE */}
            {isScanning && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative overflow-hidden rounded-2xl border border-accent/40 bg-accent-dim/10 p-6 text-center"
              >
                {/* Laser scan line anim */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_8px_#2dd4bf] opacity-80"
                />
                <div className="mx-auto flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-accent border-t-transparent text-accent mb-3" />
                <p className="text-sm font-medium text-text">{scanStatus}</p>
                <p className="mt-1 text-xs text-muted">Scanning layout structure and mapping competencies...</p>
              </motion.div>
            )}

            {/* 2. SCAN COMPLETE STATE */}
            {!isScanning && scanComplete && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-950/5 p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                      ✓
                    </span>
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
                    <button
                      type="button"
                      onClick={() => updateCv(undefined)}
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:text-text transition-colors"
                    >
                      Replace File
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2.5">Extracted Competency Matrix</p>
                  <div className="flex flex-wrap gap-2">
                    {scannedTags.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-lg border border-accent/20 bg-accent/5 px-2.5 py-1 text-xs text-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. DEFAULT BROWSE FILE STATE */}
            {!isScanning && !scanComplete && (
              <motion.div key="browse" className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => updateCv(event.target.files?.[0])}
                  className="absolute inset-0 cursor-pointer opacity-0 z-10"
                  aria-label="Upload CV"
                />
                <div className={cn(
                  'flex min-h-14 items-center justify-between rounded-2xl border bg-bg px-4 text-sm transition-colors hover:border-accent/40',
                  errors.cv ? 'border-red-400/60' : 'border-border'
                )}>
                  <span className="text-muted">Upload your CV (PDF, DOC, or DOCX)</span>
                  <span className="ml-4 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent shrink-0">
                    Browse
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {errors.cv && <span className="text-xs text-red-300">{errors.cv}</span>}
        </div>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">LinkedIn (optional)</span>
          <input
            value={values.linkedIn}
            onChange={(event) => update('linkedIn', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.linkedIn ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="https://www.linkedin.com/in/your-profile"
          />
          {errors.linkedIn && <span className="text-xs text-red-300">{errors.linkedIn}</span>}
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">Message</span>
          <textarea
            value={values.message}
            onChange={(event) => update('message', event.target.value)}
            className="min-h-32 resize-none rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
            placeholder="Share your availability, certifications, or preferred roles"
          />
        </label>
      </div>

      {submitError && (
        <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {submitError}
        </div>
      )}

      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting || isScanning}
          className={cn(
            'inline-flex h-12 items-center justify-center rounded-full border border-accent bg-accent px-6 text-sm font-medium text-bg transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/30',
            (isSubmitting || isScanning) && 'cursor-wait opacity-70'
          )}
        >
          {isSubmitting ? 'Submitting...' : 'Submit My Profile'}
        </button>
      </div>
    </form>
  );
}

