import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";

function ReviewForm({ bookingId }) {
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
            setMessage("Review submitted. Thank you!");
        } catch (err) {
            setMessage("Could not submit review (maybe already reviewed).");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
            </select>{" "}
            <input
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />{" "}
            <button type="submit">Leave review</button>
            {message && <p>{message}</p>}
        </form>
    );
}
function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch("/api/customer/bookings")
            .then((data) => setBookings(data))
            .catch(() => setError("Could not load bookings"));
    }, []);

    return (
        <div>
            <p><Link to="/customer">Back to dashboard</Link></p>
            <h2>My bookings</h2>
            {error && <p>{error}</p>}
            {bookings.length === 0 && <p>No bookings yet.</p>}
            <ul>
                {bookings.map((b) => (
                    <li key={b.id}>
                        <strong>{b.serviceName}</strong> <StatusBadge status={b.status} /><br />
                        Provider: {b.providerName}<br />
                        Agreed amount: {b.agreedAmount}
                        {b.status === "COMPLETED" && <ReviewForm bookingId={b.id} />}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyBookings;