// frontend/src/components/hod/ProvisionSuccessModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function ProvisionSuccessModal({ isOpen, onClose, data }) {
  if (!data) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("CREDENTIAL_COPIED");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-none border-border max-w-md bg-card p-10 selection:bg-primary/20">
        <DialogHeader className="items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl tracking-[0.3em] uppercase font-medium">
            Provision_Successful
          </DialogTitle>
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-2 font-bold">
            Protocol:{" "}
            {data.role === "student" ? "STU_ONBOARD_v2" : "FAC_ONBOARD_v2"}
          </p>
        </DialogHeader>

        <div className="mt-8 space-y-6">
          <div className="p-6 bg-accent/5 border border-border space-y-5">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] tracking-widest uppercase text-muted-foreground font-black">
                Authorized Login ID
              </span>
              <span className="text-xs font-mono font-bold">{data.email}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] tracking-widest uppercase text-muted-foreground font-black">
                Temporal Access Key
              </span>
              <div className="flex items-center justify-between bg-white/50 p-2 border border-dashed border-primary/30">
                <span className="text-lg font-mono font-bold text-primary tracking-tighter">
                  {data.password}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-primary hover:text-white rounded-none"
                  onClick={() => copyToClipboard(data.password)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-4 border-l-4 border-primary">
            <p className="text-[10px] leading-relaxed text-primary tracking-wide uppercase font-bold">
              Verification email dispatched. Instruct the {data.role} to use
              their University Email for initial authentication.
            </p>
          </div>

          <Button
            onClick={onClose}
            className="w-full rounded-none tracking-[0.4em] h-14 uppercase font-black bg-primary text-white hover:opacity-90 transition-all"
          >
            TERMINATE_VIEW
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
