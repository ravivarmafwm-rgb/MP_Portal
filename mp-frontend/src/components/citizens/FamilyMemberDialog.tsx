import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, UserPlus } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  addFamilyMember,
  fetchCitizens,
  getApiErrorMessage,
  updateFamilyMember,
  type FamilyRecord,
} from "@/lib/api";

type Member = FamilyRecord["family_members"][number];
type CitizenOption = { id: string; unique_id?: string; first_name: string; last_name: string };

export function FamilyMemberDialog({
  familyId,
  member,
}: {
  familyId: string;
  member?: Member;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [citizenId, setCitizenId] = useState(member?.citizen.id ?? "");
  const [relationship, setRelationship] = useState(
    member?.relationship_with_head ?? "",
  );
  const [isHead, setIsHead] = useState(member?.is_head ?? false);
  const client = useQueryClient();
  const citizens = useQuery<{ data: CitizenOption[] }>({
    queryKey: ["family-member-options", search],
    queryFn: () => fetchCitizens({ search, per_page: 20 }),
    enabled: open,
  });
  const mutation = useMutation({
    mutationFn: () =>
      member
        ? updateFamilyMember(familyId, member.id, {
            citizen_id: citizenId,
            relationship_with_head: relationship,
            is_head: isHead,
          })
        : addFamilyMember(familyId, {
            citizen_id: citizenId,
            relationship_with_head: relationship,
            is_head: isHead,
          }),
    onSuccess: async () => {
      toast.success(member ? "Family member updated." : "Family member added.");
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["families"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {member ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}{" "}
          {member ? "Edit" : "Add member"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {member ? "Edit family member" : "Add family member"}
          </DialogTitle>
          <DialogDescription>
            Select an existing citizen in the same village. A citizen can belong
            to only one family.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!member && (
            <div className="space-y-2">
              <Label>Search citizen</Label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, mobile or citizen ID"
              />
            </div>
          )}
          {!member && (
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={citizenId}
              onChange={(e) => setCitizenId(e.target.value)}
            >
              <option value="">Select citizen</option>
              {citizens.data?.data.map((citizen) => (
                <option key={String(citizen.id)} value={String(citizen.id)}>
                  {String(citizen.first_name)} {String(citizen.last_name)} (
                  {String(citizen.unique_id)})
                </option>
              ))}
            </select>
          )}
          {citizens.isError && (
            <p className="text-sm text-destructive">
              Citizen options could not be loaded.
            </p>
          )}
          <div className="space-y-2">
            <Label>Relationship with head</Label>
            <Input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="Spouse, child, parent…"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={isHead}
              onCheckedChange={(value) => setIsHead(value === true)}
            />{" "}
            Make head of family
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={
              mutation.isPending ||
              !citizenId ||
              relationship.trim().length === 0
            }
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending
              ? "Saving…"
              : member
                ? "Save member"
                : "Add member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
