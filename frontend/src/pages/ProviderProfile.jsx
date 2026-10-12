import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import Icon from "../components/Icon.jsx";

function ProviderProfile() {
    const [bio, setBio] = useState("");
    const [phone, setPhone] = useState("");
    const [allServices, setAllServices] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            apiFetch("/api/provider/profile"),
            apiFetch("/api/services"),
            apiFetch("/api/provider/services"),
        ])
            .then(([profile, services, mine]) => {
                setBio((profile && profile.bio) || "");
                setPhone((profile && profile.phone) || "");
                setAllServices(services || []);
                setSelectedIds((mine || []).map((s) => s.id));
            })
            .catch(() => setMessage("Could not load profile"))
            .finally(() => setLoading(false));
    }, []);

    function toggleService(id) {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((x) => x !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    function toggleCategoryAll(categoryName) {
        const catServices = allServices.filter((s) => s.categoryName === categoryName);
        const catIds = catServices.map((s) => s.id);
        const allSelected = catIds.every((id) => selectedIds.includes(id));

        if (allSelected) {
            setSelectedIds(selectedIds.filter((id) => !catIds.includes(id)));
        } else {
            const next = new Set([...selectedIds, ...catIds]);
            setSelectedIds(Array.from(next));
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        setMessage("");
        setSaving(true);
        try {
            await apiFetch("/api/provider/profile", {
                method: "PUT",
                body: JSON.stringify({ bio, phone }),
            });
            await apiFetch("/api/provider/services", {
                method: "PUT",
                body: JSON.stringify({ serviceIds: selectedIds }),
            });
            setMessage("Profile saved successfully.");
        } catch {
            setMessage("Could not save profile");
        } finally {
            setSaving(false);
        }
    }

    const categories = [...new Set(allServices.map((s) => s.categoryName))];

    return (
        <div className="page-enter" style={{ maxWidth: 840, margin: "0 auto" }}>
            <p>
                <Link to="/provider" className="card-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    &larr; Back to provider dashboard
                </Link>
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                <div>
                    <h2>Provider Profile & Services</h2>
                    <p className="muted-text">
                        Configure your credentials and select which services you offer to receive matching job bids.
                    </p>
                </div>
                <span className="badge" style={{ padding: "6px 14px", fontSize: 13 }}>
                    {selectedIds.length} Services Selected
                </span>
            </div>

            {loading && <div className="skeleton skeleton-row"></div>}

            {!loading && (
                <form className="form-card form-wide" onSubmit={handleSave} style={{ maxWidth: "100%" }}>
                    <h3 style={{ margin: "0 0 16px" }}>Professional Information</h3>

                    <label className="form-label">
                        About You & Experience (Max 500 characters)
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Tell clients about your trade experience, certifications, warranties, and specializations..."
                        value={bio}
                        maxLength={500}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -10, marginBottom: 14 }}>
                        <span className="muted-text" style={{ fontSize: 12 }}>
                            {bio.length} / 500 characters
                        </span>
                    </div>

                    <label className="form-label">Contact Phone Number</label>
                    <input
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <div style={{ borderTop: "1px solid var(--border)", margin: "24px 0 20px" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <div>
                            <h3 style={{ margin: "0 0 4px" }}>Services You Offer</h3>
                            <p className="muted-text" style={{ fontSize: 13.5, margin: 0 }}>
                                Check all services you want to bid on. Only matching requests will be sent to your dashboard.
                            </p>
                        </div>
                    </div>

                    {categories.map((cat) => {
                        const catServices = allServices.filter((s) => s.categoryName === cat);
                        const allChecked = catServices.every((s) => selectedIds.includes(s.id));
                        return (
                            <div key={cat} style={{ marginBottom: 20, background: "var(--bg-subtle)", padding: "14px 18px", borderRadius: "var(--radius-md)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                                    <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
                                        {cat}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn-ghost"
                                        style={{ fontSize: 12, padding: "3px 8px" }}
                                        onClick={() => toggleCategoryAll(cat)}
                                    >
                                        {allChecked ? "Deselect All" : "Select All"}
                                    </button>
                                </div>
                                <div className="check-grid" style={{ margin: 0 }}>
                                    {catServices.map((s) => (
                                        <label key={s.id} className="check-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(s.id)}
                                                onChange={() => toggleService(s.id)}
                                            />
                                            <span>{s.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {message && (
                        <div
                            style={{
                                padding: "10px 16px",
                                borderRadius: "var(--radius-sm)",
                                marginTop: 16,
                                fontSize: 14,
                                fontWeight: 600,
                                background: message.includes("successfully") ? "var(--success-bg)" : "var(--danger-bg)",
                                color: message.includes("successfully") ? "var(--success-text)" : "var(--danger-text)",
                            }}
                        >
                            {message}
                        </div>
                    )}

                    <div className="btn-row" style={{ marginTop: 22 }}>
                        <button
                            className="btn-link"
                            type="submit"
                            disabled={saving}
                            style={{ padding: "11px 26px", fontSize: 15 }}
                        >
                            <Icon name="check" size={16} /> {saving ? "Saving Changes..." : "Save Profile & Services"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default ProviderProfile;