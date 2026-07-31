import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchCitizenBoothMappings,
  fetchLocPollingBooths,
  mapCitizenBooth,
  type CitizenBoothMappingRecord,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/citizens/booth-mapping")({
  component: Page,
});
const editors = new Set([
  "super-admin",
  "mp-staff",
  "constituency-coordinator",
  "assembly-coordinator",
  "mandal-coordinator",
  "village-coordinator",
]);
function Page() {
  const { user } = useAuth();
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CitizenBoothMappingRecord | null>(
    null,
  );
  const [boothId, setBoothId] = useState("");
  const list = useQuery({
    queryKey: ["citizen-booth-mapping", search, status, page],
    queryFn: () =>
      fetchCitizenBoothMappings({
        ...(search ? { search } : {}),
        ...(status !== "all" ? { mapping_status: status } : {}),
        page,
        per_page: 20,
      }),
    placeholderData: (previous) => previous,
  });
  const booths = useQuery({
    queryKey: ["polling-booths", selected?.address?.village_id],
    queryFn: () =>
      fetchLocPollingBooths(selected?.address?.village_id ?? undefined),
    enabled: !!selected?.address?.village_id,
  });
  const mutation = useMutation({
    mutationFn: () =>
      mapCitizenBooth(selected!.id, selected!.address!.id, boothId),
    onSuccess: async (result) => {
      toast.success(result.message);
      setSelected(null);
      setBoothId("");
      await client.invalidateQueries({ queryKey: ["citizen-booth-mapping"] });
    },
    onError: (error) =>
      toast.error(
        error instanceof Error
          ? error.message
          : "Mapping could not be updated.",
      ),
  });
  return (
    <>
      <PageHeader
        title="Citizen Booth Mapping"
        description="Assign citizens to valid polling booths through their recorded village and ward."
      />
      <div className="space-y-4 p-4 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search citizen name, ID or mobile"
            className="max-w-md"
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All citizens</SelectItem>
              <SelectItem value="mapped">Mapped</SelectItem>
              <SelectItem value="unmapped">Unmapped</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {list.isError ? (
          <Card className="p-8 text-center text-destructive">
            {list.error instanceof Error
              ? list.error.message
              : "Booth mappings could not be loaded."}
          </Card>
        ) : list.isLoading ? (
          <Card className="p-8 text-center text-muted-foreground">
            Loading booth mappings…
          </Card>
        ) : list.data?.data.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No citizens match these filters.
          </Card>
        ) : (
          <div className="space-y-2">
            {list.data?.data.map((row) => (
              <Card
                key={row.id}
                className="flex flex-col justify-between gap-3 p-4 md:flex-row md:items-center"
              >
                <div>
                  <strong>{row.name}</strong>
                  <p className="text-xs text-muted-foreground">
                    {row.unique_id} · {row.mobile_number ?? "No mobile"}
                  </p>
                  <p className="mt-1 text-xs">
                    {row.address
                      ? `${row.address.village ?? "Village unavailable"}${row.address.ward ? ` · ${row.address.ward}` : ""}`
                      : "No address recorded"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {row.address?.polling_booth ? (
                    <Badge>
                      <MapPin className="mr-1 h-3 w-3" />
                      Booth {row.address.polling_booth.booth_number} ·{" "}
                      {row.address.polling_booth.name}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Unmapped</Badge>
                  )}
                  {editors.has(user?.role_slug ?? "") &&
                    row.address?.village_id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelected(row);
                          setBoothId(row.address?.polling_booth?.id ?? "");
                        }}
                      >
                        Map booth
                      </Button>
                    )}
                </div>
              </Card>
            ))}
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground">
            {list.data?.meta.total ?? 0} citizens
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || list.isFetching}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={
                !list.data ||
                page >= list.data.meta.last_page ||
                list.isFetching
              }
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Map polling booth</DialogTitle>
            <DialogDescription>
              {selected?.name} · {selected?.address?.village}
            </DialogDescription>
          </DialogHeader>
          {booths.isError ? (
            <p className="text-sm text-destructive">
              Polling booths could not be loaded.
            </p>
          ) : (
            <Select value={boothId} onValueChange={setBoothId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a polling booth" />
              </SelectTrigger>
              <SelectContent>
                {(booths.data ?? []).map((booth: Record<string, unknown>) => (
                  <SelectItem key={String(booth.id)} value={String(booth.id)}>
                    Booth {String(booth.booth_number)} · {String(booth.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            disabled={!boothId || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Saving…" : "Save mapping"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
