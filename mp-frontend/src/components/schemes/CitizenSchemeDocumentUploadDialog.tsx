import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  getApiErrorMessage,
  downloadDocument,
  uploadSchemeApplicationDocument,
  type SchemeApplicationRecord,
} from "@/lib/api";

export function CitizenSchemeDocumentUploadDialog({
  application,
}: {
  application: SchemeApplicationRecord;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [requirementId, setRequirementId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const requirements = application.scheme.required_documents ?? [];
  const mutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("Select a document.");
      const form = new FormData();
      form.append("requirement_id", requirementId);
      form.append("file", file);
      form.append("document_date", date);
      if (description) form.append("description", description);
      return uploadSchemeApplicationDocument(application.id, form);
    },
    onSuccess: async () => {
      toast.success("Document uploaded for verification.");
      setOpen(false);
      setRequirementId("");
      setFile(null);
      setDate("");
      setDescription("");
      await client.invalidateQueries({ queryKey: ["my-scheme-applications"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  if (
    !requirements.length ||
    !["submitted", "under_review"].includes(application.status)
  )
    return null;
  return (
    <div className="w-full space-y-2">
      <div className="flex flex-wrap gap-2">
        {requirements.map((requirement) => {
          const reviews = (application.document_reviews ?? []).filter(
            (review) => review.requirement.id === requirement.id,
          );
          const latest = reviews.at(-1);
          return (
            <Badge
              key={requirement.id}
              variant={
                latest?.status === "verified"
                  ? "secondary"
                  : latest?.status === "rejected"
                    ? "destructive"
                    : "outline"
              }
            >
              {requirement.name}: {latest?.status ?? "missing"}
            </Badge>
          );
        })}
      </div>
      {(application.document_reviews ?? []).map((review) => (
        <div key={review.id} className="flex items-center gap-2 text-xs">
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              downloadDocument(
                review.document.id,
                review.document.file_name,
              ).catch((error) => toast.error(getApiErrorMessage(error)))
            }
          >
            Download {review.requirement.name}
          </Button>
          {review.rejection_reason && (
            <span className="text-destructive">{review.rejection_reason}</span>
          )}
        </div>
      ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <Upload className="mr-1 h-4 w-4" />
            Upload document
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload application document</DialogTitle>
            <DialogDescription>
              The file is private and will be reviewed by authorized scheme
              staff.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate();
            }}
          >
            <div>
              <Label>Requirement</Label>
              <Select value={requirementId} onValueChange={setRequirementId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select requirement" />
                </SelectTrigger>
                <SelectContent>
                  {requirements.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                      {item.is_mandatory ? " (mandatory)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Document date</Label>
              <Input
                required
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div>
              <Label>File</Label>
              <Input
                required
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                maxLength={1000}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={mutation.isPending || !requirementId || !file || !date}
            >
              {mutation.isPending ? "Uploading..." : "Upload securely"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
