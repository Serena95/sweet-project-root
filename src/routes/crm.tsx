import { createFileRoute } from "@tanstack/react-router";
import { Briefcase } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: "CRM — Nexus CRM" },
      { name: "description", content: "Pipeline di vendita: lead, deal, contatti e aziende." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="CRM"
      description="Pipeline di vendita: lead, deal, contatti e aziende."
      icon={Briefcase}
    />
  ),
});
