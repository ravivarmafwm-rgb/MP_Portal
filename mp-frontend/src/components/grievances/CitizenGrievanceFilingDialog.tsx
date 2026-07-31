import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
  fetchCitizenGrievanceCategories,
  fileCitizenGrievance,
  getApiErrorMessage,
} from "@/lib/api";

export function CitizenGrievanceFilingDialog() {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const categories = useQuery({
    queryKey: ["citizen-grievance-categories"],
    queryFn: fetchCitizenGrievanceCategories,
    enabled: open,
  });
  const filing = useMutation({
    mutationFn: () =>
      fileCitizenGrievance({
        category_id: categoryId,
        priority,
        subject,
        description,
      }),
    onSuccess: async (result) => {
      toast.success(
        `${result.message} Tracking number: ${result.grievance_number}`,
      );
      setOpen(false);
      setCategoryId("");
      setPriority("medium");
      setSubject("");
      setDescription("");
      await Promise.all([
        client.invalidateQueries({ queryKey: ["my-grievances"] }),
        client.invalidateQueries({ queryKey: ["my-citizen"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          File grievance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File a grievance</DialogTitle>
          <DialogDescription>
            Your verified identity, mobile number, and primary constituency
            address are attached securely by the server.
          </DialogDescription>
        </DialogHeader>
        {categories.isError ? (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {getApiErrorMessage(categories.error)}
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              filing.mutate();
            }}
          >
            <div>
              <Label>Category</Label>
              <Select
                required
                value={categoryId}
                onValueChange={setCategoryId}
                disabled={categories.isLoading}
              >
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
                      {category.name} · {category.sla_days}-day SLA
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as "low" | "medium" | "high")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="citizen-grievance-subject">Subject</Label>
              <Input
                id="citizen-grievance-subject"
                required
                minLength={10}
                maxLength={255}
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="citizen-grievance-description">Description</Label>
              <Textarea
                id="citizen-grievance-description"
                required
                minLength={30}
                maxLength={10000}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={
                filing.isPending ||
                !categoryId ||
                subject.trim().length < 10 ||
                description.trim().length < 30
              }
            >
              {filing.isPending ? "Filing..." : "Submit grievance"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
