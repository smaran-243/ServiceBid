import { Link } from "react-router-dom";

function Logo({ size = "md", to = "/", showTagline = false, className = "" }) {
    const iconSize = size === "sm" ? 28 : size === "lg" ? 48 : 36;
    const textSize = size === "sm" ? 19 : size === "lg" ? 30 : 23;

    const content = (
        <span className={"brand-logo " + className}>
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="brand-logo-icon"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="sbLogoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0e3a43" />
                        <stop offset="100%" stopColor="#1b5a67" />
                    </linearGradient>
                    <linearGradient id="sbLogoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f2704e" />
                        <stop offset="100%" stopColor="#d9532f" />
                    </linearGradient>
                </defs>
                {/* Outer Rounded Container */}
                <rect width="48" height="48" rx="13" fill="url(#sbLogoGrad1)" />
                <rect x="1" y="1" width="46" height="46" rx="12" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

                {/* Dynamic Interlocking 'S' & Bid Exchange Arc */}
                <path
                    d="M32 14H20a5 5 0 0 0-5 5v1a5 5 0 0 0 5 5h8a4 4 0 0 1 4 4v1a5 5 0 0 1-5 5H15"
                    stroke="#ffffff"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Terracotta Bid Node */}
                <circle cx="33" cy="15" r="3.5" fill="url(#sbLogoGrad2)" />
                {/* Sky Accent Node */}
                <circle cx="15" cy="35" r="3" fill="#38bdf8" />
            </svg>

            <div>
                <span className="brand-logo-text" style={{ fontSize: textSize }}>
                    <span>Service</span>
                    <span className="logo-highlight">Bid</span>
                    <span style={{ color: "var(--accent)", marginLeft: 1 }}>.</span>
                </span>
                {showTagline && (
                    <span className="brand-logo-tagline">Competitive Home Services</span>
                )}
            </div>
        </span>
    );

    if (to) {
        return (
            <Link to={to} style={{ textDecoration: "none" }} aria-label="ServiceBid Home">
                {content}
            </Link>
        );
    }
    return content;
}

export default Logo;
