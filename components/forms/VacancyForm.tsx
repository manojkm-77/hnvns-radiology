'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { submitVacancyAction } from '@/app/actions/vacancy';
import { FormField, inputClassName, selectClassName } from '@/components/ui/FormField';
import { FormError } from '@/components/ui/FormError';
import { SuccessScreen } from '@/components/ui/SuccessScreen';

const initialForm = {
  hospitalName: '',
  location: '',
  department: '',
  role: '',
  positions: '1',
  urgency: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  notes: '',
  onboardingCall: false,
};

export function VacancyForm() {
  const [values, setValues] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (key: keyof typeof initialForm, value: string | boolean) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key as string]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key as string];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\-\s()]{7,20}$/;
    const pos = parseInt(values.positions, 10);

    if (!values.hospitalName.trim()) nextErrors.hospitalName = 'Hospital name is required.';
    if (!values.location.trim()) nextErrors.location = 'Location is required.';
    if (!values.department.trim()) nextErrors.department = 'Department is required.';
    if (!values.role.trim()) nextErrors.role = 'Role is required.';
    if (!values.positions || isNaN(pos) || pos < 1) nextErrors.positions = 'Enter a valid number of positions.';
    if (!values.urgency) nextErrors.urgency = 'Select an urgency level.';
    if (!values.contactName.trim()) nextErrors.contactName = 'Contact name is required.';
    if (!values.contactPhone.trim()) nextErrors.contactPhone = 'Phone is required.';
    else if (!phonePattern.test(values.contactPhone.trim())) nextErrors.contactPhone = 'Enter a valid phone number.';
    if (!values.contactEmail.trim()) nextErrors.contactEmail = 'Email is required.';
    else if (!emailPattern.test(values.contactEmail.trim())) nextErrors.contactEmail = 'Enter a valid email address.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitVacancyAction({
        hospitalName: values.hospitalName,
        location: values.location,
        department: values.department,
        role: values.role,
        positions: parseInt(values.positions, 10),
        urgency: values.urgency,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        contactEmail: values.contactEmail,
        notes: values.notes || undefined,
        onboardingCall: values.onboardingCall,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setMeetingLink(result.meetingLink);
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
      <SuccessScreen
        title="Vacancy request received."
        description="Our hospital partnerships team will review your requirements and follow up shortly."
      >
        {meetingLink && (
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-4">
            <p className="text-sm text-text font-medium">Your onboarding call is ready to book.</p>
            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors"
            >
              Book Onboarding Call →
            </a>
          </div>
        )}
      </SuccessScreen>
    );
  }

  return (
    <form id="vacancy-form" onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-border bg-surface p-6 md:p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Vacancy form</p>
        <h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-text md:text-4xl">Tell us what your team needs.</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Hospital Name" error={errors.hospitalName}>
          <input
            value={values.hospitalName}
            onChange={(e) => update('hospitalName', e.target.value)}
            className={inputClassName(!!errors.hospitalName)}
            placeholder="Apollo Hospitals"
          />
        </FormField>

        <FormField label="Location" error={errors.location}>
          <input
            value={values.location}
            onChange={(e) => update('location', e.target.value)}
            className={inputClassName(!!errors.location)}
            placeholder="Bengaluru, Karnataka"
          />
        </FormField>

        <FormField label="Department" error={errors.department}>
          <input
            value={values.department}
            onChange={(e) => update('department', e.target.value)}
            className={inputClassName(!!errors.department)}
            placeholder="Radiology / Imaging"
          />
        </FormField>

        <FormField label="Role Needed" error={errors.role}>
          <input
            value={values.role}
            onChange={(e) => update('role', e.target.value)}
            className={inputClassName(!!errors.role)}
            placeholder="Senior MRI Technologist"
          />
        </FormField>

        <FormField label="Number of Positions" error={errors.positions}>
          <input
            type="number"
            min="1"
            value={values.positions}
            onChange={(e) => update('positions', e.target.value)}
            className={inputClassName(!!errors.positions)}
            placeholder="1"
          />
        </FormField>

        <FormField label="Urgency" error={errors.urgency}>
          <select
            value={values.urgency}
            onChange={(e) => update('urgency', e.target.value)}
            className={selectClassName(!!errors.urgency)}
          >
            <option value="">Select urgency</option>
            <option value="Routine">Routine</option>
            <option value="Urgent">Urgent</option>
            <option value="Critical">Critical</option>
          </select>
        </FormField>

        <FormField label="Contact Person" error={errors.contactName}>
          <input
            value={values.contactName}
            onChange={(e) => update('contactName', e.target.value)}
            className={inputClassName(!!errors.contactName)}
            placeholder="Dr. A. Sharma"
          />
        </FormField>

        <FormField label="Phone" error={errors.contactPhone}>
          <input
            value={values.contactPhone}
            onChange={(e) => update('contactPhone', e.target.value)}
            className={inputClassName(!!errors.contactPhone)}
            placeholder="+91 98765 43210"
          />
        </FormField>

        <FormField label="Email" error={errors.contactEmail} colSpan>
          <input
            type="email"
            value={values.contactEmail}
            onChange={(e) => update('contactEmail', e.target.value)}
            className={inputClassName(!!errors.contactEmail)}
            placeholder="hr@hospital.org"
          />
        </FormField>

        <FormField label="Notes" hint="(optional)" colSpan>
          <textarea
            value={values.notes}
            onChange={(e) => update('notes', e.target.value)}
            className="min-h-32 resize-none rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
            placeholder="Shift pattern, modalities, reporting expectations, or any additional requirements"
          />
        </FormField>

        {/* Onboarding Call */}
        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-bg p-4 hover:border-accent/40 transition-colors">
            <input
              type="checkbox"
              checked={values.onboardingCall}
              onChange={(e) => update('onboardingCall', e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-accent shrink-0"
            />
            <div>
              <span className="text-sm font-medium text-text">Request an onboarding call with HNVNS team</span>
              <p className="mt-0.5 text-xs text-muted">A staffing coordinator will walk you through the process and answer any questions.</p>
            </div>
          </label>
        </div>
      </div>

      <FormError message={submitError} />

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
