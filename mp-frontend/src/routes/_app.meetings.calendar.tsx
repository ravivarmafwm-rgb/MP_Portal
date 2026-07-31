import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Users,
  MapPin,
  Building2,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCalendarEvents } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/meetings/calendar")({
  head: () => ({ meta: [{ title: "Meeting Calendar — Schedule View" }] }),
  component: CalendarPage,
});

const EVENT_COLORS: Record<
  string,
  { bg: string; text: string; label: string; icon: typeof CalendarDays }
> = {
  appointment: {
    bg: "bg-primary/15",
    text: "text-primary",
    label: "Appointment",
    icon: CalendarDays,
  },
  public_meeting: {
    bg: "bg-info/15",
    text: "text-info",
    label: "Public Meeting",
    icon: Building2,
  },
  tour: {
    bg: "bg-success/15",
    text: "text-success",
    label: "Tour",
    icon: MapPin,
  },
  janata_darbar: {
    bg: "bg-warning/15",
    text: "text-warning",
    label: "Janata Darbar",
    icon: Users,
  },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "agenda">("month");

  const startOfMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    [currentDate],
  );
  const endOfMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    [currentDate],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["calendar", currentDate.getFullYear(), currentDate.getMonth()],
    queryFn: () =>
      fetchCalendarEvents(
        startOfMonth.toISOString().substring(0, 10),
        endOfMonth.toISOString().substring(0, 10),
      ),
    staleTime: 60_000,
  });

  const events = useMemo(() => data?.events ?? [], [data?.events]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const days: {
      date: Date;
      inMonth: boolean;
      events: Record<string, unknown>[];
    }[] = [];
    const firstDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    const daysInPrevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0,
    ).getDate();

    // Prev month fill
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        daysInPrevMonth - i,
      );
      days.push({ date: d, inMonth: false, events: [] });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dateStr = d.toISOString().substring(0, 10);
      const dayEvents = events.filter(
        (e: Record<string, unknown>) =>
          String(e.date ?? "").substring(0, 10) === dateStr,
      );
      days.push({ date: d, inMonth: true, events: dayEvents });
    }
    // Next month fill to complete grid (6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        i,
      );
      days.push({ date: d, inMonth: false, events: [] });
    }
    return days;
  }, [currentDate, events, startOfMonth, endOfMonth]);

  const today = new Date().toISOString().substring(0, 10);

  const prevMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // Event counts for legend
  const eventCounts = events.reduce(
    (acc: Record<string, number>, e: Record<string, unknown>) => {
      const t = String(e.type ?? "");
      acc[t] = (acc[t] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <>
      <PageHeader
        title="Master Calendar"
        description="All appointments, public meetings, tours and Janata Darbar in one view"
      />
      <div className="space-y-4 p-4 md:p-8">
        {/* Calendar Header */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-display text-xl font-bold min-w-[200px] text-center">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {(["month", "week", "agenda"] as const).map((v) => (
                  <Button
                    key={v}
                    size="sm"
                    variant={view === v ? "default" : "outline"}
                    onClick={() => setView(v)}
                    className="capitalize"
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(EVENT_COLORS).map(([type, meta]) => (
              <div
                key={type}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                  meta.bg,
                  meta.text,
                )}
              >
                <meta.icon className="h-3 w-3" />
                {meta.label}
                {eventCounts[type] ? (
                  <span className="font-bold">({eventCounts[type]})</span>
                ) : null}
              </div>
            ))}
          </div>
        </Card>

        {/* Month View */}
        {view === "month" && (
          <Card className="overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border/70">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-xs font-semibold text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            {isLoading ? (
              <div className="grid grid-cols-7">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 border-b border-r border-border/40 p-1"
                  >
                    <Skeleton className="h-4 w-6" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7">
                {calendarDays.map(({ date, inMonth, events: dayEvents }, i) => {
                  const dateStr = date.toISOString().substring(0, 10);
                  const isToday = dateStr === today;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "min-h-[96px] border-b border-r border-border/40 p-1.5 overflow-hidden",
                        !inMonth && "bg-muted/20",
                        isToday && "bg-primary/5",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold mb-1",
                          isToday
                            ? "bg-primary text-primary-foreground"
                            : inMonth
                              ? "text-foreground"
                              : "text-muted-foreground/50",
                        )}
                      >
                        {date.getDate()}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents
                          .slice(0, 3)
                          .map((ev: Record<string, unknown>, ei: number) => {
                            const meta =
                              EVENT_COLORS[String(ev.type ?? "")] ??
                              EVENT_COLORS.appointment;
                            return (
                              <div
                                key={ei}
                                className={cn(
                                  "rounded px-1 py-0.5 text-[10px] font-medium truncate cursor-pointer hover:opacity-80",
                                  meta.bg,
                                  meta.text,
                                )}
                              >
                                {String(ev.title ?? "").substring(0, 20)}
                              </div>
                            );
                          })}
                        {dayEvents.length > 3 && (
                          <div className="text-[10px] text-muted-foreground pl-1">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {/* Agenda View */}
        {view === "agenda" && (
          <Card className="overflow-hidden divide-y divide-border/60">
            {isLoading ? (
              <div className="space-y-2 p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
                No events this month
              </div>
            ) : (
              events.map((ev: Record<string, unknown>, i: number) => {
                const meta =
                  EVENT_COLORS[String(ev.type ?? "")] ??
                  EVENT_COLORS.appointment;
                return (
                  <motion.div
                    key={String(ev.id ?? i)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        meta.bg,
                        meta.text,
                      )}
                    >
                      <meta.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {String(ev.title ?? "")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {String(ev.date ?? "").substring(0, 10)}{" "}
                        {ev.time ? `· ${String(ev.time)}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn("text-[10px]", meta.bg, meta.text)}
                      >
                        {meta.label}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-[10px] capitalize"
                      >
                        {String(ev.status ?? "")}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })
            )}
          </Card>
        )}

        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-3">
          {[
            {
              label: "Appointments",
              path: "/meetings/appointments",
              icon: CalendarDays,
              tone: "bg-primary/10 text-primary",
            },
            {
              label: "Janata Darbar",
              path: "/meetings/janata-darbar",
              icon: Users,
              tone: "bg-warning/15 text-warning",
            },
            {
              label: "Public Meetings",
              path: "/meetings/public-meetings",
              icon: Building2,
              tone: "bg-info/10 text-info",
            },
            {
              label: "Tours",
              path: "/meetings/tours",
              icon: MapPin,
              tone: "bg-success/10 text-success",
            },
          ].map((item) => (
            <Link key={item.path} to={item.path as "/meetings/appointments"}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <span
                  className={cn(
                    "grid h-4 w-4 place-items-center rounded",
                    item.tone,
                  )}
                >
                  <item.icon className="h-3 w-3" />
                </span>
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
