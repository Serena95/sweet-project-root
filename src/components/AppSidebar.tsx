import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  Calendar as CalendarIcon,
  MessageSquare,
  FolderOpen,
  FileText,
  BarChart3,
  Mail,
  Settings as SettingsIcon,
  Sparkles,
  Rss,
  Building2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

const workspaceItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Feed", url: "/feed", icon: Rss },
  { title: "Calendario", url: "/calendar", icon: CalendarIcon },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Chat", url: "/chat", icon: MessageSquare },
];

const crmItems: NavItem[] = [
  { title: "CRM", url: "/crm", icon: Briefcase },
  { title: "Contatti", url: "/contacts", icon: Users },
  { title: "Aziende", url: "/companies", icon: Building2 },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

const productivityItems: NavItem[] = [
  { title: "Drive", url: "/drive", icon: FolderOpen },
  { title: "Docs", url: "/docs", icon: FileText },
  { title: "Webmail", url: "/webmail", icon: Mail },
];

const settingsItems: NavItem[] = [
  { title: "Impostazioni", url: "/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  const renderGroup = (label: string, items: NavItem[]) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-semibold">Nexus CRM</span>
              <span className="truncate text-[10px] text-muted-foreground">Workspace</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {renderGroup("Workspace", workspaceItems)}
        {renderGroup("CRM", crmItems)}
        {renderGroup("Produttività", productivityItems)}
        {renderGroup("Sistema", settingsItems)}
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="bg-primary/10 text-[10px] text-primary">ME</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">Demo User</p>
              <p className="truncate text-[10px] text-muted-foreground">demo@nexus.app</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}