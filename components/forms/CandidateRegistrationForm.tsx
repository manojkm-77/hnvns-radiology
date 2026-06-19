'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? 'https://formspree.io/f/YOUR_ID';

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
  const [values, setValues] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (key: keyof typeof initialForm, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
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
      const formData = new FormData();

      formData.append('fullName', values.fullName);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('specialization', values.specialization);
      formData.append('experience', values.experience);
      formData.append('currentLocation', values.currentLocation);
      formData.append('preferredLocation', values.preferredLocation);
      formData.append('employmentType', values.employmentType.join(', '));
      formData.append('expectedSalary', values.expectedSalary);

      if (values.cv) {
        formData.append('cv', values.cv, values.cv.name);
      }

      if (values.linkedIn) formData.append('linkedIn', values.linkedIn);
      if (values.message) formData.append('message', values.message);

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      });

      if (!response.ok) throw new Error('Form submission failed');

      setSubmitted(true);
      setValues(initialForm);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
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

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">CV Upload</span>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) => updateCv(event.target.files?.[0])}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label="Upload CV"
            />
            <div className={cn(
              'flex min-h-14 items-center justify-between rounded-2xl border bg-bg px-4 text-sm transition-colors',
              errors.cv ? 'border-red-400/60' : 'border-border'
            )}>
              <span className="text-muted">{values.cv ? values.cv.name : 'Upload your CV (PDF, DOC, or DOCX)'}</span>
              <span className="ml-4 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Browse
              </span>
            </div>
          </div>
          {errors.cv && <span className="text-xs text-red-300">{errors.cv}</span>}
        </label>

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
          disabled={isSubmitting}
          className={cn(
            'inline-flex h-12 items-center justify-center rounded-full border border-accent bg-accent px-6 text-sm font-medium text-bg transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/30',
            isSubmitting && 'cursor-wait opacity-70'
          )}
        >
          {isSubmitting ? 'Submitting...' : 'Submit My Profile'}
        </button>
      </div>
    </form>
  );
}
