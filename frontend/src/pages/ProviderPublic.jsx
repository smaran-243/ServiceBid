import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import EmptyState from "../components/EmptyState.jsx";
import Icon from "../components/Icon.jsx";

function stars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
}

function ProviderPublic() {
    const { providerId } = useParams();
    const [profile, setProfile] = useState(null);
    const [services, setServices] = useState([]);
    const [rating, setRating] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const base = "/api/providers/" + providerId;
        Promise.all([
            apiFetch(base + "/profile").catch(() => null),
            apiFetch(base + "/services").catch(() => []),
            apiFetch(base + "/rating").catch(() => null),
            apiFetch(base + "/reviews").catch(() => []),
        ]).then(([p, s, r, rv]) => {
            setProfile(p);
            setServices(s || []);
            setRating(r);
            setReviews(rv || []);
            setLoading(false);
        });
    }, [providerId]);

    const name = profile && profile.providerName ? profile.providerName : "Service Provider";
    const hasRating = rating && rating.reviewCount > 0;

    return (
        <div className="page-enter" style={{ maxWidth: 840, margin: "0 auto" }}>
            <p>
                <Link to="/customer" className="card-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    &larr; Back to dashboard
                </Link>
            </p>

            {loading && <div className="skeleton skeleton-row"></div>}

            {!loading && (
                <>
                    {/* Provider Profile Header Card */}
                    <div className="item-card profile-head" style={{ padding: 26, background: "var(--card)" }}>
                        <img
                            className="avatar profile-face"
                            alt=""
                            src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(name)}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <h2 style={{ margin: 0 }}>{name}</h2>
                                <span className="badge badge-COMPLETED">
                                    <Icon name="shield" size={13} /> Verified Provider
                                </span>
                            </div>

                            <div className="muted-text" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, fontSize: 14 }}>
                                {hasRating ? (
                                    <>
                                        <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 16 }}>
                                            ★ {Number(rating.averageRating).toFixed(1)}
                                        </span>
                                        <span>({rating.reviewCount} customer reviews)</span>
                                    </>
                                ) : (
                                    <span>New provider • No ratings yet</span>
                                )}
                            </div>

                            {profile && profile.phone && (
                                <div className="muted-text" style={{ marginTop: 6, fontSize: 13.5 }}>
                                    Verified Phone: <strong>{profile.phone}</strong>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* About Section */}
                    {profile && profile.bio && (
                        <div className="item-card" style={{ marginTop: 20, padding: 22 }}>
                            <h3 className="category-title" style={{ margin: "0 0 10px" }}>About Provider</h3>
                            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{profile.bio}</p>
                        </div>
                    )}

                    {/* Services Offered */}
                    <div style={{ marginTop: 24 }}>
                        <h3 className="category-title">Services Offered ({services.length})</h3>
                        {services.length === 0 && (
                            <p className="muted-text">No services listed yet.</p>
                        )}
                        <div className="tag-row">
                            {services.map((s) => (
                                <span key={s.id} className="bid-tag" style={{ fontSize: 13, padding: "5px 12px" }}>
                                    <Icon name={s.categoryName || "tag"} size={14} /> {s.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Customer Reviews */}
                    <div style={{ marginTop: 28 }}>
                        <h3 className="category-title">Customer Reviews & Ratings ({reviews.length})</h3>
                        {reviews.length === 0 && (
                            <EmptyState
                                title="No reviews yet"
                                text="Reviews and ratings will appear here after customers confirm completed service jobs."
                                icon="star"
                            />
                        )}
                        <div className="card-list">
                            {reviews.map((rv) => (
                                <div key={rv.id} className="item-card" style={{ padding: 20 }}>
                                    <div className="item-head">
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <img
                                                className="avatar"
                                                style={{ width: 36, height: 36 }}
                                                alt=""
                                                src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(rv.customerName || "customer")}
                                            />
                                            <div>
                                                <strong>{rv.customerName || "Verified Homeowner"}</strong>
                                                <div className="muted-text" style={{ fontSize: 12 }}>
                                                    {rv.createdAt ? new Date(rv.createdAt).toLocaleDateString("en-IN") : ""}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="review-stars">{stars(rv.rating)}</span>
                                    </div>
                                    {rv.comment && (
                                        <p style={{ marginTop: 10, marginBottom: 0, fontSize: 14.5, fontStyle: "italic" }}>
                                            "{rv.comment}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ProviderPublic;