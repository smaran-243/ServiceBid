import { Link } from "react-router-dom";

const categories = [
    "Cleaning",
    "Plumbing",
    "Electrical",
    "AC Repair",
    "Painting",
    "Computer Repair",
    "Appliance Repair",
    "Pest Control",
    "Salon at Home",
];

function Home() {
    return (
        <div>
            <div className="hero hero-split">
                <div>
                    <span className="hero-pill">Competitive bidding for home services</span>
                    <h1>
                        Get the <span className="gradient-text">best price</span> for any home service
                    </h1>
                    <p className="hero-sub">
                        Post what you need. Providers compete with bids. You pick the best offer.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn-link">Get started</Link>
                        <Link to="/login" className="btn-link btn-outline">Login</Link>
                    </div>
                </div>
                <img className="hero-img" src="/images/hero.jpg" alt="Service professional at work" />
            </div>

            <h3 className="category-title">Popular categories</h3>
            <div className="cat-grid">
                {categories.map((c) => (
                    <Link key={c} to="/customer/services" className="cat-card">
                        <div className="cat-icon">{c.charAt(0)}</div>
                        <span>{c}</span>
                    </Link>
                ))}
            </div>

            <h3 className="category-title">How it works</h3>
            <div className="steps">
                <div className="step-card">
                    <div className="step-icon">01</div>
                    <h3>Post a request</h3>
                    <p>Pick a service and describe the job, budget and location.</p>
                </div>
                <div className="step-card">
                    <div className="step-icon">02</div>
                    <h3>Compare bids</h3>
                    <p>Providers send their price and time. See ratings side by side.</p>
                </div>
                <div className="step-card">
                    <div className="step-icon">03</div>
                    <h3>Book and review</h3>
                    <p>Accept the best bid, track the job, then rate the provider.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;