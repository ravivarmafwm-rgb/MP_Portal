import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, History, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import {
  downloadDocumentVersion,
  fetchDocumentVersions,
  getApiErrorMessage,
  uploadDocumentVersion,
} from "@/lib/api";

export function DocumentVersionsDialog({ documentId }: { documentId: string }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const versions = useQuery({
    queryKey: ["document-versions", documentId],
    queryFn: () => fetchDocumentVersions(documentId),
    enabled: open,
  });
  const upload = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Select a replacement file.");
      const data = new FormData();
      data.append("file", file);
      data.append("change_notes", notes);
      return uploadDocumentVersion(documentId, data);
    },
    onSuccess: async () => {
      toast.success("New document version uploaded.");
      setFile(null);
      setNotes("");
      await Promise.all([
        client.invalidateQueries({
          queryKey: ["document-versions", documentId],
        }),
        client.invalidateQueries({ queryKey: ["documents"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <History className="mr-1 h-3.5 w-3.5" />
          Versions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Document version history</DialogTitle>
          <DialogDescription>
            Previous files remain privately retained and every download is
            audited.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-3 rounded-lg border p-4"
          onSubmit={(event) => {
            event.preventDefault();
            upload.mutate();
          }}
        >
          <div className="font-medium">Upload a new version</div>
          <div>
            <Label htmlFor={`version-file-${documentId}`}>File</Label>
            <Input
              id={`version-file-${documentId}`}
              required
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>
          <div>
            <Label htmlFor={`version-notes-${documentId}`}>Change notes</Label>
            <Textarea
              id={`version-notes-${documentId}`}
              required
              maxLength={2000}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Describe what changed in this version"
            />
          </div>
          <Button disabled={upload.isPending || !file || !notes.trim()}>
            <Upload className="mr-2 h-4 w-4" />
            {upload.isPending ? "Uploading..." : "Upload version"}
          </Button>
        </form>

        {versions.isLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading version history...
          </div>
        ) : versions.isError ? (
          <div className="py-6 text-center text-sm text-destructive">
            {getApiErrorMessage(versions.error)}
          </div>
        ) : versions.data?.data.length ? (
          <div className="space-y-2">
            {versions.data.data.map((version) => (
              <div
                key={version.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    Version {version.version_number}
                    {version.is_current && <Badge>Current</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {version.file_name} ·{" "}
                    {new Date(version.created_at).toLocaleString()}
                    {version.uploaded_by?.name
                      ? ` · ${version.uploaded_by.name}`
                      : ""}
                  </div>
                  <p className="mt-1 text-sm">
                    {version.change_notes || "No change notes recorded."}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    downloadDocumentVersion(documentId, version).catch(
                      (error) => toast.error(getApiErrorMessage(error)),
                    )
                  }
                >
                  <Download className="mr-1 h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No version history exists yet.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
