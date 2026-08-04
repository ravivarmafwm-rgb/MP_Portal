import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Landmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCitizenSchemes, fetchCitizens, getApiErrorMessage, submitAssistedSchemeApplication } from "@/lib/api";
import { saveDraft } from "@/lib/offline-store";
import { useAuth } from "@/lib/auth";

export function VolunteerSchemeApplicationDialog() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [schemeId, setSchemeId] = useState("");
  const [remarks, setRemarks] = useState("");
  const client = useQueryClient();
  const { user } = useAuth();
  const citizens = useQuery({ queryKey: ["scheme-assist-citizens", search], queryFn: () => fetchCitizens({ search, per_page: 20 }), enabled: open && search.length > 1 });
  const schemes = useQuery({ queryKey: ["volunteer-schemes"], queryFn: fetchCitizenSchemes, enabled: open });
  const mutation = useMutation({
    mutationFn: async () => {
      const payload = { target_citizen_id: citizenId, scheme_id: schemeId, remarks: remarks || undefined, application_source: "volunteer" };
      if (!navigator.onLine) {
        if (!user?.id) throw new Error("You must be signed in to save an offline application.");
        await saveDraft({ id: `draft_scheme_${crypto.randomUUID()}`, type: "scheme_application", status: "pending", payload: JSON.stringify(payload), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), retries: 0, userId: user.id, label: `Scheme application for ${search}` });
        return null;
      }
      try { return await submitAssistedSchemeApplication(payload); }
      catch (error) {
        if (!navigator.onLine && user?.id) {
          await saveDraft({ id: `draft_scheme_${crypto.randomUUID()}`, type: "scheme_application", status: "pending", payload: JSON.stringify(payload), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), retries: 0, userId: user.id, label: `Scheme application for ${search}` });
          return null;
        }
        throw error;
      }
    },
    onSuccess: async (application) => { toast.success(application ? `${application.application_number} submitted for review.` : "Saved offline. It will sync automatically when online."); setOpen(false); setCitizenId(""); setSchemeId(""); setSearch(""); setRemarks(""); await client.invalidateQueries({ queryKey: ["scheme-applications"] }); },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="outline"><Landmark className="mr-1 h-4 w-4" />Apply for citizen</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Apply for a citizen</DialogTitle><DialogDescription>Volunteer-assisted applications are attributed to you and limited to your assigned geography.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}><div><Label>Search citizen</Label><Input value={search} onChange={(event) => { setSearch(event.target.value); setCitizenId(""); }} placeholder="Name, mobile or citizen ID" />{citizens.data?.data?.length ? <div className="mt-2 max-h-36 space-y-1 overflow-y-auto">{citizens.data.data.map((citizen) => <button type="button" key={citizen.id} className={`block w-full rounded border p-2 text-left text-sm ${citizenId === citizen.id ? "border-primary bg-primary/5" : ""}`} onClick={() => { setCitizenId(citizen.id); setSearch([citizen.first_name, citizen.last_name].filter(Boolean).join(" ")); }}>{[citizen.first_name, citizen.last_name].filter(Boolean).join(" ")} · {citizen.unique_id}</button>)}</div> : null}</div><div><Label>Scheme</Label><Select value={schemeId} onValueChange={setSchemeId}><SelectTrigger><SelectValue placeholder="Select scheme" /></SelectTrigger><SelectContent>{schemes.data?.data.map((scheme) => <SelectItem key={scheme.id} value={scheme.id}>{scheme.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Field remarks</Label><Textarea maxLength={2000} value={remarks} onChange={(event) => setRemarks(event.target.value)} /></div><Button className="w-full" disabled={mutation.isPending || !citizenId || !schemeId}>{mutation.isPending ? "Submitting..." : "Submit application"}</Button></form></DialogContent></Dialog>;
}
