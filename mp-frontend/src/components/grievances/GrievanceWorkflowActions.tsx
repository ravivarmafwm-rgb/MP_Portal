import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  CircleX,
  LockKeyhole,
  MessageSquarePlus,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  closeGrievance,
  getApiErrorMessage,
  resolveGrievance,
  respondToGrievanceAssignment,
  reopenGrievance,
  addGrievanceNote,
  type GrievanceRecord,
} from "@/lib/api";

export function GrievanceWorkflowActions({
  grievance,
  userId,
  roleSlug,
}: {
  grievance: GrievanceRecord;
  userId: string;
  roleSlug: string;
}) {
  const currentAssignment = [...(grievance.assignments ?? [])]
    .reverse()
    .find((assignment) => assignment.status === "assigned");
  const isAssignee = currentAssignment?.assigned_to?.id === userId;
  const leadership = ["super-admin", "mp", "mp-staff"].includes(roleSlug);

  return (
    <div className="flex flex-wrap gap-2">
      {isAssignee && currentAssignment && (
        <AssignmentResponse
          grievanceId={grievance.id}
          assignmentId={currentAssignment.id}
        />
      )}
      {["in_progress", "escalated"].includes(grievance.status) &&
        (isAssignee || grievance.assigned_to?.id === userId || leadership) && (
          <ResolveAction grievanceId={grievance.id} />
        )}
      {grievance.status === "resolved" && leadership && (
        <CloseAction grievanceId={grievance.id} />
      )}
      {(["resolved", "closed"] as string[]).includes(grievance.status) &&
        (leadership || isAssignee) && (
          <ReopenAction grievanceId={grievance.id} />
        )}
      <NoteAction grievanceId={grievance.id} />
    </div>
  );
}

function ReopenAction({ grievanceId }: { grievanceId: string }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const mutation = useMutation({
    mutationFn: () => reopenGrievance(grievanceId, reason),
    onSuccess: async () => {
      toast.success("Grievance reopened.");
      setOpen(false);
      await invalidate(client, grievanceId);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <RotateCcw className="mr-1 h-4 w-4" />
          Reopen
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reopen grievance</DialogTitle>
          <DialogDescription>
            Record why this resolved case requires further action.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          minLength={10}
          maxLength={2000}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button
          disabled={mutation.isPending || reason.trim().length < 10}
          onClick={() => mutation.mutate()}
        >
          Confirm reopen
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function NoteAction({ grievanceId }: { grievanceId: string }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const mutation = useMutation({
    mutationFn: () => addGrievanceNote(grievanceId, remarks),
    onSuccess: async () => {
      toast.success("Internal note added.");
      setOpen(false);
      setRemarks("");
      await invalidate(client, grievanceId);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <MessageSquarePlus className="mr-1 h-4 w-4" />
          Internal note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add internal note</DialogTitle>
          <DialogDescription>
            This note is visible only to authorized grievance staff.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          maxLength={10000}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <Button
          disabled={mutation.isPending || !remarks.trim()}
          onClick={() => mutation.mutate()}
        >
          Save note
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function AssignmentResponse({
  grievanceId,
  assignmentId,
}: {
  grievanceId: string;
  assignmentId: string;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const respond = useMutation({
    mutationFn: (action: "accept" | "reject") =>
      respondToGrievanceAssignment(grievanceId, assignmentId, {
        action,
        ...(action === "reject" ? { rejection_reason: reason } : {}),
      }),
    onSuccess: async (_, action) => {
      toast.success(
        action === "accept" ? "Assignment accepted." : "Assignment rejected.",
      );
      setOpen(false);
      await invalidate(client, grievanceId);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <>
      <Button
        size="sm"
        onClick={() => respond.mutate("accept")}
        disabled={respond.isPending}
      >
        <CheckCircle2 className="mr-1 h-4 w-4" />
        Accept assignment
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <CircleX className="mr-1 h-4 w-4" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject assignment</DialogTitle>
            <DialogDescription>
              The case returns to pending and the assigning officer is notified.
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="assignment-rejection">Reason</Label>
          <Textarea
            id="assignment-rejection"
            required
            minLength={10}
            maxLength={2000}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
          <Button
            variant="destructive"
            disabled={respond.isPending || reason.trim().length < 10}
            onClick={() => respond.mutate("reject")}
          >
            Confirm rejection
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ResolveAction({ grievanceId }: { grievanceId: string }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [remarks, setRemarks] = useState("");
  const mutation = useMutation({
    mutationFn: () =>
      resolveGrievance(grievanceId, {
        resolution_summary: summary,
        ...(remarks ? { public_remarks: remarks } : {}),
      }),
    onSuccess: async () => {
      toast.success("Grievance resolved and citizen notified.");
      setOpen(false);
      await invalidate(client, grievanceId);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Resolve
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve grievance</DialogTitle>
          <DialogDescription>
            A substantive resolution is required and becomes part of the
            citizen-visible workflow history.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="resolution-summary">Resolution summary</Label>
        <Textarea
          id="resolution-summary"
          required
          minLength={20}
          maxLength={255}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
        <Label htmlFor="resolution-remarks">Public remarks</Label>
        <Textarea
          id="resolution-remarks"
          maxLength={2000}
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
        />
        <Button
          disabled={mutation.isPending || summary.trim().length < 20}
          onClick={() => mutation.mutate()}
        >
          Confirm resolution
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function CloseAction({ grievanceId }: { grievanceId: string }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const mutation = useMutation({
    mutationFn: () =>
      closeGrievance(grievanceId, {
        citizen_confirmed: confirmed,
        ...(!confirmed ? { override_reason: overrideReason } : {}),
      }),
    onSuccess: async () => {
      toast.success("Grievance closed.");
      setOpen(false);
      await invalidate(client, grievanceId);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <LockKeyhole className="mr-1 h-4 w-4" />
          Close case
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close resolved grievance</DialogTitle>
          <DialogDescription>
            Closure normally requires confirmation that the citizen accepted the
            resolution.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Checkbox
            id="citizen-confirmed"
            checked={confirmed}
            onCheckedChange={(value) => setConfirmed(value === true)}
          />
          <Label htmlFor="citizen-confirmed">
            Citizen confirmed the resolution
          </Label>
        </div>
        {!confirmed && (
          <>
            <Label htmlFor="closure-override">Authorized override reason</Label>
            <Textarea
              id="closure-override"
              required
              minLength={20}
              maxLength={2000}
              value={overrideReason}
              onChange={(event) => setOverrideReason(event.target.value)}
            />
          </>
        )}
        <Button
          disabled={
            mutation.isPending ||
            (!confirmed && overrideReason.trim().length < 20)
          }
          onClick={() => mutation.mutate()}
        >
          Confirm closure
        </Button>
      </DialogContent>
    </Dialog>
  );
}

async function invalidate(
  client: ReturnType<typeof useQueryClient>,
  grievanceId: string,
) {
  await Promise.all([
    client.invalidateQueries({
      queryKey: ["grievance-detail", grievanceId],
    }),
    client.invalidateQueries({ queryKey: ["grievances"] }),
    client.invalidateQueries({ queryKey: ["grievance-stats"] }),
  ]);
}
