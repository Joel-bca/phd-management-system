import React, { useEffect, useState } from "react";
import {
  UserCheck,
  Search,
  RefreshCw,
  Mail,
  Phone,
  ShieldCheck,
  MoreHorizontal,
  FileText,
  User,
} from "lucide-react";
import { hodService } from "../../services/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function SupervisorDirectory() {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadSupervisors = async () => {
    setLoading(true);
    try {
      const res = await hodService.getUsers("supervisor");
      if (res?.success) {
        setSupervisors(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load supervisors", err);
      toast.error("FACULTY_DIRECTORY_OFFLINE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupervisors();
  }, []);

  const filteredSupervisors = supervisors.filter(
    (sup) =>
      sup.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-[0.1em] uppercase">
            <span className="text-primary">
              Supervisors <span className="">Directory</span>
            </span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase mt-2 text-muted-foreground font-bold">
            Catalog: SUPERVISORS • System: ACTIVE • Encryption: AES-256
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={loadSupervisors}
            variant="outline"
            className="rounded-none uppercase text-[10px] tracking-widest bg-white h-10 px-6"
          >
            <RefreshCw
              className={`mr-2 h-3 w-3 ${loading ? "animate-spin" : ""}`}
            />
            Sync Nexus
          </Button>
        </div>
      </header>

      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH_BY_FACULTY_NAME_OR_EMAIL..."
            className="w-full bg-card border border-border h-11 pl-10 pr-4 text-[10px] tracking-[0.2em] uppercase outline-none focus:ring-1 focus:ring-primary transition-all rounded-none"
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="border border-border bg-card">
        <Table>
          <TableHeader className="bg-accent/5">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] tracking-[0.3em] uppercase pl-8 h-14 font-bold text-muted-foreground">
                Faculty Name
              </TableHead>
              <TableHead className="text-[10px] tracking-[0.3em] uppercase h-14 font-bold text-muted-foreground">
                Contact Information
              </TableHead>
              <TableHead className="text-[10px] tracking-[0.3em] uppercase h-14 font-bold text-muted-foreground">
                Authentication
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell colSpan={4} className="h-16 pl-8">
                    <div className="h-3 bg-accent/20 w-1/3 rounded-none" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredSupervisors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/40 font-bold">
                    {searchQuery
                      ? "No_Matches_Found"
                      : "Registry_Empty_Awaiting_Data"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredSupervisors.map((sup) => (
                <TableRow
                  key={sup.id}
                  className="border-border hover:bg-accent/5 group transition-colors"
                >
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-none border border-primary/20">
                        <UserCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wider uppercase">
                          {sup.name || "IDENTITY_UNKNOWN"}
                        </p>
                        <p className="text-[9px] text-muted-foreground font-mono mt-0.5">
                          {sup.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span className="text-[10px] font-mono">
                        {sup.mobile || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3 text-primary/60" />
                      <span className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground">
                        SECURED
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
