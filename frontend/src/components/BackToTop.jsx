import { useState, useEffect } from "react";
import Icon from "./Icon.jsx";

function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function onScroll() {
            if (window.scrollY > 320) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    if (!visible) return null;

    return (
        <button
            type="button"
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            title="Back to top"
        >
            <Icon name="arrowUp" size={20} />
        </button>
    );
}

export default BackToTop;
