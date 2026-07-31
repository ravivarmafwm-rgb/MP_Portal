import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
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
  createSchemeRequiredDocument,
  fetchDocumentCategories,
  getApiErrorMessage,
  updateSchemeRequiredDocument,
  type SchemeRequiredDocumentRecord,
} from "@/lib/api";

export function SchemeRequiredDocumentDialog({
  schemeId,
  requirement,
}: {
  schemeId: string;
  requirement?: SchemeRequiredDocumentRecord;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(
    requirement?.document_category_id ?? "",
  );
  const [name, setName] = useState(requirement?.name ?? "");
  const [description, setDescription] = useState(
    requirement?.description ?? "",
  );
  const [mandatory, setMandatory] = useState(requirement?.is_mandatory ?? true);
  const [maxAge, setMaxAge] = useState(
    requirement?.max_age_days?.toString() ?? "",
  );
  useEffect(() => {
    setCategoryId(requirement?.document_category_id ?? "");
    setName(requirement?.name ?? "");
    setDescription(requirement?.description ?? "");
    setMandatory(requirement?.is_mandatory ?? true);
    setMaxAge(requirement?.max_age_days?.toString() ?? "");
  }, [requirement, open]);
  const categories = useQuery({
    queryKey: ["document-categories"],
    queryFn: fetchDocumentCategories,
    enabled: open,
  });
  const mutation = useMutation({
    mutationFn: () => {
      const data = {
        document_category_id: categoryId,
        name,
        description: description || undefined,
        is_mandatory: mandatory,
        max_age_days: maxAge ? Number(maxAge) : undefined,
        sort_order: 0,
        is_active: true,
      };
      return requirement
        ? updateSchemeRequiredDocument(schemeId, requirement.id, data)
        : createSchemeRequiredDocument(schemeId, data);
    },
    onSuccess: async () => {
      toast.success(
        requirement
          ? "Document requirement updated."
          : "Required document added.",
      );
      setOpen(false);
      setCategoryId("");
      setName("");
      setDescription("");
      setMaxAge("");
      await client.invalidateQueries({
        queryKey: ["scheme-eligibility-rules"],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {requirement ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <Plus className="mr-1 h-4 w-4" />
          )}
          {!requirement && "Add document"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {requirement ? "Edit" : "Add"} required document
          </DialogTitle>
          <DialogDescription>
            Citizens will upload this document privately against their
            application.
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
            <Label>Name</Label>
            <Input
              required
              minLength={3}
              maxLength={150}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.data?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div>
            <Label>Maximum document age (days)</Label>
            <Input
              type="number"
              min={1}
              max={3650}
              value={maxAge}
              onChange={(event) => setMaxAge(event.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={mandatory}
              onChange={(event) => setMandatory(event.target.checked)}
            />
            Mandatory before approval
          </label>
          <Button
            className="w-full"
            disabled={mutation.isPending || !categoryId}
          >
            {mutation.isPending ? "Saving..." : "Add requirement"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
