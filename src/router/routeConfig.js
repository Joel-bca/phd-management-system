import {
  LayoutDashboard,
  FileText,
  Users,
  CalendarClock,
  Milestone,
  Link,
} from "lucide-react";

export const UserRole = {
  STUDENT: "student",
  SUPERVISOR: "supervisor",
  HOD: "hod",
};

export const SIDEBAR_ROUTES = [
  {
    group: "Student Portal",
    checkAccess: (user) => user?.role === UserRole.STUDENT,
    items: [
      {
        title: "Dashboard",
        path: "/student/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "Supervisor Panel",
    checkAccess: (user) => user?.role === UserRole.SUPERVISOR,
    items: [
      {
        title: "Overview",
        path: "/supervisor/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "Department Management",
    checkAccess: (user) => user?.is_hod || user?.role === UserRole.HOD,
    items: [
      {
        title: "HOD Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Registry",
        path: "/admin/registry",
        icon: Users,
      },
      {
        title: "Assignments",
        path: "/admin/assignments",
        icon: Link,
      },
      {
        title: "Batches",
        path: "/admin/batches",
        icon: CalendarClock,
      },
      {
        title: "RAH Logs",
        path: "/admin/history",
        icon: FileText,
      },
      {
        title: "Student Directory",
        path: "/admin/students",
        icon: Users,
      },
      {
        title: "Faculty List",
        path: "/admin/faculty",
        icon: Milestone,
      },
    ],
  },
];
