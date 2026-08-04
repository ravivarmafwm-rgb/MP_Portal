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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getApiErrorMessage,
  reviewSchemeApplication,
  type SchemeApplicationRecord,
} from "@/lib/api";

type Action = "start_review" | "mark_pending" | "approve" | "reject";

export function SchemeApplicationReviewActions({
  application,
}: {
  application: SchemeApplicationRecord;
}) {
  const client = useQueryClient();
  const [action, setAction] = useState<Action | null>(null);
  const [remarks, setRemarks] = useState("");
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const mutation = useMutation({
    mutationFn: () =>
      reviewSchemeApplication(application.id, {
        action: action!,
        remarks: remarks || undefined,
        rejection_reason: action === "reject" ? reason : undefined,
        pending_reason: action === "mark_pending" ? reason : undefined,
        sanctioned_amount: action === "approve" ? Number(amount) : undefined,
        sanction_order_number: action === "approve" ? orderNumber : undefined,
      }),
    onSuccess: async () => {
      toast.success("Application status updated.");
      setAction(null);
      setRemarks("");
      setReason("");
      setAmount("");
      setOrderNumber("");
      await Promise.all([
        client.invalidateQueries({
          queryKey: ["scheme-application", application.id],
        }),
        client.invalidateQueries({ queryKey: ["scheme-applications"] }),
        client.invalidateQueries({ queryKey: ["scheme-stats"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const options: Array<{ action: Action; label: string }> = [
    "pending",
    "submitted",
  ].includes(application.status)
    ? [{ action: "start_review", label: "Start review" }]
    : application.status === "under_review"
      ? [
          { action: "approve", label: "Approve" },
          { action: "reject", label: "Reject" },
          { action: "mark_pending", label: "Return to pending" },
        ]
      : [];
  if (!options.length) return null;
  return (
    <>
      <div className="flex gap-2">
        {options.map((option) => (
          <Button
            key={option.action}
            variant={option.action === "reject" ? "destructive" : "default"}
            onClick={() => setAction(option.action)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <Dialog
        open={action !== null}
        onOpenChange={(open) => !open && setAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">
              {action?.replaceAll("_", " ")}
            </DialogTitle>
            <DialogDescription>
              This transition is audited and the citizen will be notified.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate();
            }}
          >
            {action === "approve" && (
              <>
                <div>
                  <Label htmlFor="sanction-amount">Sanctioned amount</Label>
                  <Input
                    id="sanction-amount"
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sanction-order">Sanction order number</Label>
                  <Input
                    id="sanction-order"
                    required
                    maxLength={100}
                    value={orderNumber}
                    onChange={(event) => setOrderNumber(event.target.value)}
                  />
                </div>
              </>
            )}
            {action === "reject" && (
              <div>
                <Label htmlFor="rejection-reason">Rejection reason</Label>
                <Textarea
                  id="rejection-reason"
                  required
                  minLength={20}
                  maxLength={2000}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </div>
            )}
            {action === "mark_pending" && (
              <div>
                <Label htmlFor="pending-reason">Pending reason</Label>
                <Textarea id="pending-reason" required minLength={10} maxLength={3000} value={reason} onChange={(event) => setReason(event.target.value)} />
              </div>
            )}
            <div>
              <Label htmlFor="review-remarks">Review remarks</Label>
              <Textarea
                id="review-remarks"
                maxLength={3000}
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={
                mutation.isPending ||
                (action === "approve" && (!amount || !orderNumber)) ||
                (action === "reject" && reason.trim().length < 20) ||
                (action === "mark_pending" && reason.trim().length < 10)
              }
            >
              {mutation.isPending ? "Saving..." : "Confirm transition"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
