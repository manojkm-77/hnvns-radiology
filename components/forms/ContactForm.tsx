'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { submitContactAction } from '@/app/actions/contact';
import { FormField, inputClassName } from '@/components/ui/FormField';
import { FormError } from '@/components/ui/FormError';
import { SuccessScreen } from '@/components/ui/SuccessScreen';

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
      <SuccessScreen
        title="Inquiry received."
        description="Thank you for reaching out. A staffing coordinator will review your inquiry and follow up shortly."
        className="min-h-[400px] flex flex-col justify-center items-center"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-border bg-surface p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Name" error={errors.name}>
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
        </FormField>
        <FormField label="Email" error={errors.email}>
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
        </FormField>
        <FormField label="Organization" error={errors.organization} colSpan>
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
        </FormField>
        <FormField label="Staffing focus" colSpan>
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
        </FormField>
        <FormField label="Message" error={errors.message} colSpan>
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
        </FormField>
      </div>

      <FormError message={submitError} />

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
