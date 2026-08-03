import {
  LayoutDashboard,
  Users,
  FileBadge,
  MessageSquareWarning,
  HardHat,
  ClipboardList,
  HeartHandshake,
  CalendarDays,
  FolderOpen,
  Megaphone,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavChild = { title: string; url: string; roles?: string[] };
export type NavSection = {
  title: string;
  url: string;
  icon: LucideIcon;
  children?: NavChild[];
};

export const navSections: NavSection[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  {
    title: "Citizens",
    url: "/citizens",
    icon: Users,
    children: [
      { title: "Citizen Dashboard", url: "/citizens/dashboard" },
      { title: "Citizen List", url: "/citizens/list" },
      { title: "Create Profile", url: "/citizens/create-profile" },
      { title: "Citizen Profile", url: "/citizens/profile" },
      { title: "Families", url: "/citizens/families" },
      { title: "Documents", url: "/citizens/documents" },
      { title: "Interactions", url: "/citizens/interactions" },
      { title: "Booth Mapping", url: "/citizens/booth-mapping" },
    ],
  },
  {
    title: "Schemes",
    url: "/schemes",
    icon: FileBadge,
    children: [
      { title: "Command Center", url: "/schemes/dashboard" },
      { title: "Applications", url: "/schemes/applications" },
      { title: "Application 360", url: "/schemes/application-detail" },
      { title: "Beneficiaries", url: "/schemes/beneficiaries" },
      { title: "Eligibility Engine", url: "/schemes/eligibility" },
      { title: "Scheme Catalog", url: "/schemes/scheme-catalog" },
      { title: "Coverage Analysis", url: "/schemes/coverage-analysis" },
      { title: "Performance", url: "/schemes/performance" },
    ],
  },
  {
    title: "Grievances",
    url: "/grievances",
    icon: MessageSquareWarning,
    children: [
      { title: "Command Center", url: "/grievances/dashboard" },
      { title: "Complaint Directory", url: "/grievances/list" },
      { title: "Case 360", url: "/grievances/detail" },
      { title: "Categories", url: "/grievances/categories" },
      { title: "Escalations", url: "/grievances/escalations" },
      { title: "Departments", url: "/grievances/departments" },
      { title: "Analytics", url: "/grievances/analytics" },
      { title: "Resolution Center", url: "/grievances/resolution-center" },
    ],
  },
  {
    title: "Projects",
    url: "/projects",
    icon: HardHat,
    children: [
      { title: "Command Center", url: "/projects/dashboard" },
      { title: "MPLADS", url: "/projects/mplads" },
      { title: "Development Projects", url: "/projects/development" },
      { title: "Project 360", url: "/projects/project-detail" },
      { title: "Contractors", url: "/projects/contractors" },
      { title: "Lookup Administration", url: "/projects/lookups" },
      { title: "Progress Tracker", url: "/projects/progress-tracker" },
      { title: "Budget Monitoring", url: "/projects/budget-monitoring" },
      { title: "Analytics", url: "/projects/analytics" },
    ],
  },
  {
    title: "Surveys",
    url: "/surveys",
    icon: ClipboardList,
    children: [
      { title: "Command Center", url: "/surveys/dashboard" },
      { title: "Active Surveys", url: "/surveys/active" },
      { title: "Form Builder", url: "/surveys/form-builder" },
      { title: "Responses", url: "/surveys/responses" },
      { title: "Survey 360", url: "/surveys/detail" },
      { title: "Analytics", url: "/surveys/analytics" },
      { title: "Census Center", url: "/surveys/census" },
      { title: "Intelligence", url: "/surveys/intelligence" },
    ],
  },
  {
    title: "Volunteers",
    url: "/volunteers",
    icon: HeartHandshake,
    children: [
      {
        title: "Applications",
        url: "/volunteers/applications",
        roles: ["super-admin", "mp-staff", "constituency-coordinator"],
      },
      { title: "Volunteer List", url: "/volunteers/list" },
      { title: "Volunteer Profile", url: "/volunteers/profile" },
      { title: "Enrolled Citizens", url: "/volunteers/enrolled-citizens" },
      { title: "Activity Monitor", url: "/volunteers/activity" },
      { title: "Attendance", url: "/volunteers/attendance" },
      { title: "Performance", url: "/volunteers/performance" },
      { title: "Geographic Coverage", url: "/volunteers/geographic-coverage" },
      { title: "Training", url: "/volunteers/training" },
    ],
  },
  {
    title: "Meetings",
    url: "/meetings/dashboard",
    icon: CalendarDays,
    children: [
      { title: "Command Center", url: "/meetings/dashboard" },
      { title: "Appointments", url: "/meetings/appointments" },
      { title: "Appointment 360", url: "/meetings/appointment-detail" },
      { title: "Janata Darbar", url: "/meetings/janata-darbar" },
      { title: "Public Meetings", url: "/meetings/public-meetings" },
      { title: "MP Tours", url: "/meetings/tours" },
      { title: "Master Calendar", url: "/meetings/calendar" },
      { title: "Engagement Analytics", url: "/meetings/engagement-analytics" },
    ],
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FolderOpen,
    children: [
      { title: "Citizen Documents", url: "/documents/citizen-documents" },
      { title: "Project Documents", url: "/documents/project-documents" },
    ],
  },
  {
    title: "Communication Hub",
    url: "/communication",
    icon: Megaphone,
    children: [
      { title: "SMS", url: "/communication/sms" },
      { title: "WhatsApp", url: "/communication/whatsapp" },
      { title: "Email", url: "/communication/email" },
      { title: "Voice & IVR", url: "/communication/voice" },
    ],
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    children: [
      { title: "Constituency", url: "/analytics/constituency" },
      { title: "Assembly", url: "/analytics/assembly" },
      { title: "Mandal", url: "/analytics/mandal" },
      { title: "Village", url: "/analytics/village" },
      { title: "Booth", url: "/analytics/booth" },
    ],
  },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Profile", url: "/profile", icon: Settings },
  { title: "Preferences", url: "/preferences", icon: Settings },
];

export function findBreadcrumb(
  pathname: string,
): { title: string; url: string }[] {
  const crumbs: { title: string; url: string }[] = [];
  for (const section of navSections) {
    if (pathname === section.url || pathname.startsWith(section.url + "/")) {
      crumbs.push({ title: section.title, url: section.url });
      if (section.children) {
        const child = section.children.find((c) => c.url === pathname);
        if (child) crumbs.push({ title: child.title, url: child.url });
      }
      break;
    }
  }
  return crumbs;
}
