import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  fetchProjectLookup,
  saveProjectLookup,
  deleteProjectLookup,
  restoreProjectLookup,
  getApiErrorMessage,
} from "@/lib/api";
import { toast } from "sonner";
export const Route = createFileRoute("/_app/projects/lookups")({
  component: LookupAdmin,
});
const kinds = ["category", "type", "department", "agency"] as const;
function LookupAdmin() {
  const [kind, setKind] = useState<(typeof kinds)[number]>("category");
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editId, setEditId] = useState<string>();
  const [showDeleted, setShowDeleted] = useState(false);
  const client = useQueryClient();
  const q = useQuery({
    queryKey: ["project-lookup-admin", kind, search, showDeleted],
    queryFn: () =>
      fetchProjectLookup(kind, showDeleted ? { with_trashed: 1 } : undefined),
  });
  const mutation = useMutation({
    mutationFn: () => saveProjectLookup(kind, { name, code }, editId),
    onSuccess: () => {
      toast.success("Lookup saved.");
      setName("");
      setCode("");
      setEditId(undefined);
      client.invalidateQueries({ queryKey: ["project-lookup-admin", kind] });
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteProjectLookup(kind, id),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["project-lookup-admin", kind] }),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  const restore = useMutation({
    mutationFn: (id: string) => restoreProjectLookup(kind, id),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["project-lookup-admin", kind] }),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  const rows = (q.data?.data ?? []).filter(
    (r) =>
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        title="Project Lookup Administration"
        description="Manage categories, types, departments and agencies used by projects."
      />
      <div className="space-y-4 p-4 md:p-8">
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <Button
              key={k}
              variant={kind === k ? "default" : "outline"}
              onClick={() => setKind(k)}
              className="capitalize"
            >
              {k}
            </Button>
          ))}
        </div>
        <Card className="grid gap-3 p-4 md:grid-cols-[1fr_1fr_auto]">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            disabled={mutation.isPending || !name.trim() || !code.trim()}
            onClick={() => mutation.mutate()}
          >
            {editId ? "Update" : "Add"}
          </Button>
        </Card>
        <Card className="p-4">
          <div className="flex gap-3">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <label className="flex items-center gap-2 text-sm whitespace-nowrap">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
              />{" "}
              Show deleted
            </label>
          </div>
          <div className="mt-3 divide-y">
            {rows.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.code}
                    {r.deleted_at ? " · deleted" : ""}
                  </div>
                </div>
                {r.deleted_at ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => restore.mutate(r.id)}
                  >
                    Restore
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditId(r.id);
                        setName(r.name);
                        setCode(r.code);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove.mutate(r.id)}
                      disabled={remove.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {!rows.length && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No lookup records found.
              </p>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
