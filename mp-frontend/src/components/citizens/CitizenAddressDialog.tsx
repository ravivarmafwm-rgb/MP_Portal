import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  createCitizenAddress,
  getApiErrorMessage,
  updateCitizenAddress,
  type CitizenAddressInput,
  type CitizenDetailRecord,
} from "@/lib/api";

export function CitizenAddressDialog({
  citizenId,
  address,
}: {
  citizenId: string;
  address?: CitizenDetailRecord["addresses"][number];
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(address?.address_type ?? "residential");
  const [house, setHouse] = useState(address?.house_number ?? "");
  const [street, setStreet] = useState(address?.street ?? "");
  const [locality, setLocality] = useState(address?.locality ?? "");
  const [pincode, setPincode] = useState(address?.pincode ?? "");
  const [district, setDistrict] = useState(address?.district ?? "");
  const [state, setState] = useState(address?.state ?? "");
  const [primary, setPrimary] = useState(address?.is_primary ?? false);
  const client = useQueryClient();
  useEffect(() => {
    if (open) {
      setType(address?.address_type ?? "residential");
      setHouse(address?.house_number ?? "");
      setStreet(address?.street ?? "");
      setLocality(address?.locality ?? "");
      setPincode(address?.pincode ?? "");
      setDistrict(address?.district ?? "");
      setState(address?.state ?? "");
      setPrimary(address?.is_primary ?? false);
    }
  }, [open, address]);
  const mutation = useMutation({
    mutationFn: () => {
      const data: CitizenAddressInput = {
        address_type: type,
        house_number: house || null,
        street: street || null,
        locality: locality || null,
        pincode,
        district,
        state,
        is_primary: primary,
      };
      return address
        ? updateCitizenAddress(citizenId, address.id, data)
        : createCitizenAddress(citizenId, data);
    },
    onSuccess: async () => {
      toast.success(address ? "Address updated." : "Address added.");
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["citizen", citizenId] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={address ? "outline" : "default"}>
          {address ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {address ? "Edit" : "Add address"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{address ? "Edit address" : "Add address"}</DialogTitle>
          <DialogDescription>
            Address changes are scoped to your assigned geography and recorded
            in the audit history.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Type</Label>
            <Input value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>House number</Label>
            <Input value={house} onChange={(e) => setHouse(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Street</Label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Locality</Label>
            <Input
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Pincode</Label>
            <Input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
            />
          </div>
          <div className="space-y-1">
            <Label>District</Label>
            <Input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>State</Label>
            <Input value={state} onChange={(e) => setState(e.target.value)} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={primary}
            onChange={(e) => setPrimary(e.target.checked)}
          />{" "}
          Primary address
        </label>
        <DialogFooter>
          <Button
            disabled={mutation.isPending || !pincode || !district || !state}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Saving…" : "Save address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
