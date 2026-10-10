import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";

function ReviewForm({ bookingId, onDone }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        try {
            await apiFetch("/api/customer/bookings/" + bookingId + "/review", {
                method: "POST",
                body: JSON.stringify({ rating: Number(rating), comment }),
            });
            onDone();
        } catch (err) {
            setMessage("Could not submit review (maybe already reviewed).");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Okay</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Bad</option>
            </select>
            <input
                placeholder="Write a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Leave review</button>
            {message && <p className="muted-text">{message}</p>}
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
        } catch (err) {
            setError("Could not cancel this booking");
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
                <p className="muted-text">No bookings yet. Accept a bid on one of your requests to create one.</p>
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
                        {b.status === "COMPLETED" && !b.reviewed && (
                            <ReviewForm bookingId={b.id} onDone={() => markReviewed(b.id)} />
                        )}
                        {b.status === "COMPLETED" && b.reviewed && (
                            <p className="muted-text">Review submitted. Thank you!</p>
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