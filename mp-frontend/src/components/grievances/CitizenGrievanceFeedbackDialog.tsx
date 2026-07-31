import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquareText } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage, submitCitizenGrievanceFeedback } from "@/lib/api";

export function CitizenGrievanceFeedbackDialog({
  grievanceId,
  hasFeedback,
}: {
  grievanceId: string;
  hasFeedback: boolean;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(false);
  const [reopen, setReopen] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const mutation = useMutation({
    mutationFn: () =>
      submitCitizenGrievanceFeedback(grievanceId, {
        rating: Number(rating),
        comments,
        would_recommend: wouldRecommend,
        reopen_requested: reopen,
        ...(reopen ? { reopen_reason: reopenReason } : {}),
      }),
    onSuccess: async () => {
      toast.success(
        reopen
          ? "Reopen request submitted to the constituency office."
          : "Feedback submitted.",
      );
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["my-grievances"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <MessageSquareText className="mr-1 h-4 w-4" />
          {hasFeedback ? "Update feedback" : "Give feedback"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolution feedback</DialogTitle>
          <DialogDescription>
            Your feedback is linked only to your verified citizen record and
            this grievance.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label>Rating</Label>
          <Select required value={rating} onValueChange={setRating}>
            <SelectTrigger>
              <SelectValue placeholder="Select 1 to 5" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value} / 5
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`feedback-${grievanceId}`}>Comments</Label>
          <Textarea
            id={`feedback-${grievanceId}`}
            required
            minLength={10}
            maxLength={2000}
            value={comments}
            onChange={(event) => setComments(event.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`recommend-${grievanceId}`}
            checked={wouldRecommend}
            onCheckedChange={(value) => setWouldRecommend(value === true)}
          />
          <Label htmlFor={`recommend-${grievanceId}`}>
            I am satisfied with the grievance process
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`reopen-${grievanceId}`}
            checked={reopen}
            onCheckedChange={(value) => setReopen(value === true)}
          />
          <Label htmlFor={`reopen-${grievanceId}`}>
            Request that this grievance be reopened
          </Label>
        </div>
        {reopen && (
          <div>
            <Label htmlFor={`reopen-reason-${grievanceId}`}>
              Why should this case be reopened?
            </Label>
            <Textarea
              id={`reopen-reason-${grievanceId}`}
              required
              minLength={20}
              maxLength={2000}
              value={reopenReason}
              onChange={(event) => setReopenReason(event.target.value)}
            />
          </div>
        )}
        <Button
          disabled={
            mutation.isPending ||
            !rating ||
            comments.trim().length < 10 ||
            (reopen && reopenReason.trim().length < 20)
          }
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Submitting..." : "Submit feedback"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
