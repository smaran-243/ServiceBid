const STEPS = [
    { key: "BID_ACCEPTED", label: "Accepted" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "IN_PROGRESS", label: "In progress" },
    { key: "COMPLETED", label: "Completed" },
];

function BookingTimeline({ status }) {
    if (status === "CANCELLED") return null;
    const current = STEPS.findIndex((s) => s.key === status);
    return (
        <div className="timeline">
            {STEPS.map((s, i) => (
                <div
                    key={s.key}
                    className={
                        "timeline-step" +
                        (i < current ? " done" : "") +
                        (i === current ? " current" : "")
                    }
                >
                    <div className="timeline-dot">{i <= current ? "\u2713" : i + 1}</div>
                    <div className="timeline-label">{s.label}</div>
                </div>
            ))}
        </div>
    );
}

export default BookingTimeline;