import { useState, useEffect, useMemo } from "react";
import { apiFetch } from "../api/api.js";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import EmptyState from "../components/EmptyState.jsx";

function getStoredFavorites() {
    try {
        const raw = localStorage.getItem("sb_favorites");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveFavoritesToStorage(favs) {
    try {
        localStorage.setItem("sb_favorites", JSON.stringify(favs));
    } catch {
        // ignore
    }
}

function getStoredRecents() {
    try {
        const raw = localStorage.getItem("sb_recent_services");
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function BrowseServices() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const initialCat = searchParams.get("cat") || "ALL";

    const [services, setServices] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(initialQuery);
    const [activeCategory, setActiveCategory] = useState(initialCat);
    const [sortBy, setSortBy] = useState("default");
    const [favorites, setFavorites] = useState(getStoredFavorites);
    const [recentServices, setRecentServices] = useState(getStoredRecents);

    useEffect(() => {
        apiFetch("/api/services")
            .then((data) => setServices(data || []))
            .catch(() => setError("Could not load services"))
            .finally(() => setLoading(false));
    }, []);

    function recordRecentView(service) {
        try {
            const list = getStoredRecents().filter((s) => s.id !== service.id);
            const updated = [
                { id: service.id, name: service.name, categoryName: service.categoryName },
                ...list
            ].slice(0, 6);
            localStorage.setItem("sb_recent_services", JSON.stringify(updated));
            setRecentServices(updated);
        } catch {
            // ignore
        }
    }

    // Update query params when search changes
    function handleSearchChange(val) {
        setSearch(val);
        const next = new URLSearchParams(searchParams);
        if (val) next.set("q", val);
        else next.delete("q");
        setSearchParams(next, { replace: true });
    }

    function handleCategoryClick(cat) {
        setActiveCategory(cat);
        const next = new URLSearchParams(searchParams);
        if (cat === "ALL" || cat === "SAVED") next.delete("cat");
        else next.set("cat", cat);
        setSearchParams(next, { replace: true });
    }

    function toggleFavorite(serviceId, e) {
        e.preventDefault();
        e.stopPropagation();
        setFavorites((prev) => {
            const next = prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId];
            saveFavoritesToStorage(next);
            return next;
        });
    }

    // Extract unique categories
    const categories = useMemo(() => {
        const set = new Set();
        services.forEach((s) => {
            if (s.categoryName) set.add(s.categoryName);
        });
        return Array.from(set);
    }, [services]);

    // Filter services
    const filtered = useMemo(() => {
        return services.filter((s) => {
            const matchesText = (s.name + " " + s.categoryName + " " + (s.description || ""))
                .toLowerCase()
                .includes(search.toLowerCase());

            if (!matchesText) return false;

            if (activeCategory === "SAVED") {
                return favorites.includes(s.id);
            }
            if (activeCategory !== "ALL" && s.categoryName !== activeCategory) {
                return false;
            }
            return true;
        });
    }, [services, search, activeCategory, favorites]);

    // Sort services
    const sorted = useMemo(() => {
        const copy = [...filtered];
        if (sortBy === "az") {
            copy.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "za") {
            copy.sort((a, b) => b.name.localeCompare(a.name));
        }
        return copy;
    }, [filtered, sortBy]);

    // Grouping by category when viewing ALL
    const groups = useMemo(() => {
        const map = {};
        sorted.forEach((s) => {
            const cat = s.categoryName || "General";
            if (!map[cat]) map[cat] = [];
            map[cat].push(s);
        });
        return map;
    }, [sorted]);

    return (
        <div className="page-enter">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <div>
                    <h2>Browse Services</h2>
                    <p className="muted-text">
                        Explore available services and post requests for competitive provider bidding.
                    </p>
                </div>
                {favorites.length > 0 && (
                    <button
                        type="button"
                        className={"chip chip-saved" + (activeCategory === "SAVED" ? " active" : "")}
                        onClick={() => handleCategoryClick(activeCategory === "SAVED" ? "ALL" : "SAVED")}
                        aria-pressed={activeCategory === "SAVED"}
                    >
                        <Icon name="heartFilled" size={14} />
                        Saved ({favorites.length})
                    </button>
                )}
            </div>

            {/* Search Input */}
            <div style={{ position: "relative" }}>
                <input
                    className="search-box"
                    placeholder="Search any service by keyword or category (e.g. plumbing, AC, cleaning)..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    aria-label="Search services"
                />
            </div>

            {/* Category Filter Chips & Sort Controls */}
            <div className="filter-bar">
                <div className="chip-group">
                    <button
                        type="button"
                        className={"chip" + (activeCategory === "ALL" ? " active" : "")}
                        onClick={() => handleCategoryClick("ALL")}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={"chip" + (activeCategory === cat ? " active" : "")}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="sort-wrap">
                    <span className="sort-label">Sort :</span>
                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        aria-label="Sort services"
                    >
                        <option value="default">Default Order</option>
                        <option value="az">Alphabetical (A - Z)</option>
                        <option value="za">Alphabetical (Z - A)</option>
                    </select>
                </div>
            </div>

            {/* Recently Viewed Strip (if any) */}
            {recentServices.length > 0 && (
                <div className="recently-viewed-strip">
                    <div className="recently-viewed-title">
                        <Icon name="clock" size={15} /> Recently Viewed Services
                    </div>
                    <div className="recently-viewed-items">
                        {recentServices.map((r) => (
                            <Link
                                key={r.id}
                                to={"/customer/request/" + r.id}
                                className="recent-chip"
                            >
                                <Icon name={r.categoryName || "tag"} size={14} />
                                <span>{r.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

            {/* Skeleton Loading State */}
            {loading && (
                <div className="service-grid">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="skeleton skeleton-card"></div>
                    ))}
                </div>
            )}

            {/* Active Group / List of Services */}
            {!loading && (
                <div>
                    {activeCategory === "ALL" && sortBy === "default" ? (
                        // Categorized groups
                        Object.keys(groups).map((cat) => (
                            <div key={cat} style={{ marginBottom: 28 }}>
                                <h3 className="category-title">{cat}</h3>
                                <div className="service-grid">
                                    {groups[cat].map((s) => {
                                        const isFav = favorites.includes(s.id);
                                        return (
                                            <div key={s.id} className="service-card">
                                                <div className="service-card-top">
                                                    <h4>{s.name}</h4>
                                                    <button
                                                        type="button"
                                                        className={"fav-btn" + (isFav ? " is-fav" : "")}
                                                        onClick={(e) => toggleFavorite(s.id, e)}
                                                        title={isFav ? "Remove from saved" : "Save service"}
                                                        aria-label={isFav ? "Remove from saved" : "Save service"}
                                                    >
                                                        <Icon name={isFav ? "heartFilled" : "heart"} size={19} />
                                                    </button>
                                                </div>
                                                <p>{s.description}</p>
                                                <Link
                                                    to={"/customer/request/" + s.id}
                                                    className="btn-link"
                                                    style={{ alignSelf: "flex-start", marginTop: "auto" }}
                                                    onClick={() => recordRecentView(s)}
                                                >
                                                    Request This Service
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        // Flat sorted or filtered grid
                        <div className="service-grid">
                            {sorted.map((s) => {
                                const isFav = favorites.includes(s.id);
                                return (
                                    <div key={s.id} className="service-card">
                                        <div className="service-card-top">
                                            <div>
                                                <span className="badge" style={{ marginBottom: 6 }}>{s.categoryName}</span>
                                                <h4>{s.name}</h4>
                                            </div>
                                            <button
                                                type="button"
                                                className={"fav-btn" + (isFav ? " is-fav" : "")}
                                                onClick={(e) => toggleFavorite(s.id, e)}
                                                title={isFav ? "Remove from saved" : "Save service"}
                                                aria-label={isFav ? "Remove from saved" : "Save service"}
                                            >
                                                <Icon name={isFav ? "heartFilled" : "heart"} size={19} />
                                            </button>
                                        </div>
                                        <p>{s.description}</p>
                                        <Link
                                            to={"/customer/request/" + s.id}
                                            className="btn-link"
                                            style={{ alignSelf: "flex-start", marginTop: "auto" }}
                                            onClick={() => recordRecentView(s)}
                                        >
                                            Request This Service
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {!loading && sorted.length === 0 && (
                <EmptyState
                    title={activeCategory === "SAVED" ? "No saved services" : "No services found"}
                    text={
                        activeCategory === "SAVED"
                            ? "Click the heart icon on any service card to save it for quick access."
                            : "Try adjusting your search query or filter category."
                    }
                    icon={activeCategory === "SAVED" ? "heart" : "search"}
                >
                    {activeCategory === "SAVED" ? (
                        <button
                            type="button"
                            className="btn-link"
                            onClick={() => setActiveCategory("ALL")}
                        >
                            Browse All Services
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn-link"
                            onClick={() => { setSearch(""); setActiveCategory("ALL"); }}
                        >
                            Clear Filters
                        </button>
                    )}
                </EmptyState>
            )}
        </div>
    );
}

export default BrowseServices;