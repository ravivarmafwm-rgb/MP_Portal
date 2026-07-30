import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const palette = [
  "var(--color-primary)",
  "var(--color-info)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-accent)",
];

interface SchemeItem {
  name: string;
  value: number;
  growth?: string;
}

interface SchemePerformanceProps {
  schemes?: SchemeItem[];
}

export function SchemePerformance({ schemes }: SchemePerformanceProps) {
  const data = schemes?.length ? schemes : [];

  return (
    <Card className="p-6 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-h3 font-bold">Scheme performance</h3>
          <p className="text-xs text-muted-foreground">
            Applications this quarter
          </p>
        </div>
        <span className="text-label">Top 5</span>
      </div>
      {data.length === 0 ? (
        <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">
          No scheme data available
        </p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 8, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                stroke="var(--color-border)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                animationDuration={900}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={palette[i % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
