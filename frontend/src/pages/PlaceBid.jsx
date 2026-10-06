import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";

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
            navigate("/provider");
        } catch (err) {
            setError("Could not submit bid (maybe you already bid, or amount is invalid).");
        }
    }

    return (
        <div>
            <p><Link to="/provider">Back to dashboard</Link></p>
            <h2>Place a bid</h2>
            {request && (
                <div>
                    <p><strong>{request.serviceName}</strong> (by {request.customerName})</p>
                    <p>{request.description}</p>
                    <p>Budget: {request.budget} | Location: {request.location}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="number"
                        placeholder="Your amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        placeholder="Estimated time (e.g. 2 hours)"
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                    />
                </div>
                <button type="submit">Submit bid</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default PlaceBid;