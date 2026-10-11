import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import toast from "react-hot-toast";
import Icon from "../components/Icon.jsx";

function CreateRequest() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [serviceInfo, setServiceInfo] = useState(null);

    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [location, setLocation] = useState("");
    const [bidDeadline, setBidDeadline] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Fetch service info for clear context
    useEffect(() => {
        apiFetch("/api/services")
            .then((list) => {
                const found = (list || []).find((s) => String(s.id) === String(serviceId));
                if (found) setServiceInfo(found);
            })
            .catch(() => {});
    }, [serviceId]);

    async function handleSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await apiFetch("/api/customer/requests", {
                method: "POST",
                body: JSON.stringify({
                    serviceId: Number(serviceId),
                    description,
                    budget: Number(budget),
                    scheduledAt,
                    location,
                    bidDeadline: bidDeadline ? new Date(bidDeadline).toISOString().slice(0, 19) : null,
                }),
            });
            toast.success("Request posted. Providers can now bid.");
            navigate("/customer");
        } catch {
            toast.error("Could not create request. Check all fields.");
        } finally {
            setSubmitting(false);
        }
    }

    function canProceedToStep2() {
        if (!description.trim()) {
            toast.error("Please describe the work required.");
            return false;
        }
        if (!location.trim()) {
            toast.error("Please enter your service location or address.");
            return false;
        }
        return true;
    }

    function canProceedToStep3() {
        if (!budget || Number(budget) <= 0) {
            toast.error("Please enter a valid budget amount.");
            return false;
        }
        if (!scheduledAt) {
            toast.error("Please select a preferred date and time.");
            return false;
        }
        return true;
    }

    return (
        <div className="page-enter" style={{ maxWidth: 760, margin: "0 auto" }}>
            <p>
                <Link to="/customer/services" className="card-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    &larr; Back to services
                </Link>
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                <h2>Create Service Request</h2>
                {serviceInfo && (
                    <span className="badge" style={{ fontSize: 13, padding: "5px 12px" }}>
                        {serviceInfo.name}
                    </span>
                )}
            </div>

            <p className="muted-text" style={{ marginBottom: 24 }}>
                Fill out the request steps below. Local providers will review your job and send competitive offers.
            </p>

            {/* Stepper Progress Bar */}
            <div className="stepper-header">
                <div className={"stepper-step" + (step === 1 ? " active" : step > 1 ? " completed" : "")}>
                    <div className="stepper-bubble">
                        {step > 1 ? <Icon name="check" size={16} /> : 1}
                    </div>
                    <span className="stepper-label">Work Details</span>
                </div>
                <div style={{ flex: 1, height: 2, background: step > 1 ? "var(--accent)" : "var(--border)", margin: "0 12px" }} />
                <div className={"stepper-step" + (step === 2 ? " active" : step > 2 ? " completed" : "")}>
                    <div className="stepper-bubble">
                        {step > 2 ? <Icon name="check" size={16} /> : 2}
                    </div>
                    <span className="stepper-label">Budget & Schedule</span>
                </div>
                <div style={{ flex: 1, height: 2, background: step > 2 ? "var(--accent)" : "var(--border)", margin: "0 12px" }} />
                <div className={"stepper-step" + (step === 3 ? " active" : "")}>
                    <div className="stepper-bubble">3</div>
                    <span className="stepper-label">Review & Post</span>
                </div>
            </div>

            <form className="form-card form-wide" onSubmit={handleSubmit}>
                {/* STEP 1: Work Details */}
                {step === 1 && (
                    <div className="page-enter">
                        <h3 style={{ margin: "0 0 16px" }}>Step 1: What do you need?</h3>

                        <label className="form-label">
                            Job Description <span style={{ color: "var(--danger)" }}>*</span>
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Describe what needs to be done, specific problems, tools needed, or room count..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />

                        <label className="form-label">
                            Service Location / Address <span style={{ color: "var(--danger)" }}>*</span>
                        </label>
                        <input
                            placeholder="e.g. Indiranagar 2nd Stage, Bangalore or Full Street Address"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />

                        <div className="btn-row" style={{ justifyContent: "flex-end", marginTop: 24 }}>
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => {
                                    if (canProceedToStep2()) setStep(2);
                                }}
                            >
                                Continue to Budget & Schedule &rarr;
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Budget & Schedule */}
                {step === 2 && (
                    <div className="page-enter">
                        <h3 style={{ margin: "0 0 16px" }}>Step 2: Budget & Preferred Time</h3>

                        <label className="form-label">
                            Target Budget (₹) <span style={{ color: "var(--danger)" }}>*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            placeholder="e.g. 1200"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            required
                        />

                        <label className="form-label">
                            Preferred Date and Time <span style={{ color: "var(--danger)" }}>*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                            required
                        />

                        <label className="form-label">
                            Bid Deadline (Optional Countdown)
                        </label>
                        <input
                            type="datetime-local"
                            value={bidDeadline}
                            onChange={(e) => setBidDeadline(e.target.value)}
                        />
                        <p className="muted-text" style={{ fontSize: 12.5, marginTop: -6 }}>
                            Specifying a deadline adds an urgent countdown badge so providers bid quickly.
                        </p>

                        <div className="btn-row" style={{ justifyContent: "space-between", marginTop: 24 }}>
                            <button
                                type="button"
                                className="btn-light"
                                onClick={() => setStep(1)}
                            >
                                &larr; Back
                            </button>
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => {
                                    if (canProceedToStep3()) setStep(3);
                                }}
                            >
                                Review Request &rarr;
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Review & Submit */}
                {step === 3 && (
                    <div className="page-enter">
                        <h3 style={{ margin: "0 0 16px" }}>Step 3: Review Your Request</h3>
                        <p className="muted-text">
                            Please check the information below before publishing your request to providers.
                        </p>

                        <div className="item-card" style={{ background: "var(--bg-subtle)", margin: "16px 0 24px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <span className="request-label">Selected Service</span>
                                    <div style={{ fontWeight: 700, marginTop: 4 }}>
                                        {serviceInfo ? serviceInfo.name : "Service #" + serviceId}
                                    </div>
                                </div>
                                <div>
                                    <span className="request-label">Your Budget</span>
                                    <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: 18, marginTop: 4 }}>
                                        ₹{Number(budget).toLocaleString("en-IN")}
                                    </div>
                                </div>
                                <div>
                                    <span className="request-label">Location</span>
                                    <div style={{ marginTop: 4, fontWeight: 500 }}>{location}</div>
                                </div>
                                <div>
                                    <span className="request-label">Preferred Time</span>
                                    <div style={{ marginTop: 4, fontWeight: 500 }}>
                                        {scheduledAt ? new Date(scheduledAt).toLocaleString() : "Not set"}
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                                <span className="request-label">Work Description</span>
                                <p style={{ marginTop: 6, marginBottom: 0, fontStyle: "italic" }}>"{description}"</p>
                            </div>
                            {bidDeadline && (
                                <div style={{ marginTop: 12 }}>
                                    <span className="request-label">Bid Deadline</span>
                                    <div style={{ marginTop: 4, fontSize: 13, color: "var(--accent)" }}>
                                        Closes at: {new Date(bidDeadline).toLocaleString()}
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

                        <div className="btn-row" style={{ justifyContent: "space-between" }}>
                            <button
                                type="button"
                                className="btn-light"
                                onClick={() => setStep(2)}
                            >
                                &larr; Edit Details
                            </button>
                            <button
                                type="submit"
                                className="btn-link"
                                disabled={submitting}
                                style={{ padding: "11px 24px", fontSize: 15 }}
                            >
                                {submitting ? "Publishing..." : "Submit Request to Providers"}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default CreateRequest;