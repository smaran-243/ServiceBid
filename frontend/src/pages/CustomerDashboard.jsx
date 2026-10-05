import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import LogoutButton from "../components/LogoutButton.jsx";

function CustomerDashboard() {
    const [email, setEmail] = useState("");

    useEffect(() => {
        apiFetch("/api/me")
            .then((me) => setEmail(me.email))
            .catch(() => setEmail("unknown"));
    }, []);

    return (
        <div>
            <h2>Customer dashboard</h2>
            <p>Logged in as: {email}</p>
            <LogoutButton />
        </div>
    );
}

export default CustomerDashboard;