import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";

type Props = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function PagePlaceholder({ title, description, icon: Icon = Construction }: Props) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge variant="outline" className="shrink-0 gap-1">
          <Construction className="h-3 w-3" />
          In migrazione
        </Badge>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Questo modulo verrà migrato dalla CRM originale (
            <code className="rounded bg-muted px-1 py-0.5 text-[11px]">
              artifacts/crm-nuovo
            </code>
            ) nelle prossime fasi della migrazione.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
