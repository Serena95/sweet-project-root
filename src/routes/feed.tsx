import { createFileRoute } from "@tanstack/react-router";
import { Rss } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed — Nexus CRM" },
      { name: "description", content: "Stream sociale interno: post, commenti e attività del team." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="Feed"
      description="Stream sociale interno: post, commenti e attività del team."
      icon={Rss}
    />
  ),
});
