import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import { Link } from "react-router-dom";
import RequestCard from "../components/RequestCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Icon from "../components/Icon.jsx";
import CountUp from "../components/CountUp.jsx";

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
            .then((me) => setEmail(me.email || me.name || "Provider"))
            .catch(() => setEmail("Provider"));
    }, []);

    useEffect(() => {
        apiFetch("/api/provider/requests")
            .then((data) => setRequests(data || []))
            .catch(() => setRequests([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        apiFetch("/api/provider/bookings")
            .then((data) => {
                const list = data || [];
                setBookings(list);
                if (list.length > 0) {
                    apiFetch("/api/providers/" + list[0].providerId + "/rating")
                        .then((r) => setRating(r))
                        .catch(() => {});
                }
            })
            .catch(() => setBookings([]));
    }, []);

    const completed = bookings.filter((b) => b.status === "COMPLETED");
    const activeBookings = bookings.filter((b) => b.status === "BID_ACCEPTED" || b.status === "CONFIRMED" || b.status === "IN_PROGRESS");
    const totalEarned = completed.reduce((sum, b) => sum + Number(b.agreedAmount), 0);

    const perService = {};
    completed.forEach((b) => {
        perService[b.serviceName] = (perService[b.serviceName] || 0) + Number(b.agreedAmount);
    });
    const chartRows = Object.keys(perService).map((name) => ({ name, total: perService[name] }));
    const maxTotal = chartRows.length > 0 ? Math.max(...chartRows.map((r) => r.total)) : 0;

    return (
        <div className="page-enter">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
                <div>
                    <h2>Provider Dashboard</h2>
                    <p className="muted-text">Professional Account: {email}</p>
                </div>
                <div className="action-row" style={{ margin: 0 }}>
                    <Link to="/provider/bids" className="btn-link">
                        <Icon name="tag" size={16} /> My Bids
                    </Link>
                    <Link to="/provider/bookings" className="btn-link btn-light">
                        <Icon name="bookings" size={16} /> Bookings ({activeBookings.length})
                    </Link>
                    <Link to="/provider/profile" className="btn-link btn-light">
                        <Icon name="users" size={16} /> My Profile
                    </Link>
                </div>
            </div>

            {/* Performance Stat Cards */}
            <h3 className="category-title">Performance & Earnings</h3>
            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon"><Icon name="check" /></div>
                    <div className="stat-number">
                        <CountUp value={completed.length} />
                    </div>
                    <div className="muted-text">Completed Jobs</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon"><Icon name="money" /></div>
                    <div className="stat-number">
                        <CountUp value={totalEarned} format={(n) => money(Math.round(n))} />
                    </div>
                    <div className="muted-text">Total Revenue Earned</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon"><Icon name="star" /></div>
                    <div className="stat-number">
                        {rating && rating.reviewCount > 0 ? (
                            <CountUp value={Number(rating.averageRating)} format={(n) => n.toFixed(1)} />
                        ) : (
                            "-"
                        )}
                    </div>
                    <div className="muted-text">
                        {rating && rating.reviewCount > 0
                            ? "Average Rating (" + rating.reviewCount + " reviews)"
                            : "No reviews yet"}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon"><Icon name="bookings" /></div>
                    <div className="stat-number" style={{ color: "var(--info)" }}>
                        <CountUp value={activeBookings.length} />
                    </div>
                    <div className="muted-text">Active In-Progress Jobs</div>
                </div>
            </div>

            {/* Earnings Breakdown Chart */}
            {chartRows.length > 0 && (
                <div className="chart-card">
                    <div className="chart-title">Revenue by Service Category</div>
                    {chartRows.map((row) => (
                        <div key={row.name} className="bar-row">
                            <div className="bar-label">{row.name}</div>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{ width: ((row.total / maxTotal) * 100) + "%" }}
                                ></div>
                            </div>
                            <div className="bar-value">{money(row.total)}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Open Requests Available to Bid On */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, marginBottom: 16 }}>
                <h3 className="category-title" style={{ margin: 0 }}>
                    Matching Open Requests ({requests.length})
                </h3>
                <Link to="/provider/profile" className="card-link" style={{ fontSize: 13 }}>
                    Configure Offered Services &rarr;
                </Link>
            </div>

            {loading && (
                <div className="card-list">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="skeleton skeleton-row"></div>
                    ))}
                </div>
            )}

            {!loading && requests.length === 0 && (
                <EmptyState
                    title="No open requests in your categories"
                    text="Make sure you have selected all services you offer in your profile to receive matching customer requests."
                    icon="requests"
                >
                    <Link to="/provider/profile" className="btn-link">
                        Open My Service Profile
                    </Link>
                </EmptyState>
            )}

            <div className="request-grid">
                {requests.map((r) => (
                    <RequestCard
                        key={r.id}
                        request={r}
                        showStatus={false}
                        linkTo={"/provider/requests/" + r.id}
                        linkText="Place a Competitive Bid"
                    />
                ))}
            </div>
        </div>
    );
}

export default ProviderDashboard;