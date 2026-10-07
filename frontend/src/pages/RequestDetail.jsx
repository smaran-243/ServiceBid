import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";

function RequestDetail() {
    const { requestId } = useParams();
    const [request, setRequest] = useState(null);
    const [bids, setBids] = useState([]);
    const [error, setError] = useState("");
    const [ratings, setRatings] = useState({});
    const [profiles, setProfiles] = useState({});

    useEffect(() => {
        apiFetch("/api/customer/requests/" + requestId)
            .then((data) => setRequest(data))
            .catch(() => setError("Could not load request"));
        apiFetch("/api/customer/requests/" + requestId + "/bids")
            .then((data) => {
                setBids(data);
                data.forEach((b) => {
                    apiFetch("/api/providers/" + b.providerId + "/rating")
                        .then((r) =>
                            setRatings((prev) => ({ ...prev, [b.providerId]: r }))
                        )
                        .catch(() => {});
                    apiFetch("/api/providers/" + b.providerId + "/profile")
                        .then((p) =>
                            setProfiles((prev) => ({ ...prev, [b.providerId]: p }))
                        )
                        .catch(() => {});
                });
            })
            .catch(() => setError("Could not load bids"));
    }, [requestId]);
    async function acceptBid(bidId) {
        setError("");
        try {
            await apiFetch("/api/customer/bids/" + bidId + "/accept", {
                method: "POST",
            });
            window.location.reload();
        } catch (err) {
            setError("Could not accept bid");
        }
    }

    return (
        <div>
            <p><Link to="/customer">Back to dashboard</Link></p>
            {error && <p>{error}</p>}
            {request && (
                <div>
                    <h2>{request.serviceName} - {request.status}</h2>
                    <p>{request.description}</p>
                    <p>Budget: {request.budget} | Location: {request.location}</p>
                </div>
            )}
            <h3>Bids (cheapest first)</h3>
            {bids.length === 0 && <p>No bids yet.</p>}
            <ul>
                {bids.map((b) => (
                    <li key={b.id}>
                        <strong>{b.providerName}</strong> - Amount: {b.amount}<br />
                        Rating:{" "}
                        {ratings[b.providerId] && ratings[b.providerId].reviewCount > 0
                            ? ratings[b.providerId].averageRating + " (" + ratings[b.providerId].reviewCount + " reviews)"
                            : "No reviews yet"}
                        <br />
                        {profiles[b.providerId] && profiles[b.providerId].bio && (
                            <span>About: {profiles[b.providerId].bio}<br /></span>
                        )}
                        Time: {b.estimatedTime}<br />
                        {b.message}<br />
                        Status: {b.status}<br />
                        {request && request.status === "OPEN" && b.status === "PENDING" && (
                            <button onClick={() => acceptBid(b.id)}>Accept this bid</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RequestDetail;