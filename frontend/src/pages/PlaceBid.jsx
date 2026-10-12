import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import toast from "react-hot-toast";
import Countdown from "../components/Countdown.jsx";
import Icon from "../components/Icon.jsx";

function PlaceBid() {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [estimatedTime, setEstimatedTime] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        apiFetch("/api/provider/requests/" + requestId)
            .then((data) => setRequest(data))
            .catch(() => setError("Could not load request"));
    }, [requestId]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await apiFetch("/api/provider/requests/" + requestId + "/bids", {
                method: "POST",
                body: JSON.stringify({
                    amount: Number(amount),
                    message,
                    estimatedTime,
                }),
            });
            toast.success("Bid submitted successfully.");
            navigate("/provider");
        } catch {
            toast.error("Could not submit bid (already bid, bidding closed, or invalid amount).");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="page-enter" style={{ maxWidth: 720, margin: "0 auto" }}>
            <p>
                <Link to="/provider" className="card-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    &larr; Back to open requests
                </Link>
            </p>

            <h2>Submit a Competitive Bid</h2>
            <p className="muted-text">
                Review client specifications and proposal details before submitting your offer.
            </p>

            {!request && !error && <div className="skeleton skeleton-row"></div>}

            {request && (
                <div className="item-card" style={{ marginBottom: 24, padding: 22, background: "var(--card)" }}>
                    <div className="item-head">
                        <div>
                            <span className="badge" style={{ marginBottom: 6 }}>Request #{request.id}</span>
                            <h3 style={{ margin: "4px 0" }}>{request.serviceName}</h3>
                            <span className="muted-text">Posted by {request.customerName}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <span className="request-label">Client Budget</span>
                            <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>
                                ₹{Number(request.budget).toLocaleString("en-IN")}
                            </div>
                        </div>
                    </div>

                    <p style={{ margin: "14px 0", fontSize: 15, lineHeight: 1.5 }}>
                        {request.description}
                    </p>

                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13.5, color: "var(--text-secondary)", borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                            <Icon name="location" size={14} /> {request.location}
                        </span>
                        {request.scheduledAt && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                                <Icon name="calendar" size={14} /> {new Date(request.scheduledAt).toLocaleString()}
                            </span>
                        )}
                    </div>

                    {request.bidDeadline && (
                        <div style={{ marginTop: 12 }}>
                            <Countdown deadline={request.bidDeadline} />
                        </div>
                    )}
                </div>
            )}

            <form className="form-card form-wide" onSubmit={handleSubmit} style={{ maxWidth: "100%" }}>
                <h3 style={{ margin: "0 0 16px" }}>Your Proposal</h3>

                <label className="form-label">
                    Your Bid Amount (₹) <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                    type="number"
                    min="1"
                    placeholder="e.g. 950"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                {request && amount && Number(amount) < Number(request.budget) && (
                    <p className="muted-text" style={{ color: "var(--success-text)", fontSize: 13, marginTop: -8 }}>
                        ✓ Your bid is ₹{(Number(request.budget) - Number(amount)).toLocaleString("en-IN")} lower than the client's budget, increasing chance of winning!
                    </p>
                )}

                <label className="form-label">
                    Estimated Time to Complete <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                    placeholder="e.g. 2 - 3 hours, or Same Day"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    required
                />

                <label className="form-label">Proposal Message to Customer</label>
                <textarea
                    rows={3}
                    placeholder="Explain why you are the ideal choice (e.g. 10 years experience, genuine spare parts, guarantee provided)..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

                <div className="btn-row" style={{ marginTop: 18 }}>
                    <button
                        className="btn-link"
                        type="submit"
                        disabled={submitting}
                        style={{ padding: "11px 26px", fontSize: 15 }}
                    >
                        {submitting ? "Submitting Bid..." : "Submit Bid to Customer"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PlaceBid;