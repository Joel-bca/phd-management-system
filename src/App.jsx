// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import GlobalLayout from "./components/GlobalLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";

import StudentDashboard from "./pages/student/StudentDashboard";
import SupervisorDashboard from "./pages/supervisor/SupervisorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Batches from "./pages/admin/Batches";
import Registry from "./pages/admin/Registry";
import StudentDirectory from "./pages/admin/StudentDirectory";
import SupervisorDirectory from "./pages/admin/SupervisorDirectory";
import Assignment from "./pages/admin/Assignment";
import MeetingHistory from "./pages/admin/MeetingHistory";
import Policy from "./pages/policy";

import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" expand={false} richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* All routes inside here will have the Top Bar */}
          <Route element={<GlobalLayout />}>
            {/* PUBLIC: Login Page (Shows Search Bar in Top Bar) */}

            {/* PROTECTED: Dashboards (Shows Avatar/Branding in Top Bar) */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/supervisor/dashboard"
              element={
                <ProtectedRoute allowedRoles={["supervisor"]}>
                  <SupervisorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["hod"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/batches"
              element={
                <ProtectedRoute allowedRoles={["hod"]}>
                  <Batches />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/registry"
              element={
                <ProtectedRoute allowedRoles={["hod"]}>
                  <Registry />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowedRoles={["hod"]}>
                  <StudentDirectory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/faculty"
              element={
                <ProtectedRoute allowedRoles={["hod"]}>
                  <SupervisorDirectory />
                </ProtectedRoute>
              }
            />
            <Route path="/policy" element={<Policy />} />
            <Route
              path="/admin/assignments"
              element={
                <ProtectedRoute allowedRoles={["hod"]}>
                  <Assignment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/history"
              element={
                <ProtectedRoute allowedRoles={["hod"]}>
                  <MeetingHistory />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
