import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";
import Countdown from "./Countdown.jsx";
import Icon from "./Icon.jsx";

function formatWhen(value) {
    if (!value) return "Flexible";
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

            {r.status === "OPEN" && r.bidDeadline && (
                <div style={{ marginTop: -2 }}>
                    <Countdown deadline={r.bidDeadline} />
                </div>
            )}

            <div className="request-box">
                <div className="request-person">
                    <img
                        className="request-face"
                        alt=""
                        src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(r.customerName || "user")}
                    />
                    <div>
                        <strong>{r.customerName || "Customer"}</strong>
                        <div className="muted-text" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                            <Icon name="location" size={13} /> {r.location}
                        </div>
                    </div>
                </div>

                <div className="request-meta">
                    <div>
                        <span className="request-label">Scheduled</span>
                        <div className="request-value">{formatWhen(r.scheduledAt)}</div>
                    </div>
                    <div className="request-right">
                        <span className="request-label">Budget</span>
                        <div className="request-value" style={{ color: "var(--accent)" }}>
                            {"\u20B9" + Number(r.budget).toLocaleString("en-IN")}
                        </div>
                    </div>
                </div>
            </div>

            <Link
                to={linkTo}
                className="btn-link"
                style={{ textAlign: "center", marginTop: "auto" }}
            >
                {linkText} &rarr;
            </Link>
        </div>
    );
}

export default RequestCard;