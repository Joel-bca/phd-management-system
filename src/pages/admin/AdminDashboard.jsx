import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Layers,
  Activity,
  RefreshCw,
  ShieldAlert,
  MessageSquare,
  Lock,
} from "lucide-react";
import { hodService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import LiveMonitor from "../../components/hod/LiveMonitor";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [batches, setBatches] = useState([]);
  const [manifest, setManifest] = useState({
    version_code: "---",
    motd_message: "Syncing...",
  });
  const [failedAttempts, setFailedAttempts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString("en-GB", { hour12: false });
    setLogs((prev) => [{ timestamp, message, type }, ...prev].slice(0, 15));
  };

  const fetchData = async () => {
    setLoading(true);

    // STEP 1: Fetch System Info (These usually work without RLS issues)
    try {
      const v = await hodService.getSystemManifest();
      if (v?.success) setManifest(v.data);

      const f = await hodService.getFailedLogins();
      if (f?.success) setFailedAttempts(f.data || []);

      addLog("System telemetry received", "success");
    } catch (err) {
      console.error("System Fetch Error:", err);
      addLog("System telemetry partially offline", "error");
    }

    // STEP 2: Fetch User Data (The parts likely causing the 400 error)
    try {
      const s = await hodService.getUsers("student");
      if (s?.success) setStudents(s.data || []);

      const sp = await hodService.getUsers("supervisor");
      if (sp?.success) setSupervisors(sp.data || []);

      const b = await hodService.getBatches();
      if (b?.success) setBatches(b.data || []);
    } catch (err) {
      console.error("User Data Error:", err);
      // We don't crash the whole UI if users fail, just log it.
      addLog("User directory sync failed (Check RLS)", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-[0.1em] uppercase">
            <span className="text-primary">
              Administrative <span className="text-primary">Portal</span>
            </span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase mt-2 text-muted-foreground font-bold">
            Node: {manifest.version_code} • Protocol:{" "}
            {loading ? "Syncing..." : "Active"}
          </p>
        </div>
        <Button
          onClick={fetchData}
          variant="outline"
          className="rounded-none uppercase text-[10px] tracking-widest bg-white h-10 px-6"
        >
          <RefreshCw
            className={`mr-2 h-3 w-3 ${loading ? "animate-spin" : ""}`}
          />
          Force Sync
        </Button>
      </header>

      {/* STATS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-border mb-12 bg-card overflow-hidden">
        {[
          { label: "Candidates", value: students.length, icon: Users },
          { label: "Faculty", value: supervisors.length, icon: UserCheck },
          { label: "Batches", value: batches.length, icon: Layers },
          {
            label: "Security",
            value: failedAttempts.length > 5 ? "ALERT" : "SECURE",
            icon: ShieldAlert,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-6 border-b sm:border-b-0 sm:border-r border-border last:border-0 h-32 flex flex-col justify-between hover:bg-accent/5"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold">
              {stat.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-light tabular-nums ${stat.label === "Security" && failedAttempts.length > 5 ? "text-destructive" : ""}`}
              >
                {stat.value}
              </span>
              <stat.icon className="h-4 w-4 text-primary/30" />
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-transparent mb-12 border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
          {["overview", "directory"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary px-0 pb-4 text-[10px] tracking-[0.4em] uppercase font-bold"
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* NO BOX-WITHIN-A-BOX HERE */}
            <div className="lg:col-span-8 h-[500px]">
              <LiveMonitor logs={logs} />
            </div>

            <div className="lg:col-span-4 space-y-8">
              {/* ANNOUNCEMENT BOX */}
              <div className="bg-primary p-8 text-primary-foreground shadow-lg shadow-primary/10">
                <div className="flex items-center gap-2 mb-4 opacity-80 text-white">
                  <MessageSquare className="h-3 w-3" />
                  <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold">
                    System Broadcast
                  </h3>
                </div>
                <p className="text-sm leading-relaxed font-light italic text-white/90">
                  "{manifest.motd_message}"
                </p>
              </div>

              {/* FAILED LOGINS */}
              <div className="border border-border p-6 bg-card">
                <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                  <Lock className="h-3 w-3 text-destructive" />
                  <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-destructive">
                    Access Alerts
                  </h3>
                </div>
                <div className="space-y-4 max-h-[200px] overflow-y-auto no-scrollbar">
                  {failedAttempts.length === 0 ? (
                    <p className="text-[9px] text-muted-foreground uppercase text-center py-4">
                      Status: Clear
                    </p>
                  ) : (
                    failedAttempts.map((a, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border-b border-border/50 pb-2"
                      >
                        <span className="text-[10px] font-mono truncate max-w-[140px]">
                          {a.email}
                        </span>
                        <span className="bg-destructive/10 text-destructive text-[9px] px-2 py-0.5 font-bold tabular-nums border border-destructive/10">
                          {a.attempt_count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
