'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { submitContactAction } from '@/app/actions/contact';

const initialForm = {
  name: '',
  email: '',
  organization: '',
  staffingFocus: 'Staffing operations',
  message: ''
};

export function ContactForm() {
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

    if (!values.name.trim()) nextErrors.name = 'Name is required.';
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    else if (!emailPattern.test(values.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!values.organization.trim()) nextErrors.organization = 'Organization is required.';
    if (!values.message.trim()) nextErrors.message = 'Message is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitContactAction(values);

      if (!result.success) {
        throw new Error(result.error);
      }

      setSubmitted(true);
      setValues(initialForm);
    } catch (err) {
      setSubmitError((err as Error).message || 'Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-[2rem] border border-accent/30 bg-surface p-8 text-center min-h-[400px] flex flex-col justify-center items-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-bg">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-6 text-2xl font-light tracking-[-0.04em] text-text">Inquiry received.</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">
          Thank you for reaching out. A staffing coordinator will review your inquiry and follow up shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-border bg-surface p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm text-muted">Name</span>
          <input
            name="name"
            value={values.name}
            onChange={(event) => update('name', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/60',
              errors.name ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="Dr. A. Sharma"
          />
          {errors.name && <span className="text-xs text-red-300">{errors.name}</span>}
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-muted">Email</span>
          <input
            name="email"
            value={values.email}
            onChange={(event) => update('email', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/60',
              errors.email ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="name@hospital.org"
            type="email"
          />
          {errors.email && <span className="text-xs text-red-300">{errors.email}</span>}
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">Organization</span>
          <input
            name="organization"
            value={values.organization}
            onChange={(event) => update('organization', event.target.value)}
            className={cn(
              'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/60',
              errors.organization ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="Hospital, clinic, or research group"
          />
          {errors.organization && <span className="text-xs text-red-300">{errors.organization}</span>}
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">Staffing focus</span>
          <select
            name="staffingFocus"
            value={values.staffingFocus}
            onChange={(event) => update('staffingFocus', event.target.value)}
            className="h-12 rounded-2xl border border-border bg-bg px-4 text-sm text-muted outline-none transition-colors focus:border-accent/60"
          >
            <option value="Staffing operations">Staffing operations</option>
            <option value="Credential verification">Credential verification</option>
            <option value="Candidate sourcing">Candidate sourcing</option>
            <option value="Clinical coverage">Clinical coverage</option>
          </select>
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-muted">Message</span>
          <textarea
            name="message"
            value={values.message}
            onChange={(event) => update('message', event.target.value)}
            className={cn(
              'min-h-40 resize-none rounded-2xl border bg-bg px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/60',
              errors.message ? 'border-red-400/60' : 'border-border'
            )}
            placeholder="Tell us about your hiring volume, role gaps, and timeline."
          />
          {errors.message && <span className="text-xs text-red-300">{errors.message}</span>}
        </label>
      </div>

      {submitError && (
        <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
          {submitError}
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'inline-flex h-11 items-center justify-center rounded-full border border-accent bg-accent px-5 text-sm font-medium text-bg transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/30',
            isSubmitting && 'cursor-wait opacity-70'
          )}
        >
          {isSubmitting ? 'Sending...' : 'Send inquiry'}
        </button>
        <Button href="/services" variant="outline">Review services</Button>
      </div>
    </form>
  );
}
