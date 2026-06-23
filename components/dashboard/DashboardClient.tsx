'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  requestOtpAction,
  verifyOtpAction,
  getCandidateApplicationsAction,
  getHospitalVacanciesAction,
} from '@/app/actions/dashboard';

type Role = 'candidate' | 'hospital';
type Step = 'email' | 'otp' | 'role' | 'data';

type CandidateRow = {
  id: string;
  specialization: string;
  jobId: string | null;
  registeredAt: Date | string;
  availability: string;
  resumeUrl: string | null;
  job: { id: string; title: string; hospital: string; location: string } | null;
};

type HospitalRow = {
  id: string;
  hospitalName: string;
  role: string;
  department: string;
  urgency: string;
  createdAt: Date | string;
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DashboardClient({ email: initialEmail, firstName }: { email: string; firstName: string | null }) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState(initialEmail);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [candidateRows, setCandidateRows] = useState<CandidateRow[]>([]);
  const [hospitalRows, setHospitalRows] = useState<HospitalRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = emailInput.trim();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError('Enter a valid email address.');
      return;
    }
    setEmail(val);
    setIsSendingOtp(true);
    setEmailError('');
    try {
      const res = await requestOtpAction(val);
      if (res.success) {
        setStep('otp');
      } else {
        setEmailError(res.error ?? 'Could not send a login code.');
      }
    } catch (err) {
      setEmailError('An error occurred. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpInput.trim();
    if (!/^\d{6}$/.test(code)) {
      setOtpError('Enter the 6-digit code we sent to your email.');
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError('');
    try {
      const res = await verifyOtpAction(email, code);
      if (res.success) {
        setStep('role');
      } else {
        setOtpError(res.error ?? 'Invalid or expired code.');
      }
    } catch (err) {
      setOtpError('An error occurred. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const loadData = async (selectedRole: Role) => {
    setLoading(true);
    setError('');

    try {
      if (selectedRole === 'candidate') {
        const res = await getCandidateApplicationsAction();
        if (res.success) {
          setCandidateRows(res.data as CandidateRow[]);
        } else {
          setError(res.error ?? 'Failed to load data.');
          if (res.error === 'Session expired') { setStep('email'); return; }
        }
      } else {
        const res = await getHospitalVacanciesAction();
        if (res.success) {
          setHospitalRows(res.data as HospitalRow[]);
        } else {
          setError(res.error ?? 'Failed to load data.');
          if (res.error === 'Session expired') { setStep('email'); return; }
        }
      }

      setStep('data');
    } catch (err) {
      setError('An error occurred while loading your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (r: Role) => {
    setRole(r);
    loadData(r);
  };

  // Step 1: collect email
  if (step === 'email') {
    return (
      <div className="mx-auto max-w-md pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Dashboard</p>
        <h1 className="mt-3 text-3xl font-light tracking-[-0.04em] text-text md:text-4xl">
          View your activity.
        </h1>
        <p className="mt-2 text-sm text-muted">
          Enter the email address you used when submitting your application or vacancy request.
        </p>

        <form onSubmit={handleEmailSubmit} className="mt-8 space-y-4">
          <div className="grid gap-2">
            <label htmlFor="dash-email" className="text-sm text-muted">Email address</label>
            <input
              id="dash-email"
              type="email"
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); }}
              className="h-12 rounded-2xl border border-border bg-surface px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
              placeholder="name@example.com"
              autoFocus
              disabled={isSendingOtp}
            />
            {emailError && <span className="text-xs text-red-300">{emailError}</span>}
          </div>
          <button
            type="submit"
            disabled={isSendingOtp}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors disabled:opacity-70"
          >
            {isSendingOtp ? 'Sending code…' : 'Send login code →'}
          </button>
        </form>
      </div>
    );
  }

  // Step 2: enter OTP
  if (step === 'otp') {
    return (
      <div className="mx-auto max-w-md pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Dashboard</p>
        <h1 className="mt-3 text-3xl font-light tracking-[-0.04em] text-text md:text-4xl">
          Check your inbox.
        </h1>
        <p className="mt-2 text-sm text-muted">
          We sent a 6-digit code to <span className="text-text">{email}</span>. It expires in 10 minutes.
        </p>

        <form onSubmit={handleOtpSubmit} className="mt-8 space-y-4">
          <div className="grid gap-2">
            <label htmlFor="dash-otp" className="text-sm text-muted">Login code</label>
            <input
              id="dash-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otpInput}
              onChange={(e) => { setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError(''); }}
              className="h-12 rounded-2xl border border-border bg-surface px-4 text-center text-lg tracking-[0.5em] text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20"
              placeholder="······"
              autoFocus
              disabled={isVerifyingOtp}
            />
            {otpError && <span className="text-xs text-red-300">{otpError}</span>}
          </div>
          <button
            type="submit"
            disabled={isVerifyingOtp}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors disabled:opacity-70"
          >
            {isVerifyingOtp ? 'Verifying…' : 'Verify code →'}
          </button>
        </form>

        <button
          onClick={() => { setStep('email'); setEmail(''); setEmailInput(''); setOtpInput(''); setOtpError(''); }}
          className="mt-8 text-xs text-muted hover:text-text transition-colors"
        >
          ← Use a different email
        </button>
      </div>
    );
  }

  // Step 2: pick role
  if (step === 'role') {
    return (
      <div className="mx-auto max-w-2xl pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Dashboard</p>
        <h1 className="mt-3 text-3xl font-light tracking-[-0.04em] text-text md:text-4xl">
          Welcome back.
        </h1>
        <p className="mt-2 text-sm text-muted">Showing activity for <span className="text-text">{email}</span></p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <button
            onClick={() => selectRole('candidate')}
            className="group rounded-2xl border border-border bg-surface p-6 text-left hover:border-accent/40 transition-all duration-300"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-bg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-medium text-text">Candidate</h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">View your submitted applications and profile status.</p>
            <span className="mt-4 text-xs text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">View applications →</span>
          </button>

          <button
            onClick={() => selectRole('hospital')}
            className="group rounded-2xl border border-border bg-surface p-6 text-left hover:border-accent/40 transition-all duration-300"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-bg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-medium text-text">Hospital / Facility</h3>
            <p className="mt-2 text-xs text-muted leading-relaxed">View your submitted vacancy requests and staffing inquiries.</p>
            <span className="mt-4 text-xs text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">View vacancies →</span>
          </button>
        </div>

        <button
          onClick={() => { setStep('email'); setEmail(''); setEmailInput(''); }}
          className="mt-8 text-xs text-muted hover:text-text transition-colors"
        >
          ← Use a different email
        </button>
      </div>
    );
  }

  // Step 3: show data
  return (
    <div className="animate-page-fade">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs text-accent capitalize">
              {role} Dashboard
            </span>
            {loading && <span className="text-xs text-muted animate-pulse">Loading...</span>}
          </div>
          <h1 className="mt-2 text-3xl font-light tracking-[-0.05em] text-text md:text-4xl">
            {role === 'candidate' ? 'Your Applications' : 'Your Vacancy Requests'}
          </h1>
          <p className="mt-1 text-sm text-muted">{email}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setStep('role'); setRole(null); }}
            className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-surface px-4 text-xs font-medium text-muted hover:text-text transition-colors"
          >
            ← Switch view
          </button>
          <Button href={role === 'candidate' ? '/candidates' : '/hospitals'}>
            {role === 'candidate' ? '+ New Application' : '+ New Request'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Candidate table */}
      {role === 'candidate' && !loading && (
        <div className="mt-8">
          {candidateRows.length === 0 ? (
            <div className="rounded-3xl border border-border bg-surface p-10 text-center">
              <p className="text-text text-lg font-light">No applications found for {email}.</p>
              <p className="mt-2 text-sm text-muted">Browse open roles and apply via HNVNS to get started.</p>
              <div className="mt-6"><Button href="/jobs">Browse Jobs</Button></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-widest text-muted bg-bg/50">
                    <th className="py-4 px-6">Applied For</th>
                    <th className="py-4 px-6">Specialization</th>
                    <th className="py-4 px-6">Applied On</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm text-text">
                  {candidateRows.map((row) => (
                    <tr key={row.id} className="hover:bg-bg/25 transition-colors">
                      <td className="py-4 px-6">
                        {row.job ? (
                          <div>
                            <Link href={`/jobs/${row.job.id}`} className="font-medium text-text hover:text-accent transition-colors">
                              {row.job.title}
                            </Link>
                            <p className="text-xs text-muted mt-0.5">{row.job.hospital} · {row.job.location}</p>
                          </div>
                        ) : (
                          <span className="text-muted italic text-xs">General application</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-accent">{row.specialization}</td>
                      <td className="py-4 px-6 text-muted">{formatDate(row.registeredAt)}</td>
                      <td className="py-4 px-6"><Badge variant="teal">Under Review</Badge></td>
                      <td className="py-4 px-6 text-right">
                        {row.resumeUrl ? (
                          <a href={row.resumeUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex h-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 px-3 text-xs text-accent hover:bg-accent/20 transition-colors">
                            View CV
                          </a>
                        ) : (
                          <span className="text-xs text-muted italic">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Hospital table */}
      {role === 'hospital' && !loading && (
        <div className="mt-8">
          {hospitalRows.length === 0 ? (
            <div className="rounded-3xl border border-border bg-surface p-10 text-center">
              <p className="text-text text-lg font-light">No vacancy requests found for {email}.</p>
              <p className="mt-2 text-sm text-muted">Post a vacancy to start receiving matched candidate shortlists.</p>
              <div className="mt-6"><Button href="/hospitals">Post a Vacancy</Button></div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-widest text-muted bg-bg/50">
                    <th className="py-4 px-6">Hospital</th>
                    <th className="py-4 px-6">Role / Department</th>
                    <th className="py-4 px-6">Urgency</th>
                    <th className="py-4 px-6">Submitted</th>
                    <th className="py-4 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm text-text">
                  {hospitalRows.map((row) => (
                    <tr key={row.id} className="hover:bg-bg/25 transition-colors">
                      <td className="py-4 px-6 font-medium text-text">{row.hospitalName}</td>
                      <td className="py-4 px-6">
                        <p className="text-text">{row.role}</p>
                        <p className="text-xs text-muted">{row.department}</p>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={row.urgency === 'Critical' ? 'urgent' : row.urgency === 'Urgent' ? 'featured' : 'teal'}>
                          {row.urgency}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-muted">{formatDate(row.createdAt)}</td>
                      <td className="py-4 px-6 text-muted">{formatDate(row.createdAt)}</td>
                      <td className="py-4 px-6 text-right"><Badge variant="teal">In Review</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
