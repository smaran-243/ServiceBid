import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import { Link } from "react-router-dom";
import RequestCard from "../components/RequestCard.jsx";
import EmptyState from "../components/EmptyState.jsx";

function money(n) {
    return "\u20B9" + Number(n).toLocaleString("en-IN");
}

function ProviderDashboard() {
    const [email, setEmail] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [rating, setRating] = useState(null);

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
    useEffect(() => {
        apiFetch("/api/provider/bookings")
            .then((data) => {
                setBookings(data);
                if (data.length > 0) {
                    apiFetch("/api/providers/" + data[0].providerId + "/rating")
                        .then((r) => setRating(r))
                        .catch(() => {});
                }
            })
            .catch(() => setBookings([]));
    }, []);

    const completed = bookings.filter((b) => b.status === "COMPLETED");
    const totalEarned = completed.reduce((sum, b) => sum + Number(b.agreedAmount), 0);

    const perService = {};
    completed.forEach((b) => {
        perService[b.serviceName] = (perService[b.serviceName] || 0) + Number(b.agreedAmount);
    });
    const chartRows = Object.keys(perService).map((name) => ({ name, total: perService[name] }));
    const maxTotal = chartRows.length > 0 ? Math.max(...chartRows.map((r) => r.total)) : 0;

    return (
        <div>
            <h2>Provider dashboard</h2>
            <p className="muted-text">Logged in as {email}</p>
            <div className="action-row">
                <Link to="/provider/bids" className="btn-link">My bids</Link>
                <Link to="/provider/bookings" className="btn-link btn-light">My bookings</Link>
                <Link to="/provider/profile" className="btn-link btn-light">My profile</Link>
            </div>

            <h3 className="category-title">Your performance</h3>
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-number">{completed.length}</div>
                    <div className="muted-text">Completed jobs</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{money(totalEarned)}</div>
                    <div className="muted-text">Total earned</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">
                        {rating && rating.reviewCount > 0
                            ? Number(rating.averageRating).toFixed(1)
                            : "-"}
                    </div>
                    <div className="muted-text">
                        {rating && rating.reviewCount > 0
                            ? "Average rating (" + rating.reviewCount + " reviews)"
                            : "No reviews yet"}
                    </div>
                </div>
            </div>

            {chartRows.length > 0 && (
                <div className="chart-card">
                    <div className="chart-title">Earnings by service</div>
                    {chartRows.map((row) => (
                        <div key={row.name} className="bar-row">
                            <div className="bar-label">{row.name}</div>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{ width: (row.total / maxTotal) * 100 + "%" }}
                                ></div>
                            </div>
                            <div className="bar-value">{money(row.total)}</div>
                        </div>
                    ))}
                </div>
            )}

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