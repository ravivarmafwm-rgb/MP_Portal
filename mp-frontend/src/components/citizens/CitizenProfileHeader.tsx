import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone, ShieldCheck, BadgeCheck, Heart, IdCard } from "lucide-react";
import type { Citizen } from "@/lib/citizen-data";

export function CitizenProfileHeader({ citizen }: { citizen: Citizen }) {
  const initials = citizen.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent" />
        <div className="-mt-12 grid gap-5 px-5 pb-5 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-6">
          <Avatar className="h-24 w-24 ring-4 ring-background shadow-md">
            <AvatarFallback className="bg-primary/15 text-xl font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-bold tracking-tight">{citizen.name}</h2>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                <IdCard className="mr-1 h-3 w-3" /> {citizen.id}
              </Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {citizen.occupation} · {citizen.gender} · {citizen.age} yrs
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{citizen.mobile}</span>
              <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />citizen@mp-platform.in</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{citizen.village}, {citizen.mandal} — {citizen.pincode}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {citizen.status === "Active" && (
                <Badge className="bg-success/10 text-success hover:bg-success/15">Active</Badge>
              )}
              {citizen.status === "Pending" && (
                <Badge className="bg-warning/15 text-warning hover:bg-warning/20">Pending</Badge>
              )}
              {citizen.status === "Inactive" && (
                <Badge variant="secondary">Inactive</Badge>
              )}
              {citizen.isSchemeBeneficiary && (
                <Badge variant="outline" className="border-primary/40 text-primary"><BadgeCheck className="mr-1 h-3 w-3" />Scheme Beneficiary</Badge>
              )}
              {citizen.isVolunteerVerified && (
                <Badge variant="outline" className="border-success/40 text-success"><ShieldCheck className="mr-1 h-3 w-3" />Volunteer Verified</Badge>
              )}
              {citizen.isSeniorCitizen && (
                <Badge variant="outline" className="border-rose-500/40 text-rose-600"><Heart className="mr-1 h-3 w-3" />Senior Citizen</Badge>
              )}
            </div>
          </div>
          <div className="hidden flex-col items-end gap-1 text-right md:flex">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Family ID</span>
            <span className="text-sm font-semibold">{citizen.familyId}</span>
            <span className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Booth</span>
            <span className="text-sm font-semibold">{citizen.booth}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}