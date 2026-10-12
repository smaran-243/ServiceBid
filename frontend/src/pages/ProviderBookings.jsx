import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState.jsx";
import BookingTimeline from "../components/BookingTimeline.jsx";
import Icon from "../components/Icon.jsx";

const NEXT_STEP = {
    BID_ACCEPTED: "CONFIRMED",
    CONFIRMED: "IN_PROGRESS",
};

function ProviderBookings() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");

    function loadBookings() {
        apiFetch("/api/provider/bookings")
            .then((data) => setBookings(data || []))
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
            toast.success("Status updated to " + status.replace("_", " "));
        } catch {
            toast.error("Could not update status");
        }
    }

    const filteredBookings = bookings.filter((b) => {
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
                <Link to="/provider" className="card-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    &larr; Back to provider dashboard
                </Link>
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <div>
                    <h2>Client Bookings</h2>
                    <p className="muted-text">Manage accepted service contracts and advance job progress.</p>
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
                        All Bookings ({bookings.length})
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

            {!loading && bookings.length === 0 && (
                <EmptyState
                    title="No client bookings yet"
                    text="When a customer accepts your bid, the confirmed job will automatically appear here."
                    icon="bookings"
                >
                    <Link to="/provider" className="btn-link">View Open Requests</Link>
                </EmptyState>
            )}

            {!loading && bookings.length > 0 && filteredBookings.length === 0 && (
                <EmptyState
                    title="No bookings in this filter"
                    text="Try switching to All to view your other jobs."
                    icon="search"
                >
                    <button type="button" className="btn-link" onClick={() => setFilterStatus("ALL")}>
                        View All Bookings
                    </button>
                </EmptyState>
            )}

            <div className="card-list">
                {filteredBookings.map((b) => (
                    <div key={b.id} className="item-card" style={{ padding: 24 }}>
                        <div className="item-head">
                            <div>
                                <span className="badge" style={{ marginBottom: 6 }}>Booking #{b.id}</span>
                                <h3 style={{ margin: "2px 0 6px", fontSize: 20 }}>{b.serviceName}</h3>
                                <p className="muted-text" style={{ margin: 0 }}>
                                    Customer: <strong>{b.customerName}</strong>
                                </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <StatusBadge status={b.status} />
                                <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--accent)", marginTop: 6 }}>
                                    ₹{Number(b.agreedAmount).toLocaleString("en-IN")}
                                </div>
                            </div>
                        </div>

                        <BookingTimeline status={b.status} />

                        <div className="btn-row" style={{ marginTop: 18 }}>
                            {b.status === "IN_PROGRESS" && (
                                <span className="muted-text" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5 }}>
                                    <Icon name="clock" size={15} /> Job is in progress. Awaiting customer completion sign-off.
                                </span>
                            )}

                            {NEXT_STEP[b.status] && (
                                <button
                                    className="btn-link"
                                    onClick={() => updateStatus(b.id, NEXT_STEP[b.status])}
                                >
                                    <Icon name="check" size={16} /> Mark as {NEXT_STEP[b.status].replace("_", " ")}
                                </button>
                            )}

                            {(b.status === "BID_ACCEPTED" || b.status === "CONFIRMED") && (
                                <button
                                    className="btn-danger"
                                    onClick={() => updateStatus(b.id, "CANCELLED")}
                                >
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

export default ProviderBookings;