import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Layers } from "lucide-react";

const hotspots = [
  { top: "22%", left: "30%", label: "Madhapur", n: 42, tone: "bg-destructive" },
  { top: "44%", left: "58%", label: "Kondapur", n: 31, tone: "bg-warning" },
  { top: "60%", left: "22%", label: "Gachibowli", n: 18, tone: "bg-info" },
  { top: "30%", left: "72%", label: "Hi-Tec City", n: 26, tone: "bg-warning" },
  { top: "72%", left: "48%", label: "Sector 7", n: 12, tone: "bg-success" },
];

export function GeoInsights() {
  return (
    <Card className="overflow-hidden p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-h3 font-bold">Geographic insights</h3>
          <p className="text-xs text-muted-foreground">Live activity by mandal & ward</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Layers className="h-3 w-3" /> Grievances · Projects · Beneficiaries
        </Badge>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-muted/40 via-background to-muted/20">
        <svg className="absolute inset-0 h-full w-full text-border" aria-hidden>
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 225" preserveAspectRatio="none">
          <path
            d="M40 60 Q120 30 200 80 T380 70 L370 180 Q260 200 180 170 T40 190 Z"
            fill="oklch(0.65 0.16 235 / 0.10)"
            stroke="oklch(0.65 0.16 235 / 0.4)"
            strokeWidth="1"
          />
          <path
            d="M80 100 Q150 80 220 110 T340 110"
            fill="none"
            stroke="oklch(0.65 0.16 235 / 0.3)"
            strokeDasharray="3 3"
          />
        </svg>

        {hotspots.map((h) => (
          <div
            key={h.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: h.top, left: h.left }}
          >
            <span className={"relative flex h-3 w-3 " + h.tone + " rounded-full"}>
              <span className={"absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 " + h.tone} />
            </span>
            <div className="mt-1 whitespace-nowrap rounded-md bg-background/90 px-2 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur">
              {h.label} · {h.n}
            </div>
          </div>
        ))}

        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">
          <MapPin className="h-3 w-3" /> GIS preview · 47 villages
        </div>
      </div>
    </Card>
  );
}