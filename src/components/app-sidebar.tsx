"use client";

import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  ChevronRight,
  LogOut,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { SIDEBAR_ROUTES } from "@/router/routeConfig";
import { useAuth } from "@/context/AuthContext";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const { user, logout } = useAuth();

  const routes = SIDEBAR_ROUTES.filter((item) =>
    item.checkAccess(user)
  );

  const isSectionActive = (section: any) =>
    section.children?.some((child: any) =>
      location.pathname.startsWith(child.path)
    );

  return (
    <Sidebar
      collapsible="icon"
      className="border-r bg-sidebar"
      {...props}
    >

      {/* Header */}

      <SidebarHeader className="h-16 border-b px-4 flex items-center">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">

            <img
              src="/phd-logo.svg"
              alt="logo"
              className="h-7 w-7 brightness-0 invert"
            />

          </div>

          <div className="group-data-[collapsible=icon]:hidden">

            <p className="font-semibold text-sm">
              PHD Management
            </p>

            <p className="text-xs text-muted-foreground">
              Research Portal
            </p>

          </div>

        </div>

      </SidebarHeader>

      <SidebarContent>

        <SidebarGroup>

          <SidebarMenu>
            {/* Dashboard */}

            {routes
              .filter((item) => !item.children)
              .map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className="h-11 rounded-lg"
                    >
                      <NavLink to={item.path} className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

            {/* Expandable Sections */}

            {routes
              .filter((item) => item.children)
              .map((section) => {
                const SectionIcon = section.icon;

                return (
                  <Collapsible
                    key={section.title}
                    defaultOpen={
                      section.defaultOpen || isSectionActive(section)
                    }
                  >
                    <SidebarMenuItem>

                      <CollapsibleTrigger
                        render={
                          <SidebarMenuButton
                            tooltip={section.title}
                            className="h-11 rounded-lg group/collapsible"
                          />
                        }
                      >

                        <SectionIcon className="h-4 w-4 shrink-0" />

                        <span className="flex-1 text-left group-data-[collapsible=icon]:hidden">
                          {section.title}
                        </span>

                        <ChevronRight
                          className="
                  h-4
                  w-4
                  transition-transform
                  duration-200
                  group-data-[panel-open]/collapsible:rotate-90
                  group-data-[collapsible=icon]:hidden
                "
                        />

                      </CollapsibleTrigger>

                      <CollapsibleContent>

                        <SidebarMenu className="mt-1 ml-5 border-l pl-3 gap-1">

                          {section.children.map((child) => {
                            const ChildIcon = child.icon;

                            const active = location.pathname.startsWith(
                              child.path
                            );

                            return (
                              <SidebarMenuItem key={child.path}>

                                <SidebarMenuButton
                                  asChild
                                  isActive={active}
                                  tooltip={child.title}
                                  className="h-10 rounded-md"
                                >
                                  <NavLink
                                    to={child.path}
                                    className="flex items-center gap-3"
                                  >
                                    <ChildIcon className="h-4 w-4 shrink-0" />

                                    <span className="group-data-[collapsible=icon]:hidden">
                                      {child.title}
                                    </span>

                                  </NavLink>

                                </SidebarMenuButton>

                              </SidebarMenuItem>
                            );
                          })}

                        </SidebarMenu>

                      </CollapsibleContent>

                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}

          </SidebarMenu>

        </SidebarGroup>

      </SidebarContent>

      {/* Footer */}

      <SidebarFooter className="border-t p-2">

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton
              onClick={logout}
              tooltip="Logout"
              className="h-11 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />

              <span className="group-data-[collapsible=icon]:hidden">
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