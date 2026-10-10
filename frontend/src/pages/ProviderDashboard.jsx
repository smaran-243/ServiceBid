import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import { Link } from "react-router-dom";
import RequestCard from "../components/RequestCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

function ProviderDashboard() {
    const [email, setEmail] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/api/me")
            .then((me) => setEmail(me.email))
            .catch(() => setEmail("unknown"));
    }, []);
    useEffect(() => {
        apiFetch("/api/provider/requests")
            .then((data) => setRequests(data))
            .catch(() => setRequests([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h2>Provider dashboard</h2>
            <p className="muted-text">Logged in as {email}</p>
            <div className="action-row">
                <Link to="/provider/bids" className="btn-link">My bids</Link>
                <Link to="/provider/bookings" className="btn-link btn-light">My bookings</Link>
                <Link to="/provider/profile" className="btn-link btn-light">My profile</Link>
            </div>
            <h3 className="category-title">Open requests</h3>
            {loading && (
                <div className="card-list">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="skeleton skeleton-row"></div>
                    ))}
                </div>
            )}
            {!loading && requests.length === 0 && (
                <EmptyState title="No open requests" text="Tick the services you offer in your profile to see matching requests.">
                    <Link to="/provider/profile" className="btn-link">Open my profile</Link>
                </EmptyState>
            )}
            <div className="request-grid">
                {requests.map((r) => (
                    <RequestCard
                        key={r.id}
                        request={r}
                        showStatus={false}
                        linkTo={"/provider/requests/" + r.id}
                        linkText="Place a bid"
                    />
                ))}
            </div>
        </div>
    );
}

export default ProviderDashboard;