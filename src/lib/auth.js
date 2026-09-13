export const setAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("name", data.name);
  localStorage.setItem("id", data.id);
  localStorage.setItem("is_hod", data.is_hod ? "true" : "false");
  localStorage.setItem("is_coordinator", data.is_coordinator ? "true" : "false");
};

export const getAuth = () => {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    name: localStorage.getItem("name"),
    id: localStorage.getItem("id"),
    is_hod: localStorage.getItem("is_hod") === "true",
    is_coordinator: localStorage.getItem("is_coordinator") === "true",
  };
};

export const logout = () => {
  localStorage.clear();
};