import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";

function ProviderProfile() {
    const [bio, setBio] = useState("");
    const [phone, setPhone] = useState("");
    const [allServices, setAllServices] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiFetch("/api/provider/profile"),
            apiFetch("/api/services"),
            apiFetch("/api/provider/services"),
        ])
            .then(([profile, services, mine]) => {
                setBio(profile.bio || "");
                setPhone(profile.phone || "");
                setAllServices(services);
                setSelectedIds(mine.map((s) => s.id));
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

    async function handleSave(e) {
        e.preventDefault();
        setMessage("");
        try {
            await apiFetch("/api/provider/profile", {
                method: "PUT",
                body: JSON.stringify({ bio, phone }),
            });
            await apiFetch("/api/provider/services", {
                method: "PUT",
                body: JSON.stringify({ serviceIds: selectedIds }),
            });
            setMessage("Profile saved.");
        } catch (err) {
            setMessage("Could not save profile");
        }
    }

    const categories = [...new Set(allServices.map((s) => s.categoryName))];

    return (
        <div>
            <p><Link to="/provider">Back to dashboard</Link></p>
            <h2>My profile</h2>

            {loading && <div className="skeleton skeleton-row"></div>}
            {!loading && (
                <form className="form-card form-wide" onSubmit={handleSave}>
                    <label className="form-label">About you</label>
                    <textarea
                        rows={4}
                        placeholder="Short bio (max 500 characters)"
                        value={bio}
                        maxLength={500}
                        onChange={(e) => setBio(e.target.value)}
                    />

                    <label className="form-label">Phone</label>
                    <input
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <div className="category-title">Services I offer</div>
                    {categories.map((cat) => (
                        <div key={cat}>
                            <p className="form-label">{cat}</p>
                            <div className="check-grid">
                                {allServices
                                    .filter((s) => s.categoryName === cat)
                                    .map((s) => (
                                        <label key={s.id} className="check-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(s.id)}
                                                onChange={() => toggleService(s.id)}
                                            />
                                            {s.name}
                                        </label>
                                    ))}
                            </div>
                        </div>
                    ))}

                    {message && (
                        <p
                            style={{
                                color: message === "Profile saved." ? "#15803d" : "var(--danger)",
                                marginTop: 16,
                            }}
                        >
                            {message}
                        </p>
                    )}
                    <button className="btn-link" type="submit" style={{ marginTop: 12 }}>
                        Save profile
                    </button>
                </form>
            )}
        </div>
    );
}

export default ProviderProfile;