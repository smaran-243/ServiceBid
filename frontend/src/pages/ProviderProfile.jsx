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

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <p><Link to="/provider">Back to dashboard</Link></p>
            <h2>My profile</h2>
            <form onSubmit={handleSave}>
                <p>
                    <textarea
                        placeholder="Short bio (max 500 characters)"
                        value={bio}
                        maxLength={500}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </p>
                <p>
                    <input
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </p>
                <h3>Services I offer</h3>
                {allServices.map((s) => (
                    <div key={s.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(s.id)}
                                onChange={() => toggleService(s.id)}
                            />{" "}
                            {s.name} ({s.categoryName})
                        </label>
                    </div>
                ))}
                <p><button type="submit">Save profile</button></p>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default ProviderProfile;