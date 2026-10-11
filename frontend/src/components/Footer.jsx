import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import Logo from "./Logo.jsx";

function Footer() {
    return (
        <footer className="app-footer">
            <div className="footer-top">
                <div className="footer-brand-col">
                    <div className="brand-wrap" style={{ marginBottom: 14 }}>
                        <Logo size="md" showTagline={true} />
                    </div>
                    <p>
                        The next-generation competitive marketplace where verified local service professionals compete with transparent bids to deliver maximum value for your home.
                    </p>
                    <div className="footer-badges" style={{ marginTop: 16 }}>
                        <span className="footer-badge-pill">
                            <Icon name="shield" size={14} /> 100% Verified Contractors
                        </span>
                        <span className="footer-badge-pill">
                            <Icon name="check" size={14} /> Guaranteed Price Lock
                        </span>
                    </div>
                </div>

                <div>
                    <div className="footer-heading">For Homeowners</div>
                    <div className="footer-links">
                        <Link to="/customer/services">Browse All Services</Link>
                        <Link to="/customer">Customer Dashboard</Link>
                        <Link to="/customer/bookings">Track My Bookings</Link>
                        <Link to="/register">Create Free Account</Link>
                    </div>
                </div>

                <div>
                    <div className="footer-heading">For Contractors</div>
                    <div className="footer-links">
                        <Link to="/provider">Browse Open Requests</Link>
                        <Link to="/provider/bids">My Active Bids</Link>
                        <Link to="/provider/bookings">Job Schedule</Link>
                        <Link to="/provider/profile">Trade Qualifications</Link>
                    </div>
                </div>

                <div>
                    <div className="footer-heading">Marketplace Trust</div>
                    <div className="footer-links">
                        <Link to="/">How Bidding Works</Link>
                        <Link to="/login">Sign In</Link>
                        <span className="muted-text" style={{ fontSize: 13.5 }}>Support: concierge@servicebid.com</span>
                        <span className="muted-text" style={{ fontSize: 13.5 }}>Direct Line: +91 (800) 420-BIDS</span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div>
                    &copy; {new Date().getFullYear()} ServiceBid Technologies. Engineered for fair, transparent home commerce.
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                    <span className="muted-text">Privacy Policy</span>
                    <span className="muted-text">&bull;</span>
                    <span className="muted-text">Terms of Service</span>
                    <span className="muted-text">&bull;</span>
                    <span className="muted-text">Contractor Code of Conduct</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
