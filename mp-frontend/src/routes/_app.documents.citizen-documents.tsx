import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { DocumentRepository } from "@/components/documents/DocumentRepository";
export const Route = createFileRoute("/_app/documents/citizen-documents")({
  component: Page,
});
function Page() {
  return (
    <>
      <PageHeader
        title="Citizen Documents"
        description="Authorized documents attached to citizen records."
      />
      <div className="p-4 md:p-8">
        <DocumentRepository type="citizen" />
      </div>
    </>
  );
}
