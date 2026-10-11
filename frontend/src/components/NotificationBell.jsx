import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiFetch } from "../api/api.js";

function NotificationBell() {
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);
    const box = useRef(null);

    useEffect(() => {
        function load() {
            apiFetch("/api/notifications")
                .then((data) => setItems(data))
                .catch(() => {});
        }
        load();
        const id = setInterval(load, 30000);
        return () => clearInterval(id);
    }, [location.pathname]);

    useEffect(() => {
        function onClick(e) {
            if (box.current && !box.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    return (
        <div className="bell-wrap" ref={box}>
            <button
                className="theme-toggle"
                onClick={() => setOpen(!open)}
                aria-label="Notifications"
                title="Notifications"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9a6 6 0 0 1 12 0c0 6 2 7.5 2 7.5H4S6 15 6 9z" />
                    <path d="M10 20a2 2 0 0 0 4 0" />
                </svg>
            </button>
            {items.length > 0 && <span className="bell-badge">{items.length}</span>}
            {open && (
                <div className="bell-menu">
                    <div className="bell-title">Needs your attention</div>
                    {items.length === 0 && <div className="bell-empty">You are all caught up.</div>}
                    {items.map((n, i) => (
                        <Link key={i} to={n.link} className="bell-item" onClick={() => setOpen(false)}>
                            {n.text}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;