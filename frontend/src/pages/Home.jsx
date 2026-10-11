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

const trending = [
    { name: "Plumbing", img: "/images/plumbing.jpg", text: "Leaks, taps, pipes and fittings." },
    { name: "Home Cleaning", img: "/images/cleaning.jpg", text: "Deep clean for every room." },
    { name: "Electrical", img: "/images/electrical.jpg", text: "Wiring, switches and repairs." },
    { name: "AC Repair", img: "/images/ac-repair.jpg", text: "Service and fixes for any AC." },
];

const reasons = [
    { title: "Best price wins", text: "Providers compete, so you see real offers side by side." },
    { title: "Rated providers", text: "Every bid shows the average rating and review count." },
    { title: "Track every job", text: "Follow your booking from accepted to completed." },
    { title: "You stay in control", text: "Work is marked done only when you confirm it." },
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

            <h3 className="category-title">Trending services</h3>
            <div className="trend-grid">
                {trending.map((t) => (
                    <Link key={t.name} to="/customer/services" className="trend-card">
                        <img src={t.img} alt={t.name} loading="lazy" />
                        <div className="trend-overlay">
                            <h4>{t.name}</h4>
                            <p>{t.text}</p>
                            <span className="trend-more">Explore</span>
                        </div>
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

            <div className="why-band">
                <h3 className="category-title">Why choose ServiceBid</h3>
                <div className="why-grid">
                    {reasons.map((r) => (
                        <div key={r.title} className="why-item">
                            <h4>{r.title}</h4>
                            <p>{r.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="cta-band">
                <h2>Ready to get the best offer?</h2>
                <p>Create a free account and post your first request in a minute.</p>
                <div className="hero-buttons">
                    <Link to="/register" className="btn-link">Create free account</Link>
                    <Link to="/login" className="btn-link btn-outline">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Home;