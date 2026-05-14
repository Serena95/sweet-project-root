import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Accedi — Nexus CRM" },
      { name: "description", content: "Accedi al tuo workspace Nexus." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Nexus CRM</h1>
            <p className="text-xs text-muted-foreground">
              Accedi al tuo workspace
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="tu@azienda.it" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/"
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Password dimenticata?
                </Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="button" className="w-full" disabled>
              Accedi (auth in arrivo)
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            L'autenticazione verrà collegata nella prossima fase
            <br />
            (Lovable Cloud o Supabase esistente).
          </p>

          <div className="text-center">
            <Link
              to="/"
              className="text-xs text-primary underline-offset-4 hover:underline"
            >
              Torna alla dashboard demo
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
