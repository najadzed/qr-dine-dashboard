export function setAuth(data) {
  localStorage.setItem("token", data.access);
  localStorage.setItem("role", data.role);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.clear();
  window.location.href = "/";
}
