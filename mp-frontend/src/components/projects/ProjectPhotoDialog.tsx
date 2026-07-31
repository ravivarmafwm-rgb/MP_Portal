import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { getApiErrorMessage, uploadProjectPhoto } from "@/lib/api";

export function ProjectPhotoDialog({ projectId }: { projectId: string }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoDate, setPhotoDate] = useState("");
  const [before, setBefore] = useState(false);
  const [after, setAfter] = useState(false);
  const mutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("Select a photo.");
      const data = new FormData();
      data.append("photo", file);
      data.append("title", title);
      data.append("description", description);
      data.append("photo_date", photoDate);
      data.append("is_before", before ? "1" : "0");
      data.append("is_after", after ? "1" : "0");
      return uploadProjectPhoto(projectId, data);
    },
    onSuccess: async () => {
      toast.success("Project photo uploaded securely.");
      setOpen(false);
      setFile(null);
      setTitle("");
      setDescription("");
      setPhotoDate("");
      setBefore(false);
      setAfter(false);
      await client.invalidateQueries({
        queryKey: ["project-detail", projectId],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <ImagePlus className="mr-2 h-4 w-4" />
          Upload photo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload project photo</DialogTitle>
          <DialogDescription>
            JPG, PNG or WebP, maximum 8 MB. Photos are served only through
            authorized requests.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <Field label="Title">
            <Input
              required
              maxLength={255}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Field>
          <Field label="Photo date">
            <Input
              required
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={photoDate}
              onChange={(e) => setPhotoDate(e.target.value)}
            />
          </Field>
          <Field label="Photo">
            <Input
              required
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </Field>
          <Field label="Description">
            <Textarea
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <div className="flex gap-5">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={before}
                onCheckedChange={(v) => setBefore(v === true)}
              />
              Before work
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={after}
                onCheckedChange={(v) => setAfter(v === true)}
              />
              After work
            </label>
          </div>
          <Button className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Uploading..." : "Upload securely"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
