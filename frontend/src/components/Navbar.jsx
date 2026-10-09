import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiFetch, getToken } from "../api/api.js";
import LogoutButton from "./LogoutButton.jsx";

function Navbar() {
    const location = useLocation();
    const [roles, setRoles] = useState([]);
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (!getToken()) {
            setRoles([]);
            setEmail("");
            return;
        }
        apiFetch("/api/me")
            .then((me) => {
                setRoles(me.roles);
                setEmail(me.email || "user");
            })
            .catch(() => {
                setRoles([]);
                setEmail("");
            });
    }, [location.pathname]);

    const isCustomer = roles.includes("CUSTOMER");
    const isProvider = roles.includes("PROVIDER");
    const isAdmin = roles.includes("ADMIN");
    const loggedIn = isCustomer || isProvider || isAdmin;

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
                        src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(email)}
                    />
                )}
                {loggedIn && <LogoutButton />}
            </div>
        </nav>
    );
}

export default Navbar;