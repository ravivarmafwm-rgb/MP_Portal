import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  Landmark,
  LockKeyhole,
  MapPinned,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPublicStatistics, type PublicStatistics } from "@/lib/api";

export const Route = createFileRoute("/")({ component: LandingPage });

const modules = [
  {
    icon: Users,
    title: "Citizen 360",
    text: "A connected citizen and family record with benefits, grievances, surveys and meetings.",
  },
  {
    icon: MessageSquareText,
    title: "Grievance Resolution",
    text: "Traceable cases from citizen registration through departmental resolution.",
  },
  {
    icon: Landmark,
    title: "Schemes & MPLADS",
    text: "Manage welfare delivery, public works, budgets, milestones and evidence.",
  },
  {
    icon: HeartHandshake,
    title: "Field Operations",
    text: "Coordinate volunteers, surveys, visits and constituency-level service delivery.",
  },
  {
    icon: ClipboardCheck,
    title: "Meetings & Follow-up",
    text: "Appointments, Janata Darbar, public meetings, tours and accountable action items.",
  },
  {
    icon: BarChart3,
    title: "Parliamentary Intelligence",
    text: "Decision-ready reporting across assemblies, mandals, villages and polling booths.",
  },
];

const capabilities = [
  "Constituency-wide administrative hierarchy",
  "Secure citizen and family records",
  "Department-linked grievance workflows",
  "Project, budget and document monitoring",
  "Survey and census field operations",
  "Role-specific dashboards and accountability",
];

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statistics, setStatistics] = useState<PublicStatistics | null>(null);
  const [statisticsError, setStatisticsError] = useState(false);

  useEffect(() => {
    fetchPublicStatistics()
      .then(setStatistics)
      .catch(() => setStatisticsError(true));
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f8f5] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-[#f6f8f5]/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="MP Connect home"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-950 text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <span>
              <strong className="block font-display text-base leading-none">
                MP Connect
              </strong>
              <small className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Constituency Governance
              </small>
            </span>
          </Link>
          <nav
            className="hidden items-center gap-8 text-sm font-semibold lg:flex"
            aria-label="Primary navigation"
          >
            <a href="#home" className="hover:text-emerald-800">
              Home
            </a>
            <a href="#about" className="hover:text-emerald-800">
              About
            </a>
            <a href="#features" className="hover:text-emerald-800">
              Features
            </a>
            <a href="#contact" className="hover:text-emerald-800">
              Contact
            </a>
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-bold text-emerald-950 hover:bg-emerald-950/5"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-emerald-950 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-900"
            >
              Sign Up
            </Link>
          </div>
          <button
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-emerald-950/10 bg-white px-5 py-5 lg:hidden">
            <div className="grid gap-4 text-sm font-semibold">
              <a href="#home" onClick={() => setMenuOpen(false)}>
                Home
              </a>
              <a href="#about" onClick={() => setMenuOpen(false)}>
                About
              </a>
              <a href="#features" onClick={() => setMenuOpen(false)}>
                Features
              </a>
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Contact
              </a>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="rounded-lg border border-emerald-950/20 px-4 py-3 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-emerald-950 px-4 py-3 text-center text-white"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <section
        id="home"
        className="relative overflow-hidden border-b border-emerald-950/10"
      >
        <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-emerald-950 lg:block" />
        <div className="absolute right-[8%] top-24 hidden h-72 w-72 rounded-full border border-amber-300/30 lg:block" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.18fr_.82fr] lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-900">
              <ShieldCheck className="h-4 w-4" /> Accountable public service
            </div>
            <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              One constituency.
              <br />
              <span className="text-emerald-800">One trusted view.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              A secure operating system for an MP office to connect citizens,
              field teams, departments, welfare delivery and development
              projects—across every assembly, mandal, village, ward and booth.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-950 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-950/15 hover:bg-emerald-900"
              >
                Access the portal <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center justify-center rounded-xl border border-emerald-950/20 bg-white px-6 py-3.5 font-bold text-emerald-950 hover:border-emerald-800"
              >
                Explore the platform
              </a>
            </div>
          </div>
          <div className="relative rounded-3xl bg-emerald-950 p-6 text-white shadow-2xl lg:ml-8 lg:bg-white/8 lg:ring-1 lg:ring-white/15">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                  Governance network
                </p>
                <p className="mt-1 text-xl font-bold">
                  From Parliament to polling booth
                </p>
              </div>
              <MapPinned className="h-9 w-9 text-amber-300" />
            </div>
            <div className="mt-6 space-y-3">
              {[
                "Parliamentary Constituency",
                "Assembly Constituencies",
                "Mandals & Municipalities",
                "Villages, Wards & Booths",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-xl bg-white/8 p-4 ring-1 ring-white/10"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-300 text-sm font-extrabold text-emerald-950">
                    {index + 1}
                  </span>
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-800">
            Built for constituency scale
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Public service needs more than disconnected registers.
          </h2>
        </div>
        <div>
          <p className="text-lg leading-8 text-slate-600">
            MP Connect gives authorized teams a shared, accountable view of
            citizen needs and government response. It connects office operations
            with field evidence while protecting sensitive records through role
            and geography-based access.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {capabilities.map((item) => (
              <div
                key={item}
                className="flex gap-3 text-sm font-semibold text-slate-700"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="bg-emerald-950 py-20 text-white lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-300">
              Connected modules
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
              A complete constituency operating model.
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/15 md:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="bg-emerald-950 p-7 transition hover:bg-emerald-900"
              >
                <Icon className="h-7 w-7 text-amber-300" />
                <h3 className="mt-6 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-emerald-100/75">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="public-impact-heading"
        className="border-b border-emerald-950/10 bg-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-800">
                Live constituency record
              </p>
              <h2
                id="public-impact-heading"
                className="mt-3 font-display text-3xl font-extrabold"
              >
                Public service in measurable action.
              </h2>
            </div>
            {statisticsError && (
              <p role="alert" className="text-sm font-semibold text-red-700">
                Live statistics are temporarily unavailable.
              </p>
            )}
          </div>
          {!statistics && !statisticsError && (
            <div
              className="mt-10 h-24 animate-pulse rounded-2xl bg-slate-100"
              aria-label="Loading public statistics"
            />
          )}
          {statistics && (
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-emerald-950/10 bg-emerald-950/10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Citizens served", statistics.citizens_served],
                ["Grievances resolved", statistics.grievances_resolved],
                ["Projects completed", statistics.projects_completed],
                ["Active volunteers", statistics.active_volunteers],
              ].map(([label, value]) => (
                <div key={String(label)} className="bg-white p-6">
                  <p className="font-display text-4xl font-extrabold text-emerald-900">
                    {Number(value).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-950/10 bg-white p-7">
            <LockKeyhole className="h-7 w-7 text-emerald-800" />
            <h3 className="mt-5 text-xl font-bold">
              Security by responsibility
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Role, permission, ownership and geography controls keep sensitive
              constituency information with the right people.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-950/10 bg-white p-7">
            <FileText className="h-7 w-7 text-emerald-800" />
            <h3 className="mt-5 text-xl font-bold">Evidence, not estimates</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Documents, status history and audit trails support every
              application, grievance and development project.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-950/10 bg-white p-7">
            <BarChart3 className="h-7 w-7 text-emerald-800" />
            <h3 className="mt-5 text-xl font-bold">Decisions at every level</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Operational reporting helps leaders identify delays, coverage gaps
              and priorities by administrative area.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="px-5 pb-20 lg:px-8 lg:pb-28">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl bg-amber-300 p-8 text-emerald-950 md:flex-row md:items-center lg:p-12">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em]">
              Citizen access
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Connect with your constituency office.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-950/75">
              Create a citizen account to access eligible public services. Staff
              and official accounts are provisioned securely by the MP office.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-950 px-6 py-3.5 font-bold text-white"
          >
            Create citizen account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-emerald-950/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2 font-bold text-emerald-950">
            <Building2 className="h-4 w-4" /> MP Connect
          </div>
          <p>Secure constituency governance and citizen service delivery.</p>
          <div className="flex gap-5">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
