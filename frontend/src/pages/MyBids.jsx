import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";

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
                <p className="muted-text">No bids yet. Place a bid from your dashboard.</p>
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
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyBids;