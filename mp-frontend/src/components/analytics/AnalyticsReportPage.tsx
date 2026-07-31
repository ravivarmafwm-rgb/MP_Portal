import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ParliamentaryAnalyticsReport } from "@/lib/api";

const levels = [
  "constituency",
  "assembly",
  "mandal",
  "village",
  "booth",
] as const;
export function AnalyticsReportPage({
  report,
  title,
  description,
}: {
  report: ParliamentaryAnalyticsReport;
  title: string;
  description: string;
}) {
  const t = report.totals;
  const metrics = [
    ["Citizens", t.citizens],
    ["Families", t.families],
    ["Applications", t.applications],
    ["Beneficiaries", t.beneficiaries],
    ["Grievances", t.grievances],
    ["MPLADS / Projects", t.projects],
    ["Active Volunteers", t.volunteers],
    ["Polling Booths", t.booths],
  ] as const;
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="space-y-6 p-4 md:p-8">
        <nav className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <Link
              key={level}
              to={`/analytics/${level}` as "/analytics/constituency"}
              className="rounded-md border px-3 py-1.5 text-sm capitalize hover:bg-muted"
            >
              {level}
            </Link>
          ))}
        </nav>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {metrics.map(([label, value]) => (
            <Card key={label} className="p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">
                {value.toLocaleString("en-IN")}
              </p>
            </Card>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Sanctioned budget</p>
            <p className="text-xl font-bold">{money(t.sanctioned_amount)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Expenditure</p>
            <p className="text-xl font-bold">{money(t.expenditure)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Budget utilization</p>
            <p className="text-xl font-bold">
              {t.budget_utilization == null
                ? "Not available"
                : `${t.budget_utilization}%`}
            </p>
          </Card>
        </div>
        {report.data.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No geographic records are available in your authorized scope.
          </Card>
        ) : (
          <Card className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Citizens</TableHead>
                  <TableHead>Families</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Grievances</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Volunteers</TableHead>
                  <TableHead>Budget use</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <strong>{row.name}</strong>
                      {row.parent_name && (
                        <div className="text-xs text-muted-foreground">
                          {row.parent_name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.metrics.citizens.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      {row.metrics.families.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      {row.metrics.applications.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      {row.metrics.grievances.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      {row.metrics.projects.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      {row.metrics.volunteers.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      {row.metrics.budget_utilization == null
                        ? "—"
                        : `${row.metrics.budget_utilization}%`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <strong className="text-sm">Metric definitions</strong>
            <Badge variant="outline">
              Generated {new Date(report.generated_at).toLocaleString()}
            </Badge>
          </div>
          <dl className="mt-3 space-y-2">
            {Object.entries(report.definitions).map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs font-semibold capitalize">
                  {key.replaceAll("_", " ")}
                </dt>
                <dd className="text-xs text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </>
  );
}
function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
