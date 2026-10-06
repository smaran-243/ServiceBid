import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
            <h2>Create Request</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <button type="submit">Submit request</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
}

export default CreateRequest;