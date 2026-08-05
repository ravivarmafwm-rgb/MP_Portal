import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Copy, Loader2, UserPlus } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createOfficialInvitation, getApiErrorMessage, type OfficialInvitation } from '@/lib/api';

export const Route = createFileRoute('/_app/admin/users')({ component: AdminUserInvitationsPage });

const roles = [
  ['super-admin', 'Super Admin'], ['mp', 'MP'], ['mla', 'MLA'], ['mp-staff', 'MP Staff'],
  ['constituency-coordinator', 'Constituency Coordinator'], ['assembly-coordinator', 'Assembly Coordinator'],
  ['mandal-coordinator', 'Mandal Coordinator'], ['village-coordinator', 'Village Coordinator'], ['government-officer', 'Government Officer'],
] as const;

function AdminUserInvitationsPage() {
  const [form, setForm] = useState({ name: '', email: '', role_slug: 'mp-staff' });
  const [result, setResult] = useState<OfficialInvitation>();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError(''); setResult(undefined);
    try { setResult(await createOfficialInvitation(form)); setForm({ name: '', email: '', role_slug: 'mp-staff' }); }
    catch (e) { setError(getApiErrorMessage(e, 'Invitation could not be created.')); } finally { setSaving(false); }
  };
  return <RoleGuard route="/admin"><div className="mx-auto max-w-4xl space-y-6 p-6"><div><p className="text-sm font-medium text-primary">Administration</p><h1 className="text-3xl font-bold">Official user invitations</h1><p className="mt-1 text-muted-foreground">Create secure registration links for official roles. Users choose only their password; role and scope remain controlled by the office.</p></div><div className="rounded-xl border bg-card p-6 shadow-sm"><div className="mb-5 flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Issue invitation</h2></div><form onSubmit={submit} className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="invite-name">Full name</Label><Input id="invite-name" className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div><div><Label htmlFor="invite-email">Official email</Label><Input id="invite-email" type="email" className="mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div><div><Label htmlFor="invite-role">Role</Label><select id="invite-role" className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.role_slug} onChange={(e) => setForm({ ...form, role_slug: e.target.value })}>{roles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div className="flex items-end"><Button type="submit" disabled={saving}>{saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating</> : 'Create secure invitation'}</Button></div></form>{error && <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}</div>{result && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"><h2 className="font-semibold text-emerald-950">Invitation created</h2><p className="mt-1 text-sm text-emerald-900">Send this link privately to {result.email}. It expires in three days and can be used once.</p><div className="mt-3 flex gap-2"><Input readOnly value={result.registration_url} /><Button type="button" variant="outline" onClick={() => navigator.clipboard.writeText(result.registration_url ?? '')}><Copy className="mr-2 h-4 w-4" />Copy</Button></div></div>}</div></RoleGuard>;
}
