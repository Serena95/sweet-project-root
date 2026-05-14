import { Outlet, useRouterState } from "@tanstack/react-router";
import { Bell, HelpCircle, Plus, Search } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PUBLIC_PATHS = new Set(["/login", "/forgot-password", "/reset-password", "/invite"]);

export function AppShell() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  // Public routes (login, etc.) render without the chrome.
  if (PUBLIC_PATHS.has(pathname)) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur md:px-4">
            <SidebarTrigger className="shrink-0" />
            <div className="relative hidden flex-1 max-w-md sm:block">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cerca contatti, deal, task…" className="h-9 pl-8" />
            </div>
            <div className="flex-1 sm:flex-none" />
            <Button variant="ghost" size="icon" aria-label="Aiuto" className="hidden sm:inline-flex">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifiche">
              <Bell className="h-4 w-4" />
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nuovo</span>
            </Button>
          </header>

          <main className="flex-1 overflow-y-auto p-3 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}