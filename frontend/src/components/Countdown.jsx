import { useState, useEffect } from "react";

function Countdown({ deadline }) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    if (!deadline) return null;
    const end = new Date(deadline + "Z").getTime();
    if (isNaN(end)) return null;

    const left = end - now;
    if (left <= 0) {
        return <span className="countdown countdown-closed">Bidding closed</span>;
    }

    const s = Math.floor(left / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    let text = "";
    if (d > 0) text += d + "d ";
    if (d > 0 || h > 0) text += h + "h ";
    text += m + "m " + String(sec).padStart(2, "0") + "s";

    return (
        <span className="countdown">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </svg>
            Bidding closes in {text}
        </span>
    );
}

export default Countdown;