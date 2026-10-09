import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx";

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
                <p className="muted-text">No requests yet. Browse services to post your first one.</p>
            )}
            <div className="card-list">
                {requests.map((r) => (
                    <div key={r.id} className="item-card">
                        <div className="item-head">
                            <strong>{r.serviceName}</strong>
                            <StatusBadge status={r.status} />
                        </div>
                        <p>{r.description}</p>
                        <p className="muted-text">
                            Budget: {r.budget} | Location: {r.location} | When: {r.scheduledAt}
                        </p>
                        <Link to={"/customer/requests/" + r.id} className="card-link">View bids</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CustomerDashboard;