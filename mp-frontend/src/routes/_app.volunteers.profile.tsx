import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  CalendarCheck,
  GraduationCap,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchVolunteer } from "@/lib/api";

export const Route = createFileRoute("/_app/volunteers/profile")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  component: VolunteerProfilePage,
});

function VolunteerProfilePage() {
  const { id } = Route.useSearch();
  const query = useQuery({
    queryKey: ["volunteer", id],
    queryFn: () => fetchVolunteer(id!),
    enabled: Boolean(id),
  });
  if (!id)
    return <State text="Select a volunteer from the volunteer directory." />;
  if (query.isLoading)
    return (
      <div className="space-y-3 p-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  if (query.isError)
    return (
      <State text="The volunteer could not be loaded or is outside your assigned area." />
    );
  const volunteer = query.data!;
  const name = [
    volunteer.first_name,
    volunteer.middle_name,
    volunteer.last_name,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <>
      <PageHeader
        title={name}
        description={`Volunteer ID ${volunteer.volunteer_id}`}
        actions={
          <Button asChild variant="outline">
            <Link to="/volunteers/list">Back to directory</Link>
          </Button>
        }
      />
      <div className="space-y-5 p-4 md:p-8">
        <Card className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Status" value={volunteer.status} />
          <Info label="Mobile" value={volunteer.mobile_number} />
          <Info label="Email" value={volunteer.email ?? "Not recorded"} />
          <Info
            label="Village"
            value={volunteer.village?.name ?? "Not assigned"}
          />
          <Info
            label="Joined"
            value={new Date(volunteer.joining_date).toLocaleDateString("en-IN")}
          />
          <Info
            label="Availability"
            value={volunteer.is_available ? "Available" : "Unavailable"}
          />
          <Info
            label="Total hours"
            value={Number(volunteer.total_hours).toLocaleString("en-IN")}
          />
          <Info
            label="Performance score"
            value={Number(volunteer.performance_score).toFixed(1)}
          />
        </Card>
        <Tabs defaultValue="activity">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="activity">
              <Activity className="mr-1 h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <CalendarCheck className="mr-1 h-4 w-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="training">
              <GraduationCap className="mr-1 h-4 w-4" />
              Training
            </TabsTrigger>
            <TabsTrigger value="performance">
              <User className="mr-1 h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>
          <TabsContent value="activity">
            <Card className="divide-y">
              {volunteer.activities?.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 p-4 text-sm sm:grid-cols-4"
                >
                  <span className="font-medium">{item.title}</span>
                  <span>
                    {new Date(item.activity_date).toLocaleDateString("en-IN")}
                  </span>
                  <span>{Number(item.hours_spent)} hours</span>
                  <Badge variant="secondary" className="w-fit capitalize">
                    {item.status}
                  </Badge>
                </div>
              ))}
              {!volunteer.activities?.length && (
                <Empty text="No activities are recorded." />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="attendance">
            <Card className="divide-y">
              {volunteer.attendance?.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 p-4 text-sm sm:grid-cols-4"
                >
                  <span>
                    {new Date(item.attendance_date).toLocaleDateString("en-IN")}
                  </span>
                  <Badge variant="secondary" className="w-fit capitalize">
                    {item.status}
                  </Badge>
                  <span>{Number(item.hours_worked)} hours</span>
                  <span>{item.location ?? "Location not recorded"}</span>
                </div>
              ))}
              {!volunteer.attendance?.length && (
                <Empty text="No attendance records are available." />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="training">
            <Card className="divide-y">
              {volunteer.training?.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 p-4 text-sm sm:grid-cols-4"
                >
                  <span className="font-medium">{item.training_name}</span>
                  <span>
                    {new Date(item.start_date).toLocaleDateString("en-IN")}
                  </span>
                  <Badge variant="secondary" className="w-fit capitalize">
                    {item.status}
                  </Badge>
                  <span>{item.certificate_number ?? "No certificate"}</span>
                </div>
              ))}
              {!volunteer.training?.length && (
                <Empty text="No training records are available." />
              )}
            </Card>
          </TabsContent>
          <TabsContent value="performance">
            <Card className="divide-y">
              {volunteer.performance?.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 p-4 text-sm sm:grid-cols-4"
                >
                  <span className="font-medium">{item.evaluation_period}</span>
                  <span>{item.total_activities} activities</span>
                  <span>{item.attendance_rate}% attendance</span>
                  <span className="font-semibold">
                    {item.overall_score} / 100
                  </span>
                </div>
              ))}
              {!volunteer.performance?.length && (
                <Empty text="No performance evaluations are available." />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium capitalize">{value}</div>
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className="p-10 text-center text-sm text-muted-foreground">{text}</div>
  );
}
function State({ text }: { text: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center text-center text-muted-foreground">
      <div>
        <AlertCircle className="mx-auto mb-3 h-8 w-8" />
        {text}
      </div>
    </div>
  );
}
