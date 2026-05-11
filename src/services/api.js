export const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error(
      `PROTOCOL_ERROR: Server returned non-JSON response (${response.status})`,
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || `An error occurred (${response.status})`,
    );
  }

  return data;
};

export const hodService = {
  getUsers: (role) => apiFetch(`/hod/users?role=${role}`),
  addStudent: (data) =>
    apiFetch("/hod/student", { method: "POST", body: JSON.stringify(data) }),
  addSupervisor: (data) =>
    apiFetch("/hod/supervisor", { method: "POST", body: JSON.stringify(data) }),
  assignSupervisor: (data) =>
    apiFetch("/hod/assign", { method: "POST", body: JSON.stringify(data) }),
  bulkStudents: (data) =>
    apiFetch("/hod/bulk/students", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  bulkSupervisors: (data) =>
    apiFetch("/hod/bulk/supervisors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getSystemManifest: () => apiFetch("/hod/manifest"),
  getFailedLogins: () => apiFetch("/hod/failed-logins"),
  getBatches: () => apiFetch("/hod/batches"),
  addBatch: (data) =>
    apiFetch("/hod/batch", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        year: parseInt(data.year),
        cycle: parseInt(data.cycle),
      }),
    }),
  getMeetingHistory: () => apiFetch("/hod/meetings/history"),
};

export const meetingService = {
  getMeetings: () => apiFetch("/meetings"),
  createMeeting: (data) =>
    apiFetch("/meetings", { method: "POST", body: JSON.stringify(data) }),
  updateMeeting: (id, data) =>
    apiFetch(`/meetings/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMeeting: (id) => apiFetch(`/meetings/${id}`, { method: "DELETE" }),
};

export const studentService = {
  // Fetches student info + profiles + supervisor mapping
  getProfile: () => apiFetch("/student/profile"),

  // Updates only editable contact fields
  updateContact: (data) =>
    apiFetch("/student/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Fetches RAH (Research Advisory Health) meetings for the logged-in student
  getRAHMeetings: () => apiFetch("/student/meetings"),
};

export const supervisorService = {
  // Fetches students assigned to the logged-in supervisor
  getMyStudents: () => apiFetch("/supervisor/my-students"),
};

export const systemService = {
  // Fetches system version and build information
  getManifest: () => apiFetch("/system/manifest"),
};
