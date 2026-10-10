import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState.jsx";

function RequestDetail() {
    const { requestId } = useParams();
    const [request, setRequest] = useState(null);
    const [bids, setBids] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [ratings, setRatings] = useState({});
    const [profiles, setProfiles] = useState({});

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
                setBids(data);
                setLoading(false);
                data.forEach((b) => {
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
        } catch{
            toast.error("Could not accept bid");
        }
    }

    return (
        <div>
            <p><Link to="/customer">Back to dashboard</Link></p>
            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

            {!request && !error && <div className="skeleton skeleton-row"></div>}
            {request && (
                <div className="item-card" style={{ marginBottom: 24 }}>
                    <div className="item-head">
                        <h2 style={{ margin: 0 }}>{request.serviceName}</h2>
                        <StatusBadge status={request.status} />
                    </div>
                    <p>{request.description}</p>
                    <p className="muted-text">
                        Budget: {request.budget} | Location: {request.location}
                    </p>
                </div>
            )}

            <div className="category-title">Bids (cheapest first)</div>

            {loading && (
                <div className="card-list">
                    <div className="skeleton skeleton-row"></div>
                    <div className="skeleton skeleton-row"></div>
                </div>
            )}
            {!loading && bids.length === 0 && (
                <EmptyState title="No bids yet" text="Providers who offer this service will send their prices here. Check back soon." />
            )}

            <div className="card-list">
                {bids.map((b) => {
                    const r = ratings[b.providerId];
                    const p = profiles[b.providerId];
                    const tags = tagsFor(b);
                    return (
                        <div key={b.id} className="item-card">
                            <div className="item-head">
                                <div className="bid-provider">
                                    <img
                                        className="avatar"
                                        alt=""
                                        src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(b.providerName)}
                                    />
                                    <div>
                                        <Link to={"/providers/" + b.providerId} className="card-link">
                                            <strong>{b.providerName}</strong>
                                        </Link>
                                        <div className="muted-text">
                                            {r && r.reviewCount > 0
                                                ? "Rating " + r.averageRating + " (" + r.reviewCount + " reviews)"
                                                : "No reviews yet"}
                                        </div>
                                    </div>
                                </div>
                                <div className="bid-amount">{b.amount}</div>
                            </div>
                            {tags.length > 0 && (
                                <div className="tag-row">
                                    {tags.map((t) => (
                                        <span key={t} className="bid-tag">{t}</span>
                                    ))}
                                </div>
                            )}
                            {p && p.bio && <p className="muted-text">{p.bio}</p>}
                            <p>Estimated time: {b.estimatedTime}</p>
                            {b.message && <p>{b.message}</p>}
                            <div className="btn-row">
                                <StatusBadge status={b.status} />
                                {request && request.status === "OPEN" && b.status === "PENDING" && (
                                    <button className="btn-link" onClick={() => acceptBid(b.id)}>
                                        Accept this bid
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