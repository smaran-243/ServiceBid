import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { apiFetch, getToken, removeToken } from "../api/api.js";

function ProtectedRoute({ role, children }) {
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        if (!getToken()) {
            setStatus("denied");
            return;
        }
        apiFetch("/api/me")
            .then((me) => {
                if (me.roles.includes(role)) {
                    setStatus("allowed");
                } else {
                    setStatus("denied");
                }
            })
            .catch(() => {
                removeToken();
                setStatus("denied");
            });
    }, [role]);

    if (status === "loading") return <p>Loading...</p>;
    if (status === "denied") return <Navigate to="/login" replace />;
    return children;
}

export default ProtectedRoute;