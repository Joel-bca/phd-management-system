import React, { useState, useEffect } from "react";
import { hodService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar, Plus, RefreshCw } from "lucide-react";

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newBatch, setNewBatch] = useState({
    name: "",
    year: new Date().getFullYear(),
    cycle: 1,
  });

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await hodService.getBatches();
      if (res?.success && Array.isArray(res.data)) setBatches(res.data);
    } catch (err) {
      toast.error(err.message || "FAILURE_TO_SYNC_BATCHES");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      const res = await hodService.addBatch(newBatch);
      if (res.success) {
        toast.success("BATCH_CREATED_SUCCESS");
        fetchBatches();
        setNewBatch({ name: "", year: new Date().getFullYear(), cycle: 1 });
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans selection:bg-primary/20">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-[0.2em] uppercase text-foreground m-0 leading-tight">
            <span className="text-primary">
              {" "}
              Batch <span className="text-primary">Management</span>{" "}
            </span>
          </h1>
          <p className="text-sm tracking-[0.3em] uppercase mt-2 text-muted-foreground font-light">
            Temporal Infrastructure Configuration
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={fetchBatches}
            variant="outline"
            className="rounded-[4px] border-border hover:bg-accent h-10 px-4"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Dialog>
            <DialogTrigger
              render={
                <Button className="rounded-[4px] tracking-[0.2em] uppercase text-[10px] px-6 h-10" />
              }
            >
              <Plus className="h-3 w-3 mr-2" /> New_Batch_Entry
            </DialogTrigger>

            <DialogContent className="rounded-none border-border max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-sm tracking-[0.4em] uppercase font-bold text-center">
                  Batch_Initialization
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateBatch} className="space-y-6 pt-6">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold">
                    BATCH NAME
                  </label>
                  <Input
                    placeholder="E.G. 2024_INTAKE"
                    value={newBatch.name}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, name: e.target.value })
                    }
                    className="rounded-none bg-accent/5 h-11"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold">
                      Year
                    </label>
                    <Input
                      type="number"
                      value={newBatch.year}
                      onChange={(e) =>
                        setNewBatch({
                          ...newBatch,
                          year: parseInt(e.target.value),
                        })
                      }
                      className="rounded-none bg-accent/5 h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold">
                      Cycle
                    </label>
                    <select
                      className="w-full h-11 border border-input bg-accent/5 px-3 text-[10px] tracking-[0.2em] uppercase outline-none focus:border-primary transition-all rounded-none"
                      value={newBatch.cycle}
                      onChange={(e) =>
                        setNewBatch({
                          ...newBatch,
                          cycle: parseInt(e.target.value),
                        })
                      }
                    >
                      {[1, 2, 3, 4].map((c) => (
                        <option key={c} value={c}>
                          Cycle {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-[4px] tracking-[0.4em] h-12 uppercase text-xs font-bold"
                >
                  EXECUTE_DEPLOYMENT
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="border border-border bg-card">
        <div className="p-6 border-b border-border bg-accent/5 flex justify-between items-center">
          <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-muted-foreground">
            Active_Registry
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground/50">
            {batches.length} ENTRIES
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] tracking-[0.3em] uppercase pl-8 h-12">
                Identifier
              </TableHead>
              <TableHead className="text-[10px] tracking-[0.3em] uppercase h-12">
                Year
              </TableHead>
              <TableHead className="text-[10px] tracking-[0.3em] uppercase h-12">
                Cycle
              </TableHead>
              <TableHead className="text-[10px] tracking-[0.3em] uppercase h-12">
                TIME STAMP
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-20 text-[10px] tracking-[0.5em] uppercase text-muted-foreground/30"
                >
                  Registry_Empty
                </TableCell>
              </TableRow>
            ) : (
              batches.map((batch) => (
                <TableRow
                  key={batch.id}
                  className="hover:bg-accent/10 border-border group transition-colors"
                >
                  <TableCell className="font-medium pl-8 py-6 uppercase tracking-wider text-sm">
                    {batch.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {batch.year}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-none border border-primary/20 px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase bg-primary/5 text-primary">
                      Cycle_{batch.cycle}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[10px] font-mono">
                    {new Date(batch.created_at).toISOString().split("T")[0]}
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
