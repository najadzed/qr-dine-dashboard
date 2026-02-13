const API_BASE = "https://qr-dine-backend-xbja.onrender.com/api";

export async function authFetch(url, options = {}) {
  const res = await fetch(API_BASE + url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) throw new Error("API Error");

  return res.json();
}
