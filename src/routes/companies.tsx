import { createFileRoute } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Aziende — Nexus CRM" },
      { name: "description", content: "Anagrafica delle aziende clienti e prospect." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="Aziende"
      description="Anagrafica delle aziende clienti e prospect."
      icon={Building2}
    />
  ),
});
