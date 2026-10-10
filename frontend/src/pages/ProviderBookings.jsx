import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState.jsx";

const NEXT_STEP = {
    BID_ACCEPTED: "CONFIRMED",
    CONFIRMED: "IN_PROGRESS",
    IN_PROGRESS: "COMPLETED",
};

function ProviderBookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    function loadBookings() {
        apiFetch("/api/provider/bookings")
            .then((data) => setBookings(data))
            .catch(() => setError("Could not load bookings"))
            .finally(() => setLoading(false));
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
            toast.success("Status updated.");
        } catch (err) {
            toast.error("Could not update status");
        }
    }

    return (
        <div>
            <p><Link to="/provider">Back to dashboard</Link></p>
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
                <EmptyState title="No bookings yet" text="They appear here when a customer accepts your bid." />
            )}
            <div className="card-list">
                {bookings.map((b) => (
                    <div key={b.id} className="item-card">
                        <div className="item-head">
                            <strong>{b.serviceName}</strong>
                            <StatusBadge status={b.status} />
                        </div>
                        <p className="muted-text">
                            Customer: {b.customerName} | Agreed amount: {b.agreedAmount}
                        </p>
                        <div className="btn-row">
                            {NEXT_STEP[b.status] && (
                                <button onClick={() => updateStatus(b.id, NEXT_STEP[b.status])}>
                                    Mark as {NEXT_STEP[b.status].replace("_", " ")}
                                </button>
                            )}
                            {(b.status === "BID_ACCEPTED" || b.status === "CONFIRMED") && (
                                <button className="btn-danger" onClick={() => updateStatus(b.id, "CANCELLED")}>
                                    Cancel booking
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProviderBookings;