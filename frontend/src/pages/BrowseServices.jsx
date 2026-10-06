import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";
import { Link } from "react-router-dom";

function BrowseServices() {
    const [services, setServices] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/api/services")
            .then((data) => setServices(data))
            .catch(() => setError("Could not load services"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <h2>Browse Services</h2>
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
            <ul>
                {services.map((s) => (
                    <li key={s.id}>
                        <strong>{s.name}</strong> ({s.categoryName})<br />
                        {s.description}<br />
                        <Link to={"/customer/request/" + s.id}>Request this service</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BrowseServices;