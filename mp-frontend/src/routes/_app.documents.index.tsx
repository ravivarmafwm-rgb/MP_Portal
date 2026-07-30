import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { DocumentRepository } from "@/components/documents/DocumentRepository";
export const Route = createFileRoute("/_app/documents/")({ component: Page });
function Page() {
  return (
    <>
      <PageHeader
        title="Document Repository"
        description="Authorized constituency documents stored in the secure backend repository."
      />
      <div className="p-4 md:p-8">
        <DocumentRepository />
      </div>
    </>
  );
}
