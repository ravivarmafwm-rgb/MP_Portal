import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api";

export function DeleteProjectRecordButton({
  projectId,
  label,
  deleteRecord,
}: {
  projectId: string;
  label: string;
  deleteRecord: () => Promise<{ message: string }>;
}) {
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteRecord,
    onSuccess: async (result) => {
      toast.success(result.message || `${label} deleted.`);
      await client.invalidateQueries({
        queryKey: ["project-detail", projectId],
      });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={`Delete ${label}`}
      disabled={mutation.isPending}
      onClick={() => {
        if (
          window.confirm(`Delete this ${label}? This action cannot be undone.`)
        )
          mutation.mutate();
      }}
    >
      <Trash2 className="h-3.5 w-3.5 text-destructive" />
    </Button>
  );
}
