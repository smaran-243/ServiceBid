import { useState, useEffect } from "react";

function CountUp({ value, format }) {
    const [shown, setShown] = useState(0);

    useEffect(() => {
        const target = Number(value) || 0;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const duration = reduced ? 0 : 900;
        const start = performance.now();
        let raf;
        function tick(now) {
            const p = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setShown(target * eased);
            if (p < 1) raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [value]);

    return <>{format ? format(shown) : Math.round(shown)}</>;
}

export default CountUp;