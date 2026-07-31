import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Search, Trash2 } from "lucide-react";
import {
  deleteDocument,
  downloadDocument,
  fetchDocuments,
  getApiErrorMessage,
} from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DocumentUploadDialog } from "@/components/documents/DocumentUploadDialog";
import { DocumentVersionsDialog } from "@/components/documents/DocumentVersionsDialog";
import { toast } from "sonner";

export function DocumentRepository({
  type,
  documentableId,
}: {
  type?: "citizen" | "project" | "grievance";
  documentableId?: string;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const client = useQueryClient();
  const deletion = useMutation({
    mutationFn: deleteDocument,
    onSuccess: async (result) => {
      toast.success(result.message);
      await client.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const query = useQuery({
    queryKey: ["documents", type, documentableId, search, page],
    queryFn: () =>
      fetchDocuments({
        ...(type ? { documentable_type: type } : {}),
        ...(documentableId ? { documentable_id: documentableId } : {}),
        ...(search ? { search } : {}),
        page,
        per_page: 20,
      }),
    placeholderData: (previous) => previous,
  });
  if (query.isError)
    return (
      <Card className="p-8 text-center text-destructive">
        {query.error instanceof Error
          ? query.error.message
          : "Documents could not be loaded."}
      </Card>
    );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search document title, number or file name"
          />
        </div>
        {type && documentableId && (
          <DocumentUploadDialog type={type} documentableId={documentableId} />
        )}
      </div>
      {query.isLoading ? (
        <Card className="p-8 text-center text-muted-foreground">
          Loading documents…
        </Card>
      ) : query.data?.data.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No documents found.
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {query.data?.data.map((document) => (
            <Card key={document.id} className="p-4">
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div className="min-w-0 flex-1">
                  <strong className="block truncate">{document.title}</strong>
                  <p className="truncate text-xs text-muted-foreground">
                    {document.document_number} · {document.file_name}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline">
                      {document.document_category?.name ??
                        document.file_type ??
                        "Document"}
                    </Badge>
                    {document.is_verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                    {document.is_confidential && (
                      <Badge variant="destructive">Confidential</Badge>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        downloadDocument(document.id, document.file_name).catch(
                          (error) => toast.error(getApiErrorMessage(error)),
                        )
                      }
                    >
                      <Download className="mr-1 h-3.5 w-3.5" />
                      Download
                    </Button>
                    <DocumentVersionsDialog documentId={document.id} />
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete document"
                      disabled={deletion.isPending}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Delete this document and its stored file?",
                          )
                        )
                          deletion.mutate(document.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {query.data?.meta.total ?? 0} records
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || query.isFetching}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={
              !query.data ||
              page >= query.data.meta.last_page ||
              query.isFetching
            }
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
