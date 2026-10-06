import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";

const NEXT_STEP = {
    BID_ACCEPTED: "CONFIRMED",
    CONFIRMED: "IN_PROGRESS",
    IN_PROGRESS: "COMPLETED",
};

function ProviderBookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    function loadBookings() {
        apiFetch("/api/provider/bookings")
            .then((data) => setBookings(data))
            .catch(() => setError("Could not load bookings"));
    }

    useEffect(() => {
        loadBookings();
    }, []);

    async function updateStatus(bookingId, status) {
        setError("");
        try {
            await apiFetch("/api/provider/bookings/" + bookingId + "/status", {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });
            loadBookings();
        } catch (err) {
            setError("Could not update status");
        }
    }

    return (
        <div>
            <p><Link to="/provider">Back to dashboard</Link></p>
            <h2>My bookings</h2>
            {error && <p>{error}</p>}
            {bookings.length === 0 && <p>No bookings yet.</p>}
            <ul>
                {bookings.map((b) => (
                    <li key={b.id}>
                        <strong>{b.serviceName}</strong> - {b.status}<br />
                        Customer: {b.customerName}<br />
                        Agreed amount: {b.agreedAmount}<br />
                        {NEXT_STEP[b.status] && (
                            <button onClick={() => updateStatus(b.id, NEXT_STEP[b.status])}>
                                Mark as {NEXT_STEP[b.status]}
                            </button>
                        )}{" "}
                        {(b.status === "BID_ACCEPTED" || b.status === "CONFIRMED") && (
                            <button onClick={() => updateStatus(b.id, "CANCELLED")}>
                                Cancel booking
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProviderBookings;