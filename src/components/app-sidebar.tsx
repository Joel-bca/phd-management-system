"use client";

import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { SIDEBAR_ROUTES } from "@/router/routeConfig";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, Shield } from "lucide-react";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Filters groups based on the logged-in user's role
  const filteredGroups = SIDEBAR_ROUTES.filter((group) =>
    group.checkAccess(user),
  );

  return (
    <Sidebar collapsible="icon" {...props} className="border-r-0 shadow-xl">
      {/* Institutional Branding Header */}
      <SidebarHeader className="h-16 flex flex-row items-center gap-3 px-4 shrink-0 bg-sidebar/50 backdrop-blur-md border-b">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 p-1.5 transition-transform duration-300 hover:rotate-12">
          <img
            src="/phd-logo.svg"
            alt="PHD Logo"
            className="h-full w-full object-contain brightness-0 invert"
          />
        </div>
        <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-bold leading-none tracking-tight text-foreground">
            PHD Management
          </span>
          <span className="text-[10px] text-primary font-semibold mt-1 uppercase tracking-wider">
            Research Portal
          </span>
        </div>
      </SidebarHeader>

      {/* Role-Based Navigation Menu */}
      <SidebarContent className="py-2 gap-4">
        {filteredGroups.map((group, groupIdx) => (
          <SidebarGroup key={`${group.group}-${groupIdx}`}>
            <SidebarGroupLabel className="px-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 group-data-[collapsible=icon]:hidden">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1 px-2">
                {group.items.map((item, itemIdx) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={`${item.path}-${itemIdx}`}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        className={`
                          h-11 transition-all duration-200 rounded-lg
                          ${
                            isActive
                              ? "bg-primary/10 text-primary font-semibold shadow-sm"
                              : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
                          }
                        `}
                      >
                        <NavLink 
                          to={item.path} 
                          className="flex items-center gap-3 w-full h-full"
                        >
                          {Icon && (
                            <Icon
                              className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                                isActive ? "text-primary" : "text-muted-foreground"
                              }`}
                            />
                          )}
                          <span className="text-sm group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>


      <SidebarFooter className="p-4 border-t bg-sidebar/30 backdrop-blur-sm">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={`
                h-11 transition-all duration-200 rounded-lg mb-1
                ${location.pathname === "/policy" 
                  ? "bg-primary/10 text-primary font-semibold shadow-sm" 
                  : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"}
              `}
            >
              <NavLink to="/policy" className="flex items-center gap-3 w-full h-full">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                  Data Policy
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="h-11 w-full justify-start gap-3 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

