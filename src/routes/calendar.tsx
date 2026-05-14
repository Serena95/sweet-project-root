import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendario — Nexus CRM" },
      { name: "description", content: "Eventi, riunioni e promemoria condivisi con il team." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="Calendario"
      description="Eventi, riunioni e promemoria condivisi con il team."
      icon={Calendar}
    />
  ),
});
