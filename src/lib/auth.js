export const setAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("name", data.name);
};

export const getAuth = () => {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    name: localStorage.getItem("name"),
    is_hod: localStorage.getItem("is_hod") === "true",
    is_coordinator: localStorage.getItem("is_coordinator") === "true",
  };
};

export const logout = () => {
  localStorage.clear();
};  