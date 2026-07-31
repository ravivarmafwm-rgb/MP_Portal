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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createBenefitDisbursement,
  getApiErrorMessage,
  transitionBenefitDisbursement,
  type SchemeApplicationRecord,
} from "@/lib/api";

type Transition = "complete" | "fail" | "retry";

export function BenefitDisbursementActions({
  application,
}: {
  application: SchemeApplicationRecord;
}) {
  const client = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [transition, setTransition] = useState<{
    id: string;
    action: Transition;
  } | null>(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<
    "bank_transfer" | "cheque" | "cash" | "in_kind"
  >("bank_transfer");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [reference, setReference] = useState("");
  const [details, setDetails] = useState("");
  const refresh = () =>
    client.invalidateQueries({
      queryKey: ["scheme-application", application.id],
    });
  const createMutation = useMutation({
    mutationFn: () =>
      createBenefitDisbursement(application.id, {
        amount: Number(amount),
        payment_mode: mode,
        disbursement_date: date,
        bank_name: mode === "bank_transfer" ? bank : undefined,
        account_number: mode === "bank_transfer" ? account : undefined,
        ifsc_code: mode === "bank_transfer" ? ifsc.toUpperCase() : undefined,
        reference_number: mode === "cash" ? undefined : reference,
      }),
    onSuccess: async () => {
      toast.success("Pending disbursement recorded.");
      setCreateOpen(false);
      setAmount("");
      setBank("");
      setAccount("");
      setIfsc("");
      setReference("");
      await refresh();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const transitionMutation = useMutation({
    mutationFn: () =>
      transitionBenefitDisbursement(transition!.id, {
        action: transition!.action,
        transaction_id: transition!.action === "complete" ? details : undefined,
        failure_reason: transition!.action === "fail" ? details : undefined,
        retry_date: transition!.action === "retry" ? details : undefined,
      }),
    onSuccess: async () => {
      toast.success("Disbursement status updated.");
      setTransition(null);
      setDetails("");
      await refresh();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const committed = (application.benefit_disbursements ?? [])
    .filter((item) => ["pending", "completed"].includes(item.status))
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = Math.max(
    Number(application.sanctioned_amount ?? 0) - committed,
    0,
  );
  return (
    <>
      {application.status === "approved" && remaining > 0 && (
        <Button onClick={() => setCreateOpen(true)}>Record benefit</Button>
      )}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record pending benefit</DialogTitle>
            <DialogDescription>
              Remaining sanctioned amount: ₹{remaining.toLocaleString("en-IN")}.
              Bank details are encrypted and API responses expose only masks.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate();
            }}
          >
            <div>
              <Label htmlFor="benefit-amount">Amount</Label>
              <Input
                id="benefit-amount"
                required
                type="number"
                min="0.01"
                max={remaining}
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div>
              <Label>Payment mode</Label>
              <Select
                value={mode}
                onValueChange={(value) => setMode(value as typeof mode)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="in_kind">In kind</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="benefit-date">Disbursement date</Label>
              <Input
                id="benefit-date"
                required
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            {mode === "bank_transfer" && (
              <>
                <div>
                  <Label htmlFor="benefit-bank">Bank</Label>
                  <Input
                    id="benefit-bank"
                    required
                    maxLength={150}
                    value={bank}
                    onChange={(event) => setBank(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="benefit-account">Account number</Label>
                  <Input
                    id="benefit-account"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{9,18}"
                    value={account}
                    onChange={(event) => setAccount(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="benefit-ifsc">IFSC</Label>
                  <Input
                    id="benefit-ifsc"
                    required
                    pattern="[A-Za-z]{4}0[A-Za-z0-9]{6}"
                    value={ifsc}
                    onChange={(event) => setIfsc(event.target.value)}
                  />
                </div>
              </>
            )}
            {mode !== "cash" && (
              <div>
                <Label htmlFor="benefit-reference">Reference number</Label>
                <Input
                  id="benefit-reference"
                  required
                  maxLength={100}
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                />
              </div>
            )}
            <Button
              className="w-full"
              disabled={createMutation.isPending || !amount}
            >
              {createMutation.isPending
                ? "Saving..."
                : "Create pending disbursement"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={transition !== null}
        onOpenChange={(open) => !open && setTransition(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">
              {transition?.action} disbursement
            </DialogTitle>
            <DialogDescription>
              This change is validated, audited, and sent to the citizen.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              transitionMutation.mutate();
            }}
          >
            <div>
              <Label htmlFor="transition-details">
                {transition?.action === "complete"
                  ? "Transaction ID"
                  : transition?.action === "fail"
                    ? "Failure reason"
                    : "Retry date"}
              </Label>
              {transition?.action === "fail" ? (
                <Textarea
                  id="transition-details"
                  required
                  minLength={15}
                  maxLength={2000}
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                />
              ) : (
                <Input
                  id="transition-details"
                  required
                  type={transition?.action === "retry" ? "date" : "text"}
                  min={
                    transition?.action === "retry"
                      ? new Date().toISOString().slice(0, 10)
                      : undefined
                  }
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                />
              )}
            </div>
            <Button
              className="w-full"
              disabled={transitionMutation.isPending || !details}
            >
              {transitionMutation.isPending ? "Saving..." : "Confirm"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="divide-y rounded-lg border">
        {(application.benefit_disbursements ?? []).map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div className="text-sm">
              <div className="font-medium">
                ₹{Number(item.amount).toLocaleString("en-IN")} ·{" "}
                {item.disbursement_number}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(item.disbursement_date).toLocaleDateString("en-IN")} ·{" "}
                {item.payment_mode.replaceAll("_", " ")} · {item.status}
              </div>
              {item.account_number_masked && (
                <div className="text-xs text-muted-foreground">
                  Account {item.account_number_masked} · {item.ifsc_masked}
                </div>
              )}
              {item.failure_reason && (
                <div className="text-xs text-destructive">
                  {item.failure_reason}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {item.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    onClick={() =>
                      setTransition({ id: item.id, action: "complete" })
                    }
                  >
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      setTransition({ id: item.id, action: "fail" })
                    }
                  >
                    Mark failed
                  </Button>
                </>
              )}
              {item.status === "failed" && (
                <Button
                  size="sm"
                  onClick={() =>
                    setTransition({ id: item.id, action: "retry" })
                  }
                >
                  Retry
                </Button>
              )}
            </div>
          </div>
        ))}
        {!application.benefit_disbursements?.length && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No benefit disbursements are recorded.
          </div>
        )}
      </div>
    </>
  );
}
