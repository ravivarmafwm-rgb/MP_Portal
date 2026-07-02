import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, ShieldCheck, ShieldAlert } from "lucide-react";
import type { DocumentRecord } from "@/lib/citizen-data";

export function DocumentCard({ doc, index = 0 }: { doc: DocumentRecord; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card className="group flex h-full flex-col p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          {doc.verified ? (
            <Badge variant="outline" className="border-success/40 text-success">
              <ShieldCheck className="mr-1 h-3 w-3" />Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="border-warning/40 text-warning">
              <ShieldAlert className="mr-1 h-3 w-3" />Unverified
            </Badge>
          )}
        </div>
        <h4 className="mt-3 font-display text-sm font-semibold">{doc.type}</h4>
        <p className="text-xs text-muted-foreground">{doc.number}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">Issued</div>
            <div className="font-medium">{doc.issuedOn}</div>
          </div>
          <div>
            <div className="text-muted-foreground">OCR</div>
            <div className="font-medium">Auto-extracted</div>
          </div>
        </div>
        <div className="mt-auto flex gap-1.5 pt-4">
          <Button size="sm" variant="outline" className="flex-1 gap-1.5">
            <Eye className="h-3.5 w-3.5" />Preview
          </Button>
          <Button size="sm" variant="ghost" className="px-2">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}