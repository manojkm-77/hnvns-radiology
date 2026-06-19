'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { submitVacancyAction } from '@/app/actions/vacancy';

const initialForm = {
  hospitalName: '',
  contactPerson: '',
  email: '',
  phone: '',
  specialization: '',
  roleType: '',
  urgency: '',
  startDate: '',
  requirements: ''
};

const specializationOptions = [
  'Neuro Imaging',
  'Chest Imaging',
  'MSK Imaging',
  'Body Imaging',
  'Emergency Coverage',
  "Women's Health Imaging",
  'Pediatric Imaging',
  'AI Validation'
];

export function VacancyForm() {
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

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\-\s()]{7,20}$/;

    if (!values.hospitalName.trim()) nextErrors.hospitalName = 'Hospital name is required.';
    if (!values.contactPerson.trim()) nextErrors.contactPerson = 'Contact person is required.';
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    else if (!emailPattern.test(values.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!values.phone.trim()) nextErrors.phone = 'Phone number is required.';
    else if (!phonePattern.test(values.phone.trim())) nextErrors.phone = 'Enter a valid phone number.';
    if (!values.specialization) nextErrors.specialization = 'Select a specialization.';
    if (!values.roleType) nextErrors.roleType = 'Select a role type.';
    if (!values.urgency) nextErrors.urgency = 'Select an urgency level.';
    if (!values.startDate) nextErrors.startDate = 'Select a start date.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitVacancyAction(values);

      if (!result.success) {
        throw new Error(result.error);
      }

      setSubmitted(true);
      setValues(initialForm);
    } catch (err) {
      setSubmitError((err as Error).message || 'Something went wrong. Please try again or contact partnerships directly.');
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
        <h3 className="mt-6 text-2xl font-light tracking-[-0.04em] text-text">Vacancy request received.</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">
          Our hospital partnerships team will review your requirements and follow up shortly.
        </p>
      </div>
    );
  }

  return (
    <form id="vacancy-form" onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-border bg-surface p-6 md:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Vacancy form</p>
        <h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-text md:text-4xl">Tell us what your team needs.</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm text-muted">Hospital Name</span>
          <input
            value={values.hospitalName}
            onChange={(event) => update('hospitalName', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.hospitalName ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="Apollo Hospitals"
          />
          {errors.hospitalName && <span className="text-xs text-red-300">{errors.hospitalName}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-muted">Contact Person</span>
          <input
            value={values.contactPerson}
            onChange={(event) => update('contactPerson', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.contactPerson ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="Dr. A. Sharma"
          />
          {errors.contactPerson && <span className="text-xs text-red-300">{errors.contactPerson}</span>}
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
            placeholder="hr@hospital.org"
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
          <span className="text-sm text-muted">Role Type</span>
          <select
            value={values.roleType}
            onChange={(event) => update('roleType', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-muted outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.roleType ? 'border-red-400/60' : 'border-border'
            )}
          >
            <option value="">Select role type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Contract">Contract</option>
            <option value="Locum">Locum</option>
          </select>
          {errors.roleType && <span className="text-xs text-red-300">{errors.roleType}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-muted">Urgency level</span>
          <select
            value={values.urgency}
            onChange={(event) => update('urgency', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-muted outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.urgency ? 'border-red-400/60' : 'border-border'
            )}
          >
            <option value="">Select urgency</option>
            <option value="Standard">Standard</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          {errors.urgency && <span className="text-xs text-red-300">{errors.urgency}</span>}
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-muted">Start Date</span>
          <input
            value={values.startDate}
            onChange={(event) => update('startDate', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20',
              errors.startDate ? 'border-red-400/60' : 'border-border'
            )}
            type="date"
          />
          {errors.startDate && <span className="text-xs text-red-300">{errors.startDate}</span>}
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">Additional Requirements</span>
          <textarea
            value={values.requirements}
            onChange={(event) => update('requirements', event.target.value)}
            className="min-h-32 resize-none rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
            placeholder="Shift pattern, modalities, reporting expectations, or onboarding notes"
          />
        </label>
      </div>

      {submitError && (
        <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {submitError}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'inline-flex h-12 items-center justify-center rounded-full border border-accent bg-accent px-6 text-sm font-medium text-bg transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/30',
            isSubmitting && 'cursor-wait opacity-70'
          )}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Vacancy'}
        </button>
        <Button href="/contact" variant="outline">Contact partnerships</Button>
      </div>
    </form>
  );
}
