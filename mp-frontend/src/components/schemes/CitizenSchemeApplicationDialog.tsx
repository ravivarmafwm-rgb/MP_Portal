import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Landmark } from "lucide-react";
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
  fetchCitizenSchemes,
  getApiErrorMessage,
  submitCitizenSchemeApplication,
} from "@/lib/api";

export function CitizenSchemeApplicationDialog() {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [schemeId, setSchemeId] = useState("");
  const [remarks, setRemarks] = useState("");
  const schemes = useQuery({
    queryKey: ["citizen-schemes"],
    queryFn: fetchCitizenSchemes,
    enabled: open,
  });
  const mutation = useMutation({
    mutationFn: () =>
      submitCitizenSchemeApplication({ scheme_id: schemeId, remarks }),
    onSuccess: async (application) => {
      toast.success(`Application ${application.application_number} submitted.`);
      setOpen(false);
      setSchemeId("");
      setRemarks("");
      await Promise.all([
        client.invalidateQueries({ queryKey: ["my-scheme-applications"] }),
        client.invalidateQueries({ queryKey: ["my-citizen"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Landmark className="mr-1 h-4 w-4" />
          Apply for scheme
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for a scheme</DialogTitle>
          <DialogDescription>
            Eligibility is checked against your verified citizen profile.
          </DialogDescription>
        </DialogHeader>
        {schemes.isError ? (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {getApiErrorMessage(schemes.error)}
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate();
            }}
          >
            <div>
              <Label>Scheme</Label>
              <Select value={schemeId} onValueChange={setSchemeId}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      schemes.isLoading ? "Loading schemes..." : "Select scheme"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {schemes.data?.data.map((scheme) => (
                    <SelectItem key={scheme.id} value={scheme.id}>
                      {scheme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scheme-remarks">Supporting remarks</Label>
              <Textarea
                id="scheme-remarks"
                maxLength={2000}
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={!schemeId || mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Submit application"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
