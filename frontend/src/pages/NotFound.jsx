import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";

function NotFound() {
    return (
        <div className="page-enter" style={{ textAlign: "center", padding: "64px 20px" }}>
            <div
                style={{
                    width: 80,
                    height: 80,
                    margin: "0 auto 20px",
                    borderRadius: "50%",
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Icon name="alertCircle" size={40} />
            </div>

            <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", margin: "0 0 10px", color: "var(--accent)" }}>
                404
            </h1>
            <h2>Page Not Found</h2>
            <p className="muted-text" style={{ maxWidth: 480, margin: "0 auto 28px", fontSize: 16 }}>
                The page you are looking for doesn't exist, has been moved, or the link may be outdated.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                <Link to="/" className="btn-link">
                    Return to Homepage
                </Link>
                <Link to="/customer/services" className="btn-link btn-light">
                    Browse Available Services
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
