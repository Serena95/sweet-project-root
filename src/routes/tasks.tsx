import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Nexus CRM" },
      { name: "description", content: "Gestione task con liste, priorità e scadenze." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="Tasks"
      description="Gestione task con liste, priorità e scadenze."
      icon={CheckSquare}
    />
  ),
});
