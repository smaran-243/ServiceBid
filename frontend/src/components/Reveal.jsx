import { useState, useEffect, useRef } from "react";

function Reveal({ children }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || !("IntersectionObserver" in window)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={visible ? "reveal reveal-in" : "reveal"}>
            {children}
        </div>
    );
}

export default Reveal;