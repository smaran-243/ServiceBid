import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import toast from "react-hot-toast";
import StarRating from "../components/StarRating.jsx";
import EmptyState from "../components/EmptyState.jsx";
import BookingTimeline from "../components/BookingTimeline.jsx";
import Icon from "../components/Icon.jsx";

function ReviewForm({ bookingId, onDone }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiFetch("/api/customer/bookings/" + bookingId + "/review", {
                method: "POST",
                body: JSON.stringify({ rating: Number(rating), comment }),
            });
            toast.success("Review submitted. Thank you!");
            onDone();
        } catch {
            toast.error("Could not submit review (maybe already reviewed).");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
                    Rate your experience:
                </span>
                <StarRating value={Number(rating)} onChange={setRating} />
            </div>
            <input
                placeholder="Share feedback on quality, punctuality, and service..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                aria-label="Review comment"
            />
            <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
}

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");

    useEffect(() => {
        apiFetch("/api/customer/bookings")
            .then((data) => setBookings(data || []))
            .catch(() => setError("Could not load bookings"))
            .finally(() => setLoading(false));
    }, []);

    async function handleCancel(bookingId) {
        if (!window.confirm("Cancel this booking?")) return;
        try {
            const updated = await apiFetch(
                "/api/customer/bookings/" + bookingId + "/cancel",
                { method: "POST" }
            );
            setBookings(bookings.map((b) => (b.id === bookingId ? updated : b)));
            toast.success("Booking cancelled.");
        } catch {
            toast.error("Could not cancel this booking");
        }
    }

    async function handleComplete(bookingId) {
        if (!window.confirm("Confirm that the job is fully done?")) return;
        try {
            const updated = await apiFetch(
                "/api/customer/bookings/" + bookingId + "/complete",
                { method: "POST" }
            );
            setBookings(bookings.map((b) => (b.id === bookingId ? updated : b)));
            toast.success("Job confirmed as done. You can now leave a review.");
        } catch {
            toast.error("Could not confirm this job");
        }
    }

    function markReviewed(bookingId) {
        setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, reviewed: true } : b)));
    }

    const filtered = bookings.filter((b) => {
        if (filterStatus === "ACTIVE") {
            return b.status === "BID_ACCEPTED" || b.status === "CONFIRMED" || b.status === "IN_PROGRESS";
        }
        if (filterStatus === "COMPLETED") return b.status === "COMPLETED";
        if (filterStatus === "CANCELLED") return b.status === "CANCELLED";
        return true;
    });

    return (
        <div className="page-enter">
            <p>
                <Link to="/customer" className="card-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    &larr; Back to dashboard
                </Link>
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <div>
                    <h2>My Bookings</h2>
                    <p className="muted-text">Track your confirmed jobs, confirm completion, and view invoices.</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-bar">
                <div className="chip-group">
                    <button
                        type="button"
                        className={"chip" + (filterStatus === "ALL" ? " active" : "")}
                        onClick={() => setFilterStatus("ALL")}
                    >
                        All ({bookings.length})
                    </button>
                    <button
                        type="button"
                        className={"chip" + (filterStatus === "ACTIVE" ? " active" : "")}
                        onClick={() => setFilterStatus("ACTIVE")}
                    >
                        Active Jobs
                    </button>
                    <button
                        type="button"
                        className={"chip" + (filterStatus === "COMPLETED" ? " active" : "")}
                        onClick={() => setFilterStatus("COMPLETED")}
                    >
                        Completed
                    </button>
                    <button
                        type="button"
                        className={"chip" + (filterStatus === "CANCELLED" ? " active" : "")}
                        onClick={() => setFilterStatus("CANCELLED")}
                    >
                        Cancelled
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

            {!loading && filtered.length === 0 && (
                <EmptyState
                    title={filterStatus === "ALL" ? "No bookings yet" : "No " + filterStatus.toLowerCase() + " bookings"}
                    text={
                        filterStatus === "ALL"
                            ? "Accept an offer on one of your service requests to confirm a booking."
                            : "There are no bookings matching this status filter."
                    }
                    icon="bookings"
                >
                    <Link to="/customer" className="btn-link">Go to dashboard</Link>
                </EmptyState>
            )}

            <div className="card-list">
                {filtered.map((b) => (
                    <div key={b.id} className="item-card" style={{ padding: 24 }}>
                        <div className="item-head">
                            <div>
                                <span className="badge" style={{ marginBottom: 6 }}>Booking #{b.id}</span>
                                <h3 style={{ margin: "2px 0 6px", fontSize: 20 }}>{b.serviceName}</h3>
                                <div className="muted-text" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span>Provider: <strong>{b.providerName}</strong></span>
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <StatusBadge status={b.status} />
                                <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--accent)", marginTop: 6 }}>
                                    ₹{Number(b.agreedAmount).toLocaleString("en-IN")}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Timeline */}
                        <BookingTimeline status={b.status} />

                        {/* Review Section */}
                        {b.status === "COMPLETED" && !b.reviewed && (
                            <div style={{ marginTop: 14 }}>
                                <ReviewForm bookingId={b.id} onDone={() => markReviewed(b.id)} />
                            </div>
                        )}
                        {b.status === "COMPLETED" && b.reviewed && (
                            <div style={{ margin: "14px 0 6px", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--success-text)", background: "var(--success-bg)", padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: 13, fontWeight: 600 }}>
                                <Icon name="check" size={14} /> Review submitted. Thank you!
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="btn-row" style={{ marginTop: 16 }}>
                            {b.status === "COMPLETED" && (
                                <Link to={"/customer/invoice/" + b.id} className="btn-link btn-light">
                                    <Icon name="fileText" size={16} /> View Official Invoice
                                </Link>
                            )}

                            {b.status === "IN_PROGRESS" && (
                                <button className="btn-link" onClick={() => handleComplete(b.id)}>
                                    <Icon name="check" size={16} /> Confirm Job Done
                                </button>
                            )}

                            {(b.status === "BID_ACCEPTED" || b.status === "CONFIRMED") && (
                                <button className="btn-danger" onClick={() => handleCancel(b.id)}>
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyBookings;