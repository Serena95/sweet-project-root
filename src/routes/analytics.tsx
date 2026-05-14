import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Nexus CRM" },
      { name: "description", content: "Report e dashboard analitiche su pipeline e vendite." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="Analytics"
      description="Report e dashboard analitiche su pipeline e vendite."
      icon={BarChart3}
    />
  ),
});
