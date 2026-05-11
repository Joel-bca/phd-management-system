import { LoginForm } from "@/components/login-form";
import CurvedLoop from "@/components/ui/CurvedLoop"; // Updated path

export default function Login() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 overflow-hidden bg-background">
      {/* The Background Design 
          We place it first so it stays at the bottom z-index layer.
      */}
      <CurvedLoop text="Christ University ✦ PhD Management ✦ Research Portal ✦ " />

      <div className="relative z-10 w-full max-w-sm">
        {/* Your login-form.tsx contains its own Card, 
            so we just render the component directly here.
        */}
        <LoginForm />
      </div>
    </div>
  );
}
