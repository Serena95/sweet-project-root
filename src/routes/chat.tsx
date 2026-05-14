import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat — Nexus CRM" },
      { name: "description", content: "Messaggistica interna con canali e DM." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="Chat"
      description="Messaggistica interna con canali e DM."
      icon={MessageSquare}
    />
  ),
});
