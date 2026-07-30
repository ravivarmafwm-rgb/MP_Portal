import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  CalendarCheck,
  GraduationCap,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVolunteerActivities, fetchVolunteerStats } from "@/lib/api";
export const Route = createFileRoute("/_app/volunteers/")({
  component: VolunteersHome,
});
const links = [
  { title: "Directory", to: "/volunteers/list" as const, icon: Users },
  {
    title: "Performance",
    to: "/volunteers/performance" as const,
    icon: Trophy,
  },
  { title: "Activity", to: "/volunteers/activity" as const, icon: Activity },
  {
    title: "Attendance",
    to: "/volunteers/attendance" as const,
    icon: CalendarCheck,
  },
  {
    title: "Training",
    to: "/volunteers/training" as const,
    icon: GraduationCap,
  },
  {
    title: "Geographic coverage",
    to: "/volunteers/geographic-coverage" as const,
    icon: MapPin,
  },
];
function VolunteersHome() {
  const stats = useQuery({
    queryKey: ["volunteer-stats"],
    queryFn: fetchVolunteerStats,
  });
  const activities = useQuery({
    queryKey: ["volunteer-activities-recent"],
    queryFn: () => fetchVolunteerActivities({ per_page: 8 }),
  });
  if (stats.isLoading || activities.isLoading)
    return (
      <div className="space-y-3 p-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  if (stats.isError || activities.isError)
    return (
      <div className="grid min-h-[50vh] place-items-center text-center text-muted-foreground">
        <div>
          <AlertCircle className="mx-auto mb-2" />
          Volunteer operations data could not be loaded.
        </div>
      </div>
    );
  const s = stats.data!;
  return (
    <>
      <PageHeader
        title="Volunteer Operations"
        description="Live volunteer totals and recorded field activity."
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            ["Total", s.total],
            ["Active", s.active],
            ["Inactive", s.inactive],
            ["Available", s.available_now],
            ["Villages covered", s.villages_covered],
          ].map(([label, value]) => (
            <Card key={String(label)} className="p-4">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="mt-1 text-2xl font-bold">
                {Number(value).toLocaleString()}
              </div>
            </Card>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="font-semibold">Volunteer modules</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {links.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/40"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Recent recorded activity</h2>
            <div className="mt-4 divide-y">
              {activities.data!.data.map((item) => (
                <div key={item.id} className="py-3">
                  <div className="flex justify-between gap-3">
                    <Link
                      to="/volunteers/profile"
                      search={{ id: item.volunteer.id }}
                      className="font-medium text-primary"
                    >
                      {item.volunteer.first_name} {item.volunteer.last_name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.activity_date).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.title}
                  </p>
                </div>
              ))}
              {!activities.data!.data.length && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No volunteer activity is recorded.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
