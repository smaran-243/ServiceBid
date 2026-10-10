import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiFetch, getToken } from "../api/api.js";
import LogoutButton from "./LogoutButton.jsx";

function Navbar() {
    const location = useLocation();
    const [roles, setRoles] = useState([]);
    const [name, setName] = useState("");
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem("theme") || "light";
        } catch {
            return "light";
        }
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try {
            localStorage.setItem("theme", theme);
        } catch {
            // ignore
        }
    }, [theme]);

    useEffect(() => {
        if (!getToken()) return;
        apiFetch("/api/me")
            .then((me) => {
                setRoles(me.roles);
                setName(me.name || me.email || "user");
            })
            .catch(() => {
                setRoles([]);
                setName("");
            });
    }, [location.pathname]);

    const hasToken = !!getToken();
    const isCustomer = hasToken && roles.includes("CUSTOMER");
    const isProvider = hasToken && roles.includes("PROVIDER");
    const isAdmin = hasToken && roles.includes("ADMIN");
    const loggedIn = isCustomer || isProvider || isAdmin;

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    return (
        <nav className="navbar">
            <Link to="/" className="brand">ServiceBid</Link>
            <div className="nav-links">
                {isCustomer && (
                    <>
                        <Link to="/customer">Dashboard</Link>
                        <Link to="/customer/services">Browse services</Link>
                        <Link to="/customer/bookings">My bookings</Link>
                    </>
                )}
                {isProvider && (
                    <>
                        <Link to="/provider">Open requests</Link>
                        <Link to="/provider/bids">My bids</Link>
                        <Link to="/provider/bookings">My bookings</Link>
                        <Link to="/provider/profile">My profile</Link>
                    </>
                )}
                {isAdmin && (
                    <>
                        <Link to="/admin">Admin</Link>
                    </>
                )}
                {!loggedIn && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
                {loggedIn && (
                    <img
                        className="nav-avatar"
                        alt="Profile"
                        src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(name)}
                    />
                )}
                {loggedIn && <LogoutButton />}
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle dark mode"
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {theme === "dark" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                        </svg>
                    )}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;