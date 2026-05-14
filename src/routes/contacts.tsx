import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Contatti — Nexus CRM" },
      { name: "description", content: "Rubrica unificata di tutti i contatti." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="Contatti"
      description="Rubrica unificata di tutti i contatti."
      icon={Users}
    />
  ),
});
