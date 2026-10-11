import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import { Link } from "react-router-dom";
import RequestCard from "../components/RequestCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Icon from "../components/Icon.jsx";

function CustomerDashboard() {
    const [email, setEmail] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        apiFetch("/api/me")
            .then((me) => setEmail(me.email || me.name || "user"))
            .catch(() => setEmail("user"));
    }, []);

    useEffect(() => {
        apiFetch("/api/customer/requests")
            .then((data) => setRequests(data || []))
            .catch(() => setRequests([]))
            .finally(() => setLoading(false));
    }, []);

    const openCount = requests.filter((r) => r.status === "OPEN").length;
    const completedCount = requests.filter((r) => r.status === "COMPLETED").length;

    const filteredRequests = requests.filter((r) => {
        if (statusFilter === "OPEN") return r.status === "OPEN";
        if (statusFilter === "IN_PROGRESS") return r.status === "ACCEPTED" || r.status === "IN_PROGRESS";
        if (statusFilter === "COMPLETED") return r.status === "COMPLETED";
        return true;
    });

    return (
        <div className="page-enter">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
                <div>
                    <h2>Customer Dashboard</h2>
                    <p className="muted-text">Welcome back! Account: {email}</p>
                </div>
                <div className="action-row" style={{ margin: 0 }}>
                    <Link to="/customer/services" className="btn-link">
                        <Icon name="search" size={16} /> Browse Services
                    </Link>
                    <Link to="/customer/bookings" className="btn-link btn-light">
                        <Icon name="bookings" size={16} /> My Bookings
                    </Link>
                </div>
            </div>

            {/* Quick KPI stats */}
            <div className="stat-grid" style={{ marginBottom: 28 }}>
                <div className="stat-card">
                    <div className="stat-icon"><Icon name="requests" /></div>
                    <div className="stat-number">{requests.length}</div>
                    <div className="muted-text">Total Requests Posted</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><Icon name="clock" /></div>
                    <div className="stat-number" style={{ color: "var(--info)" }}>{openCount}</div>
                    <div className="muted-text">Open for Bidding</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><Icon name="check" /></div>
                    <div className="stat-number" style={{ color: "var(--success)" }}>{completedCount}</div>
                    <div className="muted-text">Completed Jobs</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <h3 className="category-title" style={{ margin: 0 }}>My Requests</h3>
                {requests.length > 0 && (
                    <div className="chip-group">
                        <button
                            type="button"
                            className={"chip" + (statusFilter === "ALL" ? " active" : "")}
                            onClick={() => setStatusFilter("ALL")}
                        >
                            All ({requests.length})
                        </button>
                        <button
                            type="button"
                            className={"chip" + (statusFilter === "OPEN" ? " active" : "")}
                            onClick={() => setStatusFilter("OPEN")}
                        >
                            Open ({openCount})
                        </button>
                        <button
                            type="button"
                            className={"chip" + (statusFilter === "COMPLETED" ? " active" : "")}
                            onClick={() => setStatusFilter("COMPLETED")}
                        >
                            Completed ({completedCount})
                        </button>
                    </div>
                )}
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
                    title="No service requests yet"
                    text="Browse our service catalog and post your first request. Verified providers will submit their competitive bids."
                    icon="requests"
                >
                    <Link to="/customer/services" className="btn-link">
                        Browse Services
                    </Link>
                </EmptyState>
            )}

            {!loading && requests.length > 0 && filteredRequests.length === 0 && (
                <EmptyState
                    title="No requests match this filter"
                    text="Try switching to All to view your other requests."
                    icon="search"
                >
                    <button type="button" className="btn-link" onClick={() => setStatusFilter("ALL")}>
                        Show All Requests
                    </button>
                </EmptyState>
            )}

            <div className="request-grid">
                {filteredRequests.map((r) => (
                    <RequestCard
                        key={r.id}
                        request={r}
                        showStatus={true}
                        linkTo={"/customer/requests/" + r.id}
                        linkText="View Bids & Details"
                    />
                ))}
            </div>
        </div>
    );
}

export default CustomerDashboard;