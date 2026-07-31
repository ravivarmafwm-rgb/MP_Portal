import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, MapPin } from "lucide-react";
import { fetchParliamentaryAnalytics } from "@/lib/api";

export function GeoInsights() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["geographic-insights", "village"],
    queryFn: () => fetchParliamentaryAnalytics("village"),
    staleTime: 60_000,
  });
  const villages = [...(data?.data ?? [])]
    .sort((a, b) => (b.metrics.grievances ?? 0) - (a.metrics.grievances ?? 0))
    .slice(0, 5);

  return (
    <Card className="overflow-hidden p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-h3 font-bold">Geographic insights</h3>
          <p className="text-xs text-muted-foreground">
            Live activity by village in your authorized scope
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Layers className="h-3 w-3" /> Grievances · Projects · Citizens
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
            Loading geographic metrics…
          </p>
        ) : isError ? (
          <p className="col-span-full py-8 text-center text-sm text-destructive">
            Geographic metrics could not be loaded.
          </p>
        ) : villages.length === 0 ? (
          <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
            No geographic metrics are available.
          </p>
        ) : (
          villages.map((village) => (
            <div
              key={village.id}
              className="rounded-lg border border-border/70 p-4"
            >
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                {village.name}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span>
                  Grievances{" "}
                  <strong className="text-foreground">
                    {village.metrics.grievances}
                  </strong>
                </span>
                <span>
                  Projects{" "}
                  <strong className="text-foreground">
                    {village.metrics.projects}
                  </strong>
                </span>
                <span>
                  Citizens{" "}
                  <strong className="text-foreground">
                    {village.metrics.citizens}
                  </strong>
                </span>
                <span>
                  Volunteers{" "}
                  <strong className="text-foreground">
                    {village.metrics.volunteers}
                  </strong>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
