import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import { Link } from "react-router-dom";

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
                <p className="muted-text">
                    No open requests for your services. <Link to="/provider/profile">Tick the services you offer</Link> in your profile.
                </p>
            )}
            <div className="card-list">
                {requests.map((r) => (
                    <div key={r.id} className="item-card">
                        <div className="item-head">
                            <strong>{r.serviceName}</strong>
                            <span className="muted-text">by {r.customerName}</span>
                        </div>
                        <p>{r.description}</p>
                        <p className="muted-text">
                            Budget: {r.budget} | Location: {r.location} | When: {r.scheduledAt}
                        </p>
                        <Link to={"/provider/requests/" + r.id} className="card-link">Place a bid</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProviderDashboard;