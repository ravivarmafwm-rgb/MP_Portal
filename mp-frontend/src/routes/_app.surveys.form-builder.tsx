import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Type, AlignLeft, Hash, ChevronDown, CircleDot, CheckSquare, Calendar,
  Star, Upload, MapPin, ShieldCheck, Smartphone, Save, Eye, Send, Copy,
  Download, GripVertical, Trash2, Plus, Sparkles, type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/surveys/form-builder")({
  head: () => ({ meta: [{ title: "Form Builder — MP Constituency Platform" }] }),
  component: FormBuilder,
});

type QuestionType = "Short Text" | "Long Text" | "Number" | "Dropdown" | "Radio" | "Checkbox" | "Date" | "Rating" | "File Upload" | "GPS Location" | "Aadhaar Verification" | "Mobile";

const questionLibrary: { type: QuestionType; icon: string; desc: string }[] = [
  { type: "Short Text",           icon: "Type",         desc: "Single-line text input" },
  { type: "Long Text",            icon: "AlignLeft",    desc: "Multi-line text input" },
  { type: "Number",               icon: "Hash",         desc: "Numeric input" },
  { type: "Dropdown",             icon: "ChevronDown",  desc: "Single select list" },
  { type: "Radio",                icon: "CircleDot",    desc: "Multiple choice (1 answer)" },
  { type: "Checkbox",             icon: "CheckSquare",  desc: "Multiple choice (multi)" },
  { type: "Date",                 icon: "Calendar",     desc: "Date picker" },
  { type: "Rating",               icon: "Star",         desc: "1–5 star rating" },
  { type: "File Upload",          icon: "Upload",       desc: "Upload photos/docs" },
  { type: "GPS Location",         icon: "MapPin",       desc: "Auto-capture GPS" },
  { type: "Aadhaar Verification", icon: "ShieldCheck",  desc: "OTP-based verify" },
  { type: "Mobile",               icon: "Smartphone",   desc: "Mobile number field" },
];

const iconMap: Record<string, LucideIcon> = {
  Type, AlignLeft, Hash, ChevronDown, CircleDot, CheckSquare, Calendar,
  Star, Upload, MapPin, ShieldCheck, Smartphone,
};

const defaultQuestions = [
  { id: "Q1", type: "Short Text"  as QuestionType, label: "Respondent Full Name",        required: true },
  { id: "Q2", type: "Aadhaar Verification" as QuestionType, label: "Aadhaar Number",     required: true },
  { id: "Q3", type: "Dropdown"    as QuestionType, label: "Primary Occupation",           required: true },
  { id: "Q4", type: "Number"      as QuestionType, label: "Annual Family Income (₹)",    required: false },
  { id: "Q5", type: "Checkbox"    as QuestionType, label: "Issues Faced",                required: false },
  { id: "Q6", type: "GPS Location"as QuestionType, label: "Current Location",            required: false },
];

function FormBuilder() {
  const [selected, setSelected] = useState(defaultQuestions[0].id);
  const [questions, setQuestions] = useState(defaultQuestions);
  const active = questions.find(q => q.id === selected) ?? questions[0];

  function addQuestion(type: QuestionType) {
    const id = `Q${questions.length + 1}`;
    setQuestions([...questions, { id, type, label: `New ${type} question`, required: false }]);
    setSelected(id);
  }

  return (
    <>
      <PageHeader
        title="Survey Form Builder"
        description="Drag · drop · configure. Build multi-language survey forms with conditional logic — no code."
        actions={<div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5"><Save className="h-4 w-4" /> Save Draft</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><Eye className="h-4 w-4" /> Preview</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><Copy className="h-4 w-4" /> Clone</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm" className="gap-1.5"><Send className="h-4 w-4" /> Publish</Button>
        </div>}
      />
      <div className="grid gap-4 p-4 md:p-8 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        {/* LEFT — Question library */}
        <Card className="p-3">
          <div className="mb-2 px-1">
            <h3 className="font-display text-sm font-bold">Question Library</h3>
            <p className="text-[11px] text-muted-foreground">Click to add to canvas</p>
          </div>
          <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-1">
            {questionLibrary.map((q, i) => {
              const Icon = iconMap[q.icon] ?? Type;
              return (
                <motion.button
                  key={q.type}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                  onClick={() => addQuestion(q.type)}
                  className="group flex items-center gap-2 rounded-md border border-border bg-card p-2 text-left transition-all hover:border-primary hover:bg-primary/5"
                >
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold">{q.type}</div>
                    <div className="hidden truncate text-[10px] text-muted-foreground xl:block">{q.desc}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Card>

        {/* CENTER — Canvas */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between border-b border-dashed border-border pb-3">
            <div>
              <Input defaultValue="New Survey Form" className="border-0 px-0 font-display text-lg font-bold focus-visible:ring-0" />
              <p className="text-xs text-muted-foreground">1 section · {questions.length} questions · Telugu / English</p>
            </div>
            <Badge variant="secondary" className="bg-warning/15 text-warning">Draft</Badge>
          </div>
          <div className="space-y-2">
            <div className="rounded-md bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">SECTION 1 · Respondent Information</div>
            {questions.map((q, i) => {
              const ql = questionLibrary.find(x => x.type === q.type);
              const Icon = iconMap[ql?.icon ?? "Type"] ?? Type;
              const sel = q.id === selected;
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  onClick={() => setSelected(q.id)}
                  className={cn(
                    "group flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-3 transition-all",
                    sel ? "border-primary shadow-elevated ring-1 ring-primary/30" : "border-border hover:border-primary/40",
                  )}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground/60" />
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-muted"><Icon className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground">{q.id}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{q.type}</span>
                      {q.required && <Badge variant="secondary" className="bg-destructive/10 text-destructive text-[9px]">Required</Badge>}
                    </div>
                    <div className="mt-0.5 truncate text-sm font-medium">{q.label}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100"
                    onClick={(e) => { e.stopPropagation(); setQuestions(questions.filter(x => x.id !== q.id)); }}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </motion.div>
              );
            })}
            <button onClick={() => addQuestion("Short Text")} className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Plus className="h-4 w-4" /> Add question
            </button>
          </div>
        </Card>

        {/* RIGHT — Properties */}
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-bold">Question Properties</h3>
            <Badge variant="outline" className="font-mono text-[10px]">{active.id}</Badge>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Question label</Label>
              <Input defaultValue={active.label} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Description / help text</Label>
              <Textarea placeholder="Optional guidance for the volunteer" className="mt-1 min-h-[60px]" />
            </div>
            <div>
              <Label className="text-xs">Question type</Label>
              <Select defaultValue={active.type}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {questionLibrary.map(q => <SelectItem key={q.type} value={q.type}>{q.type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-2.5">
              <div><div className="text-xs font-semibold">Required</div><div className="text-[10px] text-muted-foreground">Volunteer must answer</div></div>
              <Switch defaultChecked={active.required} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border p-2.5">
              <div><div className="text-xs font-semibold">Validation</div><div className="text-[10px] text-muted-foreground">Aadhaar / mobile / regex</div></div>
              <Switch defaultChecked />
            </div>
            <div className="rounded-md border border-dashed border-primary/30 bg-primary/5 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" /> Conditional Logic</div>
              <p className="mt-1 text-[11px] text-muted-foreground">Show only if <span className="font-medium text-foreground">Q3 = Farmer</span></p>
              <Button size="sm" variant="outline" className="mt-2 h-7 w-full text-xs">Edit rule</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
