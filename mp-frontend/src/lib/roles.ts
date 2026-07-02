export type RoleSlug =
  | "super-admin"
  | "mp"
  | "mla"
  | "mp-staff"
  | "constituency-coordinator"
  | "assembly-coordinator"
  | "mandal-coordinator"
  | "village-coordinator"
  | "volunteer"
  | "government-officer"
  | "citizen"
  | "staff";

/** Default landing page per role after login */
export const ROLE_DASHBOARDS: Record<string, string> = {
  "super-admin": "/admin",
  mp: "/mp",
  mla: "/mla",
  "mp-staff": "/staff",
  "constituency-coordinator": "/coordinator",
  "assembly-coordinator": "/coordinator",
  "mandal-coordinator": "/coordinator",
  "village-coordinator": "/coordinator",
  volunteer: "/volunteer",
  "government-officer": "/officer",
  citizen: "/citizen",
  staff: "/staff",
};

/** Which roles may access a given route prefix */
export const ROUTE_ROLE_ACCESS: Record<string, RoleSlug[]> = {
  "/admin": ["super-admin"],
  "/mp": ["super-admin", "mp"],
  "/dashboard": ["super-admin", "mp", "mp-staff", "constituency-coordinator"],
  "/mla": ["super-admin", "mla"],
  "/staff": ["super-admin", "mp-staff"],
  "/coordinator": [
    "super-admin",
    "constituency-coordinator",
    "assembly-coordinator",
    "mandal-coordinator",
    "village-coordinator",
  ],
  "/volunteer": ["super-admin", "volunteer"],
  "/officer": ["super-admin", "government-officer"],
  "/citizen": ["super-admin", "citizen"],
  "/citizens/create-profile": ["super-admin", "volunteer"],
};

export function getDashboardPath(roleSlug: string): string {
  return ROLE_DASHBOARDS[roleSlug] ?? "/dashboard";
}

export function canAccessRoute(roleSlug: string, pathname: string): boolean {
  const exact = ROUTE_ROLE_ACCESS[pathname];
  if (exact) return exact.includes(roleSlug as RoleSlug) || roleSlug === "super-admin";

  for (const [prefix, roles] of Object.entries(ROUTE_ROLE_ACCESS)) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return roles.includes(roleSlug as RoleSlug) || roleSlug === "super-admin";
    }
  }

  return true;
}

/** Nav sections visible per role */
export const ROLE_NAV_ACCESS: Record<string, string[]> = {
  "super-admin": ["*"],
  mp: ["*"],
  mla: ["Dashboard", "Citizens", "Grievances", "Projects", "Surveys", "Volunteers", "Analytics"],
  "mp-staff": ["Dashboard", "Citizens", "Schemes", "Grievances", "Projects", "Surveys", "Volunteers", "Meetings", "Documents", "Communication Hub"],
  "constituency-coordinator": ["Dashboard", "Citizens", "Grievances", "Volunteers", "Surveys", "Meetings"],
  "assembly-coordinator": ["Dashboard", "Citizens", "Grievances", "Volunteers"],
  "mandal-coordinator": ["Dashboard", "Citizens", "Grievances", "Volunteers"],
  "village-coordinator": ["Dashboard", "Citizens", "Grievances", "Volunteers"],
  volunteer: ["Dashboard", "Citizens", "Grievances", "Surveys", "Volunteers"],
  "government-officer": ["Grievances", "Projects"],
  citizen: ["Dashboard"],
  staff: ["Dashboard", "Citizens", "Grievances"],
};

export function canSeeNavSection(roleSlug: string, sectionTitle: string): boolean {
  const allowed = ROLE_NAV_ACCESS[roleSlug] ?? ROLE_NAV_ACCESS.staff;
  if (allowed.includes("*")) return true;
  return allowed.includes(sectionTitle);
}
