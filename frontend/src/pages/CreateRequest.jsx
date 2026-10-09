import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";

function CreateRequest() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [location, setLocation] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await apiFetch("/api/customer/requests", {
                method: "POST",
                body: JSON.stringify({
                    serviceId: Number(serviceId),
                    description,
                    budget: Number(budget),
                    scheduledAt,
                    location,
                }),
            });
            navigate("/customer");
        } catch (err) {
            setError("Could not create request. Check all fields.");
        }
    }

    return (
        <div>
            <p><Link to="/customer/services">Back to services</Link></p>
            <h2>Create request</h2>
            <p className="muted-text" style={{ marginBottom: 16 }}>
                Describe what you need. Providers will send you their bids.
            </p>

            <form className="form-card" onSubmit={handleSubmit}>
                <label className="form-label">What do you need?</label>
                <textarea
                    rows={4}
                    placeholder="Describe the work in a few lines"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label className="form-label">Your budget</label>
                <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                />

                <label className="form-label">Preferred date and time</label>
                <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                />

                <label className="form-label">Location</label>
                <input
                    placeholder="Your address or area"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
                <button className="btn-link" type="submit">Submit request</button>
            </form>
        </div>
    );
}

export default CreateRequest;