import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createVolunteerVisit,
  fetchCitizens,
  fetchFamilies,
  fetchLocVillages,
  fetchVolunteers,
  getApiErrorMessage,
} from "@/lib/api";

type CitizenOption = {
  id: string;
  unique_id: string;
  first_name: string;
  last_name: string;
};
type FamilyOption = {
  id: string;
  family_id: string;
  head_of_family_name: string;
};

export function VolunteerVisitCreateDialog() {
  const [open, setOpen] = useState(false);
  const [volunteerId, setVolunteerId] = useState("");
  const [villageId, setVillageId] = useState("");
  const [type, setType] = useState("household");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [targetType, setTargetType] = useState("none");
  const [targetId, setTargetId] = useState("");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState("");
  const client = useQueryClient();
  const volunteers = useQuery({
    queryKey: ["visit-volunteers"],
    queryFn: () => fetchVolunteers({ per_page: 100 }),
    enabled: open,
  });
  const villages = useQuery<{ id: string; name: string }[]>({
    queryKey: ["visit-villages"],
    queryFn: () => fetchLocVillages(),
    enabled: open,
  });
  const citizens = useQuery<{ data: CitizenOption[] }>({
    queryKey: ["visit-citizens"],
    queryFn: () => fetchCitizens({ per_page: 100 }),
    enabled: open && targetType === "citizen",
  });
  const families = useQuery<{ data: FamilyOption[] }>({
    queryKey: ["visit-families"],
    queryFn: () => fetchFamilies({ per_page: 100 }),
    enabled: open && targetType === "family",
  });
  const mutation = useMutation({
    mutationFn: () =>
      createVolunteerVisit({
        volunteer_id: volunteerId,
        village_id: villageId,
        ...(targetType === "citizen" ? { citizen_id: targetId } : {}),
        ...(targetType === "family" ? { family_id: targetId } : {}),
        visit_type: type,
        scheduled_at: scheduledAt,
        notes: notes || null,
        follow_up_required: followUpRequired,
        follow_up_date: followUpDate || null,
        follow_up_notes: followUpNotes || null,
      }),
    onSuccess: () => {
      toast.success("Visit assigned.");
      setOpen(false);
      client.invalidateQueries({ queryKey: ["volunteer-visits"] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          Assign visit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign field visit</DialogTitle>
          <DialogDescription>
            Create a real household or citizen visit for a volunteer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Volunteer</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={volunteerId}
              onChange={(e) => setVolunteerId(e.target.value)}
            >
              <option value="">Select volunteer</option>
              {volunteers.data?.data.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.first_name} {v.last_name} ({v.volunteer_id})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label>Village</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={villageId}
              onChange={(e) => setVillageId(e.target.value)}
            >
              <option value="">Select village</option>
              {villages.data?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label>Visit type</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {[
                "household",
                "citizen",
                "scheme",
                "survey",
                "grievance",
                "follow_up",
              ].map((v) => (
                <option key={v} value={v}>
                  {v.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label>Visit target</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={targetType}
              onChange={(e) => {
                setTargetType(e.target.value);
                setTargetId("");
              }}
            >
              <option value="none">General visit</option>
              <option value="family">Household / family</option>
              <option value="citizen">Citizen</option>
            </select>
            {targetType !== "none" && (
              <select
                className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
              >
                <option value="">Select {targetType}</option>
                {targetType === "citizen"
                  ? (citizens.data?.data ?? []).map((c: CitizenOption) => (
                      <option key={c.id} value={c.id}>
                        {c.first_name} {c.last_name} ({c.unique_id})
                      </option>
                    ))
                  : (families.data?.data ?? []).map((f: FamilyOption) => (
                      <option key={f.id} value={f.id}>
                        {f.head_of_family_name} ({f.family_id})
                      </option>
                    ))}
              </select>
            )}
          </div>
          <div className="space-y-1">
            <Label>Schedule</Label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Notes</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={10000}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={followUpRequired}
              onChange={(e) => setFollowUpRequired(e.target.checked)}
            />{" "}
            Follow-up required
          </label>
          {followUpRequired && (
            <>
              <div className="space-y-1">
                <Label>Follow-up date</Label>
                <Input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Follow-up notes</Label>
                <Input
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  maxLength={5000}
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            disabled={
              mutation.isPending ||
              !volunteerId ||
              !villageId ||
              !scheduledAt ||
              (targetType !== "none" && !targetId) ||
              (followUpRequired && !followUpDate)
            }
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Assigning…" : "Assign visit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
