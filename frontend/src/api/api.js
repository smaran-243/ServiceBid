const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export function saveToken(token) {
    localStorage.setItem("token", token);
}

export function getToken() {
    return localStorage.getItem("token");
}

export function removeToken() {
    localStorage.removeItem("token");
}

// Sends a request to the backend. Adds the token automatically if we have one.
export async function apiFetch(path, options = {}) {
    const headers = { "Content-Type": "application/json" };

    const token = getToken();
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const response = await fetch(BASE_URL + path, {
        ...options,
        headers: { ...headers, ...options.headers },
    });

    if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}