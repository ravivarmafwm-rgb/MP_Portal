import axios from "axios";
import { clearStoredAuth } from "./auth-storage";

const API_URL =
  import.meta.env.VITE_API_URL ?? "https://mpportaldashboard.focuswebmedia.in/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: false,
});

// ── Attach token on every request ─────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Handle 401 globally ───────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  role_slug: string;
  initials: string;
}

export async function apiLogin(email: string, password: string) {
  const res = await api.post("/login", { email, password });
  return res.data as { access_token: string; token_type: string; user: AuthUser };
}

export async function apiRegister(name: string, email: string, password: string, password_confirmation: string, role_slug: string) {
  const res = await api.post("/register", { name, email, password, password_confirmation, role_slug });
  return res.data as { access_token: string; token_type: string; user: AuthUser };
}

export async function apiRoles() {
  const res = await api.get("/roles");
  return res.data as Array<{ id: string; name: string; slug: string; description: string }>;
}

export async function apiLogout() {
  await api.post("/logout");
  clearStoredAuth();
}

export async function apiMe(): Promise<AuthUser> {
  const res = await api.get("/user");
  return res.data;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export async function fetchDashboardStats() {
  const res = await api.get("/dashboard/stats");
  return res.data;
}

export async function fetchMlaDashboardStats() {
  const res = await api.get("/dashboard/mla/stats");
  return res.data;
}

export async function fetchVolunteerDashboardStats() {
  const res = await api.get("/dashboard/volunteer/stats");
  return res.data;
}

// ── Citizens ─────────────────────────────────────────────────────────────────
export async function fetchCitizens(params?: Record<string, string | number>) {
  const res = await api.get("/citizens", { params });
  return res.data;
}

export async function fetchCitizen(id: string) {
  const res = await api.get(`/citizens/${id}`);
  return res.data;
}

export async function fetchCitizenStats() {
  const res = await api.get("/citizens/stats");
  return res.data;
}

export async function createCitizen(data: Record<string, unknown>) {
  const res = await api.post("/citizens", data);
  return res.data;
}

// ── Grievances ────────────────────────────────────────────────────────────────
export async function fetchGrievances(params?: Record<string, string | number>) {
  const res = await api.get("/grievances", { params });
  return res.data;
}

export async function fetchGrievance(id: string) {
  const res = await api.get(`/grievances/${id}`);
  return res.data;
}

export async function fetchGrievanceStats() {
  const res = await api.get("/grievances/stats");
  return res.data;
}

export async function fetchGrievanceCategories() {
  const res = await api.get("/grievances/categories");
  return res.data;
}

export async function createGrievance(data: Record<string, unknown>) {
  const res = await api.post("/grievances", data);
  return res.data;
}

export async function updateGrievance(id: string, data: Record<string, unknown>) {
  const res = await api.put(`/grievances/${id}`, data);
  return res.data;
}

// ── Projects ─────────────────────────────────────────────────────────────────
export async function fetchProjects(params?: Record<string, string | number>) {
  const res = await api.get("/projects", { params });
  return res.data;
}

export async function fetchProject(id: string) {
  const res = await api.get(`/projects/${id}`);
  return res.data;
}

export async function fetchProjectStats() {
  const res = await api.get("/projects/stats");
  return res.data;
}

// ── Volunteers ────────────────────────────────────────────────────────────────
export async function fetchVolunteers(params?: Record<string, string | number>) {
  const res = await api.get("/volunteers", { params });
  return res.data;
}

export async function fetchVolunteer(id: string) {
  const res = await api.get(`/volunteers/${id}`);
  return res.data;
}

export async function fetchVolunteerStats() {
  const res = await api.get("/volunteers/stats");
  return res.data;
}

// ── Schemes ──────────────────────────────────────────────────────────────────
export async function fetchSchemes(params?: Record<string, string | number>) {
  const res = await api.get("/schemes", { params });
  return res.data;
}

export async function fetchScheme(id: string) {
  const res = await api.get(`/schemes/${id}`);
  return res.data;
}

export async function fetchSchemeStats() {
  const res = await api.get("/schemes/stats");
  return res.data;
}

export async function fetchSchemeApplications(params?: Record<string, string | number>) {
  const res = await api.get("/schemes/applications", { params });
  return res.data;
}

// ── Surveys ──────────────────────────────────────────────────────────────────
export async function fetchSurveys(params?: Record<string, string | number>) {
  const res = await api.get("/surveys", { params });
  return res.data;
}

export async function fetchSurvey(id: string) {
  const res = await api.get(`/surveys/${id}`);
  return res.data;
}

export async function fetchSurveyStats() {
  const res = await api.get("/surveys/stats");
  return res.data;
}

// ── Locations ────────────────────────────────────────────────────────────────
export async function fetchLocConstituencies() {
  const res = await api.get("/locations/constituencies");
  return res.data;
}

export async function fetchLocVillages(mandalId?: string) {
  const res = await api.get("/locations/villages", { params: mandalId ? { mandal_id: mandalId } : {} });
  return res.data;
}

export async function fetchLocMandals(acId?: string) {
  const res = await api.get("/locations/mandals", { params: acId ? { assembly_constituency_id: acId } : {} });
  return res.data;
}

export async function fetchLocWards(villageId?: string) {
  const res = await api.get("/locations/wards", { params: villageId ? { village_id: villageId } : {} });
  return res.data;
}

export async function fetchLocPollingBooths(villageId?: string) {
  const res = await api.get("/locations/polling-booths", { params: villageId ? { village_id: villageId } : {} });
  return res.data;
}

export async function fetchLocAssemblyConstituencies(constituencyId?: string) {
  const res = await api.get("/locations/assembly-constituencies", {
    params: constituencyId ? { constituency_id: constituencyId } : {},
  });
  return res.data;
}

// ── Families ─────────────────────────────────────────────────────────────────
export async function fetchFamilies(params?: Record<string, string | number>) {
  const res = await api.get("/families", { params });
  return res.data;
}

export async function createFamily(data: Record<string, unknown>) {
  const res = await api.post("/families", data);
  return res.data;
}

// ── Documents ────────────────────────────────────────────────────────────────
export async function uploadDocument(formData: FormData) {
  const res = await api.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function fetchDocuments(params?: Record<string, string | number>) {
  const res = await api.get("/documents", { params });
  return res.data;
}

export async function deleteDocument(id: string) {
  const res = await api.delete(`/documents/${id}`);
  return res.data;
}

// ── Notifications ────────────────────────────────────────────────────────────
export async function fetchNotifications(params?: Record<string, string | number | boolean>) {
  const res = await api.get("/notifications", { params });
  return res.data;
}

export async function fetchUnreadNotificationCount() {
  const res = await api.get("/notifications/unread-count");
  return res.data as { count: number };
}

export async function markNotificationRead(id: string) {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
}

export async function markAllNotificationsRead() {
  const res = await api.put("/notifications/read-all");
  return res.data;
}

// ── Meetings ─────────────────────────────────────────────────────────────────
export async function fetchMeetingDashboard() {
  const res = await api.get("/meetings/dashboard");
  return res.data;
}

export async function fetchAppointments(params?: Record<string, string | number | boolean>) {
  const res = await api.get("/meetings/appointments", { params });
  return res.data;
}

export async function fetchAppointmentStats() {
  const res = await api.get("/meetings/appointments/stats");
  return res.data;
}

export async function fetchAppointment(id: string) {
  const res = await api.get(`/meetings/appointments/${id}`);
  return res.data;
}

export async function createAppointment(data: Record<string, unknown>) {
  const res = await api.post("/meetings/appointments", data);
  return res.data;
}

export async function updateAppointment(id: string, data: Record<string, unknown>) {
  const res = await api.put(`/meetings/appointments/${id}`, data);
  return res.data;
}

export async function fetchPublicMeetings(params?: Record<string, string | number>) {
  const res = await api.get("/meetings/public-meetings", { params });
  return res.data;
}

export async function createPublicMeeting(data: Record<string, unknown>) {
  const res = await api.post("/meetings/public-meetings", data);
  return res.data;
}

export async function fetchTours(params?: Record<string, string | number>) {
  const res = await api.get("/meetings/tours", { params });
  return res.data;
}

export async function createTour(data: Record<string, unknown>) {
  const res = await api.post("/meetings/tours", data);
  return res.data;
}

export async function fetchJanataDarbars(params?: Record<string, string | number>) {
  const res = await api.get("/meetings/janata-darbar", { params });
  return res.data;
}

export async function createJanataDarbar(data: Record<string, unknown>) {
  const res = await api.post("/meetings/janata-darbar", data);
  return res.data;
}

export async function fetchCalendarEvents(start: string, end: string) {
  const res = await api.get("/meetings/calendar", { params: { start, end } });
  return res.data;
}

export async function fetchEngagementAnalytics() {
  const res = await api.get("/meetings/engagement-analytics");
  return res.data;
}
