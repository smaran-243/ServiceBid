import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

function formatWhen(value) {
    if (!value) return "Not set";
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function RequestCard({ request, showStatus, linkTo, linkText }) {
    const r = request;
    return (
        <div className="request-card">
            <div className="request-top">
                <span className="request-pill">{r.serviceName}</span>
                {showStatus && <StatusBadge status={r.status} />}
            </div>
            <h4 className="request-title">{r.description}</h4>
            <div className="request-box">
                <div className="request-person">
                    <img
                        className="request-face"
                        alt=""
                        src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(r.customerName || "user")}
                    />
                    <div>
                        <strong>{r.customerName}</strong>
                        <div className="muted-text">{r.location}</div>
                    </div>
                </div>
                <div className="request-meta">
                    <div>
                        <span className="request-label">Time</span>
                        <div className="request-value">{formatWhen(r.scheduledAt)}</div>
                    </div>
                    <div className="request-right">
                        <span className="request-label">Budget</span>
                        <div className="request-value">{"\u20B9" + Number(r.budget).toLocaleString("en-IN")}</div>
                    </div>
                </div>
            </div>
            <Link to={linkTo} className="card-link">{linkText}</Link>
        </div>
    );
}

export default RequestCard;