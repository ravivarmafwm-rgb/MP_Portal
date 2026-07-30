import axios from "axios";
//#region src/lib/auth-storage.ts
function getStoredAuth() {
	if (typeof window === "undefined") return {
		token: null,
		user: null
	};
	try {
		const token = localStorage.getItem("mp_token");
		const raw = localStorage.getItem("mp_user");
		return {
			token,
			user: raw ? JSON.parse(raw) : null
		};
	} catch {
		return {
			token: null,
			user: null
		};
	}
}
function isStoredAuthenticated() {
	const { token, user } = getStoredAuth();
	return !!token && !!user;
}
function clearStoredAuth() {
	localStorage.removeItem("mp_token");
	localStorage.removeItem("mp_user");
}
function setStoredAuth(token, user) {
	localStorage.setItem("mp_token", token);
	localStorage.setItem("mp_user", JSON.stringify(user));
}
var INACTIVITY_MS = 1800 * 1e3;
var lastActivity = Date.now();
function touchActivity() {
	lastActivity = Date.now();
}
function isSessionExpired() {
	return Date.now() - lastActivity > INACTIVITY_MS;
}
function initActivityTracking(onExpire) {
	const events = [
		"mousedown",
		"keydown",
		"scroll",
		"touchstart"
	];
	const handler = () => touchActivity();
	events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
	const interval = window.setInterval(() => {
		if (isSessionExpired()) onExpire();
	}, 6e4);
	return () => {
		events.forEach((e) => window.removeEventListener(e, handler));
		clearInterval(interval);
	};
}
var api = axios.create({
	baseURL: "https://mpportal.focuswebmedia.in/api",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json"
	},
	withCredentials: false
});
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("mp_token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});
api.interceptors.response.use((response) => response, (error) => {
	if (error.response?.status === 401) {
		clearStoredAuth();
		window.location.href = "/login";
	}
	return Promise.reject(error);
});
async function apiLogin(email, password) {
	return (await api.post("/login", {
		email,
		password
	})).data;
}
async function apiRegister(name, email, password, password_confirmation, role_slug) {
	return (await api.post("/register", {
		name,
		email,
		password,
		password_confirmation,
		role_slug
	})).data;
}
async function apiRoles() {
	return (await api.get("/roles")).data;
}
async function apiLogout() {
	await api.post("/logout");
	clearStoredAuth();
}
async function apiMe() {
	return (await api.get("/user")).data;
}
async function fetchDashboardStats() {
	return (await api.get("/dashboard/stats")).data;
}
async function fetchMlaDashboardStats() {
	return (await api.get("/dashboard/mla/stats")).data;
}
async function fetchVolunteerDashboardStats() {
	return (await api.get("/dashboard/volunteer/stats")).data;
}
async function fetchCitizens(params) {
	return (await api.get("/citizens", { params })).data;
}
async function fetchCitizenStats() {
	return (await api.get("/citizens/stats")).data;
}
async function createCitizen(data) {
	return (await api.post("/citizens", data)).data;
}
async function fetchGrievances(params) {
	return (await api.get("/grievances", { params })).data;
}
async function fetchGrievanceStats() {
	return (await api.get("/grievances/stats")).data;
}
async function fetchGrievanceCategories() {
	return (await api.get("/grievances/categories")).data;
}
async function updateGrievance(id, data) {
	return (await api.put(`/grievances/${id}`, data)).data;
}
async function fetchProjects(params) {
	return (await api.get("/projects", { params })).data;
}
async function fetchProject(id) {
	return (await api.get(`/projects/${id}`)).data;
}
async function fetchProjectStats() {
	return (await api.get("/projects/stats")).data;
}
async function fetchVolunteers(params) {
	return (await api.get("/volunteers", { params })).data;
}
async function fetchVolunteerStats() {
	return (await api.get("/volunteers/stats")).data;
}
async function fetchSchemes(params) {
	return (await api.get("/schemes", { params })).data;
}
async function fetchSchemeStats() {
	return (await api.get("/schemes/stats")).data;
}
async function fetchSchemeApplications(params) {
	return (await api.get("/schemes/applications", { params })).data;
}
async function fetchSurveys(params) {
	return (await api.get("/surveys", { params })).data;
}
async function fetchSurvey(id) {
	return (await api.get(`/surveys/${id}`)).data;
}
async function fetchSurveyStats() {
	return (await api.get("/surveys/stats")).data;
}
async function fetchLocVillages(mandalId) {
	return (await api.get("/locations/villages", { params: mandalId ? { mandal_id: mandalId } : {} })).data;
}
async function fetchLocMandals(acId) {
	return (await api.get("/locations/mandals", { params: acId ? { assembly_constituency_id: acId } : {} })).data;
}
async function fetchLocWards(villageId) {
	return (await api.get("/locations/wards", { params: villageId ? { village_id: villageId } : {} })).data;
}
async function fetchLocPollingBooths(villageId) {
	return (await api.get("/locations/polling-booths", { params: villageId ? { village_id: villageId } : {} })).data;
}
async function fetchFamilies(params) {
	return (await api.get("/families", { params })).data;
}
async function uploadDocument(formData) {
	return (await api.post("/documents/upload", formData, { headers: { "Content-Type": "multipart/form-data" } })).data;
}
async function fetchDocuments(params) {
	return (await api.get("/documents", { params })).data;
}
async function fetchNotifications(params) {
	return (await api.get("/notifications", { params })).data;
}
async function fetchUnreadNotificationCount() {
	return (await api.get("/notifications/unread-count")).data;
}
async function markNotificationRead(id) {
	return (await api.put(`/notifications/${id}/read`)).data;
}
async function markAllNotificationsRead() {
	return (await api.put("/notifications/read-all")).data;
}
async function fetchMeetingDashboard() {
	return (await api.get("/meetings/dashboard")).data;
}
async function fetchAppointments(params) {
	return (await api.get("/meetings/appointments", { params })).data;
}
async function fetchAppointmentStats() {
	return (await api.get("/meetings/appointments/stats")).data;
}
async function createAppointment(data) {
	return (await api.post("/meetings/appointments", data)).data;
}
async function updateAppointment(id, data) {
	return (await api.put(`/meetings/appointments/${id}`, data)).data;
}
async function fetchPublicMeetings(params) {
	return (await api.get("/meetings/public-meetings", { params })).data;
}
async function createPublicMeeting(data) {
	return (await api.post("/meetings/public-meetings", data)).data;
}
async function fetchTours(params) {
	return (await api.get("/meetings/tours", { params })).data;
}
async function createTour(data) {
	return (await api.post("/meetings/tours", data)).data;
}
async function fetchJanataDarbars(params) {
	return (await api.get("/meetings/janata-darbar", { params })).data;
}
async function createJanataDarbar(data) {
	return (await api.post("/meetings/janata-darbar", data)).data;
}
async function fetchCalendarEvents(start, end) {
	return (await api.get("/meetings/calendar", { params: {
		start,
		end
	} })).data;
}
async function fetchEngagementAnalytics() {
	return (await api.get("/meetings/engagement-analytics")).data;
}
//#endregion
export { getStoredAuth as $, fetchMlaDashboardStats as A, fetchSurveyStats as B, fetchGrievances as C, fetchLocVillages as D, fetchLocPollingBooths as E, fetchPublicMeetings as F, fetchVolunteerStats as G, fetchTours as H, fetchSchemeApplications as I, markNotificationRead as J, fetchVolunteers as K, fetchSchemeStats as L, fetchProject as M, fetchProjectStats as N, fetchLocWards as O, fetchProjects as P, clearStoredAuth as Q, fetchSchemes as R, fetchGrievanceStats as S, fetchLocMandals as T, fetchUnreadNotificationCount as U, fetchSurveys as V, fetchVolunteerDashboardStats as W, updateGrievance as X, updateAppointment as Y, uploadDocument as Z, fetchDashboardStats as _, apiRegister as a, fetchFamilies as b, createCitizen as c, createTour as d, initActivityTracking as et, fetchAppointmentStats as f, fetchCitizens as g, fetchCitizenStats as h, apiMe as i, fetchNotifications as j, fetchMeetingDashboard as k, createJanataDarbar as l, fetchCalendarEvents as m, apiLogin as n, setStoredAuth as nt, apiRoles as o, fetchAppointments as p, markAllNotificationsRead as q, apiLogout as r, touchActivity as rt, createAppointment as s, api as t, isStoredAuthenticated as tt, createPublicMeeting as u, fetchDocuments as v, fetchJanataDarbars as w, fetchGrievanceCategories as x, fetchEngagementAnalytics as y, fetchSurvey as z };
