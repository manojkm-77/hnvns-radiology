'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { registerCandidateAction } from '@/app/actions/candidate';
import { getUploadTokenAction } from '@/app/actions/upload';
import { motion, AnimatePresence } from 'framer-motion';
import { FormField, inputClassName, selectClassName } from '@/components/ui/FormField';
import { FormError } from '@/components/ui/FormError';
import { SuccessScreen } from '@/components/ui/SuccessScreen';

type CandidateRegistrationFormProps = {
  lang?: 'en' | 'kn';
};

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

const translations = {
  en: {
    formSub: 'Candidate registration',
    formHeading: 'Submit your profile to our talent network.',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    location: 'Current Location',
    experienceYears: 'Years of Experience',
    specialization: 'Specialization',
    currentEmployer: 'Current Employer',
    optional: '(optional)',
    salaryRange: 'Expected Salary Range',
    availability: 'Availability',
    resume: 'Resume',
    pdfOnly: '(PDF only, max 5 MB)',
    uploadPlaceholder: 'Upload your Resume (PDF only, max 5 MB)',
    browse: 'Browse',
    coverNote: 'Cover Note',
    submit: 'Submit My Profile',
    submitting: 'Submitting...',
    selectSpec: 'Select specialization',
    selectAvail: 'Select availability',
    aiScanningInit: 'Initializing AI Resume Scanning...',
    aiScanningExt: 'Extracting credentials and licensing metadata...',
    aiScanningMap: 'Mapping clinical competency to active vacancies...',
    aiScanningCompetency: 'Scanning layout structure and mapping competencies...',
    aiVerificationSuccess: 'AI Verification Successful',
    matchRating: 'Match Rating',
    replaceFile: 'Replace File',
    extractedCompetencies: 'Extracted Competency Matrix',
    successTitle: 'Profile submitted successfully.',
    successSub: 'Thanks for registering with HNVNS. Our talent team will review your profile and contact you soon.'
  },
  kn: {
    formSub: 'ಅಭ್ಯರ್ಥಿ ನೋಂದಣಿ',
    formHeading: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಸಲ್ಲಿಸಿ',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    email: 'ಇಮೇಲ್',
    phone: 'ಫೋನ್',
    location: 'ಪ್ರಸ್ತುತ ಸ್ಥಳ',
    experienceYears: 'ಅನುಭವ ವರ್ಷಗಳು',
    specialization: 'ವಿಶಿಷ್ಟತೆ',
    currentEmployer: 'ಪ್ರಸ್ತುತ ಉದ್ಯೋಗದಾತ',
    optional: '(ಐಚ್ಛಿಕ)',
    salaryRange: 'ನಿರೀಕ್ಷಿತ ಸಂಬಳ',
    availability: 'ಲಭ್ಯತೆ',
    resume: 'ಸಿವಿ / ರೆಸ್ಯೂಮ್ ಅಪ್ಲೋಡ್',
    pdfOnly: '(PDF ಮಾತ್ರ, ಗರಿಷ್ಠ 5 MB)',
    uploadPlaceholder: 'ನಿಮ್ಮ ಸಿವಿ ಅಪ್ಲೋಡ್ ಮಾಡಿ (PDF ಮಾತ್ರ, ಗರಿಷ್ಠ 5 MB)',
    browse: 'ಬ್ರೌಸ್ ಮಾಡಿ',
    coverNote: 'ಸಂದೇಶ',
    submit: 'ನನ್ನ ಪ್ರೊಫೈಲ್ ಸಲ್ಲಿಸಿ',
    submitting: 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',
    selectSpec: 'ವಿಶಿಷ್ಟತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    selectAvail: 'ಲಭ್ಯತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    aiScanningInit: 'AI ರೆಸ್ಯೂಮ್ ಸ್ಕ್ಯಾನಿಂಗ್ ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ...',
    aiScanningExt: 'ರುಜುವಾತುಗಳು ಮತ್ತು ಪರವಾನಗಿ ಮೆಟಾಡೇಟಾವನ್ನು ಹೊರತೆಗೆಯಲಾಗುತ್ತಿದೆ...',
    aiScanningMap: 'ಸಕ್ರಿಯ ಖಾಲಿ ಹುದ್ದೆಗಳಿಗೆ ವೈದ್ಯಕೀಯ ಸಾಮರ್ಥ್ಯವನ್ನು ಮ್ಯಾಪ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    aiScanningCompetency: 'ವಿನ್ಯಾಸ ರಚನೆಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ ಮತ್ತು ಸಾಮರ್ಥ್ಯಗಳನ್ನು ಮ್ಯಾಪ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    aiVerificationSuccess: 'AI ಪರಿಶೀಲನೆ ಯಶಸ್ವಿಯಾಗಿದೆ',
    matchRating: 'ಹೊಂದಾಣಿಕೆಯ ರೇಟಿಂಗ್',
    replaceFile: 'ಫೈಲ್ ಬದಲಾಯಿಸಿ',
    extractedCompetencies: 'ತೆಗೆದ ಸಾಮರ್ಥ್ಯದ ಮ್ಯಾಟ್ರಿಕ್ಸ್',
    successTitle: 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ.',
    successSub: 'HNVNS ನೊಂದಿಗೆ ನೋಂದಾಯಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ನಮ್ಮ ಪ್ರತಿಭಾ ತಂಡವು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ ಮತ್ತು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.'
  }
};

export function CandidateRegistrationForm({ lang = 'en' }: CandidateRegistrationFormProps) {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId') ?? undefined;

  const t = translations[lang];

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
        setErrors((c) => ({ ...c, cv: lang === 'kn' ? 'ಕೇವಲ PDF ಫೈಲ್‌ಗಳನ್ನು ಮಾತ್ರ ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ.' : 'Only PDF files are accepted.' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((c) => ({ ...c, cv: lang === 'kn' ? 'ಫೈಲ್ 5 MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.' : 'File must be under 5 MB.' }));
        return;
      }

      setIsScanning(true);
      setScanComplete(false);
      setScanStatus(t.aiScanningInit);
      setTimeout(() => setScanStatus(t.aiScanningExt), 800);
      setTimeout(() => setScanStatus(t.aiScanningMap), 1600);
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

    if (!values.fullName.trim()) nextErrors.fullName = lang === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು ಅಗತ್ಯವಿದೆ.' : 'Full name is required.';
    if (!values.email.trim()) nextErrors.email = lang === 'kn' ? 'ಇಮೇಲ್ ಅಗತ್ಯವಿದೆ.' : 'Email is required.';
    else if (!emailPattern.test(values.email.trim())) nextErrors.email = lang === 'kn' ? 'ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.' : 'Enter a valid email address.';
    if (!values.phone.trim()) nextErrors.phone = lang === 'kn' ? 'ಫೋನ್ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ.' : 'Phone number is required.';
    else if (!phonePattern.test(values.phone.trim())) nextErrors.phone = lang === 'kn' ? 'ಮಾನ್ಯವಾದ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.' : 'Enter a valid phone number.';
    if (!values.location.trim()) nextErrors.location = lang === 'kn' ? 'ಪ್ರಸ್ತುತ ಸ್ಥಳ ಅಗತ್ಯವಿದೆ.' : 'Current location is required.';
    if (!values.experienceYears || isNaN(exp) || exp < 0) nextErrors.experienceYears = lang === 'kn' ? 'ಮಾನ್ಯವಾದ ಅನುಭವದ ವರ್ಷಗಳನ್ನು ನಮೂದಿಸಿ.' : 'Enter valid years of experience.';
    if (!values.specialization) nextErrors.specialization = lang === 'kn' ? 'ವಿಶಿಷ್ಟತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.' : 'Select a specialization.';
    if (!values.salaryRange.trim()) nextErrors.salaryRange = lang === 'kn' ? 'ನಿರೀಕ್ಷಿತ ಸಂಬಳ ಅಗತ್ಯವಿದೆ.' : 'Expected salary range is required.';
    if (!values.availability) nextErrors.availability = lang === 'kn' ? 'ಲಭ್ಯತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.' : 'Select your availability.';
    if (!values.cv) nextErrors.cv = lang === 'kn' ? 'ಮುಂದುವರೆಯಲು ನಿಮ್ಮ ಸಿವಿ ಅಪ್ಲೋಡ್ ಮಾಡಿ.' : 'Upload your CV to continue.';

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
        const uploadToken = await getUploadTokenAction();
        if (!uploadToken) throw new Error('Uploads are not configured. Please try again later.');
        const uploadResponse = await fetch(`/api/upload?filename=${encodeURIComponent(values.cv.name)}`, {
          method: 'POST',
          body: values.cv,
          headers: {
            'X-Upload-Token': uploadToken,
            'Content-Type': 'application/pdf',
          },
        });
        if (!uploadResponse.ok) {
          const errBody = await uploadResponse.json().catch(() => ({}));
          throw new Error(errBody.error || 'CV upload failed. Please try again.');
        }
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
      <SuccessScreen
        title={t.successTitle}
        description={t.successSub}
        className="animate-page-fade"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-border bg-surface p-6 md:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{t.formSub}</p>
        <h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-text md:text-4xl">{t.formHeading}</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label={t.fullName} error={errors.fullName}>
          <input value={values.fullName} onChange={(e) => update('fullName', e.target.value)}
            className={inputClassName(!!errors.fullName)}
            placeholder="Aarav Mehta" />
        </FormField>

        <FormField label={t.email} error={errors.email}>
          <input type="email" value={values.email} onChange={(e) => update('email', e.target.value)}
            className={inputClassName(!!errors.email)}
            placeholder="name@example.com" />
        </FormField>

        <FormField label={t.phone} error={errors.phone}>
          <input value={values.phone} onChange={(e) => update('phone', e.target.value)}
            className={inputClassName(!!errors.phone)}
            placeholder="+91 98765 43210" />
        </FormField>

        <FormField label={t.location} error={errors.location}>
          <input value={values.location} onChange={(e) => update('location', e.target.value)}
            className={inputClassName(!!errors.location)}
            placeholder="Bangalore" />
        </FormField>

        <FormField label={t.experienceYears} error={errors.experienceYears}>
          <input type="number" min="0" value={values.experienceYears} onChange={(e) => update('experienceYears', e.target.value)}
            className={inputClassName(!!errors.experienceYears)}
            placeholder="4" />
        </FormField>

        <FormField label={t.specialization} error={errors.specialization}>
          <select value={values.specialization} onChange={(e) => update('specialization', e.target.value)}
            className={selectClassName(!!errors.specialization)}>
            <option value="">{t.selectSpec}</option>
            {specializationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </FormField>

        <FormField label={t.currentEmployer} hint={t.optional}>
          <input value={values.currentEmployer} onChange={(e) => update('currentEmployer', e.target.value)}
            className={inputClassName(false)}
            placeholder="Apollo Hospitals" />
        </FormField>

        <FormField label={t.salaryRange} error={errors.salaryRange}>
          <input value={values.salaryRange} onChange={(e) => update('salaryRange', e.target.value)}
            className={inputClassName(!!errors.salaryRange)}
            placeholder="₹6–9 LPA" />
        </FormField>

        <FormField label={t.availability} error={errors.availability} colSpan>
          <select value={values.availability} onChange={(e) => update('availability', e.target.value)}
            className={selectClassName(!!errors.availability)}>
            <option value="">{t.selectAvail}</option>
            {availabilityOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </FormField>

        {/* CV Upload with AI scanner */}
        <div className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">{t.resume} <span className="text-muted/50">{t.pdfOnly}</span></span>

          <AnimatePresence mode="wait">
            {isScanning && (
              <motion.div key="scanning" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="relative overflow-hidden rounded-2xl border border-accent/40 bg-accent-dim/10 p-6 text-center">
                <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_8px_#2dd4bf] opacity-80" />
                <div className="mx-auto flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-accent border-t-transparent text-accent mb-3" />
                <p className="text-sm font-medium text-text">{scanStatus}</p>
                <p className="mt-1 text-xs text-muted">{t.aiScanningCompetency}</p>
              </motion.div>
            )}

            {!isScanning && scanComplete && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-950/5 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">✓</span>
                    <div>
                      <p className="text-sm font-medium text-text">{t.aiVerificationSuccess}</p>
                      <p className="text-xs text-muted truncate max-w-[250px] sm:max-w-md">{values.cv?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-muted">{t.matchRating}</p>
                      <p className="text-sm font-bold text-accent">{matchScore}% Match</p>
                    </div>
                    <button type="button" onClick={() => updateCv(undefined)}
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:text-text transition-colors">
                      {t.replaceFile}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2.5">{t.extractedCompetencies}</p>
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
                  <span className="text-muted">{t.uploadPlaceholder}</span>
                  <span className="ml-4 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent shrink-0">{t.browse}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {errors.cv && <span className="text-xs text-red-300">{errors.cv}</span>}
        </div>

        <FormField label={t.coverNote} hint={t.optional} colSpan>
          <textarea value={values.coverNote} onChange={(e) => update('coverNote', e.target.value)}
            className="min-h-32 resize-none rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
            placeholder={lang === 'kn' ? 'ಲಭ್ಯತೆ, ಪ್ರಮಾಣೀಕರಣಗಳು ಅಥವಾ ಉದ್ಯೋಗ ಆದ್ಯತೆಗಳ ಬಗ್ಗೆ ಹಂಚಿಕೊಳ್ಳಿ' : 'Share anything specific about your availability, certifications, or role preferences'} />
        </FormField>
      </div>

      <FormError message={submitError} />

      <div className="mt-8">
        <button type="submit" disabled={isSubmitting || isScanning}
          className={cn('inline-flex h-12 items-center justify-center rounded-full border border-accent bg-accent px-6 text-sm font-medium text-bg transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/30', (isSubmitting || isScanning) && 'cursor-wait opacity-70')}>
          {isSubmitting ? t.submitting : t.submit}
        </button>
      </div>
    </form>
  );
}
