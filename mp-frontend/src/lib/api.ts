import axios from "axios";
import { clearStoredAuth } from "./auth-storage";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "https://mpportaldashboard.focuswebmedia.in/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: false,
});

export function getApiErrorMessage(
  error: unknown,
  fallback = "The request could not be completed.",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;
    return (
      (data?.errors ? Object.values(data.errors).flat()[0] : undefined) ??
      data?.message ??
      fallback
    );
  }
  return error instanceof Error ? error.message : fallback;
}

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
  },
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
  return res.data as {
    access_token: string;
    token_type: string;
    user: AuthUser;
  };
}

export async function apiRegister(
  name: string,
  email: string,
  password: string,
  password_confirmation: string,
) {
  const res = await api.post("/register", {
    name,
    email,
    password,
    password_confirmation,
  });
  return res.data as {
    access_token: string;
    token_type: string;
    user: AuthUser;
  };
}

export interface PublicStatistics {
  citizens_served: number;
  grievances_resolved: number;
  projects_completed: number;
  active_volunteers: number;
  updated_at: string;
}

export async function fetchPublicStatistics(): Promise<PublicStatistics> {
  const response = await api.get("/public/statistics");
  return response.data;
}

export interface PublicVillage {
  id: string;
  name: string;
  mandal_id: string;
}
export async function fetchPublicVillages(): Promise<PublicVillage[]> {
  const response = await api.get("/public/locations/villages");
  return response.data;
}

export interface VolunteerApplicationInput {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  date_of_birth: string;
  gender: "Male" | "Female" | "Other";
  village_id: string;
  address: string;
  motivation: string;
}
export async function submitVolunteerApplication(
  input: VolunteerApplicationInput,
) {
  const response = await api.post("/volunteer-applications", input);
  return response.data as { id: string; status: "pending"; message: string };
}

export interface VolunteerApplicationRecord extends VolunteerApplicationInput {
  id: string;
  status: "pending" | "approved" | "rejected";
  review_notes?: string;
  village?: { id: string; name: string };
  created_at: string;
}
export async function fetchVolunteerApplications(params?: {
  status?: string;
  page?: number;
}) {
  const response = await api.get("/volunteer-applications", { params });
  return response.data as {
    data: VolunteerApplicationRecord[];
    meta: {
      total: number;
      current_page: number;
      last_page: number;
      per_page: number;
    };
  };
}
export async function reviewVolunteerApplication(
  id: string,
  decision: "approved" | "rejected",
  review_notes?: string,
) {
  const response = await api.patch(`/volunteer-applications/${id}`, {
    decision,
    review_notes,
  });
  return response.data as { message: string; setup_email_sent?: boolean };
}

export async function apiLogout() {
  await api.post("/logout");
  clearStoredAuth();
}

export async function apiMe(): Promise<AuthUser> {
  const res = await api.get("/user");
  return res.data;
}

export async function updateMyProfile(data: { name: string; email: string }) {
  const res = await api.put("/user/profile", data);
  return res.data as AuthUser;
}
export async function changeMyPassword(data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) {
  const res = await api.put("/user/password", data);
  return res.data as { message: string };
}
export interface AuthSession {
  id: string;
  name: string;
  ip_address?: string | null;
  user_agent?: string | null;
  last_used_at?: string | null;
  created_at: string;
  is_current: boolean;
}
export async function fetchAuthSessions() {
  const res = await api.get("/user/sessions");
  return res.data as { data: AuthSession[] };
}
export async function revokeAuthSession(id: string) {
  const res = await api.delete(`/user/sessions/${id}`);
  return res.data as { message: string };
}
export async function revokeOtherAuthSessions() {
  const res = await api.delete("/user/sessions/others");
  return res.data as { message: string };
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

export interface CitizenDetailRecord {
  id: string;
  unique_id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  date_of_birth?: string | null;
  gender: string;
  mobile_number?: string | null;
  email?: string | null;
  aadhaar_masked?: string | null;
  voter_id?: string | null;
  occupation?: string | null;
  education?: string | null;
  marital_status?: string | null;
  is_voter: boolean;
  addresses: Array<{
    id: string;
    address_type: string;
    house_number?: string | null;
    street?: string | null;
    locality?: string | null;
    pincode?: string | null;
    village?: {
      id: string;
      name: string;
      mandal?: { id: string; name: string };
    } | null;
    ward?: { id: string; name: string } | null;
  }>;
  families: FamilyRecord[];
  grievances: Array<{
    id: string;
    grievance_number: string;
    title: string;
    status: string;
    created_at: string;
    category?: { id: string; name: string } | null;
  }>;
  scheme_applications: SchemeApplicationRecord[];
  survey_responses: Array<{
    id: string;
    response_date: string;
    survey?: { id: string; title: string } | null;
  }>;
  interactions: Array<{
    id: string;
    interaction_type: string;
    subject: string;
    interaction_date: string;
    description?: string | null;
  }>;
  documents: Array<{
    id: string;
    title: string;
    original_name: string;
    mime_type: string;
    created_at: string;
    category?: { id: string; name: string } | null;
  }>;
  activity_logs: Array<{
    id: string;
    action: string;
    description: string;
    created_at: string;
    user?: { id: string; name: string } | null;
  }>;
}

export async function fetchCitizen(id: string) {
  const res = await api.get(`/citizens/${id}`);
  return res.data as CitizenDetailRecord;
}

export async function fetchCitizenStats() {
  const res = await api.get("/citizens/stats");
  return res.data;
}

export interface CensusRecord {
  total_citizens: number;
  male: number;
  female: number;
  other_gender: number;
  voters: number;
  households: number;
  bpl_households: number;
  with_aadhaar: number;
  with_voter_id: number;
  with_mobile: number;
  with_education: number;
  with_occupation: number;
  persons_with_disability: number;
  children: number;
  working_age: number;
  senior_citizens: number;
  education_breakdown: Array<{ label: string; count: number }>;
  occupation_breakdown: Array<{ label: string; count: number }>;
  generated_at: string;
}

export async function fetchCensus() {
  const res = await api.get("/citizens/census");
  return res.data as CensusRecord;
}

export async function downloadCensus() {
  const res = await api.get("/citizens/census/export", {
    responseType: "blob",
  });
  return URL.createObjectURL(res.data as Blob);
}

export interface CitizenBoothMappingRecord {
  id: string;
  unique_id: string;
  name: string;
  mobile_number?: string | null;
  address?: {
    id: string;
    village_id?: string | null;
    village?: string | null;
    ward?: string | null;
    polling_booth?: { id: string; name: string; booth_number: number } | null;
  } | null;
}
export async function fetchCitizenBoothMappings(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/citizens/booth-mapping", { params });
  return res.data as {
    data: CitizenBoothMappingRecord[];
    meta: PaginationMeta;
  };
}
export async function mapCitizenBooth(
  citizenId: string,
  addressId: string,
  pollingBoothId: string,
) {
  const res = await api.patch(`/citizens/${citizenId}/booth`, {
    address_id: addressId,
    polling_booth_id: pollingBoothId,
  });
  return res.data as { message: string };
}

export async function createCitizen(data: Record<string, unknown>) {
  const res = await api.post("/citizens", data);
  return res.data;
}

// ── Grievances ────────────────────────────────────────────────────────────────
export interface GrievanceRecord {
  [key: string]: unknown;
  id: string;
  grievance_number: string;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  severity?: string | null;
  citizen_id?: string | null;
  citizen_name?: string | null;
  citizen_mobile?: string | null;
  source?: string | null;
  created_at: string;
  updated_at: string;
  resolved_date?: string | null;
  category?: { id: string; name: string } | null;
  assigned_department?: { id: string; name: string } | null;
  subject?: string | null;
  resolution_summary?: string | null;
}
export interface GrievanceCategoryRecord {
  [key: string]: unknown;
  id: string;
  name: string;
  severity?: string | null;
  sla_days: number;
  grievances_count: number;
  resolved_grievances_count: number;
  resolution_rate: number;
}

export async function fetchGrievances(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/grievances", { params });
  return res.data as { data: GrievanceRecord[]; meta: PaginationMeta };
}

export async function fetchGrievance(id: string) {
  const res = await api.get(`/grievances/${id}`);
  return res.data as GrievanceRecord;
}

export async function fetchGrievanceStats() {
  const res = await api.get("/grievances/stats");
  return res.data;
}

export async function fetchGrievanceCategories() {
  const res = await api.get("/grievances/categories");
  return res.data as GrievanceCategoryRecord[];
}

export async function createGrievance(data: Record<string, unknown>) {
  const res = await api.post("/grievances", data);
  return res.data;
}

export async function updateGrievance(
  id: string,
  data: Record<string, unknown>,
) {
  const res = await api.put(`/grievances/${id}`, data);
  return res.data;
}

export interface GrievanceDepartmentRecord {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  contact_person?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  assigned: number;
  pending: number;
  resolved: number;
  sla_compliance?: number | null;
}
export async function fetchGrievanceDepartments() {
  const res = await api.get("/grievances/departments");
  return res.data as GrievanceDepartmentRecord[];
}
export interface GrievanceFeedbackRecord {
  id: string;
  rating?: number | null;
  comments?: string | null;
  feedback_date: string;
  citizen?: { id: string; first_name: string; last_name: string } | null;
  grievance?: { id: string; grievance_number: string; subject: string } | null;
}
export async function fetchGrievanceFeedback(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/grievances/feedback", { params });
  return res.data as { data: GrievanceFeedbackRecord[]; meta: PaginationMeta };
}

// ── Projects ─────────────────────────────────────────────────────────────────
export async function fetchProjects(params?: Record<string, string | number>) {
  const res = await api.get("/projects", { params });
  return res.data as { data: ProjectRecord[]; meta: PaginationMeta };
}

export interface ProjectRecord {
  [key: string]: unknown;
  id: string;
  name: string;
  status: string;
  start_date?: string | null;
  expected_completion_date?: string | null;
  completion_percentage?: number | null;
  contractor?: { id: string; name: string } | null;
  project_number?: string;
  project_type?: string;
  category?: string;
  description?: string | null;
  estimated_cost?: string | number;
  sanctioned_amount?: string | number | null;
  expenditure?: string | number;
  progress_percentage?: string | number;
  constituency_id?: string | null;
  assembly_constituency_id?: string | null;
  mandal_id?: string | null;
  village_id?: string | null;
  ward_id?: string | null;
  location?: string | null;
  scheduled_completion_date?: string | null;
  actual_completion_date?: string | null;
  sanction_date?: string | null;
  department?: string | null;
  remarks?: string | null;
  constituency?: { id: string; name: string } | null;
  village?: { id: string; name: string } | null;
  mandal?: { id: string; name: string } | null;
  milestones?: ProjectMilestoneRecord[];
  updates?: Array<Record<string, unknown>>;
  budgets?: ProjectBudgetRecord[];
  photos?: ProjectPhotoRecord[];
}
export interface ProjectMilestoneRecord {
  id: string;
  name: string;
  description?: string | null;
  target_date: string;
  actual_date?: string | null;
  target_percentage?: string | number | null;
  status: string;
  budget?: string | number | null;
  actual_cost?: string | number;
  deliverables?: string | null;
  remarks?: string | null;
  sort_order?: number;
}
export interface ProjectBudgetRecord {
  id: string;
  budget_head: string;
  description?: string | null;
  allocated_amount: string | number;
  revised_amount?: string | number | null;
  utilized_amount: string | number;
  balance_amount: string | number;
  status: string;
  allocation_date?: string | null;
  remarks?: string | null;
}
export interface ProjectPhotoRecord {
  id: string;
  title?: string | null;
  description?: string | null;
  file_name: string;
  file_size?: number | null;
  photo_date: string;
  captured_by?: string | null;
  is_before: boolean;
  is_after: boolean;
  is_verified: boolean;
  status: string;
  created_at: string;
}

export async function fetchProject(id: string) {
  const res = await api.get(`/projects/${id}`);
  return res.data as ProjectRecord;
}

export async function createProject(data: Record<string, unknown>) {
  const res = await api.post("/projects", data);
  return res.data as ProjectRecord;
}
export async function updateProject(id: string, data: Record<string, unknown>) {
  const res = await api.put(`/projects/${id}`, data);
  return res.data as ProjectRecord;
}
export async function deleteProject(id: string) {
  const res = await api.delete(`/projects/${id}`);
  return res.data as { message: string };
}
export async function createProjectProgress(
  id: string,
  data: Record<string, unknown>,
) {
  const res = await api.post(`/projects/${id}/progress`, data);
  return res.data as Record<string, unknown>;
}
export async function saveProjectMilestone(
  projectId: string,
  data: Record<string, unknown>,
  id?: string,
) {
  const res = id
    ? await api.put(`/projects/${projectId}/milestones/${id}`, data)
    : await api.post(`/projects/${projectId}/milestones`, data);
  return res.data as ProjectMilestoneRecord;
}
export async function deleteProjectMilestone(projectId: string, id: string) {
  const res = await api.delete(`/projects/${projectId}/milestones/${id}`);
  return res.data as { message: string };
}
export async function saveProjectBudget(
  projectId: string,
  data: Record<string, unknown>,
  id?: string,
) {
  const res = id
    ? await api.put(`/projects/${projectId}/budgets/${id}`, data)
    : await api.post(`/projects/${projectId}/budgets`, data);
  return res.data as ProjectBudgetRecord;
}
export async function deleteProjectBudget(projectId: string, id: string) {
  const res = await api.delete(`/projects/${projectId}/budgets/${id}`);
  return res.data as { message: string };
}
export async function uploadProjectPhoto(projectId: string, data: FormData) {
  const res = await api.post(`/projects/${projectId}/photos`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as ProjectPhotoRecord;
}
export async function fetchProjectPhoto(projectId: string, id: string) {
  const res = await api.get(`/projects/${projectId}/photos/${id}`, {
    responseType: "blob",
  });
  return URL.createObjectURL(res.data as Blob);
}
export async function deleteProjectPhoto(projectId: string, id: string) {
  const res = await api.delete(`/projects/${projectId}/photos/${id}`);
  return res.data as { message: string };
}

export async function fetchProjectStats() {
  const res = await api.get("/projects/stats");
  return res.data;
}

// ── Volunteers ────────────────────────────────────────────────────────────────
export interface VolunteerRecord {
  [key: string]: unknown;
  id: string;
  volunteer_id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  mobile_number: string;
  email?: string | null;
  status: string;
  joining_date: string;
  volunteer_type?: string | null;
  village?: { id: string; name: string } | null;
  ward?: { id: string; name: string } | null;
  total_activities: number;
  total_hours: string;
  performance_score: string;
  is_available: boolean;
  aadhaar_masked?: string | null;
  attendance?: VolunteerAttendanceRecord[];
  activities?: VolunteerActivityRecord[];
  training?: VolunteerTrainingRecord[];
  performance?: VolunteerPerformanceRecord[];
  survey_responses?: Array<{
    id: string;
    response_date: string;
    survey?: { id: string; title: string } | null;
  }>;
}
export interface VolunteerActivityRecord {
  id: string;
  activity_type: string;
  title: string;
  description?: string | null;
  activity_date: string;
  hours_spent: string;
  location?: string | null;
  beneficiaries_count: number;
  status: string;
  village?: { id: string; name: string } | null;
}
export interface VolunteerAttendanceRecord {
  id: string;
  attendance_date: string;
  check_in?: string | null;
  check_out?: string | null;
  status: string;
  activity_type?: string | null;
  hours_worked: string;
  location?: string | null;
}
export interface VolunteerTrainingRecord {
  id: string;
  training_name: string;
  training_type: string;
  start_date: string;
  end_date?: string | null;
  status: string;
  certificate_number?: string | null;
  score?: string | null;
  grade?: string | null;
}
export interface VolunteerPerformanceRecord {
  id: string;
  evaluation_period: string;
  total_activities: number;
  total_hours: string;
  beneficiaries_served: number;
  attendance_rate: string;
  task_completion_rate: string;
  quality_score: string;
  overall_score: string;
  rating?: string | null;
}

export async function fetchVolunteers(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/volunteers", { params });
  return res.data as { data: VolunteerRecord[]; meta: PaginationMeta };
}

export async function fetchVolunteer(id: string) {
  const res = await api.get(`/volunteers/${id}`);
  return res.data as VolunteerRecord;
}

export async function fetchVolunteerStats() {
  const res = await api.get("/volunteers/stats");
  return res.data;
}

export async function fetchVolunteerActivities(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/volunteers/activities", { params });
  return res.data as {
    data: Array<
      VolunteerActivityRecord & {
        volunteer: Pick<
          VolunteerRecord,
          "id" | "volunteer_id" | "first_name" | "last_name"
        >;
      }
    >;
    meta: PaginationMeta;
  };
}
export async function fetchVolunteerAttendance(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/volunteers/attendance", { params });
  return res.data as {
    data: Array<
      VolunteerAttendanceRecord & {
        volunteer: Pick<
          VolunteerRecord,
          "id" | "volunteer_id" | "first_name" | "last_name"
        >;
      }
    >;
    meta: PaginationMeta;
  };
}
export async function fetchVolunteerPerformance(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/volunteers/performance", { params });
  return res.data as {
    data: Array<
      VolunteerPerformanceRecord & {
        volunteer: Pick<
          VolunteerRecord,
          "id" | "volunteer_id" | "first_name" | "last_name"
        >;
      }
    >;
    meta: PaginationMeta;
  };
}
export async function fetchVolunteerTraining(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/volunteers/training", { params });
  return res.data as {
    data: Array<
      VolunteerTrainingRecord & {
        volunteer: Pick<
          VolunteerRecord,
          "id" | "volunteer_id" | "first_name" | "last_name"
        >;
      }
    >;
    meta: PaginationMeta;
  };
}

export interface VolunteerGeographicRecord {
  id: string;
  name: string;
  mandal_name?: string | null;
  volunteer_count: number;
}
export async function fetchVolunteerGeographicCoverage() {
  const res = await api.get("/volunteers/geographic-coverage");
  return res.data as {
    data: VolunteerGeographicRecord[];
    total_active_volunteers: number;
    villages_with_active_volunteers: number;
  };
}

export type AnalyticsLevel =
  | "constituency"
  | "assembly"
  | "mandal"
  | "village"
  | "booth";
export interface ParliamentaryMetrics {
  citizens: number;
  families: number;
  applications: number;
  beneficiaries: number;
  grievances: number;
  pending_grievances: number;
  projects: number;
  sanctioned_amount: number;
  expenditure: number;
  volunteers: number;
  booths: number;
  registered_voters: number;
  budget_utilization?: number | null;
  grievance_resolution_rate?: number | null;
}
export interface ParliamentaryAnalyticsReport {
  level: AnalyticsLevel;
  generated_at: string;
  definitions: Record<string, string>;
  totals: ParliamentaryMetrics;
  data: Array<{
    id: string;
    name: string;
    parent_name?: string | null;
    village_count: number;
    metrics: ParliamentaryMetrics;
  }>;
}
export async function fetchParliamentaryAnalytics(level: AnalyticsLevel) {
  const res = await api.get(`/analytics/${level}`);
  return res.data as ParliamentaryAnalyticsReport;
}
export async function fetchVolunteerEnrolledCitizens(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/volunteers/enrolled-citizens", { params });
  return res.data as {
    data: Array<
      Pick<
        CitizenDetailRecord,
        | "id"
        | "unique_id"
        | "first_name"
        | "middle_name"
        | "last_name"
        | "gender"
      > & {
        created_at: string;
        created_by?: {
          id: string;
          name: string;
          volunteer?: Pick<
            VolunteerRecord,
            "id" | "volunteer_id" | "first_name" | "last_name"
          >;
        } | null;
        addresses: CitizenDetailRecord["addresses"];
      }
    >;
    meta: PaginationMeta;
    stats: { total: number; this_week: number; top_volunteer: string | null };
  };
}

// ── Schemes ──────────────────────────────────────────────────────────────────
export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface SchemeRecord {
  id: string;
  name: string;
  code: string;
  category: string;
  department_id: string | null;
  department?: { id: string; name: string } | null;
  description: string | null;
  eligibility: string | null;
  benefits: string | null;
  max_amount: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  application_mode: "online" | "offline" | "both";
  sla_days: number;
  applications_count?: number;
  beneficiaries_count?: number;
  eligibility_rules?: Array<{
    id: string;
    rule_name: string;
    rule_type: string;
    condition: string | null;
    field_name: string | null;
    operator: string | null;
    value: string | null;
    is_mandatory: boolean;
    error_message: string | null;
  }>;
}

export interface SchemeStats {
  total_schemes: number;
  active_schemes: number;
  total_applications: number;
  approved: number;
  pending: number;
  rejected: number;
  total_beneficiaries: number;
  total_benefit_distributed: number;
}

export interface SchemeAnalytics {
  by_scheme: Array<{
    scheme_id: string;
    beneficiaries: number;
    distributed: string;
    scheme: Pick<SchemeRecord, "id" | "name" | "code" | "department_id">;
  }>;
  by_village: Array<{
    village_id: string;
    applications: number;
    approved: number;
    village: {
      id: string;
      name: string;
      mandal?: { id: string; name: string };
    };
  }>;
  by_department: Array<{
    id: string | null;
    name: string | null;
    applications: number;
    approved: number;
  }>;
}

export interface SchemeApplicationRecord {
  id: string;
  application_number: string;
  applicant_name: string;
  applicant_mobile: string;
  status: string;
  application_date: string;
  sanctioned_amount: string | null;
  payment_status: string;
  scheme: SchemeRecord;
  village?: {
    id: string;
    name: string;
    mandal?: { id: string; name: string };
  } | null;
  remarks?: string | null;
  rejection_reason?: string | null;
  processed_date?: string | null;
  processed_by?: { id: string; name: string } | null;
  beneficiaries?: SchemeBeneficiaryRecord[];
  benefit_disbursements?: Array<{
    id: string;
    amount: string;
    disbursement_date: string;
    status: string;
    transaction_id: string | null;
  }>;
  documents?: Array<{
    id: string;
    title: string;
    original_name: string;
    mime_type: string;
    created_at: string;
  }>;
  activity_logs?: Array<{
    id: string;
    action: string;
    description: string;
    created_at: string;
    user?: { id: string; name: string } | null;
  }>;
}

export interface SchemeBeneficiaryRecord {
  id: string;
  beneficiary_name: string;
  beneficiary_type: string;
  enrollment_date: string;
  status: string;
  total_benefit_received: string;
  benefit_count: number;
  scheme: SchemeRecord;
  application?: SchemeApplicationRecord | null;
}

export async function fetchSchemes(params?: Record<string, string | number>) {
  const res = await api.get("/schemes", { params });
  return res.data as { data: SchemeRecord[]; meta: PaginationMeta };
}

export async function fetchScheme(id: string) {
  const res = await api.get(`/schemes/${id}`);
  return res.data as SchemeRecord;
}

export async function fetchSchemeStats() {
  const res = await api.get("/schemes/stats");
  return res.data as SchemeStats;
}

export async function fetchSchemeAnalytics() {
  const res = await api.get("/schemes/analytics");
  return res.data as SchemeAnalytics;
}

export async function fetchSchemeEligibilityRules() {
  const res = await api.get("/schemes/eligibility-rules");
  return res.data as { data: SchemeRecord[] };
}

export async function fetchSchemeApplications(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/schemes/applications", { params });
  return res.data as { data: SchemeApplicationRecord[]; meta: PaginationMeta };
}

export async function fetchSchemeApplication(id: string) {
  const res = await api.get(`/schemes/applications/${id}`);
  return res.data as SchemeApplicationRecord;
}

export async function fetchSchemeBeneficiaries(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/schemes/beneficiaries", { params });
  return res.data as { data: SchemeBeneficiaryRecord[]; meta: PaginationMeta };
}

// ── Surveys ──────────────────────────────────────────────────────────────────
export interface SurveyRecord {
  [key: string]: unknown;
  id: string;
  title: string;
  description?: string | null;
  status: string;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  survey_code?: string | null;
  category?: string | null;
  target_responses?: number | null;
  response_count?: number;
  total_responses?: number;
  questions?: Array<{
    id: string;
    question_type: string;
    question_text: string;
    order_number?: number;
    sort_order?: number;
    is_required: boolean;
    options?: string[] | null;
    validation_rule?: string | null;
    help_text?: string | null;
  }>;
}
export interface SurveyResponseRecord {
  id: string;
  survey_id: string;
  response_date: string;
  created_at: string;
  respondent_name?: string | null;
  survey?: { id: string; title: string } | null;
  village?: { id: string; name: string } | null;
  volunteer?: { id: string; first_name: string; last_name: string } | null;
  response_details?: Array<{
    id: string;
    answer?: string | null;
    answer_type?: string | null;
    has_attachment?: boolean;
    attachment_url?: string;
    survey_question?: {
      id: string;
      question_text: string;
      question_type: string;
    } | null;
  }>;
}

export interface SurveyAssignmentRecord {
  id: string;
  status: string;
  target_responses?: number | null;
  completed_responses: number;
  assigned_date: string;
  due_date?: string | null;
  remarks?: string | null;
  volunteer?: Pick<
    VolunteerRecord,
    "id" | "volunteer_id" | "first_name" | "last_name"
  > | null;
}

export async function fetchSurveys(params?: Record<string, string | number>) {
  const res = await api.get("/surveys", { params });
  return res.data as { data: SurveyRecord[]; meta: PaginationMeta };
}

export async function fetchSurvey(id: string) {
  const res = await api.get(`/surveys/${id}`);
  return res.data as SurveyRecord;
}
export async function createSurvey(data: Record<string, unknown>) {
  const res = await api.post("/surveys", data);
  return res.data as SurveyRecord;
}
export async function updateSurvey(id: string, data: Record<string, unknown>) {
  const res = await api.put(`/surveys/${id}`, data);
  return res.data as SurveyRecord;
}
export async function publishSurvey(id: string) {
  const res = await api.post(`/surveys/${id}/publish`);
  return res.data as SurveyRecord;
}
export async function closeSurvey(id: string) {
  const res = await api.post(`/surveys/${id}/close`);
  return res.data as SurveyRecord;
}
export async function submitSurveyResponse(id: string, data: FormData) {
  const res = await api.post(`/surveys/${id}/responses`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as SurveyResponseRecord;
}

export async function fetchSurveyAssignments(id: string) {
  const res = await api.get(`/surveys/${id}/assignments`);
  return res.data as {
    data: SurveyAssignmentRecord[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export async function assignSurvey(id: string, data: Record<string, unknown>) {
  const res = await api.post(`/surveys/${id}/assignments`, data);
  return res.data as { message: string; volunteer_count: number };
}

export async function fetchSurveyResponse(id: string) {
  const res = await api.get(`/survey-responses/${id}`);
  return res.data as SurveyResponseRecord;
}

export async function fetchSurveyAnalytics(id: string) {
  const res = await api.get(`/surveys/${id}/analytics`);
  return res.data as {
    survey_id: string;
    total_responses: number;
    questions: Array<{
      id: string;
      question_text: string;
      question_type: string;
      answered: number;
      average: number | null;
      distribution: Array<{ label: string; count: number }>;
    }>;
  };
}

export async function downloadSurveyResponses(surveyId?: string) {
  const res = await api.get("/surveys/responses/export", {
    params: surveyId ? { survey_id: surveyId } : undefined,
    responseType: "blob",
  });
  return URL.createObjectURL(res.data as Blob);
}

export async function downloadSurveyResponseAttachment(
  responseId: string,
  detailId: string,
) {
  const res = await api.get(
    `/survey-responses/${responseId}/details/${detailId}/attachment`,
    { responseType: "blob" },
  );
  return URL.createObjectURL(res.data as Blob);
}

export async function fetchSurveyStats() {
  const res = await api.get("/surveys/stats");
  return res.data;
}

export async function fetchSurveyResponses(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/surveys/responses", { params });
  return res.data as { data: SurveyResponseRecord[]; meta: PaginationMeta };
}

// ── Locations ────────────────────────────────────────────────────────────────
export async function fetchLocConstituencies() {
  const res = await api.get("/locations/constituencies");
  return res.data;
}

export async function fetchLocVillages(mandalId?: string) {
  const res = await api.get("/locations/villages", {
    params: mandalId ? { mandal_id: mandalId } : {},
  });
  return res.data;
}

export async function fetchLocMandals(acId?: string) {
  const res = await api.get("/locations/mandals", {
    params: acId ? { assembly_constituency_id: acId } : {},
  });
  return res.data;
}

export async function fetchLocWards(villageId?: string) {
  const res = await api.get("/locations/wards", {
    params: villageId ? { village_id: villageId } : {},
  });
  return res.data;
}

export async function fetchLocPollingBooths(villageId?: string) {
  const res = await api.get("/locations/polling-booths", {
    params: villageId ? { village_id: villageId } : {},
  });
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
  return res.data as { data: FamilyRecord[]; meta: PaginationMeta };
}

export interface FamilyRecord {
  id: string;
  family_id: string;
  head_of_family_name: string;
  members_count: number;
  total_benefits_received: string | null;
  village?: {
    id: string;
    name: string;
    mandal?: { id: string; name: string };
  } | null;
  family_members: Array<{
    id: string;
    relationship_with_head: string;
    is_head: boolean;
    citizen: {
      id: string;
      unique_id: string;
      first_name: string;
      middle_name?: string | null;
      last_name: string;
      date_of_birth?: string | null;
      gender: string;
    };
  }>;
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

export async function fetchDocumentCategories() {
  const res = await api.get("/document-categories");
  return res.data as Array<{ id: string; name: string; code: string }>;
}

export async function downloadDocument(id: string, fileName: string) {
  const res = await api.get(`/documents/${id}/download`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(res.data as Blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export async function fetchDocuments(params?: Record<string, string | number>) {
  const res = await api.get("/documents", { params });
  return res.data as { data: DocumentRecord[]; meta: PaginationMeta };
}

export interface DocumentRecord {
  id: string;
  document_number: string;
  title: string;
  description?: string | null;
  file_name: string;
  file_size?: number | null;
  file_type?: string | null;
  mime_type?: string | null;
  status: string;
  document_date?: string | null;
  expiry_date?: string | null;
  is_confidential: boolean;
  is_verified: boolean;
  created_at: string;
  document_category?: { id: string; name: string } | null;
  created_by?: { id: string; name: string } | null;
}

export async function deleteDocument(id: string) {
  const res = await api.delete(`/documents/${id}`);
  return res.data;
}

export interface CommunicationCampaignRecord {
  id: string;
  campaign_number: string;
  name: string;
  channel: "sms" | "whatsapp" | "email" | "voice";
  purpose: string;
  subject?: string | null;
  body: string;
  status: string;
  scheduled_at?: string | null;
  recipient_count: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  created_at: string;
  template?: { id: string; name: string } | null;
}
export async function fetchCommunicationCampaigns(
  params: Record<string, string | number>,
) {
  const res = await api.get("/communications/campaigns", { params });
  return res.data as {
    data: CommunicationCampaignRecord[];
    current_page: number;
    last_page: number;
    total: number;
  };
}
export async function createCommunicationCampaign(
  data: Record<string, unknown>,
) {
  const res = await api.post("/communications/campaigns", data);
  return res.data as CommunicationCampaignRecord;
}
export async function approveCommunicationCampaign(id: string) {
  const res = await api.post(`/communications/campaigns/${id}/approve`);
  return res.data as CommunicationCampaignRecord;
}
export async function dispatchCommunicationCampaign(id: string) {
  const res = await api.post(`/communications/campaigns/${id}/dispatch`);
  return res.data as { message: string; recipient_count: number };
}
export async function retryCommunicationCampaign(id: string) {
  const res = await api.post(`/communications/campaigns/${id}/retry`);
  return res.data as { message: string; recipient_count: number };
}
export interface CommunicationTemplateRecord {
  id: string;
  name: string;
  channel: "sms" | "whatsapp" | "email" | "voice";
  purpose: string;
  subject?: string | null;
  body: string;
  provider_template_id?: string | null;
  dlt_entity_id?: string | null;
  dlt_template_id?: string | null;
  status: string;
  is_active: boolean;
}
export async function fetchCommunicationDashboard() {
  const res = await api.get("/communications/dashboard");
  return res.data as {
    total: number;
    draft: number;
    scheduled: number;
    completed: number;
    failed_recipients: number;
    by_channel: Record<string, number>;
  };
}
export async function fetchCommunicationTemplates(
  params: Record<string, string | number> = {},
) {
  const res = await api.get("/communications/templates", { params });
  return res.data as {
    data: CommunicationTemplateRecord[];
    current_page: number;
    last_page: number;
    total: number;
  };
}
export async function saveCommunicationTemplate(
  data: Record<string, unknown>,
  id?: string,
) {
  const res = id
    ? await api.put(`/communications/templates/${id}`, data)
    : await api.post("/communications/templates", data);
  return res.data as CommunicationTemplateRecord;
}
export interface CommunicationContactOption {
  id: string;
  name: string;
  mobile?: string | null;
  email?: string | null;
}
export async function searchCommunicationContacts(
  type: string,
  search: string,
) {
  const res = await api.get("/communications/contacts", {
    params: { type, search },
  });
  return res.data as CommunicationContactOption[];
}
export async function recordCommunicationConsent(
  data: Record<string, unknown>,
) {
  const res = await api.post("/communications/consents", data);
  return res.data as { id: string; is_granted: boolean };
}

// ── Notifications ────────────────────────────────────────────────────────────
export async function fetchNotifications(
  params?: Record<string, string | number | boolean>,
) {
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
export interface AppointmentRecord {
  [key: string]: unknown;
  id: string;
  appointment_number: string;
  token_number?: string | null;
  citizen_id?: string | null;
  citizen_name: string;
  citizen_mobile: string;
  citizen_village?: string | null;
  citizen_mandal?: string | null;
  requested_date: string;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  status: string;
  priority: string;
  purpose?: string | null;
  category?: string | null;
  meeting_type?: string | null;
  venue?: string | null;
  duration_minutes?: number | null;
  created_at: string;
  follow_up_required?: boolean;
  follow_up_date?: string | null;
  follow_up_completed?: boolean;
  meeting_outcome?: string | null;
  action_items?: string | null;
  satisfaction_rating?: number | null;
  citizen_feedback?: string | null;
}
export interface PublicMeetingRecord {
  [key: string]: unknown;
  id: string;
  title: string;
  status: string;
  meeting_type: string;
  venue: string;
  meeting_date: string;
  start_time: string;
  chief_guest?: string | null;
  expected_attendance: number;
  actual_attendance: number;
  key_outcomes?: string | null;
}
export interface TourRecord {
  [key: string]: unknown;
  id: string;
  tour_number: string;
  title: string;
  status: string;
  tour_type: string;
  start_date: string;
  end_date?: string | null;
  villages_count: number;
  citizens_met: number;
  objectives?: string | null;
  key_outcomes?: string | null;
}
export interface JanataDarbarRecord {
  [key: string]: unknown;
  id: string;
  title: string;
  status: string;
  venue: string;
  session_date: string;
  start_time: string;
  registered_citizens: number;
  issues_raised: number;
  issues_resolved: number;
  issues_pending?: number | null;
  description?: string | null;
}

export async function fetchMeetingDashboard() {
  const res = await api.get("/meetings/dashboard");
  return res.data;
}

export async function fetchAppointments(
  params?: Record<string, string | number | boolean>,
) {
  const res = await api.get("/meetings/appointments", { params });
  return res.data as { data: AppointmentRecord[]; meta: PaginationMeta };
}

export async function fetchAppointmentStats() {
  const res = await api.get("/meetings/appointments/stats");
  return res.data;
}

export async function fetchAppointment(id: string) {
  const res = await api.get(`/meetings/appointments/${id}`);
  return res.data as AppointmentRecord;
}

export async function createAppointment(data: Record<string, unknown>) {
  const res = await api.post("/meetings/appointments", data);
  return res.data;
}

export async function updateAppointment(
  id: string,
  data: Record<string, unknown>,
) {
  const res = await api.put(`/meetings/appointments/${id}`, data);
  return res.data;
}

export async function fetchPublicMeetings(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/meetings/public-meetings", { params });
  return res.data as { data: PublicMeetingRecord[]; meta: PaginationMeta };
}

export async function createPublicMeeting(data: Record<string, unknown>) {
  const res = await api.post("/meetings/public-meetings", data);
  return res.data;
}

export async function fetchTours(params?: Record<string, string | number>) {
  const res = await api.get("/meetings/tours", { params });
  return res.data as { data: TourRecord[]; meta: PaginationMeta };
}

export async function createTour(data: Record<string, unknown>) {
  const res = await api.post("/meetings/tours", data);
  return res.data;
}

export async function fetchJanataDarbars(
  params?: Record<string, string | number>,
) {
  const res = await api.get("/meetings/janata-darbar", { params });
  return res.data as { data: JanataDarbarRecord[]; meta: PaginationMeta };
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
