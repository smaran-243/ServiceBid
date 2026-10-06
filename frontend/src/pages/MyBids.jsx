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
            {loading && <p>Loading...</p>}
            {!loading && bids.length === 0 && <p>No bids yet.</p>}
            <ul>
                {bids.map((b) => (
                    <li key={b.id}>
                        <strong>{b.serviceName}</strong> <StatusBadge status={b.status} /><br />
                        Amount: {b.amount} | Time: {b.estimatedTime}<br />
                        {b.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyBids;