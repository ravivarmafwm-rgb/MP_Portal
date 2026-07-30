import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { assignSurvey, fetchVolunteers, getApiErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SurveyAssignmentDialog({
  surveyId,
  open,
  onOpenChange,
}: {
  surveyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [target, setTarget] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [remarks, setRemarks] = useState("");
  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelected([]);
      setTarget("");
      setDueDate("");
      setRemarks("");
    }
  }, [open]);
  const volunteers = useQuery({
    queryKey: ["survey-assignment-volunteers", search],
    queryFn: () => fetchVolunteers({ search, status: "active", per_page: 100 }),
    enabled: open,
  });
  const save = useMutation({
    mutationFn: () =>
      assignSurvey(surveyId, {
        volunteer_ids: selected,
        target_responses: target ? Number(target) : null,
        due_date: dueDate || null,
        remarks: remarks || null,
      }),
    onSuccess: async (result) => {
      toast.success(
        `${result.volunteer_count} volunteer${result.volunteer_count === 1 ? "" : "s"} assigned.`,
      );
      await client.invalidateQueries({
        queryKey: ["survey-assignments", surveyId],
      });
      onOpenChange(false);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const rows = volunteers.data?.data ?? [];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign field volunteers</DialogTitle>
          <DialogDescription>
            Select active volunteers within your geographic scope.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
              placeholder="Search volunteer, mobile, or ID"
            />
          </div>
          <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border p-2">
            {volunteers.isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : rows.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No active volunteers found in your scope.
              </p>
            ) : (
              rows.map((volunteer) => {
                const checked = selected.includes(volunteer.id);
                return (
                  <label
                    key={volunteer.id}
                    className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-muted/60"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() =>
                        setSelected((current) =>
                          checked
                            ? current.filter((id) => id !== volunteer.id)
                            : [...current, volunteer.id],
                        )
                      }
                    />
                    <span className="flex-1 text-sm font-medium">
                      {volunteer.first_name} {volunteer.last_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {volunteer.village?.name ?? "No village"} ·{" "}
                      {volunteer.volunteer_id}
                    </span>
                  </label>
                );
              })
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="assignment-target">Target per volunteer</Label>
              <Input
                id="assignment-target"
                type="number"
                min={1}
                value={target}
                onChange={(event) => setTarget(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assignment-due">Due date</Label>
              <Input
                id="assignment-due"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="assignment-remarks">Instructions</Label>
            <Input
              id="assignment-remarks"
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              maxLength={2000}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={selected.length === 0 || save.isPending}
            onClick={() => save.mutate()}
          >
            {save.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Assign {selected.length || ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
