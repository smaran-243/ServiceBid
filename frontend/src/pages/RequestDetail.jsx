import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import toast from "react-hot-toast";

function initials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    const first = parts[0][0] || "";
    const second = parts.length > 1 ? parts[1][0] : "";
    return (first + second).toUpperCase();
}

function RequestDetail() {
    const { requestId } = useParams();
    const [request, setRequest] = useState(null);
    const [bids, setBids] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [ratings, setRatings] = useState({});
    const [profiles, setProfiles] = useState({});

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
        } catch (err) {
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
                <p className="muted-text">No bids yet.</p>
            )}

            <div className="card-list">
                {bids.map((b) => {
                    const r = ratings[b.providerId];
                    const p = profiles[b.providerId];
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
                                        <strong>{b.providerName}</strong>
                                        <div className="muted-text">
                                            {r && r.reviewCount > 0
                                                ? "Rating " + r.averageRating + " (" + r.reviewCount + " reviews)"
                                                : "No reviews yet"}
                                        </div>
                                    </div>
                                </div>
                                <div className="bid-amount">{b.amount}</div>
                            </div>
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