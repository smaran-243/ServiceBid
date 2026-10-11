import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { apiFetch, getToken, removeToken } from "../api/api.js";

function ProtectedRoute({ role, children }) {
    const [status, setStatus] = useState(() => (getToken() ? "loading" : "denied"));

    useEffect(() => {
        if (!getToken()) return;
        apiFetch("/api/me")
            .then((me) => {
                if (me.roles && me.roles.includes(role)) {
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

    if (status === "loading") {
        return (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <div className="skeleton skeleton-row" style={{ maxWidth: 400, margin: "0 auto" }}></div>
            </div>
        );
    }
    if (status === "denied") return <Navigate to="/login" replace />;
    return children;
}

export default ProtectedRoute;