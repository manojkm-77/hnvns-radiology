'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  getCandidateApplicationsAction,
  getHospitalVacanciesAction,
} from '@/app/actions/dashboard';

type Role = 'candidate' | 'hospital';

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
  specialization: string;
  roleType: string;
  urgency: string;
  startDate: Date | string;
  submittedAt: Date | string;
};

type Props = {
  email: string;
  firstName: string | null;
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DashboardClient({ email, firstName }: Props) {
  const [role, setRole] = useState<Role | null>(null);
  const [candidateRows, setCandidateRows] = useState<CandidateRow[]>([]);
  const [hospitalRows, setHospitalRows] = useState<HospitalRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = async (selectedRole: Role) => {
    setLoading(true);
    setError('');

    if (selectedRole === 'candidate') {
      const res = await getCandidateApplicationsAction(email);
      if (res.success) {
        setCandidateRows(res.data as CandidateRow[]);
      } else {
        setError(res.error ?? 'Failed to load data.');
      }
    } else {
      const res = await getHospitalVacanciesAction(email);
      if (res.success) {
        setHospitalRows(res.data as HospitalRow[]);
      } else {
        setError(res.error ?? 'Failed to load data.');
      }
    }

    setLoading(false);
  };

  const selectRole = (r: Role) => {
    setRole(r);
    loadData(r);
  };

  // Role selection screen
  if (!role) {
    return (
      <div className="mx-auto max-w-2xl pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Dashboard</p>
        <h1 className="mt-3 text-3xl font-light tracking-[-0.04em] text-text md:text-4xl">
          Welcome back{firstName ? `, ${firstName}` : ''}.
        </h1>
        <p className="mt-2 text-sm text-muted">Select your account type to view your activity.</p>

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
      </div>
    );
  }

  return (
    <div className="animate-page-fade">
      {/* Header */}
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
            onClick={() => setRole(null)}
            className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-surface px-4 text-xs font-medium text-muted hover:text-text transition-colors"
          >
            ← Switch view
          </button>
          <Button href={role === 'candidate' ? '/candidates' : '/hospitals'}>
            {role === 'candidate' ? '+ New Application' : '+ New Request'}
          </Button>
        </div>
      </div>

      {/* Error */}
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
              <p className="text-text text-lg font-light">No applications yet.</p>
              <p className="mt-2 text-sm text-muted">Browse open roles and apply via HNVNS to get started.</p>
              <div className="mt-6">
                <Button href="/jobs">Browse Jobs</Button>
              </div>
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
                            <Link
                              href={`/jobs/${row.job.id}`}
                              className="font-medium text-text hover:text-accent transition-colors"
                            >
                              {row.job.title}
                            </Link>
                            <p className="text-xs text-muted mt-0.5">
                              {row.job.hospital} · {row.job.location}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted italic text-xs">General application</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-accent">{row.specialization}</td>
                      <td className="py-4 px-6 text-muted">{formatDate(row.registeredAt)}</td>
                      <td className="py-4 px-6">
                        <Badge variant="teal">Under Review</Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {row.resumeUrl ? (
                          <a
                            href={row.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 px-3 text-xs text-accent hover:bg-accent/20 transition-colors"
                          >
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
              <p className="text-text text-lg font-light">No vacancy requests yet.</p>
              <p className="mt-2 text-sm text-muted">Post a vacancy to start receiving matched candidate shortlists.</p>
              <div className="mt-6">
                <Button href="/hospitals">Post a Vacancy</Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-widest text-muted bg-bg/50">
                    <th className="py-4 px-6">Hospital</th>
                    <th className="py-4 px-6">Role / Specialization</th>
                    <th className="py-4 px-6">Urgency</th>
                    <th className="py-4 px-6">Start Date</th>
                    <th className="py-4 px-6">Submitted</th>
                    <th className="py-4 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm text-text">
                  {hospitalRows.map((row) => (
                    <tr key={row.id} className="hover:bg-bg/25 transition-colors">
                      <td className="py-4 px-6 font-medium text-text">{row.hospitalName}</td>
                      <td className="py-4 px-6">
                        <p className="text-text">{row.specialization}</p>
                        <p className="text-xs text-muted">{row.roleType}</p>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={row.urgency === 'Urgent' ? 'urgent' : row.urgency === 'Locum' ? 'featured' : 'teal'}>
                          {row.urgency}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-muted">{formatDate(row.startDate)}</td>
                      <td className="py-4 px-6 text-muted">{formatDate(row.submittedAt)}</td>
                      <td className="py-4 px-6 text-right">
                        <Badge variant="teal">In Review</Badge>
                      </td>
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
