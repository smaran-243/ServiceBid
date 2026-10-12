import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiFetch, getToken } from "../api/api.js";
import LogoutButton from "./LogoutButton.jsx";
import NotificationBell from "./NotificationBell.jsx";
import Icon from "./Icon.jsx";
import Logo from "./Logo.jsx";

function Navbar() {
    const location = useLocation();
    const [roles, setRoles] = useState([]);
    const [name, setName] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
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
                setRoles(me.roles || []);
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

    function toggleTheme(e) {
        const next = theme === "dark" ? "light" : "dark";
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!document.startViewTransition || reduced) {
            setTheme(next);
            return;
        }
        const x = e.clientX || window.innerWidth - 40;
        const y = e.clientY || 40;
        const radius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );
        const transition = document.startViewTransition(() => {
            document.documentElement.setAttribute("data-theme", next);
            setTheme(next);
        });
        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: [
                        "circle(0px at " + x + "px " + y + "px)",
                        "circle(" + radius + "px at " + x + "px " + y + "px)",
                    ],
                },
                {
                    duration: 650,
                    easing: "ease-in-out",
                    pseudoElement: "::view-transition-new(root)",
                }
            );
        });
    }

    const isActive = (path) => location.pathname === path;
    const profileUrl = isProvider ? "/provider/profile" : isCustomer ? "/customer" : "/admin";
    const roleLabel = isAdmin ? "Admin" : isProvider ? "Provider" : "Customer";

    return (
        <nav className="navbar" role="navigation" aria-label="Main Navigation">
            {/* Zone 1: Brand */}
            <div className="nav-brand-section">
                <Logo size="md" />
            </div>

            {/* Zone 2: Segmented Nav Pills (Desktop) */}
            <div className="nav-center-menu">
                {isCustomer && (
                    <>
                        <Link to="/customer" className={"nav-pill" + (isActive("/customer") ? " nav-pill-active" : "")}>
                            Dashboard
                        </Link>
                        <Link to="/customer/services" className={"nav-pill" + (isActive("/customer/services") ? " nav-pill-active" : "")}>
                            Browse Services
                        </Link>
                        <Link to="/customer/bookings" className={"nav-pill" + (isActive("/customer/bookings") ? " nav-pill-active" : "")}>
                            My Bookings
                        </Link>
                    </>
                )}
                {isProvider && (
                    <>
                        <Link to="/provider" className={"nav-pill" + (isActive("/provider") ? " nav-pill-active" : "")}>
                            Open Requests
                        </Link>
                        <Link to="/provider/bids" className={"nav-pill" + (isActive("/provider/bids") ? " nav-pill-active" : "")}>
                            My Bids
                        </Link>
                        <Link to="/provider/bookings" className={"nav-pill" + (isActive("/provider/bookings") ? " nav-pill-active" : "")}>
                            My Bookings
                        </Link>
                        <Link to="/provider/profile" className={"nav-pill" + (isActive("/provider/profile") ? " nav-pill-active" : "")}>
                            Profile
                        </Link>
                    </>
                )}
                {isAdmin && (
                    <>
                        <Link to="/admin" className={"nav-pill" + (isActive("/admin") ? " nav-pill-active" : "")}>
                            Admin Overview
                        </Link>
                        <Link to="/admin/catalog" className={"nav-pill" + (isActive("/admin/catalog") ? " nav-pill-active" : "")}>
                            Service Catalog
                        </Link>
                    </>
                )}
                {!loggedIn && (
                    <>
                        <Link to="/" className={"nav-pill" + (isActive("/") ? " nav-pill-active" : "")}>
                            Home
                        </Link>
                        <Link to="/customer/services" className={"nav-pill" + (isActive("/customer/services") ? " nav-pill-active" : "")}>
                            Browse Services
                        </Link>
                    </>
                )}
            </div>

            {/* Zone 3: Actions & Toolbar (Desktop) */}
            <div className="nav-actions-toolbar">
                {/* Primary Action Button */}
                {!loggedIn && (
                    <div className="nav-auth-buttons">
                        <Link to="/login" className="nav-ghost-btn">
                            Sign In
                        </Link>
                        <Link to="/register" className="nav-cta-btn">
                            <span>Get Quotes</span>
                            <span className="nav-cta-arrow">&rarr;</span>
                        </Link>
                    </div>
                )}

                {isCustomer && (
                    <Link to="/customer/services" className="nav-cta-btn">
                        <Icon name="search" size={15} />
                        <span>Find Quotes</span>
                    </Link>
                )}

                {isProvider && (
                    <Link to="/provider" className="nav-cta-btn">
                        <Icon name="clock" size={15} />
                        <span>Place Bids</span>
                    </Link>
                )}

                {/* Notification Bell */}
                {(isCustomer || isProvider) && <NotificationBell />}

                {/* Dark/Light Theme Toggle */}
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

                {/* Interactive Clickable User Profile Capsule & Logout */}
                {loggedIn && (
                    <div className="nav-user-cluster">
                        <Link
                            to={profileUrl}
                            className="nav-user-pill"
                            title={`View ${roleLabel} Profile (${name})`}
                            aria-label={`View ${roleLabel} Profile`}
                        >
                            <div className="nav-avatar-wrap">
                                <img
                                    className="nav-avatar"
                                    alt={name + " avatar"}
                                    src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(name)}
                                />
                                <span className="nav-online-dot" />
                            </div>
                            <div className="nav-user-meta">
                                <span className="nav-user-label">{name}</span>
                                <span className="nav-role-badge">{roleLabel}</span>
                            </div>
                            <span className="nav-user-chevron">›</span>
                        </Link>
                        <LogoutButton />
                    </div>
                )}

                {/* Mobile Menu Toggle Button */}
                <button
                    className="mobile-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileOpen}
                >
                    <Icon name={mobileOpen ? "close" : "menu"} size={22} />
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileOpen && (
                <div className="mobile-menu-drawer">
                    {loggedIn && (
                        <Link
                            to={profileUrl}
                            className="mobile-user-header"
                            onClick={() => setMobileOpen(false)}
                            title="View your profile"
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <div className="nav-avatar-wrap">
                                <img
                                    className="nav-avatar"
                                    alt={name + " avatar"}
                                    src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(name)}
                                />
                                <span className="nav-online-dot" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span>{name}</span>
                                    <span className="nav-role-badge">{roleLabel}</span>
                                </div>
                                <div className="muted-text" style={{ fontSize: 12 }}>
                                    View profile &rarr;
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="mobile-nav-links">
                        {isCustomer && (
                            <>
                                <Link to="/customer" onClick={() => setMobileOpen(false)}>Customer Dashboard</Link>
                                <Link to="/customer/services" onClick={() => setMobileOpen(false)}>Browse Services</Link>
                                <Link to="/customer/bookings" onClick={() => setMobileOpen(false)}>My Bookings</Link>
                            </>
                        )}
                        {isProvider && (
                            <>
                                <Link to="/provider" onClick={() => setMobileOpen(false)}>Open Requests Feed</Link>
                                <Link to="/provider/bids" onClick={() => setMobileOpen(false)}>My Active Bids</Link>
                                <Link to="/provider/bookings" onClick={() => setMobileOpen(false)}>My Bookings</Link>
                                <Link to="/provider/profile" onClick={() => setMobileOpen(false)}>Provider Profile</Link>
                            </>
                        )}
                        {isAdmin && (
                            <>
                                <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin Overview</Link>
                                <Link to="/admin/catalog" onClick={() => setMobileOpen(false)}>Manage Catalog</Link>
                            </>
                        )}
                        {!loggedIn && (
                            <>
                                <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
                                <Link to="/customer/services" onClick={() => setMobileOpen(false)}>Browse Services</Link>
                                <Link to="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                                <Link to="/register" onClick={() => setMobileOpen(false)} style={{ color: "var(--accent)", fontWeight: 700 }}>
                                    Create Free Account &rarr;
                                </Link>
                            </>
                        )}
                    </div>

                    {loggedIn && (
                        <div className="mobile-drawer-bottom">
                            <LogoutButton />
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;