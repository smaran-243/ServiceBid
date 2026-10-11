import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Icon from "../components/Icon.jsx";
import toast from "react-hot-toast";

function MyBids() {
    const [bids, setBids] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");

    useEffect(() => {
        apiFetch("/api/provider/bids")
            .then((data) => setBids(data || []))
            .catch(() => setError("Could not load bids"))
            .finally(() => setLoading(false));
    }, []);

    async function withdraw(bidId) {
        if (!window.confirm("Withdraw this bid? You cannot bid on this request again.")) return;
        try {
            await apiFetch("/api/provider/bids/" + bidId + "/withdraw", { method: "POST" });
            setBids((prev) =>
                prev.map((b) => (b.id === bidId ? { ...b, status: "WITHDRAWN" } : b))
            );
            toast.success("Bid withdrawn");
        } catch {
            toast.error("Could not withdraw bid");
        }
    }

    const filteredBids = bids.filter((b) => {
        if (filterStatus === "PENDING") return b.status === "PENDING";
        if (filterStatus === "ACCEPTED") return b.status === "ACCEPTED" || b.status === "BID_ACCEPTED";
        if (filterStatus === "WITHDRAWN") return b.status === "WITHDRAWN" || b.status === "REJECTED";
        return true;
    });

    return (
        <div className="page-enter">
            <p>
                <Link to="/provider" className="card-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    &larr; Back to provider dashboard
                </Link>
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <div>
                    <h2>My Bids</h2>
                    <p className="muted-text">Manage your active bids, monitor acceptance, or withdraw pending bids.</p>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="filter-bar">
                <div className="chip-group">
                    <button
                        type="button"
                        className={"chip" + (filterStatus === "ALL" ? " active" : "")}
                        onClick={() => setFilterStatus("ALL")}
                    >
                        All Bids ({bids.length})
                    </button>
                    <button
                        type="button"
                        className={"chip" + (filterStatus === "PENDING" ? " active" : "")}
                        onClick={() => setFilterStatus("PENDING")}
                    >
                        Pending Under Review
                    </button>
                    <button
                        type="button"
                        className={"chip" + (filterStatus === "ACCEPTED" ? " active" : "")}
                        onClick={() => setFilterStatus("ACCEPTED")}
                    >
                        Accepted
                    </button>
                    <button
                        type="button"
                        className={"chip" + (filterStatus === "WITHDRAWN" ? " active" : "")}
                        onClick={() => setFilterStatus("WITHDRAWN")}
                    >
                        Withdrawn / Closed
                    </button>
                </div>
            </div>

            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

            {loading && (
                <div className="card-list">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="skeleton skeleton-row"></div>
                    ))}
                </div>
            )}

            {!loading && bids.length === 0 && (
                <EmptyState
                    title="No bids submitted yet"
                    text="Explore open customer requests on your dashboard and place your price."
                    icon="requests"
                >
                    <Link to="/provider" className="btn-link">See open requests</Link>
                </EmptyState>
            )}

            {!loading && bids.length > 0 && filteredBids.length === 0 && (
                <EmptyState
                    title="No bids in this filter"
                    text="Switch to All Bids to see the complete list."
                    icon="search"
                >
                    <button type="button" className="btn-link" onClick={() => setFilterStatus("ALL")}>
                        View All Bids
                    </button>
                </EmptyState>
            )}

            <div className="card-list">
                {filteredBids.map((b) => (
                    <div key={b.id} className="item-card" style={{ padding: 22 }}>
                        <div className="item-head">
                            <div>
                                <span className="badge" style={{ marginBottom: 6 }}>Bid #{b.id}</span>
                                <h3 style={{ margin: "2px 0 4px", fontSize: 19 }}>{b.serviceName}</h3>
                                <div className="muted-text" style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13.5 }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                        <Icon name="clock" size={14} /> Est. Duration: <strong>{b.estimatedTime}</strong>
                                    </span>
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <StatusBadge status={b.status} />
                                <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700, color: "var(--accent)", marginTop: 6 }}>
                                    ₹{Number(b.amount).toLocaleString("en-IN")}
                                </div>
                            </div>
                        </div>

                        {b.message && (
                            <div style={{ background: "var(--bg-subtle)", padding: "10px 14px", borderRadius: "var(--radius-sm)", margin: "10px 0 14px", fontSize: 13.5 }}>
                                <span style={{ fontWeight: 600, display: "block", fontSize: 11.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 2 }}>
                                    Your Proposal Message:
                                </span>
                                "{b.message}"
                            </div>
                        )}

                        {b.status === "PENDING" && (
                            <div className="btn-row" style={{ marginTop: 12 }}>
                                <button className="btn-danger" onClick={() => withdraw(b.id)}>
                                    Withdraw Bid
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyBids;