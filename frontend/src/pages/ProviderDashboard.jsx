import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import LogoutButton from "../components/LogoutButton.jsx";
import { Link } from "react-router-dom";

function ProviderDashboard() {
    const [email, setEmail] = useState("");
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        apiFetch("/api/me")
            .then((me) => setEmail(me.email))
            .catch(() => setEmail("unknown"));
    }, []);
    useEffect(() => {
        apiFetch("/api/provider/requests")
            .then((data) => setRequests(data))
            .catch(() => setRequests([]));
    }, []);


    return (
        <div>
            <h2>Provider dashboard</h2>
            <p>Logged in as: {email}</p>
            <p>
                <Link to="/provider/bids">My bids</Link> |{" "}
                <Link to="/provider/bookings">My bookings</Link>
            </p>
            <h3>Open requests</h3>
            {requests.length === 0 && <p>No open requests.</p>}
            <ul>
                {requests.map((r) => (
                    <li key={r.id}>
                        <strong>{r.serviceName}</strong> (by {r.customerName})<br />
                        {r.description}<br />
                        Budget: {r.budget} | Location: {r.location}<br />
                        When: {r.scheduledAt}<br />
                        <Link to={"/provider/requests/" + r.id}>Place a bid</Link>
                    </li>
                ))}
            </ul>
            <LogoutButton />
        </div>
    );
}

export default ProviderDashboard;