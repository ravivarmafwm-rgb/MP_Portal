import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { DocumentRepository } from "@/components/documents/DocumentRepository";
import { z } from "zod";
export const Route = createFileRoute("/_app/documents/project-documents")({
  validateSearch: z.object({ id: z.string().optional() }),
  component: Page,
});
function Page() {
  const { id } = Route.useSearch();
  return (
    <>
      <PageHeader
        title="Project Documents"
        description="Authorized documents attached to development and MPLADS projects."
      />
      <div className="p-4 md:p-8">
        <DocumentRepository type="project" documentableId={id} />
      </div>
    </>
  );
}
