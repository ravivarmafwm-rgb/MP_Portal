import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Building2, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { completeOfficialInvitation, fetchOfficialInvitation, getApiErrorMessage, type OfficialInvitation } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { getDashboardPath } from '@/lib/roles';

export const Route = createFileRoute('/official-register')({ component: OfficialRegisterPage });

function OfficialRegisterPage() {
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get('token') ?? undefined;
  const { user } = useAuth();
  const [invitation, setInvitation] = useState<OfficialInvitation>();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!token) { setError('This registration link is missing its invitation token.'); setLoading(false); return; }
    fetchOfficialInvitation(token).then(setInvitation).catch((e) => setError(getApiErrorMessage(e, 'This invitation is invalid or expired.'))).finally(() => setLoading(false));
  }, [token]);
  if (user) { void navigate({ to: getDashboardPath(user.role_slug), replace: true }); return null; }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    if (!token) return;
    if (password.length < 12 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) { setError('Use at least 12 characters with upper/lowercase letters, a number and a symbol.'); return; }
    if (password !== confirmation) { setError('Passwords do not match.'); return; }
    setSubmitting(true);
    try { const result = await completeOfficialInvitation({ token, password, password_confirmation: confirmation }); await navigate({ to: getDashboardPath(result.user.role_slug), replace: true }); }
    catch (e) { setError(getApiErrorMessage(e, 'The invitation could not be completed.')); } finally { setSubmitting(false); }
  };
  return <main className="grid min-h-screen place-items-center bg-slate-950 p-5"><section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
    <Link to="/" className="flex items-center gap-2 font-bold text-slate-950"><Building2 className="h-5 w-5" /> MP Connect</Link>
    <div className="mt-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Official account activation</p><h1 className="mt-3 text-3xl font-extrabold text-slate-950">Set your portal password</h1><p className="mt-2 text-sm text-slate-500">This secure invitation creates the account issued by the MP office. No role can be selected or changed here.</p></div>
    {loading && <div className="mt-8 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Validating invitation</div>}
    {error && <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    {invitation && !loading && <><div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm"><p className="font-semibold text-slate-900">{invitation.name}</p><p className="text-slate-500">{invitation.email}</p><p className="mt-1 font-medium text-emerald-700">Role: {invitation.role}</p></div><form onSubmit={submit} className="mt-6 space-y-4"><div><Label htmlFor="password">New password</Label><div className="relative mt-1"><Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input id="password" type="password" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required /></div></div><div><Label htmlFor="confirmation">Confirm password</Label><Input id="confirmation" type="password" className="mt-1" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} autoComplete="new-password" required /></div><p className="text-xs text-slate-500">At least 12 characters with uppercase, lowercase, number and symbol.</p><Button className="w-full" type="submit" disabled={submitting}>{submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Activating account</> : 'Activate account'}</Button></form></>}
    <p className="mt-6 text-center text-sm text-slate-500">Already activated? <Link to="/login" className="font-semibold text-emerald-700 hover:underline">Sign in</Link></p>
  </section></main>;
}
