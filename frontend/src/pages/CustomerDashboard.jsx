import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import LogoutButton from "../components/LogoutButton.jsx";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx";

function CustomerDashboard() {
    const [email, setEmail] = useState("");
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        apiFetch("/api/me")
            .then((me) => setEmail(me.email))
            .catch(() => setEmail("unknown"));
    }, []);
    useEffect(() => {
        apiFetch("/api/customer/requests")
            .then((data) => setRequests(data))
            .catch(() => setRequests([]));
    }, []);

    return (
        <div>
            <h2>Customer dashboard</h2>
            <p>Logged in as: {email}</p>
            <p>
                <Link to="/customer/services">Browse services</Link> |{" "}
                <Link to="/customer/bookings">My bookings</Link>
            </p>
            <h3>My requests</h3>
            <ul>
                {requests.map((r) => (
                    <li key={r.id}>
                        <strong>{r.serviceName}</strong> <StatusBadge status={r.status} />{" "}
                        <Link to={"/customer/requests/" + r.id}>View bids</Link><br />
                        {r.description}<br />
                        Budget: {r.budget} | Location: {r.location}<br />
                        When: {r.scheduledAt}
                    </li>
                ))}
            </ul>
            <LogoutButton />
        </div>
    );
}

export default CustomerDashboard;