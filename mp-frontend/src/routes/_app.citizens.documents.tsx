import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Filter, ScanLine } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/layout/StatCard";
import { DocumentCard } from "@/components/citizens/DocumentCard";
import { documentsByCitizen } from "@/lib/citizen-data";

const allDocs = documentsByCitizen["CTZ-100245"];
const filters = ["All", "Aadhaar", "Voter ID", "Income Certificate", "Caste Certificate", "Land Records", "Ration Card", "PAN"] as const;

export const Route = createFileRoute("/_app/citizens/documents")({
  head: () => ({
    meta: [
      { title: "Document Center — MP Constituency Platform" },
      { name: "description", content: "Citizen document repository with previews, OCR and verification." },
    ],
  }),
  component: DocumentCenterPage,
});

function DocumentCenterPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    return allDocs.filter((d) => {
      const matchFilter = filter === "All" || d.type === filter;
      const matchQ = !q || d.number.toLowerCase().includes(q.toLowerCase()) || d.type.toLowerCase().includes(q.toLowerCase());
      return matchFilter && matchQ;
    });
  }, [filter, q]);

  return (
    <>
      <PageHeader
        title="Document Center"
        description="Unified document repository with previews, OCR and version history."
        actions={
          <Button size="sm" className="gap-1.5">
            <Upload className="h-4 w-4" /> Upload Document
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Documents on File" value="48,902" icon={FileText} index={0} delta="+3.1%" />
          <StatCard label="OCR Extracted" value="42,180" icon={ScanLine} index={1} delta="+4.8%" hint="Auto-indexed" />
          <StatCard label="Pending Verification" value="1,204" icon={Filter} index={2} delta="-1.2%" trend="down" />
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-wrap items-center gap-3">
          <Input placeholder="Search documents…" value={q} onChange={(e) => setQ(e.target.value)} className="h-9 max-w-xs" />
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <Badge
                key={f}
                variant={filter === f ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilter(f)}
              >
                {f}
              </Badge>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((d, i) => (
            <DocumentCard key={d.id} doc={d} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}