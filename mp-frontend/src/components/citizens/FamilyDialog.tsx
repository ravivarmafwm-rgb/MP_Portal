import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
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
  createFamily,
  fetchCitizens,
  fetchLocVillages,
  getApiErrorMessage,
  updateFamily,
  type FamilyRecord,
} from "@/lib/api";

export function FamilyDialog({ family }: { family?: FamilyRecord }) {
  const [open, setOpen] = useState(false);
  const [headId, setHeadId] = useState("");
  const [headSearch, setHeadSearch] = useState("");
  const [villageId, setVillageId] = useState(family?.village_id ?? "");
  const [houseNumber, setHouseNumber] = useState(family?.house_number ?? "");
  const [street, setStreet] = useState(family?.street ?? "");
  const [economicStatus, setEconomicStatus] = useState(
    family?.economic_status ?? "middle",
  );
  const [isBpl, setIsBpl] = useState(family?.is_bpl ?? false);
  const client = useQueryClient();
  useEffect(() => {
    if (!open) setHeadSearch("");
  }, [open]);
  const citizens = useQuery({
    queryKey: ["family-citizen-options", headSearch],
    queryFn: () => fetchCitizens({ search: headSearch, per_page: 20 }),
    enabled: open,
  });
  const villages = useQuery({
    queryKey: ["location-villages"],
    queryFn: () => fetchLocVillages(),
    enabled: open,
  });
  const mutation = useMutation({
    mutationFn: () =>
      family
        ? updateFamily(family.id, {
            ...(headId ? { head_citizen_id: headId } : {}),
            village_id: villageId,
            house_number: houseNumber || null,
            street: street || null,
            economic_status: economicStatus,
            is_bpl: isBpl,
          })
        : createFamily({
            head_citizen_id: headId,
            village_id: villageId,
            house_number: houseNumber || null,
            street: street || null,
            economic_status: economicStatus,
            is_bpl: isBpl,
          }),
    onSuccess: async () => {
      toast.success(family ? "Family updated." : "Family created.");
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["families"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={family ? "outline" : "default"}>
          {family ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {family ? "Edit" : "New Family"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{family ? "Edit family" : "Create family"}</DialogTitle>
          <DialogDescription>
            {family
              ? "Update household details or select an existing member as head."
              : "A family must begin with a real citizen record as its head."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Find citizen {family && "(optional new head)"}</Label>
            <Input
              value={headSearch}
              onChange={(e) => setHeadSearch(e.target.value)}
              placeholder="Name, mobile, voter ID or citizen ID"
            />
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={headId}
              onChange={(e) => setHeadId(e.target.value)}
            >
              <option value="">
                {family ? "Keep current head" : "Select head"}
              </option>
              {citizens.data?.data.map((citizen) => (
                <option key={String(citizen.id)} value={String(citizen.id)}>
                  {String(citizen.first_name)} {String(citizen.last_name)} (
                  {String(citizen.unique_id)})
                </option>
              ))}
            </select>
            {citizens.isError && (
              <p className="text-sm text-destructive">
                Citizen options could not be loaded.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Village</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={villageId}
              onChange={(e) => setVillageId(e.target.value)}
            >
              <option value="">Select village</option>
              {villages.data?.map((village) => (
                <option key={village.id} value={village.id}>
                  {village.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>House number</Label>
              <Input
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Street</Label>
              <Input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Economic status</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={economicStatus}
              onChange={(e) => setEconomicStatus(e.target.value)}
            >
              {["bpl", "low", "middle", "upper_middle", "high"].map((value) => (
                <option key={value} value={value}>
                  {value.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={isBpl}
              onCheckedChange={(value) => setIsBpl(value === true)}
            />{" "}
            Below poverty line
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={mutation.isPending || !villageId || (!family && !headId)}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Saving…" : "Save family"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
