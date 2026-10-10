import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import toast from "react-hot-toast";
import StarRating from "../components/StarRating.jsx";
import EmptyState from "../components/EmptyState.jsx";
import BookingTimeline from "../components/BookingTimeline.jsx";

function ReviewForm({ bookingId, onDone }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await apiFetch("/api/customer/bookings/" + bookingId + "/review", {
                method: "POST",
                body: JSON.stringify({ rating: Number(rating), comment }),
            });
            toast.success("Review submitted. Thank you!");
            onDone();
        } catch {
            toast.error("Could not submit review (maybe already reviewed).");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <StarRating value={Number(rating)} onChange={setRating} />
            <input
                placeholder="Write a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Leave review</button>
        </form>
    );
}

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/api/customer/bookings")
            .then((data) => setBookings(data))
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

    return (
        <div>
            <p><Link to="/customer">Back to dashboard</Link></p>
            <h2>My bookings</h2>
            {error && <p>{error}</p>}
            {loading && (
                <div className="card-list">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="skeleton skeleton-row"></div>
                    ))}
                </div>
            )}
            {!loading && bookings.length === 0 && (
                <EmptyState title="No bookings yet" text="Accept a bid on one of your requests to create one.">
                    <Link to="/customer" className="btn-link">Go to dashboard</Link>
                </EmptyState>
            )}
            <div className="card-list">
                {bookings.map((b) => (
                    <div key={b.id} className="item-card">
                        <div className="item-head">
                            <strong>{b.serviceName}</strong>
                            <StatusBadge status={b.status} />
                        </div>
                        <p className="muted-text">
                            Provider: {b.providerName} | Agreed amount: {b.agreedAmount}
                        </p>
                        <BookingTimeline status={b.status} />
                        {b.status === "COMPLETED" && !b.reviewed && (
                            <ReviewForm bookingId={b.id} onDone={() => markReviewed(b.id)} />
                        )}
                        {b.status === "COMPLETED" && b.reviewed && (
                            <p className="muted-text">Review submitted. Thank you!</p>
                        )}
                        {b.status === "COMPLETED" && (
                            <div className="btn-row">
                                <Link to={"/customer/invoice/" + b.id} className="btn-link btn-light">
                                    View invoice
                                </Link>
                            </div>
                        )}
                        {b.status === "IN_PROGRESS" && (
                            <div className="btn-row">
                                <button className="btn-link" onClick={() => handleComplete(b.id)}>
                                    Confirm job done
                                </button>
                            </div>
                        )}
                        {(b.status === "BID_ACCEPTED" || b.status === "CONFIRMED") && (
                            <div className="btn-row">
                                <button className="btn-danger" onClick={() => handleCancel(b.id)}>
                                    Cancel booking
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyBookings;