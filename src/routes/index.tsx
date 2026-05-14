import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Nexus CRM" },
      { name: "description", content: "Pannello di controllo del CRM Nexus." },
    ],
  }),
  component: Index,
});

const stats = [
  { label: "Lead totali", value: "248", delta: "+12%", icon: Users },
  { label: "Deal aperti", value: "37", delta: "+4%", icon: Briefcase },
  { label: "Task oggi", value: "12", delta: "−3", icon: CheckCircle2 },
  { label: "Revenue mese", value: "€ 84.2k", delta: "+18%", icon: TrendingUp },
];

const recentDeals = [
  { name: "Rossi Holding — Sito istituzionale", stage: "Negoziazione", value: "€ 12.500" },
  { name: "Bianchi SRL — Consulenza fiscale", stage: "Proposta", value: "€ 8.200" },
  { name: "Verdi & Co — Sviluppo software", stage: "Discovery", value: "€ 24.000" },
  { name: "Neri SpA — Marketing automation", stage: "Chiusura", value: "€ 15.800" },
];

function Index() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Panoramica della tua attività commerciale.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          CoPilot
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">{s.value}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {s.delta}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Deal recenti</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              Vedi tutti
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentDeals.map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between rounded-md border border-border/60 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.stage}</p>
                </div>
                <span className="text-sm font-semibold">{d.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stato migrazione</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Fase 1 — Shell</span>
              <Badge>Fatto</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Fase 2 — Layout + routes</span>
              <Badge>In corso</Badge>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Fase 3 — Auth + dati</span>
              <Badge variant="outline">Da fare</Badge>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Fase 4 — Moduli core</span>
              <Badge variant="outline">Da fare</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
