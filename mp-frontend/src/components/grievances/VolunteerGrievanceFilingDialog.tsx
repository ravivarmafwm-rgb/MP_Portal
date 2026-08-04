import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, WifiOff, MapPin, UserSearch, Save } from "lucide-react";
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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  createGrievance,
  fetchGrievanceCategories,
  fetchCitizens,
  fetchLocVillages,
  getApiErrorMessage,
} from "@/lib/api";
import { saveDraft } from "@/lib/offline-store";
import { useAuth } from "@/lib/auth";

export function VolunteerGrievanceFilingDialog() {
  const client = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [citizenSearch, setCitizenSearch] = useState("");
  const [selectedCitizenId, setSelectedCitizenId] = useState("");
  const [useManualCitizen, setUseManualCitizen] = useState(false);
  const [citizenName, setCitizenName] = useState("");
  const [citizenMobile, setCitizenMobile] = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [villageId, setVillageId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    const up = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setCitizenSearch("");
      setSelectedCitizenId("");
      setUseManualCitizen(false);
      setCitizenName("");
      setCitizenMobile("");
      setCitizenEmail("");
      setCategoryId("");
      setPriority("medium");
      setSubject("");
      setDescription("");
      setVillageId("");
      setLatitude("");
      setLongitude("");
    }
  }, [open]);

  const categories = useQuery({
    queryKey: ["grievance-categories"],
    queryFn: fetchGrievanceCategories,
    enabled: open,
  });
  const citizens = useQuery({
    queryKey: ["volunteer-grievance-citizens", citizenSearch],
    queryFn: () => fetchCitizens({ search: citizenSearch, per_page: 15 }),
    enabled: open && citizenSearch.length >= 2,
  });
  const villages = useQuery({
    queryKey: ["location-villages"],
    queryFn: () => fetchLocVillages(),
    enabled: open,
  });

  const canSubmit =
    categoryId &&
    subject.trim().length >= 5 &&
    description.trim().length >= 10 &&
    (useManualCitizen
      ? citizenName.trim() && /^[6-9][0-9]{9}$/.test(citizenMobile.replace(/\D/g, ""))
      : !!selectedCitizenId);

  const buildPayload = () => {
    const payload: Record<string, unknown> = {
      category_id: categoryId,
      subject,
      description,
      priority,
      source: "volunteer_field",
      village_id: villageId || undefined,
    };
    if (useManualCitizen) {
      payload.citizen_name = citizenName.trim();
      payload.citizen_mobile = citizenMobile.replace(/\D/g, "");
      if (citizenEmail.trim()) payload.citizen_email = citizenEmail.trim();
    } else {
      payload.citizen_id = selectedCitizenId;
      const c = (citizens.data?.data ?? []).find((x: { id: string }) => x.id === selectedCitizenId) as
        | { id: string; first_name: string; last_name: string; mobile_number?: string; email?: string }
        | undefined;
      if (c) {
        payload.citizen_name = `${c.first_name} ${c.last_name}`;
        payload.citizen_mobile = c.mobile_number ?? "";
        if (c.email) payload.citizen_email = c.email;
      }
    }
    if (latitude) payload.latitude = Number(latitude);
    if (longitude) payload.longitude = Number(longitude);
    return payload;
  };

  const captureGps = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        toast.success("GPS location captured.");
      },
      () => toast.error("Could not capture GPS location."),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const submitOnline = useMutation({
    mutationFn: () => createGrievance(buildPayload()),
    onSuccess: async (result) => {
      toast.success(
        `Grievance filed. Tracking: ${result.grievance_number ?? result.id}`,
      );
      setOpen(false);
      await Promise.all([
        client.invalidateQueries({ queryKey: ["grievances"] }),
        client.invalidateQueries({ queryKey: ["volunteer-dashboard-stats"] }),
      ]);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !user?.id) return;

    if (!isOnline) {
      try {
        const draftId = `draft_grievance_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const villageName =
          (villages.data as { id: string; name: string }[] | undefined)?.find(
            (v) => v.id === villageId,
          )?.name ?? "Unknown Village";
        const labelCitizen = useManualCitizen
          ? citizenName.trim()
          : (() => {
              const c = (citizens.data?.data ?? []).find(
                (x: { id: string }) => x.id === selectedCitizenId,
              ) as { first_name: string; last_name: string } | undefined;
              return c ? `${c.first_name} ${c.last_name}` : "Unnamed citizen";
            })();
        await saveDraft({
          id: draftId,
          type: "grievance",
          status: "pending",
          payload: JSON.stringify(buildPayload()),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          retries: 0,
          userId: user.id,
          label: `Grievance: ${subject.slice(0, 40)} — ${labelCitizen} (${villageName})`,
        });
        toast.success(
          "Saved as offline draft. Will auto-sync when back online. Tap Sync Now to retry.",
          { duration: 5000 },
        );
        setOpen(false);
      } catch (err) {
        toast.error("Could not save draft: " + getApiErrorMessage(err));
      }
      return;
    }

    submitOnline.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          File Complaint
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>File village grievance</DialogTitle>
              <DialogDescription className="mt-1">
                Volunteer-assisted complaint registration. Attach a citizen, capture
                GPS, and save offline when there is no signal.
              </DialogDescription>
            </div>
            {!isOnline && (
              <Badge variant="outline" className="gap-1 border-amber-400 text-amber-700">
                <WifiOff className="h-3 w-3" />
                Offline draft
              </Badge>
            )}
          </div>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Card className="space-y-4 border-dashed p-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                <UserSearch className="mr-1.5 inline h-4 w-4 align-sub" />
                Complainant
              </Label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setUseManualCitizen((v) => !v);
                  setSelectedCitizenId("");
                  setCitizenName("");
                  setCitizenMobile("");
                  setCitizenEmail("");
                }}
              >
                {useManualCitizen ? "Pick enrolled citizen" : "Manual entry"}
              </Button>
            </div>

            {useManualCitizen ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Full name</Label>
                  <Input
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="e.g. Ravi Reddy"
                  />
                </div>
                <div>
                  <Label>Mobile</Label>
                  <Input
                    required
                    value={citizenMobile}
                    onChange={(e) => setCitizenMobile(e.target.value)}
                    placeholder="10-digit mobile"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Email (optional)</Label>
                  <Input
                    type="email"
                    value={citizenEmail}
                    onChange={(e) => setCitizenEmail(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Search enrolled citizen</Label>
                <Input
                  value={citizenSearch}
                  onChange={(e) => setCitizenSearch(e.target.value)}
                  placeholder="Name, mobile, voter ID or citizen ID (min 2 chars)"
                />
                <select
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={selectedCitizenId}
                  onChange={(e) => setSelectedCitizenId(e.target.value)}
                >
                  <option value="">Select a citizen</option>
                  {(citizens.data?.data ?? []).map(
                    (c: {
                      id: string;
                      first_name: string;
                      last_name: string;
                      unique_id?: string;
                      mobile_number?: string | null;
                    }) => (
                      <option key={String(c.id)} value={String(c.id)}>
                        {c.first_name} {c.last_name} ({c.unique_id ?? ""}) — {c.mobile_number ?? ""}
                      </option>
                    ),
                  )}
                </select>
                {citizens.isLoading && (
                  <p className="text-xs text-muted-foreground">Searching citizens…</p>
                )}
              </div>
            )}
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
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
                      categories.isLoading ? "Loading categories…" : "Select category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.data?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} · {cat.sla_days}-day SLA
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) =>
                  setPriority(v as "low" | "medium" | "high" | "urgent")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Village / Ward</Label>
              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={villageId}
                onChange={(e) => setVillageId(e.target.value)}
              >
                <option value="">Select village</option>
                {(villages.data ?? []).map((v: { id: string; name: string }) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>GPS location (optional)</Label>
              <div className="flex gap-2">
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <Input
                    placeholder="Lat"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                  <Input
                    placeholder="Lon"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={captureGps}
                  title="Capture GPS"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="vol-grievance-subject">Subject</Label>
            <Input
              id="vol-grievance-subject"
              required
              minLength={5}
              maxLength={255}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short summary of the issue"
            />
          </div>

          <div>
            <Label htmlFor="vol-grievance-description">Description</Label>
            <Textarea
              id="vol-grievance-description"
              required
              minLength={10}
              maxLength={10000}
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the issue, who is affected, what support is needed…"
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <p className="text-xs text-muted-foreground">
              {!isOnline ? (
                <>
                  <Save className="mr-1 inline h-3.5 w-3.5 align-sub" />
                  Will save locally and sync automatically when online.
                </>
              ) : (
                "Submits to the grievance registry immediately."
              )}
            </p>
            <Button
              type="submit"
              disabled={!canSubmit || submitOnline.isPending}
              className="min-w-[160px]"
            >
              {submitOnline.isPending
                ? "Submitting…"
                : !isOnline
                  ? "Save draft offline"
                  : "Submit grievance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
