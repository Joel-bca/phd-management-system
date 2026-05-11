import React from "react";
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  Info,
  Mail,
  Phone,
  ChevronLeft,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Policy() {
  const navigate = useNavigate();

  const sections = [
    {
      id: 1,
      title: "1. Introduction",
      icon: <Info className="h-5 w-5 text-primary" />,
      content:
        "We are committed to protecting your personal information and ensuring transparency in how your data is collected, used, and stored. This policy explains what data we collect, why we collect it, and how we safeguard it.",
    },
    {
      id: 2,
      title: "2. Information We Collect",
      icon: <Eye className="h-5 w-5 text-primary" />,
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Personal Information:</strong> Name, email address, mobile
            number, and institutional details
          </li>
          <li>
            <strong>Academic Information:</strong> Student records, supervisor
            assignments, and related academic data
          </li>
          <li>
            <strong>System Data:</strong> Login activity, timestamps, and usage
            logs
          </li>
        </ul>
      ),
      subtext:
        "We only collect data that is necessary to provide and improve our services. Please note that the data we have is as per the records given by the Department of Comupter Science, CHRIST (Deemed to be University).",
    },
    {
      id: 3,
      title: "3. How We Use Your Data",
      icon: <Lock className="h-5 w-5 text-primary" />,
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Managing student–supervisor relationships</li>
          <li>Providing access to the platform based on roles</li>
          <li>Ensuring system security and preventing misuse</li>
          <li>Improving system functionality and performance</li>
        </ul>
      ),
      subtext:
        "We do not sell or share your data with third parties for marketing purposes.",
    },
    {
      id: 4,
      title: "4. Data Security",
      icon: <Shield className="h-5 w-5 text-primary" />,
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Secure authentication and access controls</li>
          <li>Role-based permissions to restrict unauthorized access</li>
          <li>Monitoring and logging of suspicious activities</li>
        </ul>
      ),
      subtext:
        "While we follow best practices, no system is completely risk-free. We continuously work to improve our security measures.",
    },
    {
      id: 5,
      title: "5. Access Control",
      icon: <Lock className="h-5 w-5 text-primary" />,
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Students can only access their own data</li>
          <li>Supervisors can access data of assigned students</li>
          <li>
            Administrators (HOD) have broader access for management purposes
          </li>
        </ul>
      ),
      subtext:
        "Unauthorized access or misuse is strictly prohibited and may result in account suspension.",
    },
    {
      id: 6,
      title: "6. Data Retention",
      icon: <Calendar className="h-5 w-5 text-primary" />,
      content:
        "We retain data only for as long as necessary to maintain academic records, meet institutional or legal requirements, and ensure system integrity and auditability.",
    },
    {
      id: 7,
      title: "7. Data Loss & Risk Handling",
      icon: <AlertTriangle className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground mb-1">
              Data Loss
            </h4>
            <ul className="list-disc pl-6">
              <li>Attempt recovery using available backups</li>
              <li>Notify affected users if critical data is impacted</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground mb-1">
              Data Breach or Risk
            </h4>
            <ul className="list-disc pl-6">
              <li>Investigate and contain the issue immediately</li>
              <li>Assess the level of risk</li>
              <li>Notify affected users if required</li>
              <li>Take corrective actions to prevent recurrence</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "8. User Responsibility",
      icon: <Shield className="h-5 w-5 text-primary" />,
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Keeping login credentials secure</li>
          <li>Reporting suspicious activity immediately</li>
          <li>Ensuring accuracy of submitted data</li>
        </ul>
      ),
    },
    {
      id: 9,
      title: "9. Contact & Support",
      icon: <Mail className="h-5 w-5 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            If you believe your data is at risk, lost, or misused, please
            contact us immediately:
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-primary" />{" "}
              <a
                href="mailto:csbyc.connect@christuniversity.in?subject=Phd%20Managment%20System%20%7C%20Support%20Request&body=Helllo%20guysss"
                style={{ color: "#1e40af" }}
                className="hover:underline font-bold"
              >
                csbyc.connect@christuniversity.in
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-primary" />{" "}
              <span style={{ color: "#000000" }}>+91 99675-72xxx</span>
            </div>
          </div>
          <p className="text-xs italic text-muted-foreground">
            We aim to respond to all critical issues promptly.
          </p>
        </div>
      ),
    },
    {
      id: 10,
      title: "10. Updates to This Policy",
      icon: <Info className="h-5 w-5 text-primary" />,
      content:
        "This policy may be updated from time to time. Users will be informed of significant changes where applicable.",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-4xl mx-auto p-4 md:p-12">
        {/* HEADER */}
        <header className="mb-16 border-b border-border pb-8">
          <Button
            variant="ghost"
            className="mb-8 rounded-none hover:bg-accent -ml-4"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1
            style={{ color: "#000000" }}
            className="text-4xl md:text-6xl font-medium tracking-tight uppercase flex items-center gap-4"
          >
            <Shield className="h-10 w-10 text-primary" /> Privacy & Data Use
            Policy
          </h1>
          <p
            style={{ color: "#1e40af" }}
            className="text-[10px] tracking-[0.5em] uppercase mt-4 font-bold"
          >
            Institutional Protocol: DATSEC-2026 • Status: Active
          </p>
        </header>

        {/* POLICY CONTENT */}
        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.id} className="space-y-6">
              <div className="flex items-center gap-4 border-b border-primary/10 pb-4">
                <div className="p-2 bg-primary/5 border border-primary/10">
                  {section.icon}
                </div>
                <h2
                  style={{ color: "#000000" }}
                  className="text-xl font-bold tracking-widest uppercase"
                >
                  {section.title}
                </h2>
              </div>
              <div
                style={{ color: "#1e293b" }}
                className="text-sm leading-relaxed pl-14 text-left font-medium"
              >
                {section.content}
                {section.subtext && (
                  <p
                    style={{ color: "#1e40af", backgroundColor: "#eff6ff" }}
                    className="mt-4 p-4 border-l-2 border-blue-600 text-[11px] font-bold uppercase tracking-wider text-left"
                  >
                    {section.subtext}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>

        {/* FOOTER */}
        <footer className="mt-24 border-t border-border pt-12 pb-12 text-center">
          <p
            style={{ color: "#1e40af" }}
            className="text-[10px] tracking-[0.5em] uppercase font-black"
          >
            PhD Management System • 2026
          </p>
          <p
            style={{ color: "#000000" }}
            className="text-[10px] tracking-[0.5em] uppercase font-black mt-2"
          >
            Best Regards,
          </p>
          <p
            style={{ color: "#000000" }}
            className="text-[10px] tracking-[0.5em] uppercase font-black"
          >
            PhD Management System Team
          </p>
          <Heart className="text-red-500 inline-block mt-4" />
        </footer>
      </div>
    </div>
  );
}

function Calendar(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
