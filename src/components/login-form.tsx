import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MdOutlineCastForEducation } from "react-icons/md";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineGavel } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// 🔥 ADDED: pull in context + the shared localStorage writer
import { useAuth } from "@/context/AuthContext"; // <-- adjust path to wherever AuthContext.jsx actually lives
import { setAuth } from "@/lib/auth"; // <-- adjust path to wherever auth.js actually lives

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔥 ADDED

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Build one consistent user object from the API response
      const authData = {
        token: data.token,
        role: data.role,
        name: data.name,
        id: data.id,
        is_hod: !!data.is_hod,
        is_coordinator: !!data.is_coordinator,
      };

      // ✅ Persist to localStorage (single place this happens now)
      setAuth(authData);

      // ✅ THE ACTUAL FIX: sync React context immediately, in the same tick.
      // Without this, AuthContext.user stays null until a full page reload
      // re-reads localStorage — which is exactly the "have to reload and
      // try again" bug.
      login(authData);

      // 🔥 Role-based redirect (Priority to HOD if they have the flag)
      if (authData.is_hod || authData.role === "hod") navigate("/admin/dashboard");
      else if (authData.role === "supervisor") navigate("/supervisor/dashboard");
      else if (authData.role === "student") navigate("/student/dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <MdOutlineCastForEducation className="mx-auto h-12 w-12" />
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your university email and password to access your
            dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">UNIVERSITY EMAIL</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@bcah.christuniversity.in"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="******"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Protected by university-grade encryption. Need an account?
                Contact{" "}
                <AlertDialog>
                  <AlertDialogTrigger className="underline hover:text-primary cursor-pointer">
                    Faculty Admin
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogHeader>
                        Administrative Contacts
                      </AlertDialogHeader>
                      <AlertDialogDescription>
                        Reach out to these admins for account setup:
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="py-2 text-sm">
                      <p>Admin Email: admin@university.edu</p>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <div className="flex items-center justify-center gap-8 mt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
          <AiOutlineGlobal className="text-lg" />
          <span>English (US)</span>
        </div>

        <a
          href="https://your-university.edu/academic-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors decoration-none"
        >
          <MdOutlineGavel className="text-lg" />
          <span>Academic Policy</span>
        </a>
      </div>
    </div>
  );
}