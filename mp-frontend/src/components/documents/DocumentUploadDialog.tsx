import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchDocumentCategories,
  getApiErrorMessage,
  uploadDocument,
} from "@/lib/api";

export function DocumentUploadDialog({
  type,
  documentableId,
}: {
  type: "citizen" | "project" | "grievance";
  documentableId: string;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const categories = useQuery({
    queryKey: ["document-categories"],
    queryFn: fetchDocumentCategories,
    enabled: open,
  });
  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Select a file to upload.");
      const data = new FormData();
      data.append("file", file);
      data.append("title", title);
      data.append("description", description);
      data.append("document_category_id", categoryId);
      data.append("documentable_type", type);
      data.append("documentable_id", documentableId);
      return uploadDocument(data);
    },
    onSuccess: async () => {
      toast.success("Document uploaded securely.");
      setOpen(false);
      setFile(null);
      setTitle("");
      setDescription("");
      setCategoryId("");
      await client.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
          <DialogDescription>
            PDF, JPG, PNG, DOC or DOCX; maximum 10 MB. Files are stored
            privately.
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
              onChange={(event) => setTitle(event.target.value)}
            />
          </Field>
          <Field label="Category">
            <Select required value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    categories.isLoading
                      ? "Loading categories..."
                      : "Select category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="File">
            <Input
              required
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </Field>
          <Field label="Description">
            <Textarea
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
          <Button
            className="w-full"
            disabled={mutation.isPending || !categoryId}
          >
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
