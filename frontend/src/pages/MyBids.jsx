import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import toast from "react-hot-toast";

function MyBids() {
    const [bids, setBids] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/api/provider/bids")
            .then((data) => setBids(data))
            .catch(() => setError("Could not load bids"))
            .finally(() => setLoading(false));
    }, []);

    async function withdraw(bidId) {
        if (!window.confirm("Withdraw this bid? You cannot bid on this request again.")) return;
        try {
            await apiFetch("/api/provider/bids/" + bidId + "/withdraw", { method: "POST" });
            setBids((prev) =>
                prev.map((b) => (b.id === bidId ? { ...b, status: "WITHDRAWN" } : b))
            );
            toast.success("Bid withdrawn");
        } catch {
            toast.error("Could not withdraw bid");
        }
    }

    return (
        <div>
            <p><Link to="/provider">Back to dashboard</Link></p>
            <h2>My bids</h2>
            {error && <p>{error}</p>}
            {loading && (
                <div className="card-list">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="skeleton skeleton-row"></div>
                    ))}
                </div>
            )}
            {!loading && bids.length === 0 && (
                <EmptyState title="No bids yet" text="Find an open request and send your price.">
                    <Link to="/provider" className="btn-link">See open requests</Link>
                </EmptyState>
            )}
            <div className="card-list">
                {bids.map((b) => (
                    <div key={b.id} className="item-card">
                        <div className="item-head">
                            <strong>{b.serviceName}</strong>
                            <StatusBadge status={b.status} />
                        </div>
                        <p className="muted-text">
                            Amount: {b.amount} | Time: {b.estimatedTime}
                        </p>
                        {b.message && <p>{b.message}</p>}
                        {b.status === "PENDING" && (
                            <div className="btn-row">
                                <button className="btn-danger" onClick={() => withdraw(b.id)}>
                                    Withdraw bid
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyBids;