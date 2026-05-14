import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, CheckCircle2, Circle, Clock } from "lucide-react";
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

type Task = Tables<"tasks">;
type Status = Database["public"]["Enums"]["task_status"];
type Priority = Database["public"]["Enums"]["task_priority"];

const PRIO: Record<Priority, { label: string; tone: string }> = {
  low: { label: "Bassa", tone: "bg-slate-500/15 text-slate-700 dark:text-slate-300" },
  medium: { label: "Media", tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  high: { label: "Alta", tone: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
};

const STATUS: { id: Status; label: string; icon: typeof Circle }[] = [
  { id: "todo", label: "Da fare", icon: Circle },
  { id: "in_progress", label: "In corso", icon: Clock },
  { id: "done", label: "Completato", icon: CheckCircle2 },
];

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task — Nexus CRM" },
      { name: "description", content: "Le tue attività organizzate per stato e priorità." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data as Task[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Task eliminato");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Task</h1>
          <p className="text-sm text-muted-foreground">
            {tasks.filter((t) => t.status !== "done").length} attività attive
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
          Nuovo task
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Caricamento…</div>
      ) : (
        <div className="space-y-6">
          {STATUS.map((s) => {
            const items = tasks.filter((t) => t.status === s.id);
            const Icon = s.icon;
            return (
              <div key={s.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">{s.label}</h2>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                {items.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center text-xs text-muted-foreground">
                      Nessun task
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {items.map((t) => (
                      <Card key={t.id}>
                        <CardContent className="flex items-start gap-3 p-3">
                          <button
                            className="mt-0.5"
                            onClick={() =>
                              setStatus.mutate({
                                id: t.id,
                                status: t.status === "done" ? "todo" : "done",
                              })
                            }
                            aria-label="Toggle complete"
                          >
                            {t.status === "done" ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-sm font-medium ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}
                            >
                              {t.title}
                            </div>
                            {t.description && (
                              <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                                {t.description}
                              </div>
                            )}
                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                              <Badge className={`text-xs ${PRIO[t.priority].tone}`} variant="secondary">
                                {PRIO[t.priority].label}
                              </Badge>
                              {t.due_date && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(t.due_date).toLocaleDateString("it-IT")}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex shrink-0">
                            <Select
                              value={t.status}
                              onValueChange={(v) =>
                                setStatus.mutate({ id: t.id, status: v as Status })
                              }
                            >
                              <SelectTrigger className="h-7 w-auto gap-1 border-0 bg-transparent px-1 text-xs hover:bg-accent">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS.map((st) => (
                                  <SelectItem key={st.id} value={st.id}>
                                    {st.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                setEditing(t);
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
                                if (confirm("Eliminare?")) del.mutate(t.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        task={editing}
        userId={user?.id ?? ""}
      />
    </div>
  );
}

function TaskDialog({
  open,
  onOpenChange,
  task,
  userId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task: Task | null;
  userId: string;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    due_date: task?.due_date ? task.due_date.slice(0, 10) : "",
    priority: (task?.priority ?? "medium") as Priority,
    status: (task?.status ?? "todo") as Status,
  });

  const key = task?.id ?? "new";
  const [lastKey, setLastKey] = useState(key);
  if (open && lastKey !== key) {
    setLastKey(key);
    setForm({
      title: task?.title ?? "",
      description: task?.description ?? "",
      due_date: task?.due_date ? task.due_date.slice(0, 10) : "",
      priority: (task?.priority ?? "medium") as Priority,
      status: (task?.status ?? "todo") as Status,
    });
  }

  const save = useMutation({
    mutationFn: async () => {
      if (!form.title.trim()) throw new Error("Il titolo è obbligatorio");
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
        priority: form.priority,
        status: form.status,
      };
      if (task) {
        const { error } = await supabase.from("tasks").update(payload).eq("id", task.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tasks").insert({ ...payload, user_id: userId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(task ? "Task aggiornato" : "Task creato");
      qc.invalidateQueries({ queryKey: ["tasks"] });
      onOpenChange(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Modifica task" : "Nuovo task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Titolo *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            placeholder="Descrizione"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              type="date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
            <Select
              value={form.priority}
              onValueChange={(v) => setForm({ ...form, priority: v as Priority })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PRIO) as Priority[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {PRIO[p].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v as Status })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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