import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Docs — Nexus CRM" },
      { name: "description", content: "Documenti collaborativi con editor ricco." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="Docs"
      description="Documenti collaborativi con editor ricco."
      icon={FileText}
    />
  ),
});
