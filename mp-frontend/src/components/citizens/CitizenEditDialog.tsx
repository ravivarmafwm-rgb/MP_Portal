import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getApiErrorMessage,
  updateCitizen,
  type CitizenDetailRecord,
} from "@/lib/api";

export function CitizenEditDialog({
  citizen,
}: {
  citizen: CitizenDetailRecord;
}) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState(citizen.first_name);
  const [middleName, setMiddleName] = useState(citizen.middle_name ?? "");
  const [lastName, setLastName] = useState(citizen.last_name);
  const [mobile, setMobile] = useState(citizen.mobile_number ?? "");
  const [email, setEmail] = useState(citizen.email ?? "");
  const [occupation, setOccupation] = useState(citizen.occupation ?? "");
  const [education, setEducation] = useState(citizen.education ?? "");
  const [voterId, setVoterId] = useState(citizen.voter_id ?? "");
  const [isVoter, setIsVoter] = useState(citizen.is_voter);
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: () =>
      updateCitizen(citizen.id, {
        first_name: firstName,
        middle_name: middleName || null,
        last_name: lastName,
        mobile_number: mobile || null,
        email: email || null,
        occupation: occupation || null,
        education: education || null,
        voter_id: voterId || null,
        is_voter: isVoter,
      }),
    onSuccess: async () => {
      toast.success("Citizen profile updated.");
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["citizen", citizen.id] });
      await client.invalidateQueries({ queryKey: ["citizens"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4" /> Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit citizen profile</DialogTitle>
          <DialogDescription>
            Changes are validated, geographically authorized, and recorded in
            the audit trail.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" value={firstName} setValue={setFirstName} />
          <Field
            label="Middle name"
            value={middleName}
            setValue={setMiddleName}
          />
          <Field label="Last name" value={lastName} setValue={setLastName} />
          <Field label="Mobile" value={mobile} setValue={setMobile} />
          <Field label="Email" value={email} setValue={setEmail} type="email" />
          <Field label="Voter ID" value={voterId} setValue={setVoterId} />
          <Field
            label="Occupation"
            value={occupation}
            setValue={setOccupation}
          />
          <Field label="Education" value={education} setValue={setEducation} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={isVoter}
            onCheckedChange={(value) => setIsVoter(value === true)}
          />{" "}
          Registered voter
        </label>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={
              mutation.isPending || !firstName.trim() || !lastName.trim()
            }
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}
