import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/drive")({
  head: () => ({
    meta: [
      { title: "Drive — Nexus CRM" },
      { name: "description", content: "File storage condiviso con cartelle e versioni." },
    ],
  }),
  component: () => (
    <PagePlaceholder
      title="Drive"
      description="File storage condiviso con cartelle e versioni."
      icon={FolderOpen}
    />
  ),
});
