import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/webmail")({
  head: () => ({
    meta: [
      { title: "Webmail — Nexus CRM" },
      { name: "description", content: "Casella email integrata con templates." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="Webmail"
      description="Casella email integrata con templates."
      icon={Mail}
    />
  ),
});
