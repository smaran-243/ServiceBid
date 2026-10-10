import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import EmptyState from "../components/EmptyState.jsx";

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
            setServices(s);
            setRating(r);
            setReviews(rv);
            setLoading(false);
        });
    }, [providerId]);

    const name = profile && profile.providerName ? profile.providerName : "Provider";
    const hasRating = rating && rating.reviewCount > 0;

    return (
        <div>
            <p><Link to="/customer">Back to dashboard</Link></p>
            {loading && <div className="skeleton skeleton-row"></div>}
            {!loading && (
                <>
                    <div className="item-card profile-head">
                        <img
                            className="avatar profile-face"
                            alt=""
                            src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(name)}
                        />
                        <div>
                            <h2 style={{ margin: 0 }}>{name}</h2>
                            <div className="muted-text">
                                {hasRating
                                    ? Number(rating.averageRating).toFixed(1) + " average rating (" + rating.reviewCount + " reviews)"
                                    : "No reviews yet"}
                            </div>
                            {profile && profile.phone && <div className="muted-text">Phone: {profile.phone}</div>}
                        </div>
                    </div>

                    {profile && profile.bio && (
                        <>
                            <h3 className="category-title">About</h3>
                            <p>{profile.bio}</p>
                        </>
                    )}

                    <h3 className="category-title">Services offered</h3>
                    {services.length === 0 && <p className="muted-text">No services listed yet.</p>}
                    <div className="tag-row">
                        {services.map((s) => (
                            <span key={s.id} className="bid-tag">{s.name}</span>
                        ))}
                    </div>

                    <h3 className="category-title">Reviews</h3>
                    {reviews.length === 0 && (
                        <EmptyState title="No reviews yet" text="Reviews appear here after customers rate completed jobs." />
                    )}
                    <div className="card-list">
                        {reviews.map((rv) => (
                            <div key={rv.id} className="item-card">
                                <div className="item-head">
                                    <strong>{rv.customerName}</strong>
                                    <span className="review-stars">{stars(rv.rating)}</span>
                                </div>
                                {rv.comment && <p>{rv.comment}</p>}
                                <p className="muted-text">
                                    {rv.createdAt ? new Date(rv.createdAt).toLocaleDateString("en-IN") : ""}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ProviderPublic;