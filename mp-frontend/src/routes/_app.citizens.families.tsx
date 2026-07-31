import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { FamilyTree } from "@/components/citizens/FamilyTree";
import { FamilyDialog } from "@/components/citizens/FamilyDialog";
import { FamilyMemberDialog } from "@/components/citizens/FamilyMemberDialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteFamily,
  fetchFamilies,
  getApiErrorMessage,
  removeFamilyMember,
} from "@/lib/api";
import { toast } from "sonner";
import type { Family } from "@/lib/citizen-types";

export const Route = createFileRoute("/_app/citizens/families")({
  component: FamiliesPage,
});

function FamiliesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const client = useQueryClient();
  const removeMember = useMutation({
    mutationFn: ({
      familyId,
      memberId,
    }: {
      familyId: string;
      memberId: string;
    }) => removeFamilyMember(familyId, memberId),
    onSuccess: async () => {
      toast.success("Family member removed.");
      await client.invalidateQueries({ queryKey: ["families"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const archive = useMutation({
    mutationFn: deleteFamily,
    onSuccess: async () => {
      toast.success("Empty family archived.");
      await client.invalidateQueries({ queryKey: ["families"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  const query = useQuery({
    queryKey: ["families", search, page],
    queryFn: () => fetchFamilies({ search, page, per_page: 10 }),
  });
  return (
    <>
      <PageHeader
        title="Family Management"
        description="Registered households and their persisted citizen relationships."
        actions={<FamilyDialog />}
      />
      <div className="space-y-5 p-4 md:p-8">
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Family ID or head of family"
            />
          </div>
        </Card>
        {query.isLoading && (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72" />
            ))}
          </div>
        )}
        {query.isError && (
          <div className="py-16 text-center text-muted-foreground">
            <AlertCircle className="mx-auto mb-3 h-8 w-8" />
            Families could not be loaded.
          </div>
        )}
        {query.data && (
          <div className="grid gap-4 lg:grid-cols-2">
            {query.data.data.map((record) => {
              const family: Family = {
                id: record.family_id,
                members: record.family_members.map((member) => ({
                  citizenId: member.citizen.id,
                  name: [
                    member.citizen.first_name,
                    member.citizen.middle_name,
                    member.citizen.last_name,
                  ]
                    .filter(Boolean)
                    .join(" "),
                  age: ageFrom(member.citizen.date_of_birth),
                  gender: member.citizen.gender,
                  relation: member.relationship_with_head,
                  isHead: member.is_head,
                })),
              };
              const head = record.family_members.find(
                (member) => member.is_head,
              )?.citizen;
              return (
                <Card key={record.id} className="p-5">
                  <div className="mb-4 flex flex-wrap justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold">
                          {record.head_of_family_name}
                        </h2>
                        <Badge variant="outline">{record.family_id}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {record.village?.name ?? "Village not recorded"} ·{" "}
                        {record.village?.mandal?.name ?? "Mandal not recorded"}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-xs text-muted-foreground">
                        Recorded benefits
                      </div>
                      <div className="font-semibold">
                        ₹
                        {Number(
                          record.total_benefits_received ?? 0,
                        ).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                  {family.members.length ? (
                    <div className="space-y-3">
                      <FamilyTree family={family} />
                      <div className="space-y-2 border-t pt-3">
                        {record.family_members
                          .filter((member) => !member.is_head)
                          .map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <span>
                                {member.citizen.first_name}{" "}
                                {member.citizen.last_name} ·{" "}
                                {member.relationship_with_head}
                              </span>
                              <div className="flex gap-1">
                                <FamilyMemberDialog
                                  familyId={record.id}
                                  member={member}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  disabled={removeMember.isPending}
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Remove this citizen from the family?",
                                      )
                                    )
                                      removeMember.mutate({
                                        familyId: record.id,
                                        memberId: member.id,
                                      });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" /> Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                      No family members are linked.
                    </div>
                  )}
                  {head && (
                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      <FamilyDialog family={record} />
                      <FamilyMemberDialog familyId={record.id} />
                      <Button asChild variant="outline" size="sm">
                        <Link to="/citizens/profile" search={{ id: head.id }}>
                          Open head profile
                        </Link>
                      </Button>
                    </div>
                  )}
                  {!head && (
                    <div className="mt-3 flex justify-end gap-2">
                      <FamilyMemberDialog familyId={record.id} />
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={archive.isPending}
                        onClick={() => {
                          if (window.confirm("Archive this empty family?"))
                            archive.mutate(record.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Archive
                      </Button>
                    </div>
                  )}
                  {record.activity_logs && record.activity_logs.length > 0 && (
                    <div className="mt-4 border-t pt-3">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Family history
                      </div>
                      <div className="space-y-2">
                        {record.activity_logs.slice(0, 5).map((entry) => (
                          <div
                            key={entry.id}
                            className="flex justify-between gap-3 text-xs text-muted-foreground"
                          >
                            <span>{entry.description}</span>
                            <span>
                              {new Date(entry.created_at).toLocaleDateString(
                                "en-IN",
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
        {query.data?.data.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No families match the search.
          </div>
        )}
        {query.data && query.data.meta.last_page > 1 && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              Page {page} of {query.data.meta.last_page}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((v) => v - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page === query.data.meta.last_page}
                onClick={() => setPage((v) => v + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
function ageFrom(value?: string | null): number {
  if (!value) return 0;
  const birth = new Date(value);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()))
    age -= 1;
  return Math.max(age, 0);
}
