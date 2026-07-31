import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2, UsersRound } from "lucide-react";
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
  bulkArchiveCitizens,
  bulkUpdateCitizens,
  getApiErrorMessage,
} from "@/lib/api";

export function BulkCitizenActions({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState(false);
  const [occupation, setOccupation] = useState("");
  const [education, setEducation] = useState("");
  const [isVoter, setIsVoter] = useState("");
  const client = useQueryClient();
  const update = useMutation({
    mutationFn: () =>
      bulkUpdateCitizens({
        citizen_ids: ids,
        ...(occupation.trim() ? { occupation: occupation.trim() } : {}),
        ...(education.trim() ? { education: education.trim() } : {}),
        ...(isVoter ? { is_voter: isVoter === "true" } : {}),
      }),
    onSuccess: async (result) => {
      toast.success(String(result.updated) + " citizen records updated.");
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["citizens"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const archive = useMutation({
    mutationFn: () => bulkArchiveCitizens(ids),
    onSuccess: async (result) => {
      toast.success(String(result.archived) + " citizen records archived.");
      await client.invalidateQueries({ queryKey: ["citizens"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/30 p-2">
      <span className="text-sm font-medium">{ids.length} selected</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <UsersRound className="h-4 w-4" /> Bulk update
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update selected citizens</DialogTitle>
            <DialogDescription>
              Only fields you fill will change. Every record remains subject to
              geographic authorization and audit logging.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Occupation</Label>
              <Input
                value={occupation}
                onChange={(event) => setOccupation(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Education</Label>
              <Input
                value={education}
                onChange={(event) => setEducation(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Voter status</Label>
              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={isVoter}
                onChange={(event) => setIsVoter(event.target.value)}
              >
                <option value="">Keep current</option>
                <option value="true">Voter</option>
                <option value="false">Non-voter</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={
                update.isPending ||
                (!occupation.trim() && !education.trim() && !isVoter)
              }
              onClick={() => update.mutate()}
            >
              {update.isPending ? "Updating…" : "Update records"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button
        size="sm"
        variant="destructive"
        disabled={archive.isPending}
        onClick={() => {
          if (
            window.confirm(
              "Archive the selected citizens? Records with linked activity will be rejected.",
            )
          )
            archive.mutate();
        }}
      >
        <Trash2 className="h-4 w-4" /> Bulk archive
      </Button>
    </div>
  );
}
