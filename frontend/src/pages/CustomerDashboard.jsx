import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import { Link } from "react-router-dom";
import RequestCard from "../components/RequestCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

function CustomerDashboard() {
    const [email, setEmail] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/api/me")
            .then((me) => setEmail(me.email))
            .catch(() => setEmail("unknown"));
    }, []);
    useEffect(() => {
        apiFetch("/api/customer/requests")
            .then((data) => setRequests(data))
            .catch(() => setRequests([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h2>Customer dashboard</h2>
            <p className="muted-text">Logged in as {email}</p>
            <div className="action-row">
                <Link to="/customer/services" className="btn-link">Browse services</Link>
                <Link to="/customer/bookings" className="btn-link btn-light">My bookings</Link>
            </div>
            <h3 className="category-title">My requests</h3>
            {loading && (
                <div className="card-list">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="skeleton skeleton-row"></div>
                    ))}
                </div>
            )}
            {!loading && requests.length === 0 && (
                <EmptyState title="No requests yet" text="Browse services to post your first one.">
                    <Link to="/customer/services" className="btn-link">Browse services</Link>
                </EmptyState>
            )}
            <div className="request-grid">
                {requests.map((r) => (
                    <RequestCard
                        key={r.id}
                        request={r}
                        showStatus={true}
                        linkTo={"/customer/requests/" + r.id}
                        linkText="View bids"
                    />
                ))}
            </div>
        </div>
    );
}

export default CustomerDashboard;