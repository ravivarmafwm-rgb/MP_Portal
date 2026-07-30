import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Building2 } from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { navSections } from "./nav-config";
import { useAuth } from "@/lib/auth";
import { canSeeNavSection, getDashboardPath } from "@/lib/roles";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const roleSlug = user?.role_slug ?? "";
  const dashboardPath = getDashboardPath(roleSlug);

  const filteredSections = navSections
    .filter((section) => canSeeNavSection(roleSlug, section.title))
    .map((section) =>
      section.title === "Dashboard"
        ? { ...section, url: dashboardPath }
        : section,
    );

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <div className="flex items-center gap-2.5 px-1.5 py-1">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="truncate font-display text-sm font-bold text-sidebar-foreground">
                MP Connect
              </div>
              <div className="truncate text-[11px] text-sidebar-foreground/60">
                Constituency Platform
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredSections.map((section) => {
                const Icon = section.icon;
                const active = isActive(section.url);
                if (!section.children) {
                  return (
                    <SidebarMenuItem key={section.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={section.title}
                      >
                        <Link to={section.url}>
                          <Icon />
                          <span>{section.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
                return (
                  <Collapsible
                    key={section.url}
                    defaultOpen={active}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={active}
                          tooltip={section.title}
                        >
                          <Icon />
                          <span>{section.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === section.url}
                            >
                              <Link to={section.url}>
                                <span>Overview</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {section.children
                            .filter(
                              (child) =>
                                !child.roles || child.roles.includes(roleSlug),
                            )
                            .map((child) => (
                              <SidebarMenuSubItem key={child.url}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === child.url}
                                >
                                  <Link to={child.url}>
                                    <span>{child.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60">
        {!collapsed ? (
          <div className="rounded-lg bg-sidebar-accent/60 p-3 text-xs text-sidebar-foreground/80">
            <div className="font-semibold text-sidebar-foreground">
              Lok Sabha
            </div>
            <div className="text-sidebar-foreground/60">2024 — 2029 Term</div>
          </div>
        ) : (
          <div className="grid h-8 w-8 mx-auto place-items-center rounded-md bg-sidebar-accent/60 text-[10px] font-bold text-sidebar-foreground">
            LS
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
