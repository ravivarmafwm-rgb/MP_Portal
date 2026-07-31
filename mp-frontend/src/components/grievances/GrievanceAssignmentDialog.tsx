import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRoundCheck } from "lucide-react";
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
  assignGrievance,
  fetchGrievanceAssignmentOptions,
  getApiErrorMessage,
} from "@/lib/api";

export function GrievanceAssignmentDialog({
  grievanceId,
}: {
  grievanceId: string;
}) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [officerId, setOfficerId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const options = useQuery({
    queryKey: ["grievance-assignment-options", grievanceId],
    queryFn: () => fetchGrievanceAssignmentOptions(grievanceId),
    enabled: open,
  });
  const officers = useMemo(
    () =>
      options.data?.officers.filter(
        (officer) => officer.department_id === departmentId,
      ) ?? [],
    [departmentId, options.data?.officers],
  );
  const assignment = useMutation({
    mutationFn: () =>
      assignGrievance(grievanceId, {
        assigned_to: officerId,
        department_id: departmentId,
        ...(dueDate ? { due_date: dueDate } : {}),
        instructions,
      }),
    onSuccess: async () => {
      toast.success("Grievance assigned and officer notified.");
      setOpen(false);
      await Promise.all([
        client.invalidateQueries({
          queryKey: ["grievance-detail", grievanceId],
        }),
        client.invalidateQueries({ queryKey: ["grievances"] }),
        client.invalidateQueries({ queryKey: ["grievance-stats"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <UserRoundCheck className="h-4 w-4" />
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign grievance</DialogTitle>
          <DialogDescription>
            Handoff creates an assignment record, SLA due date, audit entry,
            public timeline update, and officer notification.
          </DialogDescription>
        </DialogHeader>
        {options.isError ? (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {getApiErrorMessage(options.error)}
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              assignment.mutate();
            }}
          >
            <div>
              <Label>Department</Label>
              <Select
                required
                value={departmentId}
                onValueChange={(value) => {
                  setDepartmentId(value);
                  setOfficerId("");
                }}
                disabled={options.isLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      options.isLoading
                        ? "Loading departments..."
                        : "Select department"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {options.data?.departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Responsible officer</Label>
              <Select
                required
                value={officerId}
                onValueChange={setOfficerId}
                disabled={!departmentId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      departmentId
                        ? "Select an authorized officer"
                        : "Select a department first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {officers.map((officer) => (
                    <SelectItem key={officer.id} value={officer.id}>
                      {officer.name}
                      {officer.role ? ` · ${officer.role}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {departmentId && officers.length === 0 && (
                <p className="mt-1 text-xs text-destructive">
                  No authorized, geographically eligible officer is assigned to
                  this department.
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="grievance-due-date">Due date</Label>
              <Input
                id="grievance-due-date"
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Leave blank to use the category SLA.
              </p>
            </div>
            <div>
              <Label htmlFor="grievance-instructions">Instructions</Label>
              <Textarea
                id="grievance-instructions"
                required
                maxLength={3000}
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={
                assignment.isPending ||
                !officerId ||
                !departmentId ||
                !instructions.trim()
              }
            >
              {assignment.isPending
                ? "Assigning..."
                : "Assign and notify officer"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
