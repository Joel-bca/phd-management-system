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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ Store auth
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      localStorage.setItem("id", data.id);
      localStorage.setItem("is_hod", data.is_hod ? "true" : "false");
      localStorage.setItem(
        "is_coordinator",
        data.is_coordinator ? "true" : "false",
      );

      // 🔥 Role-based redirect (Priority to HOD if they have the flag)
      if (data.is_hod || data.role === "hod") navigate("/admin/dashboard");
      else if (data.role === "supervisor") navigate("/supervisor/dashboard");
      else if (data.role === "student") navigate("/student/dashboard");
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
          {/* 🔥 CONNECTED FORM */}
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
                Contact {/* Change Dialog to AlertDialog */}
                <AlertDialog>
                  {/* Change DialogTrigger to AlertDialogTrigger */}
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
          href="https://your-university.edu/academic-policy" // Replace with your actual link
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
