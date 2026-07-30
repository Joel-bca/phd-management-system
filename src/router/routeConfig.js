import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  CalendarClock,
  FileText,
  Shield,
  ChevronRight,
} from "lucide-react";

export const UserRole = {
  STUDENT: "student",
  SUPERVISOR: "supervisor",
  HOD: "hod",
};

export const SIDEBAR_ROUTES = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    checkAccess: (user) => user?.is_hod || user?.role === UserRole.HOD,
  },

  {
    title: "Personnel",
    icon: Users,
    defaultOpen: true,
    checkAccess: (user) => user?.is_hod || user?.role === UserRole.HOD,

    children: [
      {
        title: "Registry",
        path: "/admin/registry",
        icon: Users,
      },
      {
        title: "Students",
        path: "/admin/registry#students",
        icon: GraduationCap,
      },
      {
        title: "Faculty",
        path: "/admin/registry#faculty",
        icon: Users,
      },
    ],
  },

  {
    title: "Academics",
    icon: ClipboardList,
    defaultOpen: false,
    checkAccess: (user) => user?.is_hod || user?.role === UserRole.HOD,

    children: [
      {
        title: "Assignments",
        path: "/admin/assignments",
        icon: ClipboardList,
      },
      {
        title: "Batches",
        path: "/admin/batches",
        icon: CalendarClock,
      },
    ],
  },

  {
    title: "Records",
    icon: FileText,
    defaultOpen: false,
    checkAccess: (user) => user?.is_hod || user?.role === UserRole.HOD,

    children: [
      {
        title: "RAC Logs",
        path: "/admin/history",
        icon: FileText,
      },
    ],
  },

  {
    title: "Settings",
    icon: Shield,
    defaultOpen: false,
    checkAccess: (user) => user?.is_hod || user?.role === UserRole.HOD,

    children: [
      {
        title: "Data Policy",
        path: "/policy",
        icon: Shield,
      },
    ],
  },
];