import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import { Link } from "react-router-dom";

function BrowseServices() {
    const [services, setServices] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        apiFetch("/api/services")
            .then((data) => setServices(data))
            .catch(() => setError("Could not load services"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = services.filter((s) =>
        (s.name + " " + s.categoryName).toLowerCase().includes(search.toLowerCase())
    );

    const groups = {};
    filtered.forEach((s) => {
        if (!groups[s.categoryName]) groups[s.categoryName] = [];
        groups[s.categoryName].push(s);
    });

    return (
        <div>
            <h2>Browse Services</h2>
            <input
                className="search-box"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {error && <p>{error}</p>}
            {loading && (
                <div className="service-grid">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="skeleton skeleton-card"></div>
                    ))}
                </div>
            )}
            {Object.keys(groups).map((cat) => (
                <div key={cat}>
                    <h3 className="category-title">{cat}</h3>
                    <div className="service-grid">
                        {groups[cat].map((s) => (
                            <div key={s.id} className="service-card">
                                <h4>{s.name}</h4>
                                <p>{s.description}</p>
                                <Link to={"/customer/request/" + s.id} className="card-link">
                                    Request this service
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {!loading && filtered.length === 0 && <p>No services found.</p>}
        </div>
    );
}

export default BrowseServices;