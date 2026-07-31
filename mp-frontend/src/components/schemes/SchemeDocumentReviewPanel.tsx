import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getApiErrorMessage,
  downloadDocument,
  reviewSchemeApplicationDocument,
  type SchemeApplicationRecord,
} from "@/lib/api";

export function SchemeDocumentReviewPanel({
  application,
}: {
  application: SchemeApplicationRecord;
}) {
  const client = useQueryClient();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const mutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "verify" | "reject" }) =>
      reviewSchemeApplicationDocument(id, {
        action,
        rejection_reason: action === "reject" ? reason : undefined,
      }),
    onSuccess: async () => {
      toast.success("Document review saved.");
      setRejectId(null);
      setReason("");
      await client.invalidateQueries({
        queryKey: ["scheme-application", application.id],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const reviews = application.document_reviews ?? [];
  const requirements = application.scheme.required_documents ?? [];
  return (
    <div className="space-y-3">
      {requirements.map((requirement) => {
        const matching = reviews.filter(
          (review) => review.requirement.id === requirement.id,
        );
        return (
          <div key={requirement.id} className="rounded-lg border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">
                {requirement.name}
                {requirement.is_mandatory && (
                  <Badge variant="destructive" className="ml-2">
                    Mandatory
                  </Badge>
                )}
              </div>
              {!matching.length && <Badge variant="outline">Missing</Badge>}
            </div>
            {matching.map((review) => (
              <div
                key={review.id}
                className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-sm"
              >
                <div>
                  <div>{review.document.file_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {review.status}
                    {review.rejection_reason
                      ? ` · ${review.rejection_reason}`
                      : ""}
                  </div>
                </div>
                {review.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        downloadDocument(
                          review.document.id,
                          review.document.file_name,
                        ).catch((error) =>
                          toast.error(getApiErrorMessage(error)),
                        )
                      }
                    >
                      Download
                    </Button>
                    <Button
                      size="sm"
                      disabled={mutation.isPending}
                      onClick={() =>
                        mutation.mutate({ id: review.id, action: "verify" })
                      }
                    >
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setRejectId(review.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
      {!requirements.length && (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No structured document requirements are configured.
        </div>
      )}
      <Dialog
        open={rejectId !== null}
        onOpenChange={(open) => !open && setRejectId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject document</DialogTitle>
            <DialogDescription>
              The citizen will see this reason and can upload a replacement.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate({ id: rejectId!, action: "reject" });
            }}
          >
            <div>
              <Label>Rejection reason</Label>
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
              {mutation.isPending ? "Saving..." : "Reject document"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
