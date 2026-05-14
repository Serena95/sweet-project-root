import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Impostazioni — Nexus CRM" },
      { name: "description", content: "Profilo, team, integrazioni e fatturazione." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="Impostazioni"
      description="Profilo, team, integrazioni e fatturazione."
      icon={Settings}
    />
  ),
});
