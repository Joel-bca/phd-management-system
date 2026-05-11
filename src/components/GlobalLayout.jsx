import { Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppSidebar from "./app-sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Bell, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { systemService } from "@/services/api";
import SystemManifestModal from "./SystemManifestModal";
import { toast } from "sonner";
import React, { useState } from "react";

export default function GlobalLayout() {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === "/";
  const [manifest, setManifest] = useState(null);
  const [showManifest, setShowManifest] = useState(false);

  const handleOpenManifest = async () => {
    try {
      const res = await systemService.getManifest();
      if (res.success) {
        setManifest(res.data);
        setShowManifest(true);
      } else {
        toast.error("MANIFEST_RETRIEVAL_FAILED");
      }
    } catch (err) {
      toast.error("SYSTEM_COMM_ERROR");
    }
  };

  // Public route handling
  if (isLoginPage)
    return (
      <main className="w-full">
        <Outlet />
      </main>
    );

  // Protected route handling: Redirect to login if not authenticated
  if (!isLoggedIn) return <Navigate to="/" replace />;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* Only show sidebar if user and role are loaded */}
        {isLoggedIn && user?.role && <AppSidebar />}

        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>

            <div className="flex items-center gap-4 px-4">
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                  onClick={handleOpenManifest}
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => navigate("/policy")}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l">
                <div className="flex flex-col items-end hidden lg:flex">
                  <span className="text-sm font-medium leading-none">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase mt-1">
                    {user?.role}
                  </span>
                </div>
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 bg-muted/5">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
      {showManifest && (
        <SystemManifestModal 
          manifest={manifest} 
          onClose={() => setShowManifest(false)} 
        />
      )}
    </SidebarProvider>
  );
}
