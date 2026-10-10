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
        } catch (e) {
            return "light";
        }
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try {
            localStorage.setItem("theme", theme);
        } catch (e) {
            // ignore
        }
    }, [theme]);

    useEffect(() => {
        if (!getToken()) {
            setRoles([]);
            setName("");
            return;
        }
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

    const isCustomer = roles.includes("CUSTOMER");
    const isProvider = roles.includes("PROVIDER");
    const isAdmin = roles.includes("ADMIN");
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
                <button className="btn-light" onClick={toggleTheme}>
                    {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;