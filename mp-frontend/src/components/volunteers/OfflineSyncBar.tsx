/**
 * OfflineSyncBar
 * Shows at the top of volunteer screens:
 * - Online/Offline status pill
 * - Pending draft count badge
 * - Manual sync button
 * - Last sync result toast
 */

import { useState, useEffect, useCallback } from "react";
import { Wifi, WifiOff, RefreshCw, CloudOff, CheckCircle2, Trash2, FileClock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { deleteDraft, getAllDrafts, pendingDraftCount, type OfflineDraft } from "@/lib/offline-store";
import { syncAllDrafts, type SyncResult } from "@/lib/offline-sync";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

export function OfflineSyncBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [online, setOnline]       = useState(navigator.onLine);
  const [pending, setPending]     = useState(0);
  const [syncing, setSyncing]     = useState(false);
  const [lastSync, setLastSync]   = useState<Date | null>(null);
  const [drafts, setDrafts] = useState<OfflineDraft[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);

  // Track network status
  useEffect(() => {
    const up   = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online",  up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online",  up);
      window.removeEventListener("offline", down);
    };
  }, []);

  // Refresh pending count
  const refreshCount = useCallback(async () => {
    if (!user?.id) return;
    const count = await pendingDraftCount(user.id);
    setPending(count);
    setDrafts(await getAllDrafts(user.id));
  }, [user?.id]);

  useEffect(() => {
    refreshCount();
    const interval = setInterval(refreshCount, 10_000);
    return () => clearInterval(interval);
  }, [refreshCount]);

  // Auto-sync when going online
  useEffect(() => {
    if (online && user?.id && pending > 0) {
      handleSync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  const handleSync = async () => {
    if (!user?.id || syncing || !online) return;
    setSyncing(true);
    try {
      const result: SyncResult = await syncAllDrafts(user.id);
      setLastSync(new Date());
      await refreshCount();
      const messages: string[] = [];
      if (result.synced > 0) {
        messages.push(`${result.synced} record${result.synced > 1 ? "s" : ""}`);
      }
      if ((result.documentsSynced ?? 0) > 0) {
        messages.push(`${result.documentsSynced} document${(result.documentsSynced ?? 0) > 1 ? "s" : ""}`);
      }
      if (messages.length) {
        toast.success(`Synced ${messages.join(" and ")} to server.`);
      }
      if (result.failed > 0 || (result.documentsFailed ?? 0) > 0) {
        const fails: string[] = [];
        if (result.failed > 0) fails.push(`${result.failed} record${result.failed > 1 ? "s" : ""}`);
        if ((result.documentsFailed ?? 0) > 0) fails.push(`${result.documentsFailed} document${(result.documentsFailed ?? 0) > 1 ? "s" : ""}`);
        toast.error(`${fails.join(" and ")} failed to sync.`);
      }
      if (result.synced === 0 && result.failed === 0 && (result.documentsSynced ?? 0) === 0) {
        toast.info("All records are already up to date.");
      }
    } catch {
      toast.error("Sync failed. Check connection and try again.");
    } finally {
      setSyncing(false);
    }
  };

  if (online && pending === 0 && !lastSync) return null;

  return (
    <div className={cn(
      "relative flex items-center gap-3 px-4 py-2 text-sm border-b",
      online ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" : "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800",
    )}>
      {/* Status pill */}
      <div className={cn("flex items-center gap-1.5 font-medium", online ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400")}>
        {online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
        {online ? "Online" : "Offline — drafts saved locally"}
      </div>

      {/* Pending badge */}
      {pending > 0 && (
        <button type="button" onClick={() => setShowDrafts((value) => !value)} className="rounded focus:outline-none focus:ring-2 focus:ring-primary">
          <Badge variant="outline" className={cn("gap-1", online ? "border-green-400 text-green-700" : "border-amber-400 text-amber-700")}>
          <CloudOff className="h-3 w-3" />
          {pending} pending
          </Badge>
        </button>
      )}

      {/* Last sync time */}
      {lastSync && pending === 0 && (
        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Synced {lastSync.toLocaleTimeString("en-IN")}
        </span>
      )}

      {/* Manual sync button */}
      {online && pending > 0 && (
        <Button
          size="sm"
          variant="outline"
          className="ml-auto h-7 gap-1.5 text-xs"
          disabled={syncing}
          onClick={handleSync}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
          {syncing ? "Syncing…" : "Sync Now"}
        </Button>
      )}
      {showDrafts && drafts.length > 0 && (
        <div className="absolute left-4 right-4 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border bg-background p-2 shadow-lg sm:left-auto sm:w-[28rem]">
          <div className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><FileClock className="h-3.5 w-3.5" />Offline drafts</div>
          {drafts.filter((draft) => draft.status !== "synced").map((draft) => (
            <div key={draft.id} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted/60">
              <div className="min-w-0 flex-1"><div className="truncate font-medium">{draft.label}</div><div className="text-xs text-muted-foreground">{draft.type.replaceAll("_", " ")} · {draft.status}</div>{draft.failureReason && <div className="truncate text-xs text-destructive">{draft.failureReason}</div>}</div>
              {draft.type === "citizen_enrollment" && <Button size="icon" variant="ghost" title="Resume citizen draft" onClick={() => { try { localStorage.setItem("citizen-enrollment-draft", draft.payload); void navigate({ to: "/citizens/create-profile" }); } catch { toast.error("Draft could not be opened."); } }}><Eye className="h-4 w-4" /></Button>}
              <Button size="icon" variant="ghost" title="Delete draft" onClick={async () => { await deleteDraft(draft.id); await refreshCount(); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
