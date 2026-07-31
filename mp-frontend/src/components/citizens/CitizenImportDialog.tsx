import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  downloadCitizenImportErrors,
  fetchCitizenImport,
  getApiErrorMessage,
  importCitizens,
} from "@/lib/api";

export function CitizenImportDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [batchId, setBatchId] = useState<string | null>(null);
  const client = useQueryClient();
  const batch = useQuery({
    queryKey: ["citizen-import", batchId],
    queryFn: () => fetchCitizenImport(batchId!),
    enabled: open && Boolean(batchId),
    refetchInterval: (query) =>
      query.state.data?.status === "queued" ||
      query.state.data?.status === "processing"
        ? 2000
        : false,
  });
  useEffect(() => {
    if (batch.data?.status === "completed") {
      void client.invalidateQueries({ queryKey: ["citizens"] });
    }
  }, [batch.data?.status, client]);
  const mutation = useMutation({
    mutationFn: () => importCitizens(file!),
    onSuccess: (result) => {
      setBatchId(result.id);
      setFile(null);
      toast.success("Citizen import queued for validation.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          setBatchId(null);
          setFile(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4" /> Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import citizens</DialogTitle>
          <DialogDescription>
            Upload a CSV with first_name, last_name, date_of_birth, gender,
            village_id, pincode, district, state, and is_voter columns. Invalid
            or duplicate rows are retained in the error report.
          </DialogDescription>
        </DialogHeader>
        {!batchId ? (
          <div className="space-y-3">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">
              Maximum file size: 50 MB. Processing runs in the background.
            </p>
          </div>
        ) : batch.isLoading ? (
          <Skeleton className="h-32" />
        ) : batch.isError ? (
          <p className="text-sm text-destructive">
            Import status could not be loaded.
          </p>
        ) : (
          batch.data && (
            <div className="space-y-3 rounded-md border p-4 text-sm">
              <p className="font-medium capitalize">
                Status: {batch.data.status}
              </p>
              <p>
                Processed {batch.data.processed_rows} of{" "}
                {batch.data.total_rows || "submitted rows"}
              </p>
              <p className="text-success">
                Accepted: {batch.data.accepted_rows}
              </p>
              <p className="text-destructive">
                Rejected: {batch.data.rejected_rows}
              </p>
              {batch.data.error_message && (
                <p className="text-destructive">{batch.data.error_message}</p>
              )}
              {batch.data.rejected_rows > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadCitizenImportErrors(batch.data!.id)}
                >
                  <Download className="h-4 w-4" /> Download errors
                </Button>
              )}
            </div>
          )
        )}
        <DialogFooter>
          {!batchId ? (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!file || mutation.isPending}
                onClick={() => mutation.mutate()}
              >
                {mutation.isPending ? "Uploading…" : "Start import"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setOpen(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
