//#region src/lib/roles.ts
/** Default landing page per role after login */
var ROLE_DASHBOARDS = {
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
	staff: "/staff"
};
/** Which roles may access a given route prefix */
var ROUTE_ROLE_ACCESS = {
	"/admin": ["super-admin"],
	"/mp": ["super-admin", "mp"],
	"/dashboard": [
		"super-admin",
		"mp",
		"mp-staff",
		"constituency-coordinator"
	],
	"/mla": ["super-admin", "mla"],
	"/staff": ["super-admin", "mp-staff"],
	"/coordinator": [
		"super-admin",
		"constituency-coordinator",
		"assembly-coordinator",
		"mandal-coordinator",
		"village-coordinator"
	],
	"/volunteer": ["super-admin", "volunteer"],
	"/officer": ["super-admin", "government-officer"],
	"/citizen": ["super-admin", "citizen"],
	"/citizens/create-profile": ["super-admin", "volunteer"]
};
function getDashboardPath(roleSlug) {
	return ROLE_DASHBOARDS[roleSlug] ?? "/dashboard";
}
function canAccessRoute(roleSlug, pathname) {
	const exact = ROUTE_ROLE_ACCESS[pathname];
	if (exact) return exact.includes(roleSlug) || roleSlug === "super-admin";
	for (const [prefix, roles] of Object.entries(ROUTE_ROLE_ACCESS)) if (pathname === prefix || pathname.startsWith(prefix + "/")) return roles.includes(roleSlug) || roleSlug === "super-admin";
	return true;
}
/** Nav sections visible per role */
var ROLE_NAV_ACCESS = {
	"super-admin": ["*"],
	mp: ["*"],
	mla: [
		"Dashboard",
		"Citizens",
		"Grievances",
		"Projects",
		"Surveys",
		"Volunteers",
		"Analytics"
	],
	"mp-staff": [
		"Dashboard",
		"Citizens",
		"Schemes",
		"Grievances",
		"Projects",
		"Surveys",
		"Volunteers",
		"Meetings",
		"Documents",
		"Communication Hub"
	],
	"constituency-coordinator": [
		"Dashboard",
		"Citizens",
		"Grievances",
		"Volunteers",
		"Surveys",
		"Meetings"
	],
	"assembly-coordinator": [
		"Dashboard",
		"Citizens",
		"Grievances",
		"Volunteers"
	],
	"mandal-coordinator": [
		"Dashboard",
		"Citizens",
		"Grievances",
		"Volunteers"
	],
	"village-coordinator": [
		"Dashboard",
		"Citizens",
		"Grievances",
		"Volunteers"
	],
	volunteer: [
		"Dashboard",
		"Citizens",
		"Grievances",
		"Surveys",
		"Volunteers"
	],
	"government-officer": ["Grievances", "Projects"],
	citizen: ["Dashboard"],
	staff: [
		"Dashboard",
		"Citizens",
		"Grievances"
	]
};
function canSeeNavSection(roleSlug, sectionTitle) {
	const allowed = ROLE_NAV_ACCESS[roleSlug] ?? ROLE_NAV_ACCESS.staff;
	if (allowed.includes("*")) return true;
	return allowed.includes(sectionTitle);
}
//#endregion
export { canSeeNavSection as n, getDashboardPath as r, canAccessRoute as t };
