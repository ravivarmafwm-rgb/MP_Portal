import {
  fetchCitizenStats,
  fetchCitizens,
  fetchDocuments,
  fetchGrievanceCategories,
  fetchGrievances,
  fetchGrievanceStats,
  fetchProjects,
  fetchProjectStats,
  fetchSchemeApplications,
  fetchSchemeStats,
  fetchSchemes,
  fetchSurveyStats,
  fetchSurveys,
  fetchVolunteerStats,
  fetchVolunteers,
} from "./api";

const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

async function loadWithFallback<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  if (!isBrowser) return fallback;
  try {
    return await loader();
  } catch {
    return fallback;
  }
}

function toDisplayName(first: string | undefined, last: string | undefined) {
  return [first, last].filter(Boolean).join(" ").trim();
}

function toAge(dateOfBirth?: string) {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return 0;
  const diff = Date.now() - dob.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
}

function toStatusLabel(status?: string) {
  if (!status) return "Active";
  return String(status).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function numberValue(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export type SchemeCategory = "Agriculture" | "Housing" | "Health" | "Education" | "Pension" | "Welfare" | "Infrastructure";
export type ProjectStatus = "Planned" | "In Progress" | "Delayed" | "Completed";

const citizenRawList = isBrowser
  ? await loadWithFallback(async () => {
      const payload = await fetchCitizens({ per_page: 100 });
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    }, [])
  : [];

const grievanceRawList = isBrowser
  ? await loadWithFallback(async () => {
      const payload = await fetchGrievances({ per_page: 100 });
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    }, [])
  : [];

const projectRawList = isBrowser
  ? await loadWithFallback(async () => {
      const payload = await fetchProjects({ per_page: 100 });
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    }, [])
  : [];

const schemeRawList = isBrowser
  ? await loadWithFallback(async () => {
      const payload = await fetchSchemes({ per_page: 100 });
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    }, [])
  : [];

const schemeApplicationRawList = isBrowser
  ? await loadWithFallback(async () => {
      const payload = await fetchSchemeApplications({ per_page: 100 });
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    }, [])
  : [];

const surveyRawList = isBrowser
  ? await loadWithFallback(async () => {
      const payload = await fetchSurveys({ per_page: 100 });
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    }, [])
  : [];

const volunteerRawList = isBrowser
  ? await loadWithFallback(async () => {
      const payload = await fetchVolunteers({ per_page: 100 });
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    }, [])
  : [];

const citizenStats = isBrowser
  ? await loadWithFallback(fetchCitizenStats, {
      total: citizenRawList.length,
      male: 0,
      female: 0,
      voters: 0,
      this_month: 0,
    })
  : { total: 0, male: 0, female: 0, voters: 0, this_month: 0 };

const grievanceStats = isBrowser
  ? await loadWithFallback(fetchGrievanceStats, {
      total: grievanceRawList.length,
      pending: 0,
      assigned: 0,
      in_progress: 0,
      escalated: 0,
      resolved: 0,
      closed: 0,
      this_week: 0,
    })
  : { total: 0, pending: 0, assigned: 0, in_progress: 0, escalated: 0, resolved: 0, closed: 0, this_week: 0 };

const projectStats = isBrowser
  ? await loadWithFallback(fetchProjectStats, {
      total: projectRawList.length,
      in_progress: 0,
      completed: 0,
      delayed: 0,
      proposed: 0,
      total_budget: 0,
      total_spent: 0,
    })
  : { total: 0, in_progress: 0, completed: 0, delayed: 0, proposed: 0, total_budget: 0, total_spent: 0 };

const schemeStats = isBrowser
  ? await loadWithFallback(fetchSchemeStats, {
      total_schemes: 0,
      active_schemes: 0,
      total_applications: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      total_beneficiaries: 0,
    })
  : { total_schemes: 0, active_schemes: 0, total_applications: 0, approved: 0, pending: 0, rejected: 0, total_beneficiaries: 0 };

const surveyStats = isBrowser
  ? await loadWithFallback(fetchSurveyStats, {
      total: 0,
      active: 0,
      draft: 0,
      total_responses: 0,
      this_month: 0,
    })
  : { total: 0, active: 0, draft: 0, total_responses: 0, this_month: 0 };

const volunteerStats = isBrowser
  ? await loadWithFallback(fetchVolunteerStats, {
      total: volunteerRawList.length,
      active: 0,
      inactive: 0,
      this_month: 0,
    })
  : { total: 0, active: 0, inactive: 0, this_month: 0 };

const documentRawList = isBrowser
  ? await loadWithFallback(async () => {
      const payload = await fetchDocuments({ per_page: 100 });
      return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    }, [])
  : [];

const grievanceCategories = isBrowser
  ? await loadWithFallback(async () => {
      const payload = await fetchGrievanceCategories();
      return Array.isArray(payload) ? payload : [];
    }, [])
  : [];

export const citizens = citizenRawList.map((item: any, index: number) => {
  const firstName = item.first_name ?? item.name?.split(" ")?.[0] ?? item.full_name?.split(" ")?.[0] ?? `Citizen`;
  const lastName = item.last_name ?? item.name?.split(" ")?.slice(1).join(" ") ?? "";
  const village = item.addresses?.[0]?.village?.name ?? item.village?.name ?? item.village ?? "—";
  const mandal = item.addresses?.[0]?.village?.mandal?.name ?? item.mandal ?? "—";
  const constituency = item.addresses?.[0]?.village?.constituency?.name ?? item.constituency ?? "MP Constituency";
  return {
    id: item.id,
    uniqueId: item.unique_id ?? item.uniqueId,
    name: toDisplayName(firstName, lastName) || `Citizen ${index + 1}`,
    first_name: firstName,
    last_name: lastName,
    gender: item.gender ?? "Other",
    age: toAge(item.date_of_birth ?? item.dob),
    mobile: item.mobile_number ?? item.mobile ?? "—",
    mobile_number: item.mobile_number ?? item.mobile,
    occupation: item.occupation ?? "—",
    address: item.addresses?.[0]?.full_address ?? item.address ?? `${village}, ${mandal}`,
    village,
    mandal,
    constituency,
    familyId: item.family_id ?? item.familyId ?? "—",
    booth: item.polling_booth?.name ?? item.booth ?? "—",
    status: item.status ?? "Active",
    aadhaar: item.aadhaar_number ?? item.aadhaar ?? "—",
    aadhaar_number: item.aadhaar_number ?? item.aadhaar,
    voterId: item.voter_id ?? item.voterId ?? "—",
    voter_id: item.voter_id ?? item.voterId,
    registeredOn: formatDate(item.created_at ?? item.registered_on),
    category: item.category ?? "General",
    economicCategory: item.economic_category ?? item.economicCategory ?? "General",
    pincode: item.addresses?.[0]?.pincode ?? item.pincode ?? "—",
    email: item.email ?? "—",
    is_voter: item.is_voter ?? false,
    created_at: item.created_at,
    data: item,
  };
});

export const citizenStatsSummary = citizenStats;
export const grievanceStatsSummary = grievanceStats;
export const projectStatsSummary = projectStats;
export const schemeStatsSummary = schemeStats;
export const surveyStatsSummary = surveyStats;
export const volunteerStatsSummary = volunteerStats;

export const documentsByCitizen: Record<string, any[]> = {};
export const schemesByCitizen: Record<string, any[]> = {};
export const grievancesByCitizen: Record<string, any[]> = {};
export const surveysByCitizen: Record<string, any[]> = {};
export const activityByCitizen: Record<string, any[]> = {};

citizens.forEach((citizen: any, index: number) => {
  documentsByCitizen[citizen.id] = documentRawList.slice(index, index + 2).map((doc: any) => ({
    id: doc.id ?? `DOC-${index + 1}`,
    name: doc.name ?? `Document ${index + 1}`,
    type: doc.document_type ?? "PDF",
    uploadedOn: formatDate(doc.created_at),
    status: "Verified",
  }));
  schemesByCitizen[citizen.id] = schemeApplicationRawList.slice(index, index + 3).map((application: any, appIndex: number) => ({
    id: application.id ?? `SCH-${appIndex + 1}`,
    scheme: application.scheme?.name ?? `Scheme ${appIndex + 1}`,
    status: application.status ?? "Approved",
    benefit: numberValue(application.benefit_amount ?? application.amount, 0),
    department: application.scheme?.department?.name ?? "Department",
    appliedOn: formatDate(application.created_at),
  }));
  grievancesByCitizen[citizen.id] = grievanceRawList.slice(index, index + 2).map((item: any, grievanceIndex: number) => ({
    id: item.id ?? `GR-${grievanceIndex + 1}`,
    subject: item.subject ?? "Service request",
    category: item.category?.name ?? "General",
    status: toStatusLabel(item.status),
    date: formatDate(item.created_at),
    priority: item.priority ?? "Medium",
  }));
  surveysByCitizen[citizen.id] = surveyRawList.slice(index, index + 2).map((item: any, surveyIndex: number) => ({
    id: item.id ?? `SV-${surveyIndex + 1}`,
    survey: item.title ?? `Survey ${surveyIndex + 1}`,
    completedOn: formatDate(item.created_at),
    status: "Completed",
  }));
  activityByCitizen[citizen.id] = [
    { title: "Citizen profile updated", time: "Today", detail: "Record verified by volunteer" },
    { title: "Survey submitted", time: "2 days ago", detail: "Field survey completed" },
  ];
});

export function getCitizen(id?: string) {
  if (!id) return citizens[0];
  return citizens.find((person: any) => person.id === id || person.uniqueId === id || person.name === id) ?? citizens[0];
}

export function getFamilyOf(citizen: any) {
  return {
    head: citizen?.name ?? "Head of Family",
    members: [citizen, ...(citizens.slice(0, 3) as any[])],
  };
}

export const families = citizens.slice(0, 12).map((citizen: any, index: number) => ({
  id: `FAM-${index + 1}`,
  head: citizen.name,
  members: [citizen.name, `${citizen.name} Spouse`],
  village: citizen.village,
  status: "Active",
}));

export const activityByCitizenList = activityByCitizen;
export const interactionsByCitizen: Record<string, any[]> = {};

citizens.forEach((citizen: any) => {
  interactionsByCitizen[citizen.id] = [
    { id: `INT-${citizen.id.slice(0, 4)}`, type: "Visit", summary: "Volunteer visit completed", date: "Today" },
    { id: `INT-${citizen.id.slice(0, 4)}-2`, type: "Complaint", summary: "Water issue logged", date: "2 days ago" },
  ];
});

export const grievances = grievanceRawList.map((item: any, index: number) => ({
  id: item.id ?? `GRV-${index + 1}`,
  number: item.grievance_number ?? `GRV-${index + 1}`,
  citizen: item.citizen_name ?? "Citizen",
  subject: item.subject ?? "Service request",
  category: item.category?.name ?? "General",
  status: toStatusLabel(item.status),
  priority: item.priority ?? "Medium",
  date: formatDate(item.created_at),
  department: item.assigned_department?.name ?? "Pending",
  resolutionProgress: item.resolved_date ? 100 : 60,
  village: item.village?.name ?? "—",
  mobile: item.citizen_mobile ?? "—",
}));

export const grievanceCategoriesSummary = grievanceCategories.map((item: any) => ({
  name: item.name ?? item.title,
  count: item.grievances_count ?? 0,
  trend: 12,
}));

export const categoryStats = grievanceCategoriesSummary;
export const mandalStats = [{ name: "Madhapur", count: 12 }, { name: "Kondapur", count: 8 }, { name: "Gachibowli", count: 7 }];
export const assemblyStats = [{ name: "Serilingampally", count: 18 }, { name: "Madhapur", count: 10 }];
export const resolutionTrend = [{ month: "Jan", resolved: 24 }, { month: "Feb", resolved: 38 }, { month: "Mar", resolved: 41 }, { month: "Apr", resolved: 51 }];
export const departmentStats = [{ name: "Revenue", count: 12 }, { name: "Water", count: 9 }, { name: "Education", count: 7 }];
export const escalationLevels = [{ level: "Open", count: 4 }, { level: "Escalated", count: 2 }, { level: "Critical", count: 1 }];
export const recentFeedback = [{ message: "Resolution was prompt", rating: 5 }, { message: "Need more follow-up", rating: 4 }];
export const enrolledCitizens = citizens.slice(0, 10);
export const enrollmentKpis = {
  total: citizens.length,
  verified: Math.max(1, Math.round(citizens.length * 0.8)),
  pending: Math.max(0, citizens.length - Math.round(citizens.length * 0.8)),
};

export const projects = projectRawList.map((item: any, index: number) => ({
  id: item.id ?? `PRJ-${index + 1}`,
  name: item.name ?? `Project ${index + 1}`,
  type: item.project_type ?? "Development",
  budget: numberValue(item.sanctioned_amount ?? item.budget, 0),
  spent: numberValue(item.expenditure ?? item.spent, 0),
  progress: numberValue(item.progress_percentage ?? item.progress, 0),
  status: (item.status ?? "in_progress") as ProjectStatus,
  completionDate: formatDate(item.expected_completion_date ?? item.completion_date),
  constituency: item.constituency?.name ?? "MP Constituency",
  village: item.village?.name ?? "—",
  contractor: item.contractor?.name ?? "—",
  description: item.description ?? "Project under implementation",
}));

export const completionTrend = [{ month: "Jan", percent: 42 }, { month: "Feb", percent: 58 }, { month: "Mar", percent: 68 }, { month: "Apr", percent: 76 }];
export const monthlyBudgetTrend = [{ month: "Jan", budget: 30 }, { month: "Feb", budget: 35 }, { month: "Mar", budget: 33 }, { month: "Apr", budget: 41 }];
export const contractorsData = projects.slice(0, 8).map((project: any) => ({
  id: project.id,
  name: project.contractor,
  projectsAssigned: 1,
  completed: project.status === "Completed" ? 1 : 0,
  completionRate: project.progress,
  performanceScore: Math.max(60, Math.min(98, project.progress + 15)),
  budgetHandled: Math.round(project.budget / 10000000),
  risk: project.status === "Delayed" ? "High" : project.progress > 75 ? "Low" : "Medium",
  empanelledSince: "2024",
}));
export const mpladsCategoryAllocations = [{ category: "Roads", amount: 20 }, { category: "Schools", amount: 14 }, { category: "Water", amount: 10 }];
export const villageBudget = [{ village: "Madhapur", budget: 12 }, { village: "Kondapur", budget: 9 }, { village: "Gachibowli", budget: 7 }];

export const schemes = schemeRawList.map((item: any, index: number) => ({
  id: item.id ?? `SCM-${index + 1}`,
  name: item.name ?? `Scheme ${index + 1}`,
  schemeCode: item.code ?? `SC-${index + 1}`,
  category: (item.category ?? "Welfare") as SchemeCategory,
  department: item.department?.name ?? "Department",
  status: item.is_active ? "Active" : "Draft",
  coverage: 72 + index,
  beneficiaries: numberValue(item.beneficiary_count ?? item.beneficiaries, 0),
  description: item.description ?? "Welfare scheme",
}));

export const applications = schemeApplicationRawList.map((item: any, index: number) => ({
  id: item.id ?? `APP-${index + 1}`,
  citizen: item.citizen?.name ?? `Citizen ${index + 1}`,
  scheme: item.scheme?.name ?? `Scheme ${index + 1}`,
  schemeCode: item.scheme?.code ?? `SC-${index + 1}`,
  village: item.village?.name ?? "—",
  mandal: item.village?.mandal?.name ?? "—",
  appliedOn: formatDate(item.created_at),
  benefit: numberValue(item.benefit_amount ?? item.amount, 0),
  status: item.status ?? "Submitted",
  department: item.scheme?.department?.name ?? "Department",
}));

export const schemeKpis = {
  totalApplications: applications.length,
  approved: applications.filter((item: any) => item.status === "Approved").length,
  pending: applications.filter((item: any) => item.status === "Submitted" || item.status === "Pending").length,
  rejected: applications.filter((item: any) => item.status === "Rejected").length,
};

export const villageCoverage = [{ village: "Madhapur", coverage: 82 }, { village: "Kondapur", coverage: 76 }, { village: "Gachibowli", coverage: 71 }];
export const assemblyCoverage = [{ assembly: "Serilingampally", coverage: 84 }, { assembly: "Madhapur", coverage: 79 }];
export const eligibilityMatrix = [{ title: "PMAY", eligible: 68 }, { title: "PM-KISAN", eligible: 124 }, { title: "Pension", eligible: 33 }];
export const aiSchemeAdvisor = [{ title: "Suggested scheme", description: "PMAY housing for eligible families" }];
export const departmentPerformance = [{ department: "Revenue", approvals: 92 }, { department: "Water", approvals: 87 }];

export const surveys = surveyRawList.map((item: any, index: number) => ({
  id: item.id ?? `SRV-${index + 1}`,
  title: item.title ?? `Survey ${index + 1}`,
  description: item.description ?? "Field survey",
  status: item.status ?? "active",
  responses: numberValue(item.response_count ?? item.responses, 0),
  completion: Math.min(100, 65 + index),
  category: item.category ?? "General",
  createdAt: formatDate(item.created_at),
}));

export const responseTrend = [{ month: "Jan", responses: 42 }, { month: "Feb", responses: 58 }, { month: "Mar", responses: 71 }];
export const census = [{ label: "Families", value: citizens.length }, { label: "Voters", value: citizenStatsSummary.voters }];
export const volunteerContributions = [{ volunteer: "Ravi", contributions: 14 }, { volunteer: "Kavya", contributions: 11 }];
export const builderQuestions = [{ type: "text", label: "Household size" }, { type: "select", label: "Water issue" }];
export const questionLibrary = builderQuestions;
export const topIssues = [{ issue: "Water", count: 24 }, { issue: "Road", count: 18 }];
export const aiSuggestions = [{ title: "Target villages", detail: "Kondapur and Madhapur" }];
export const aiInsights = [{ title: "Survey trend", detail: "Housing demand rising" }];
export const lifecycle = [{ stage: "Draft", status: "Complete" }, { stage: "Active", status: "Running" }];

export const volunteers = volunteerRawList.map((item: any, index: number) => ({
  id: item.id ?? `VOL-${index + 1}`,
  name: item.name ?? `${item.first_name ?? "Volunteer"} ${item.last_name ?? ""}`.trim(),
  mobile: item.mobile_number ?? item.mobile ?? "—",
  village: item.village?.name ?? item.village ?? "—",
  mandal: item.mandal?.name ?? item.mandal ?? "—",
  constituency: item.constituency?.name ?? item.constituency ?? "MP Constituency",
  activityScore: 70 + index,
  attendanceRate: 88 + (index % 5),
  citizensRegistered: 18 + index,
  surveysCompleted: 10 + index,
  complaintsSubmitted: 3 + (index % 4),
  meetingsAttended: 6 + (index % 4),
  status: (item.status ?? "Active").toLowerCase().replace(/\s+/g, "_"),
  joinedOn: formatDate(item.created_at),
  email: item.email ?? "—",
  badges: ["Field Ready", "Verified"],
  data: item,
}));

export const featuredVolunteer = volunteers[0] ?? {
  id: "VOL-1",
  name: "Volunteer",
  mobile: "—",
  village: "—",
  mandal: "—",
  constituency: "MP Constituency",
  activityScore: 80,
  attendanceRate: 90,
  citizensRegistered: 20,
  surveysCompleted: 12,
  complaintsSubmitted: 4,
  meetingsAttended: 8,
  status: "active",
  joinedOn: "—",
  email: "—",
  badges: ["Field Ready", "Verified"],
};

export const volunteerKpis = {
  total: volunteers.length || volunteerStats.total,
  active: Math.max(1, Math.round((volunteers.length || volunteerStats.total) * 0.8)),
  inactive: Math.max(0, (volunteers.length || volunteerStats.total) - Math.max(1, Math.round((volunteers.length || volunteerStats.total) * 0.8))),
  newThisMonth: volunteerStats.this_month,
  villagesCovered: Math.max(1, volunteers.length),
  surveysCompleted: surveyStatsSummary.total_responses,
};

export const activityLogs = volunteers.slice(0, 6).map((volunteer: any, index: number) => ({
  id: `${volunteer.id}-${index}`,
  date: new Date(Date.now() - index * 2 * 60 * 60 * 1000).toLocaleString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }),
  type: index % 2 === 0 ? "Survey" : "Registration",
  description: `${volunteer.name} completed a field visit`,
  village: volunteer.village,
}));

export const attendanceCalendar = Array.from({ length: 30 }).map((_, i) => ({
  date: i + 1,
  status: i % 6 === 0 ? "A" : i % 4 === 0 ? "L" : i % 3 === 0 ? "F" : "P",
}));

export const trainingPrograms = [
  { id: "TRN-001", title: "Citizen Registration Basics", category: "Onboarding", duration: "4 hours", enrolled: Math.max(50, citizenStatsSummary.total), completed: Math.max(40, Math.round(citizenStatsSummary.total * 0.8)), certified: Math.max(30, Math.round(citizenStatsSummary.total * 0.7)), status: "Live" },
  { id: "TRN-002", title: "Survey Collection Methodology", category: "Field Ops", duration: "6 hours", enrolled: Math.max(40, Math.round(surveyStatsSummary.total_responses / 50)), completed: Math.max(30, Math.round(surveyStatsSummary.total_responses / 70)), certified: Math.max(25, Math.round(surveyStatsSummary.total_responses / 90)), status: "Live" },
  { id: "TRN-003", title: "Grievance Handling & Escalation", category: "Service", duration: "3 hours", enrolled: Math.max(30, grievanceStatsSummary.total), completed: Math.max(20, Math.round(grievanceStatsSummary.total * 0.7)), certified: Math.max(15, Math.round(grievanceStatsSummary.total * 0.5)), status: "Upcoming" },
  { id: "TRN-004", title: "Digital Platform Mastery", category: "Tech", duration: "8 hours", enrolled: Math.max(60, volunteers.length), completed: Math.max(45, Math.round(volunteers.length * 0.8)), certified: Math.max(35, Math.round(volunteers.length * 0.7)), status: "Live" },
];

export const fieldOps = {
  activeNow: Math.max(10, Math.round(volunteers.length * 0.2)),
  ongoingSurveys: Math.max(5, Math.round(surveyStatsSummary.total_responses / 1000)),
  complaintsToday: Math.max(4, Math.round(grievanceStatsSummary.this_week / 2)),
  registrationsToday: Math.max(10, Math.round(citizenStatsSummary.this_month / 2)),
  villagesVisited: Math.max(10, Math.round(volunteers.length / 10)),
};

export const coverageAreas = [
  { mandal: "Serilingampally", villages: 42, covered: 39, volunteers: Math.max(10, Math.round(volunteers.length * 0.35)), citizens: 86420, coverageScore: 92 },
  { mandal: "Kukatpally", villages: 38, covered: 31, volunteers: Math.max(8, Math.round(volunteers.length * 0.3)), citizens: 71200, coverageScore: 81 },
  { mandal: "Khairatabad", villages: 28, covered: 24, volunteers: Math.max(6, Math.round(volunteers.length * 0.2)), citizens: 52480, coverageScore: 86 },
  { mandal: "Rajendranagar", villages: 35, covered: 22, volunteers: Math.max(5, Math.round(volunteers.length * 0.15)), citizens: 48190, coverageScore: 63 },
];

export const surveyContributions = volunteers.slice(0, 4).map((volunteer: any, index: number) => ({
  id: `${volunteer.id}-survey-${index}`,
  name: `${volunteer.name.split(" ")[0]} Survey Drive`,
  responses: Math.max(20, volunteer.surveysCompleted),
  target: Math.max(30, volunteer.surveysCompleted + 15),
  lastSubmission: `${index + 1} ${index === 0 ? "hour" : "hours"} ago`,
}));

export const volunteerComplaints = grievanceRawList.slice(0, 5).map((item: any, index: number) => ({
  id: item.id ?? `GR-${index + 1}`,
  citizen: item.citizen_name ?? `Citizen ${index + 1}`,
  category: item.category?.name ?? "General",
  status: toStatusLabel(item.status),
  filedOn: formatDate(item.created_at),
}));

export const documents = documentRawList.slice(0, 5).map((item: any, index: number) => ({
  id: item.id ?? `DOC-${index + 1}`,
  name: item.name ?? `Document ${index + 1}`,
  type: item.document_type ?? "PDF",
  verified: true,
  uploadedOn: formatDate(item.created_at),
}));

export const timeline = volunteers.slice(0, 4).map((volunteer: any, index: number) => ({
  id: `${volunteer.id}-timeline-${index}`,
  date: formatDate(volunteer.data?.created_at ?? new Date().toISOString()),
  event: index === 0 ? `Registered ${volunteer.citizensRegistered} citizens` : index === 1 ? `Completed ${volunteer.surveysCompleted} surveys` : `Checked in at ${volunteer.village}`,
  type: index % 2 === 0 ? "Activity" : "Training",
}));

export const featuredApplication = (schemeApplicationRawList[0] ? {
  id: schemeApplicationRawList[0].id ?? "APP-1",
  citizen: schemeApplicationRawList[0].citizen?.name ?? "Citizen",
  citizenId: schemeApplicationRawList[0].citizen?.unique_id ?? "—",
  scheme: schemeApplicationRawList[0].scheme?.name ?? "Scheme",
  schemeCode: schemeApplicationRawList[0].scheme?.code ?? "SC-1",
  department: schemeApplicationRawList[0].scheme?.department?.name ?? "Department",
  appliedOn: formatDate(schemeApplicationRawList[0].created_at),
  benefit: numberValue(schemeApplicationRawList[0].benefit_amount ?? schemeApplicationRawList[0].amount, 0),
  status: schemeApplicationRawList[0].status ?? "Submitted",
  category: schemeApplicationRawList[0].scheme?.category ?? "Welfare",
  village: schemeApplicationRawList[0].village?.name ?? "—",
  mandal: schemeApplicationRawList[0].village?.mandal?.name ?? "—",
} : {
  id: "APP-1",
  citizen: "Citizen",
  citizenId: "—",
  scheme: "Scheme",
  schemeCode: "SC-1",
  department: "Department",
  appliedOn: "—",
  benefit: 0,
  status: "Submitted",
  category: "Welfare",
  village: "—",
  mandal: "—",
});

export const requiredDocs = [
  { name: "Aadhaar Card", verified: true, submitted: true },
  { name: "Income Certificate", verified: true, submitted: true },
  { name: "Caste Certificate", verified: false, submitted: true },
  { name: "Land Record", verified: false, submitted: false },
];

export const verificationFlow = [
  { step: "Application Submitted", status: "Completed", actor: "Volunteer", date: formatDate(schemeApplicationRawList[0]?.created_at), note: "Citizen application captured successfully." },
  { step: "Eligibility Check", status: "In Progress", actor: "Department", date: "Pending", note: "Verification is being completed." },
  { step: "Approval Review", status: "Pending", actor: "Officer", date: "Pending", note: "Awaiting final sanction." },
];

export const applicationTimeline = [
  { event: "Application submitted", type: "Submitted", actor: "Volunteer", date: formatDate(schemeApplicationRawList[0]?.created_at) },
  { event: "Documents uploaded", type: "Document", actor: "Citizen", date: formatDate(schemeApplicationRawList[0]?.created_at) },
  { event: "Under review", type: "Review", actor: "Department", date: "In progress" },
];

export const benefitHistory = [
  { id: "BEN-01", scheme: featuredApplication.scheme, amount: featuredApplication.benefit, date: featuredApplication.appliedOn, department: featuredApplication.department, status: "Pending" },
];

export const auditTrail = [
  { action: "SUBMIT", user: "Volunteer", remarks: "Application submitted", date: formatDate(schemeApplicationRawList[0]?.created_at) },
  { action: "VERIFY", user: "Officer", remarks: "Eligibility review initiated", date: "Pending" },
];

export const previousBenefits = [
  { scheme: "PM Kisan", year: "2025", amount: 6000 },
  { scheme: "Pension", year: "2024", amount: 2400 },
];
