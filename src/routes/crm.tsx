import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tables, Database } from "@/integrations/supabase/types";

type Deal = Tables<"deals">;
type Company = Tables<"companies">;
type Contact = Tables<"contacts">;
type Stage = Database["public"]["Enums"]["deal_stage"];

const STAGES: { id: Stage; label: string; tone: string }[] = [
  { id: "lead", label: "Lead", tone: "bg-slate-500" },
  { id: "discovery", label: "Discovery", tone: "bg-blue-500" },
  { id: "proposal", label: "Proposta", tone: "bg-amber-500" },
  { id: "negotiation", label: "Negoziazione", tone: "bg-violet-500" },
  { id: "won", label: "Vinto", tone: "bg-emerald-500" },
  { id: "lost", label: "Perso", tone: "bg-rose-500" },
];

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: "CRM — Pipeline Deal" },
      { name: "description", content: "Pipeline commerciale: gestisci i tuoi deal." },
    ],
  }),
  component: CrmPage,
});

function CrmPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Deal[];
    },
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("*").order("name");
      if (error) throw error;
      return data as Company[];
    },
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contacts").select("*").order("first_name");
      if (error) throw error;
      return data as Contact[];
    },
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: Stage }) => {
      const { error } = await supabase.from("deals").update({ stage }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deals"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("deals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deal eliminato");
      qc.invalidateQueries({ queryKey: ["deals"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const totalOpen = deals
    .filter((d) => d.stage !== "won" && d.stage !== "lost")
    .reduce((s, d) => s + Number(d.value ?? 0), 0);
  const totalWon = deals
    .filter((d) => d.stage === "won")
    .reduce((s, d) => s + Number(d.value ?? 0), 0);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pipeline CRM</h1>
          <p className="text-sm text-muted-foreground">
            {deals.length} deal · aperti {fmtMoney(totalOpen)} · vinti {fmtMoney(totalWon)}
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Nuovo deal
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Caricamento…</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {STAGES.map((s) => {
            const items = deals.filter((d) => d.stage === s.id);
            const sum = items.reduce((acc, d) => acc + Number(d.value ?? 0), 0);
            return (
              <div key={s.id} className="flex min-w-0 flex-col gap-2">
                <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${s.tone}`} />
                    <span className="text-sm font-medium">{s.label}</span>
                    <span className="text-xs text-muted-foreground">{items.length}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{fmtMoney(sum)}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {items.length === 0 && (
                    <div className="rounded-md border border-dashed border-border px-2 py-6 text-center text-xs text-muted-foreground">
                      —
                    </div>
                  )}
                  {items.map((d) => {
                    const company = companies.find((c) => c.id === d.company_id);
                    return (
                      <Card key={d.id} className="group">
                        <CardContent className="space-y-2 p-3">
                          <div className="flex items-start justify-between gap-1">
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">{d.title}</div>
                              {company && (
                                <div className="truncate text-xs text-muted-foreground">
                                  {company.name}
                                </div>
                              )}
                            </div>
                            <div className="flex shrink-0 opacity-0 group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  setEditing(d);
                                  setOpen(true);
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  if (confirm("Eliminare?")) del.mutate(d.id);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {fmtMoney(Number(d.value ?? 0))}
                            </Badge>
                            <Select
                              value={d.stage}
                              onValueChange={(v) =>
                                updateStage.mutate({ id: d.id, stage: v as Stage })
                              }
                            >
                              <SelectTrigger className="h-7 w-auto gap-1 border-0 bg-transparent px-1 text-xs hover:bg-accent">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STAGES.map((st) => (
                                  <SelectItem key={st.id} value={st.id}>
                                    {st.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && deals.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-12 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nessun deal in pipeline.</p>
          </CardContent>
        </Card>
      )}

      <DealDialog
        open={open}
        onOpenChange={setOpen}
        deal={editing}
        companies={companies}
        contacts={contacts}
        userId={user?.id ?? ""}
      />
    </div>
  );
}

function DealDialog({
  open,
  onOpenChange,
  deal,
  companies,
  contacts,
  userId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  deal: Deal | null;
  companies: Company[];
  contacts: Contact[];
  userId: string;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: deal?.title ?? "",
    value: String(deal?.value ?? ""),
    stage: (deal?.stage ?? "lead") as Stage,
    company_id: deal?.company_id ?? "",
    contact_id: deal?.contact_id ?? "",
    expected_close_date: deal?.expected_close_date ?? "",
    notes: deal?.notes ?? "",
  });

  const key = deal?.id ?? "new";
  const [lastKey, setLastKey] = useState(key);
  if (open && lastKey !== key) {
    setLastKey(key);
    setForm({
      title: deal?.title ?? "",
      value: String(deal?.value ?? ""),
      stage: (deal?.stage ?? "lead") as Stage,
      company_id: deal?.company_id ?? "",
      contact_id: deal?.contact_id ?? "",
      expected_close_date: deal?.expected_close_date ?? "",
      notes: deal?.notes ?? "",
    });
  }

  const save = useMutation({
    mutationFn: async () => {
      if (!form.title.trim()) throw new Error("Il titolo è obbligatorio");
      const payload = {
        title: form.title.trim(),
        value: form.value ? Number(form.value) : 0,
        stage: form.stage,
        company_id: form.company_id || null,
        contact_id: form.contact_id || null,
        expected_close_date: form.expected_close_date || null,
        notes: form.notes.trim() || null,
      };
      if (deal) {
        const { error } = await supabase.from("deals").update(payload).eq("id", deal.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("deals").insert({ ...payload, user_id: userId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(deal ? "Deal aggiornato" : "Deal creato");
      qc.invalidateQueries({ queryKey: ["deals"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{deal ? "Modifica deal" : "Nuovo deal"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Titolo *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Valore €"
              type="number"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
            <Select
              value={form.stage}
              onValueChange={(v) => setForm({ ...form, stage: v as Stage })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={form.company_id || "none"}
              onValueChange={(v) => setForm({ ...form, company_id: v === "none" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Azienda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nessuna</SelectItem>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={form.contact_id || "none"}
              onValueChange={(v) => setForm({ ...form, contact_id: v === "none" ? "" : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Contatto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nessuno</SelectItem>
                {contacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.first_name} {c.last_name ?? ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            type="date"
            value={form.expected_close_date}
            onChange={(e) => setForm({ ...form, expected_close_date: e.target.value })}
          />
          <Textarea
            placeholder="Note"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Salvataggio…" : "Salva"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}