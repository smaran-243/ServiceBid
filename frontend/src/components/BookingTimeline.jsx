import Icon from "./Icon.jsx";

const STEPS = [
    { key: "BID_ACCEPTED", label: "Bid Accepted" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "COMPLETED", label: "Completed" },
];

function BookingTimeline({ status }) {
    if (status === "CANCELLED") {
        return (
            <div style={{ margin: "14px 0 10px", padding: "8px 14px", background: "var(--danger-bg)", color: "var(--danger-text)", borderRadius: "var(--radius-sm)", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                <Icon name="alertCircle" size={16} /> Booking was cancelled.
            </div>
        );
    }

    const current = STEPS.findIndex((s) => s.key === status);

    return (
        <div className="timeline" role="progressbar" aria-label="Booking Progress" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={4}>
            {STEPS.map((s, i) => {
                const isDone = i < current;
                const isCurrent = i === current;
                return (
                    <div
                        key={s.key}
                        className={
                            "timeline-step" +
                            (isDone ? " done" : "") +
                            (isCurrent ? " current" : "")
                        }
                    >
                        <div className="timeline-dot">
                            {isDone ? (
                                <Icon name="check" size={14} />
                            ) : (
                                i + 1
                            )}
                        </div>
                        <div className="timeline-label">{s.label}</div>
                    </div>
                );
            })}
        </div>
    );
}

export default BookingTimeline;