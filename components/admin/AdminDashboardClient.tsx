'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  getAdminDataAction,
  createJobAction,
  updateJobAction,
  deleteJobAction
} from '@/app/actions/admin';

type JobType = {
  id: string;
  title: string;
  hospital: string;
  location: string;
  type: string;
  salary: string;
  postedAt: Date | string;
  specialization: string;
  status: string;
  description: string | null;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
};

type CandidateType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  availability: string;
  resumeUrl: string | null;
  registeredAt: Date | string;
};

type VacancyRequestType = {
  id: string;
  hospitalName: string;
  contactPerson: string;
  email: string;
  phone: string;
  specialization: string;
  roleType: string;
  urgency: string;
  startDate: Date | string;
  requirements: string | null;
  submittedAt: Date | string;
};

const initialJobForm = {
  title: '',
  hospital: '',
  location: '',
  type: 'Full-Time',
  salary: '',
  specialization: 'MRI',
  status: 'open',
  description: '',
  responsibilities: '',
  requirements: '',
  benefits: ''
};

export function AdminDashboardClient() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'candidates' | 'requests'>('overview');
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [candidates, setCandidates] = useState<CandidateType[]>([]);
  const [requests, setRequests] = useState<VacancyRequestType[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  // CRUD Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [formError, setFormError] = useState('');

  // Persist session locally
  useEffect(() => {
    const savedCode = sessionStorage.getItem('hnvns_admin_code');
    if (savedCode) {
      handleLogin(savedCode);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    handleLogin(passcode);
  };

  const handleLogin = async (codeToTry: string) => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await getAdminDataAction(codeToTry);
      if (res.success && res.data) {
        setIsAuthenticated(true);
        sessionStorage.setItem('hnvns_admin_code', codeToTry);
        setJobs(res.data.jobs as any);
        setCandidates(res.data.candidates as any);
        setRequests(res.data.vacancyRequests as any);
      } else {
        setLoginError(res.error || 'Authentication failed.');
        sessionStorage.removeItem('hnvns_admin_code');
      }
    } catch (err) {
      setLoginError('An error occurred during authentication.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const refreshData = async () => {
    const code = sessionStorage.getItem('hnvns_admin_code') || passcode;
    if (!code) return;
    setIsLoadingData(true);
    setDataError('');
    try {
      const res = await getAdminDataAction(code);
      if (res.success && res.data) {
        setJobs(res.data.jobs as any);
        setCandidates(res.data.candidates as any);
        setRequests(res.data.vacancyRequests as any);
      } else {
        setDataError(res.error || 'Failed to refresh data.');
      }
    } catch (err) {
      setDataError('An error occurred fetching dashboard data.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    sessionStorage.removeItem('hnvns_admin_code');
  };

  // Job Submission Handler
  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!jobForm.title || !jobForm.hospital || !jobForm.location || !jobForm.salary) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const code = sessionStorage.getItem('hnvns_admin_code') || passcode;
    setIsSubmittingJob(true);

    const formattedData = {
      title: jobForm.title,
      hospital: jobForm.hospital,
      location: jobForm.location,
      type: jobForm.type,
      salary: jobForm.salary,
      specialization: jobForm.specialization,
      status: jobForm.status,
      description: jobForm.description,
      responsibilities: jobForm.responsibilities.split('\n').map(r => r.trim()).filter(Boolean),
      requirements: jobForm.requirements.split('\n').map(r => r.trim()).filter(Boolean),
      benefits: jobForm.benefits.split('\n').map(r => r.trim()).filter(Boolean)
    };

    try {
      let res;
      if (isEditModalOpen && editingJobId) {
        res = await updateJobAction(code, editingJobId, formattedData);
      } else {
        res = await createJobAction(code, formattedData);
      }

      if (res.success) {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setJobForm(initialJobForm);
        setEditingJobId(null);
        refreshData();
      } else {
        setFormError(res.error || 'Failed to submit job.');
      }
    } catch (err) {
      setFormError('An unexpected error occurred.');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleEditClick = (job: JobType) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title,
      hospital: job.hospital,
      location: job.location,
      type: job.type,
      salary: job.salary,
      specialization: job.specialization,
      status: job.status,
      description: job.description || '',
      responsibilities: job.responsibilities.join('\n'),
      requirements: job.requirements.join('\n'),
      benefits: job.benefits.join('\n')
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    const code = sessionStorage.getItem('hnvns_admin_code') || passcode;
    try {
      const res = await deleteJobAction(code, jobId);
      if (res.success) {
        refreshData();
      } else {
        alert(res.error || 'Failed to delete job.');
      }
    } catch (err) {
      alert('Failed to delete job.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08),transparent_45%)]" />
        <div className="w-full max-w-md rounded-[2rem] border border-border bg-surface/80 p-8 shadow-glow backdrop-blur-xl">
          <div className="text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Internal Access</p>
            <h2 className="mt-3 text-3xl font-light tracking-[-0.04em] text-text">HNVNS Admin Portal</h2>
            <p className="mt-2 text-sm text-muted">Please enter your passcode to access dashboard features.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-8 space-y-4">
            <div className="grid gap-2">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••••"
                className="h-12 w-full rounded-2xl border border-border bg-bg px-4 text-center text-lg tracking-widest text-text outline-none transition-all focus:border-accent/80 focus:ring-2 focus:ring-accent/15"
                disabled={isLoggingIn}
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-center text-xs text-red-400 mt-2">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className={cn(
                "mt-4 flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#5df3c3] to-[#15a684] text-sm font-semibold text-black transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-accent/25",
                isLoggingIn && "opacity-70 cursor-wait"
              )}
            >
              {isLoggingIn ? "Authorizing..." : "Enter Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Header Block */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs text-accent">Admin Console</span>
              {isLoadingData && <span className="text-xs text-muted animate-pulse">Syncing...</span>}
            </div>
            <h1 className="mt-2 text-3xl font-light tracking-[-0.05em] text-text md:text-4xl">HNVNS Admin Panel</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refreshData}
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-surface px-4 text-xs font-medium text-text hover:border-accent/40 transition-colors"
            >
              Sync Database
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex h-10 items-center justify-center rounded-full border border-red-500/30 bg-red-950/10 px-4 text-xs font-medium text-red-300 hover:bg-red-950/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="mt-8 flex border-b border-border/80">
          {[
            ['overview', 'Overview'],
            ['jobs', 'Manage Jobs'],
            ['candidates', 'Verified Candidates'],
            ['requests', 'Client Requests']
          ].map(([tabKey, tabLabel]) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey as any)}
              className={cn(
                "relative pb-4 px-4 text-sm font-medium transition-colors border-b-2",
                activeTab === tabKey
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-text"
              )}
            >
              {tabLabel}
              {tabKey === 'candidates' && candidates.length > 0 && (
                <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">{candidates.length}</span>
              )}
              {tabKey === 'requests' && requests.length > 0 && (
                <span className="ml-2 rounded-full bg-red-400/10 px-2 py-0.5 text-xs text-red-300">{requests.length}</span>
              )}
            </button>
          ))}
        </div>

        {dataError && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {dataError}
          </div>
        )}

        {/* --- TAB CONTENT: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8 animate-page-fade">
            {/* KPI Cards Grid */}
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-border bg-surface p-6">
                <p className="text-xs uppercase tracking-widest text-muted">Active Vacancies</p>
                <p className="mt-4 text-4xl font-light text-text">{jobs.length}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted">Listed jobs</span>
                  <button onClick={() => setActiveTab('jobs')} className="text-xs text-accent hover:underline">Manage →</button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border bg-surface p-6">
                <p className="text-xs uppercase tracking-widest text-muted">Verified Applicants</p>
                <p className="mt-4 text-4xl font-light text-text">{candidates.length}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted">Registered CVs</span>
                  <button onClick={() => setActiveTab('candidates')} className="text-xs text-accent hover:underline">View All →</button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border bg-surface p-6">
                <p className="text-xs uppercase tracking-widest text-muted">Hospital Staffing Inquiries</p>
                <p className="mt-4 text-4xl font-light text-text">{requests.length}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted">Incoming requests</span>
                  <button onClick={() => setActiveTab('requests')} className="text-xs text-accent hover:underline">Review →</button>
                </div>
              </div>
            </div>

            {/* Quick Summary Tables */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Candidates */}
              <div className="rounded-[1.5rem] border border-border bg-surface p-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <h3 className="font-medium text-text">Recent Applicants</h3>
                  <button onClick={() => setActiveTab('candidates')} className="text-xs text-muted hover:text-accent">View all</button>
                </div>
                <div className="mt-4 divide-y divide-border/40">
                  {candidates.slice(0, 4).map((c) => (
                    <div key={c.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text">{c.name}</p>
                        <p className="text-xs text-muted">{c.specialization} · {c.email}</p>
                      </div>
                      <Badge variant="teal">Registered</Badge>
                    </div>
                  ))}
                  {candidates.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted">No applications received yet.</p>
                  )}
                </div>
              </div>

              {/* Recent Inquiries */}
              <div className="rounded-[1.5rem] border border-border bg-surface p-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <h3 className="font-medium text-text">Recent Hospital Requests</h3>
                  <button onClick={() => setActiveTab('requests')} className="text-xs text-muted hover:text-accent">View all</button>
                </div>
                <div className="mt-4 divide-y divide-border/40">
                  {requests.slice(0, 4).map((r) => (
                    <div key={r.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text">{r.hospitalName}</p>
                        <p className="text-xs text-muted">{r.specialization} · {r.contactPerson}</p>
                      </div>
                      <Badge variant={r.urgency === 'Urgent' ? 'urgent' : r.urgency === 'Locum' ? 'featured' : 'teal'}>
                        {r.urgency}
                      </Badge>
                    </div>
                  ))}
                  {requests.length === 0 && (
                    <p className="py-4 text-center text-sm text-muted">No vacancy requests submitted yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: JOBS --- */}
        {activeTab === 'jobs' && (
          <div className="mt-8 space-y-6 animate-page-fade">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-light text-text">Current Job Board Postings ({jobs.length})</h2>
              <button
                onClick={() => {
                  setJobForm(initialJobForm);
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-bg hover:bg-accent/90 transition-colors"
              >
                + Post a Vacancy
              </button>
            </div>

            {/* Jobs List Table */}
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-widest text-muted bg-bg/50">
                    <th className="py-4 px-6">Job Title</th>
                    <th className="py-4 px-6">Hospital</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Specialization</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm text-text">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-bg/25 transition-colors">
                      <td className="py-4 px-6 font-medium text-text">{job.title}</td>
                      <td className="py-4 px-6 text-muted">{job.hospital}</td>
                      <td className="py-4 px-6 text-muted">{job.location}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 text-xs text-accent">
                          {job.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-muted">{job.specialization}</td>
                      <td className="py-4 px-6">
                        <Badge variant={job.status === 'open' ? 'teal' : job.status as any}>
                          {job.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2 shrink-0">
                        <button
                          onClick={() => handleEditClick(job)}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-border px-3 text-xs text-text hover:border-accent/40 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(job.id)}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-950/5 px-3 text-xs text-red-300 hover:bg-red-950/20 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted">
                        No job vacancies found. Click &quot;+ Post a Vacancy&quot; to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: CANDIDATES --- */}
        {activeTab === 'candidates' && (
          <div className="mt-8 space-y-6 animate-page-fade">
            <h2 className="text-xl font-light text-text">Pre-Verified Candidates Directory ({candidates.length})</h2>

            {/* Candidates Table */}
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-widest text-muted bg-bg/50">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Specialization</th>
                    <th className="py-4 px-6">Email / Phone</th>
                    <th className="py-4 px-6">Availability & Background Info</th>
                    <th className="py-4 px-6">Registered</th>
                    <th className="py-4 px-6 text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm text-text">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-bg/25 transition-colors">
                      <td className="py-4 px-6 font-medium text-text">{c.name}</td>
                      <td className="py-4 px-6 text-accent">{c.specialization}</td>
                      <td className="py-4 px-6">
                        <p className="text-text">{c.email}</p>
                        <p className="text-xs text-muted">{c.phone}</p>
                      </td>
                      <td className="py-4 px-6 max-w-md text-xs text-muted leading-relaxed">
                        {c.availability}
                      </td>
                      <td className="py-4 px-6 text-xs text-muted">
                        {new Date(c.registeredAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {c.resumeUrl ? (
                          <a
                            href={c.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 px-3 text-xs text-accent hover:bg-accent/20 transition-colors"
                          >
                            Download CV
                          </a>
                        ) : (
                          <span className="text-xs text-muted italic">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {candidates.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted">
                        No candidates have registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: REQUESTS --- */}
        {activeTab === 'requests' && (
          <div className="mt-8 space-y-6 animate-page-fade">
            <h2 className="text-xl font-light text-text">Hospital Staffing Vacancy Requests ({requests.length})</h2>

            {/* Requests Table */}
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-widest text-muted bg-bg/50">
                    <th className="py-4 px-6">Hospital</th>
                    <th className="py-4 px-6">Specialization / Role</th>
                    <th className="py-4 px-6">Contact details</th>
                    <th className="py-4 px-6">Target Start</th>
                    <th className="py-4 px-6">Urgency</th>
                    <th className="py-4 px-6">Requirements</th>
                    <th className="py-4 px-6">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm text-text">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-bg/25 transition-colors">
                      <td className="py-4 px-6 font-medium text-text">
                        {r.hospitalName}
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-text">{r.specialization}</p>
                        <p className="text-xs text-muted">{r.roleType}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-text">{r.contactPerson}</p>
                        <p className="text-xs text-muted">{r.email} · {r.phone}</p>
                      </td>
                      <td className="py-4 px-6 text-muted">
                        {new Date(r.startDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={r.urgency === 'Urgent' ? 'urgent' : r.urgency === 'Locum' ? 'featured' : 'teal'}>
                          {r.urgency}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 max-w-sm text-xs text-muted whitespace-pre-wrap truncate leading-relaxed">
                        {r.requirements || <span className="italic text-muted/50">None</span>}
                      </td>
                      <td className="py-4 px-6 text-xs text-muted">
                        {new Date(r.submittedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted">
                        No vacancy inquiries have been received.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- CREATE / EDIT MODALS --- */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-md animate-[page-fade_0.2s_ease-out]">
          <div className="w-full max-w-3xl rounded-[2rem] border border-border bg-surface p-6 shadow-glow md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <h3 className="text-2xl font-light tracking-tight text-text">
                {isEditModalOpen ? 'Edit Job Posting' : 'Post a New Vacancy'}
              </h3>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                  setJobForm(initialJobForm);
                  setEditingJobId(null);
                }}
                className="text-muted hover:text-text text-xl"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleJobSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs text-muted">Job Title *</span>
                  <input
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="h-11 rounded-xl border border-border bg-bg px-4 text-sm text-text outline-none focus:border-accent"
                    placeholder="Senior MRI Technologist"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs text-muted">Hospital Name *</span>
                  <input
                    value={jobForm.hospital}
                    onChange={(e) => setJobForm({ ...jobForm, hospital: e.target.value })}
                    className="h-11 rounded-xl border border-border bg-bg px-4 text-sm text-text outline-none focus:border-accent"
                    placeholder="Apollo Hospitals"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs text-muted">Location *</span>
                  <input
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="h-11 rounded-xl border border-border bg-bg px-4 text-sm text-text outline-none focus:border-accent"
                    placeholder="Bengaluru"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs text-muted">Salary Band *</span>
                  <input
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="h-11 rounded-xl border border-border bg-bg px-4 text-sm text-text outline-none focus:border-accent"
                    placeholder="₹12,00,000 - ₹16,00,000 / year"
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-xs text-muted">Employment Type</span>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="h-11 rounded-xl border border-border bg-bg px-4 text-sm text-muted outline-none focus:border-accent"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Locum">Locum</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-xs text-muted">Specialization</span>
                  <select
                    value={jobForm.specialization}
                    onChange={(e) => setJobForm({ ...jobForm, specialization: e.target.value })}
                    className="h-11 rounded-xl border border-border bg-bg px-4 text-sm text-muted outline-none focus:border-accent"
                  >
                    <option value="MRI">MRI</option>
                    <option value="CT">CT</option>
                    <option value="Sonography">Sonography</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="Mammography">Mammography</option>
                    <option value="PACS">PACS</option>
                    <option value="Reporting">Reporting</option>
                    <option value="Operations">Operations</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-xs text-muted">Status Badge</span>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                    className="h-11 rounded-xl border border-border bg-bg px-4 text-sm text-muted outline-none focus:border-accent"
                  >
                    <option value="open">Open</option>
                    <option value="featured">Featured</option>
                    <option value="urgent">Urgent</option>
                    <option value="new">New</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-xs text-muted">Job Description Summary</span>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="min-h-24 resize-none rounded-xl border border-border bg-bg p-3 text-sm text-text outline-none focus:border-accent"
                  placeholder="Summarize the core focus of the position..."
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs text-muted">Key Responsibilities (one per line)</span>
                <textarea
                  value={jobForm.responsibilities}
                  onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                  className="min-h-28 resize-none rounded-xl border border-border bg-bg p-3 text-xs text-text outline-none focus:border-accent"
                  placeholder="Perform high-quality MRI procedures&#10;Ensure radiation safety standards&#10;Maintain imaging equipment logs"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs text-muted">Qualifications & Requirements (one per line)</span>
                <textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className="min-h-28 resize-none rounded-xl border border-border bg-bg p-3 text-xs text-text outline-none focus:border-accent"
                  placeholder="B.Sc. in Radiographic Imaging or equivalent&#10;Registered Radiologic Technologist credentials&#10;2+ years clinical experience in MRI"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs text-muted">Compensation & Benefits (one per line)</span>
                <textarea
                  value={jobForm.benefits}
                  onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                  className="min-h-28 resize-none rounded-xl border border-border bg-bg p-3 text-xs text-text outline-none focus:border-accent"
                  placeholder="Competitive compensation with shift differentials&#10;Comprehensive health insurance options&#10;Paid time off and flexible scheduling"
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-border pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    setJobForm(initialJobForm);
                    setEditingJobId(null);
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-medium text-text hover:border-accent/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingJob}
                  className={cn(
                    "inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors",
                    isSubmittingJob && "opacity-75 cursor-wait"
                  )}
                >
                  {isSubmittingJob ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
