import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import toast from "react-hot-toast";

function PlaceBid() {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [estimatedTime, setEstimatedTime] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        apiFetch("/api/provider/requests/" + requestId)
            .then((data) => setRequest(data))
            .catch(() => setError("Could not load request"));
    }, [requestId]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await apiFetch("/api/provider/requests/" + requestId + "/bids", {
                method: "POST",
                body: JSON.stringify({
                    amount: Number(amount),
                    message,
                    estimatedTime,
                }),
            });
            toast.success("Bid submitted.");
            navigate("/provider");
        } catch (err) {
            toast.error("Could not submit bid (maybe you already bid, or amount is invalid).");
        }
    }

    return (
        <div>
            <p><Link to="/provider">Back to dashboard</Link></p>
            <h2>Place a bid</h2>

            {!request && !error && <div className="skeleton skeleton-row"></div>}
            {request && (
                <div className="item-card" style={{ marginBottom: 24 }}>
                    <div className="item-head">
                        <strong>{request.serviceName}</strong>
                        <span className="muted-text">by {request.customerName}</span>
                    </div>
                    <p>{request.description}</p>
                    <p className="muted-text">
                        Budget: {request.budget} | Location: {request.location}
                    </p>
                </div>
            )}

            <form className="form-card" onSubmit={handleSubmit}>
                <label className="form-label">Your amount</label>
                <input
                    type="number"
                    placeholder="e.g. 900"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <label className="form-label">Message to customer</label>
                <input
                    placeholder="Why you are the right choice"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <label className="form-label">Estimated time</label>
                <input
                    placeholder="e.g. 2 hours"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                />

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
                <button className="btn-link" type="submit">Submit bid</button>
            </form>
        </div>
    );
}

export default PlaceBid;