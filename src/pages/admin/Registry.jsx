import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserPlus,
  Fingerprint,
  Mail,
  Phone,
  BookOpen,
  Layers,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { hodService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import StudentDirectory from "./StudentDirectory";
import SupervisorDirectory from "./SupervisorDirectory";

export default function Registry() {
  const [activeTab, setActiveTab] = useState("student");
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const location = useLocation();
  const directorySectionRef = useRef(null);
  const pendingScrollRef = useRef(null);

  // Sidebar links to Personnel Registry with #students / #supervisors.
  // When the hash changes, switch to the matching tab and flag that we
  // still need to scroll to it once that tab's content has rendered.
  useEffect(() => {
    const hash = location.hash.replace("#", "");

    if (hash === "students") {
      pendingScrollRef.current = "students";
      setActiveTab("student");
    } else if (hash === "supervisors") {
      pendingScrollRef.current = "supervisors";
      setActiveTab("supervisor");
    }
  }, [location.hash]);

  // Once the tab matching the pending hash has actually rendered,
  // scroll to it smoothly. Manual tab clicks never set pendingScrollRef,
  // so they never trigger a scroll here.
  useEffect(() => {
    if (!pendingScrollRef.current) return;

    const expectedId = activeTab === "student" ? "students" : "supervisors";
    if (pendingScrollRef.current !== expectedId) return;

    const el = document.getElementById(expectedId);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    pendingScrollRef.current = null;
  }, [activeTab]);

  // Fetch batches for the dropdown on mount
  const loadBatches = async () => {
    try {
      const data = await hodService.getBatches();
      if (data?.success) {
        setBatches(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load batches", err);
      toast.error("BATCH_REGISTRY_OFFLINE");
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response =
        activeTab === "student"
          ? await hodService.addStudent(payload)
          : await hodService.addSupervisor(payload);

      if (response?.success) {
        setResult(response.data);
        toast.success(`${activeTab.toUpperCase()}_REGISTERED_SUCCESS`);
        e.target.reset();
      }
    } catch (err) {
      toast.error(err.message || "REGISTRATION_FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans overflow-x-hidden">
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-[0.1em] uppercase">
            <span className="text-primary">
              {" "}
              Personnel <span className="text-primary">Registry</span>
            </span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase mt-2 text-muted-foreground font-bold">
            Mode:{" "}
            {activeTab === "student"
              ? "CANDIDATE_ENROLLMENT"
              : "FACULTY_PROVISIONING"}{" "}
            • Protocol: SECURE
          </p>
        </div>
        <Button
          onClick={loadBatches}
          variant="outline"
          className="rounded-none uppercase text-[10px] tracking-widest bg-white h-10 px-6"
        >
          <RefreshCw className="mr-2 h-3 w-3" />
          Refresh Registry
        </Button>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* TABS */}
        <div className="flex gap-8 border-b border-border mb-12">
          {[
            { id: "student", label: "Students", icon: Users },
            { id: "supervisor", label: "Supervisors", icon: UserCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setResult(null);
              }}
              className={`pb-4 text-[10px] tracking-[0.4em] uppercase font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              } flex items-center gap-2`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FORM SECTION */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeTab === "student" ? (
                  <>
                    <div className="space-y-2 lg:col-span-2 min-w-0">
                      <Label text="Full Name" icon={Users} />
                      <Input
                        name="name"
                        placeholder="Wellesley C Bailey"
                        required
                        className="w-full rounded-none border-border h-12 uppercase text-xs tracking-wider"
                      />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <Label text="Register Number" icon={Fingerprint} />
                      <Input
                        name="register_number"
                        placeholder="2543141"
                        required
                        className="w-full rounded-none border-border h-12 uppercase text-xs tracking-wider"
                      />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <Label text="Discipline" icon={BookOpen} />
                      <Input
                        name="discipline"
                        placeholder="COmputer Science"
                        required
                        className="w-full rounded-none border-border h-12 uppercase text-xs tracking-wider"
                      />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <Label text="University Email" icon={Mail} />
                      <Input
                        name="university_email"
                        type="email"
                        placeholder="@bcah.christuniversity.in"
                        required
                        className="w-full rounded-none border-border h-12 text-xs"
                      />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <Label text="Personal Email" icon={Mail} />
                      <Input
                        name="personal_email"
                        type="email"
                        placeholder="@gmail.com"
                        required
                        className="w-full rounded-none border-border h-12 text-xs"
                      />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <Label text="Campus" icon={Layers} />
                      <Input
                        name="campus"
                        placeholder="Campus"
                        required
                        className="w-full rounded-none border-border h-12 uppercase text-xs tracking-wider"
                      />
                    </div>
                    <div className="space-y-2 min-w-0">
                      <Label text="Batch Selection" icon={Layers} />
                      <select
                        name="batch_id"
                        required
                        className="w-full h-12 border border-border bg-transparent px-3 text-[10px] tracking-[0.2em] uppercase outline-none focus:ring-1 focus:ring-primary transition-all rounded-none"
                      >
                        <option value="">-- SELECT_BATCH --</option>
                        {batches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.year})
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2 lg:col-span-2 min-w-0">
                      <Label text="Full Name" icon={Users} />
                      <Input
                        name="name"
                        placeholder="E.G. DR. ADA LOVELACE"
                        required
                        className="w-full rounded-none border-border h-12 uppercase text-xs tracking-wider"
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-2 min-w-0">
                      <Label text="Official Email" icon={Mail} />
                      <Input
                        name="email"
                        type="email"
                        placeholder="FACULTY@INSTITUTION.EDU"
                        required
                        className="w-full rounded-none border-border h-12 text-xs"
                      />
                    </div>
                    <div className="space-y-2 lg:col-span-2 min-w-0">
                      <Label text="Mobile Number" icon={Phone} />
                      <Input
                        name="mobile"
                        placeholder="+91 XXXXX XXXXX"
                        required
                        className="w-full rounded-none border-border h-12 text-xs"
                      />
                    </div>
                  </>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-none bg-primary hover:bg-primary/90 text-white uppercase text-[10px] tracking-[0.4em] font-bold shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                Commit to Registry
              </Button>
            </form>
          </div>

          {/* SIDEBAR / RESULT SECTION */}
          <div className="lg:col-span-5">
            {result ? (
              <div className="bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/20 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-2 mb-6 border-b border-white/20 pb-4">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                  <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold text-white">
                    Registration Success
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/60 mb-1">
                      Generated Password
                    </p>
                    <div className="bg-white/10 p-4 border border-white/20 backdrop-blur-sm">
                      <code className="text-xl font-mono tracking-wider text-white">
                        {result.password}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-black/10 p-4">
                    <ShieldCheck className="h-4 w-4 text-white mt-1 shrink-0" />
                    <p className="text-[11px] leading-relaxed text-white/80 italic font-light">
                      Personnel record has been encrypted and synchronized. An
                      automated onboarding mail has been dispatched to the
                      personal email address provided.
                    </p>
                  </div>

                  <Button
                    onClick={() => setResult(null)}
                    variant="link"
                    className="p-0 h-auto text-white underline decoration-white/30 hover:decoration-white text-[10px] uppercase tracking-widest font-bold"
                  >
                    Register Another Record
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border border-border p-8 bg-card flex flex-col items-center justify-center text-center h-full min-h-[400px] border-dashed">
                <div className="bg-accent/10 p-4 rounded-full mb-6">
                  <Fingerprint className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-muted-foreground mb-2">
                  Awaiting Input
                </h3>
                <p className="text-[10px] leading-relaxed text-muted-foreground/60 max-w-[200px] uppercase tracking-tight">
                  Enter student details to initiate the registration process.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* DIRECTORY SECTION — anchor target for sidebar nav (#students / #supervisors) */}
        <div
          ref={directorySectionRef}
          id={activeTab === "student" ? "students" : "supervisors"}
          className="mt-16 scroll-mt-24"
        >
          {activeTab === "student" ? (
            <StudentDirectory embedded />
          ) : (
            <SupervisorDirectory embedded />
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ text, icon: Icon }) {
  return (
    <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-bold flex items-center gap-2">
      <Icon className="h-3 w-3 text-primary/40" />
      {text}
    </label>
  );
}