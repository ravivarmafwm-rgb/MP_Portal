import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { getApiErrorMessage, withdrawSchemeApplication } from "@/lib/api";

export function CitizenSchemeWithdrawalDialog({
  applicationId,
}: {
  applicationId: string;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const mutation = useMutation({
    mutationFn: () => withdrawSchemeApplication(applicationId, reason),
    onSuccess: async () => {
      toast.success("Application withdrawn.");
      setOpen(false);
      setReason("");
      await Promise.all([
        client.invalidateQueries({ queryKey: ["my-scheme-applications"] }),
        client.invalidateQueries({ queryKey: ["my-citizen"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw application</DialogTitle>
          <DialogDescription>
            This records an auditable withdrawal. Approved or paid applications
            cannot be withdrawn.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <div>
            <Label>Reason</Label>
            <Textarea
              required
              minLength={15}
              maxLength={2000}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </div>
          <Button
            className="w-full"
            variant="destructive"
            disabled={mutation.isPending || reason.trim().length < 15}
          >
            {mutation.isPending ? "Withdrawing..." : "Confirm withdrawal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
