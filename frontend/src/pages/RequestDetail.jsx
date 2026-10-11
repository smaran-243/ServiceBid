import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState.jsx";
import Countdown from "../components/Countdown.jsx";
import Icon from "../components/Icon.jsx";

function RequestDetail() {
    const { requestId } = useParams();
    const [request, setRequest] = useState(null);
    const [bids, setBids] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [ratings, setRatings] = useState({});
    const [profiles, setProfiles] = useState({});
    const [bidSort, setBidSort] = useState("cheapest");

    const pendingBids = bids.filter((b) => b.status === "PENDING");
    const lowestAmount = pendingBids.length > 0
        ? Math.min(...pendingBids.map((b) => Number(b.amount)))
        : null;

    function ratingOf(providerId) {
        const r = ratings[providerId];
        return r && r.reviewCount > 0 ? Number(r.averageRating) : 0;
    }

    const bestRating = pendingBids.length > 0
        ? Math.max(...pendingBids.map((b) => ratingOf(b.providerId)))
        : 0;

    // Best value = highest rating divided by price, among rated bids
    let bestValueId = null;
    let bestScore = 0;
    pendingBids.forEach((b) => {
        const rt = ratingOf(b.providerId);
        const amount = Number(b.amount);
        if (rt > 0 && amount > 0) {
            const score = rt / amount;
            if (score > bestScore) {
                bestScore = score;
                bestValueId = b.id;
            }
        }
    });

    function tagsFor(b) {
        const tags = [];
        if (b.status !== "PENDING" || pendingBids.length < 2) return tags;
        if (Number(b.amount) === lowestAmount) tags.push("Lowest price");
        if (bestRating > 0 && ratingOf(b.providerId) === bestRating) tags.push("Top rated");
        if (b.id === bestValueId) tags.push("Best value");
        return tags;
    }

    useEffect(() => {
        apiFetch("/api/customer/requests/" + requestId)
            .then((data) => setRequest(data))
            .catch(() => setError("Could not load request"));

        apiFetch("/api/customer/requests/" + requestId + "/bids")
            .then((data) => {
                setBids(data || []);
                setLoading(false);
                (data || []).forEach((b) => {
                    apiFetch("/api/providers/" + b.providerId + "/rating")
                        .then((r) =>
                            setRatings((prev) => ({ ...prev, [b.providerId]: r }))
                        )
                        .catch(() => {});
                    apiFetch("/api/providers/" + b.providerId + "/profile")
                        .then((p) =>
                            setProfiles((prev) => ({ ...prev, [b.providerId]: p }))
                        )
                        .catch(() => {});
                });
            })
            .catch(() => {
                setError("Could not load bids");
                setLoading(false);
            });
    }, [requestId]);

    async function acceptBid(bidId) {
        setError("");
        try {
            await apiFetch("/api/customer/bids/" + bidId + "/accept", {
                method: "POST",
            });
            toast.success("Bid accepted. Booking created.");
            setTimeout(() => window.location.reload(), 1200);
        } catch {
            toast.error("Could not accept bid");
        }
    }

    async function cancelRequest() {
        if (!window.confirm("Cancel this request? All pending bids will be rejected.")) return;
        try {
            await apiFetch("/api/customer/requests/" + requestId + "/cancel", {
                method: "POST",
            });
            toast.success("Request cancelled");
            setTimeout(() => window.location.reload(), 800);
        } catch {
            toast.error("Could not cancel request");
        }
    }

    // Sort bids according to user preference
    const sortedBids = [...bids].sort((a, b) => {
        if (bidSort === "cheapest") return Number(a.amount) - Number(b.amount);
        if (bidSort === "highest_rated") return ratingOf(b.providerId) - ratingOf(a.providerId);
        return 0;
    });

    return (
        <div className="page-enter">
            <p>
                <Link to="/customer" className="card-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    &larr; Back to dashboard
                </Link>
            </p>

            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

            {!request && !error && <div className="skeleton skeleton-row"></div>}

            {request && (
                <div className="item-card" style={{ marginBottom: 28, padding: 26, background: "var(--card)" }}>
                    <div className="item-head">
                        <div>
                            <span className="badge" style={{ marginBottom: 6 }}>Request #{request.id}</span>
                            <h2 style={{ margin: "4px 0 8px" }}>{request.serviceName}</h2>
                        </div>
                        <StatusBadge status={request.status} />
                    </div>

                    <p style={{ fontSize: 16, lineHeight: 1.55 }}>{request.description}</p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, margin: "16px 0", padding: "14px 18px", background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
                        <div>
                            <span className="request-label">Your Budget</span>
                            <div style={{ fontWeight: 700, fontSize: 17, color: "var(--accent)" }}>
                                ₹{Number(request.budget).toLocaleString("en-IN")}
                            </div>
                        </div>
                        <div>
                            <span className="request-label">Location</span>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{request.location}</div>
                        </div>
                        <div>
                            <span className="request-label">Scheduled Time</span>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                                {request.scheduledAt ? new Date(request.scheduledAt).toLocaleString() : "Flexible"}
                            </div>
                        </div>
                    </div>

                    {request.status === "OPEN" && request.bidDeadline && (
                        <div style={{ margin: "12px 0 8px" }}>
                            <Countdown deadline={request.bidDeadline} />
                        </div>
                    )}

                    {request.status === "OPEN" && (
                        <div className="btn-row" style={{ marginTop: 16 }}>
                            <button className="btn-danger" onClick={cancelRequest}>
                                Cancel Request
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Bids Header & Sort Toolbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <div className="category-title" style={{ margin: 0 }}>
                    Received Bids ({bids.length})
                </div>
                {bids.length > 1 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="muted-text" style={{ fontSize: 13, fontWeight: 600 }}>Sort bids:</span>
                        <select
                            className="sort-select"
                            value={bidSort}
                            onChange={(e) => setBidSort(e.target.value)}
                        >
                            <option value="cheapest">Lowest Price First</option>
                            <option value="highest_rated">Highest Rated First</option>
                        </select>
                    </div>
                )}
            </div>

            {loading && (
                <div className="card-list">
                    <div className="skeleton skeleton-row"></div>
                    <div className="skeleton skeleton-row"></div>
                </div>
            )}

            {!loading && bids.length === 0 && (
                <EmptyState
                    title="No bids received yet"
                    text="Providers offering this service are reviewing your request. New quotes will appear here automatically."
                    icon="requests"
                />
            )}

            {/* Bids Comparison Grid */}
            <div className="card-list">
                {sortedBids.map((b) => {
                    const r = ratings[b.providerId];
                    const p = profiles[b.providerId];
                    const tags = tagsFor(b);
                    const diff = request ? Number(request.budget) - Number(b.amount) : 0;
                    const isHighlighted = tags.length > 0;

                    return (
                        <div
                            key={b.id}
                            className={"item-card" + (isHighlighted ? " bid-card-highlight" : "")}
                            style={{ padding: 22 }}
                        >
                            <div className="item-head">
                                <div className="bid-provider">
                                    <img
                                        className="avatar"
                                        alt=""
                                        src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(b.providerName)}
                                    />
                                    <div>
                                        <Link to={"/providers/" + b.providerId} className="card-link" style={{ fontSize: 17 }}>
                                            <strong>{b.providerName}</strong>
                                        </Link>
                                        <div className="muted-text" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                                            {r && r.reviewCount > 0 ? (
                                                <>
                                                    <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                                                        ★ {Number(r.averageRating).toFixed(1)}
                                                    </span>
                                                    <span>({r.reviewCount} reviews)</span>
                                                </>
                                            ) : (
                                                <span>New provider • No reviews yet</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: "right" }}>
                                    <div className="bid-amount">₹{Number(b.amount).toLocaleString("en-IN")}</div>
                                    {diff > 0 && (
                                        <span className="bid-savings-pill">
                                            ₹{diff.toLocaleString("en-IN")} below budget
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Tag badges */}
                            {tags.length > 0 && (
                                <div className="tag-row" style={{ marginTop: 8 }}>
                                    {tags.map((t) => (
                                        <span key={t} className="bid-tag">
                                            <Icon name="check" size={12} /> {t}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {p && p.bio && (
                                <p className="muted-text" style={{ fontStyle: "italic", margin: "8px 0" }}>
                                    "{p.bio}"
                                </p>
                            )}

                            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "10px 0", fontSize: 13.5 }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--text-secondary)" }}>
                                    <Icon name="clock" size={15} /> Duration: <strong>{b.estimatedTime}</strong>
                                </span>
                            </div>

                            {b.message && (
                                <div style={{ background: "var(--bg-subtle)", padding: "10px 14px", borderRadius: "var(--radius-sm)", margin: "8px 0 12px", fontSize: 14 }}>
                                    <span style={{ fontWeight: 600, display: "block", fontSize: 12, textTransform: "uppercase", color: "var(--muted)" }}>
                                        Provider Message:
                                    </span>
                                    {b.message}
                                </div>
                            )}

                            <div className="btn-row" style={{ justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                                <StatusBadge status={b.status} />
                                {request && request.status === "OPEN" && b.status === "PENDING" && (
                                    <button
                                        type="button"
                                        className="btn-link"
                                        onClick={() => acceptBid(b.id)}
                                        style={{ padding: "9px 20px" }}
                                    >
                                        <Icon name="check" size={16} /> Accept This Bid
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RequestDetail;