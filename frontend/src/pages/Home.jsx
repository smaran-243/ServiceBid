import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Reveal from "../components/Reveal.jsx";

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
    { name: "Plumbing", img: "/images/plumbing.jpg", text: "Pipe bursts, tap replacements, drainage unblocking.", price: "from ₹499", tag: "Fast Quotes" },
    { name: "Home Cleaning", img: "/images/cleaning.jpg", text: "Deep sanitized clean for kitchens, bathrooms, full homes.", price: "from ₹1,800", tag: "Top Rated" },
    { name: "Electrical", img: "/images/electrical.jpg", text: "Appliance wiring, MCB boards, fixture installations.", price: "from ₹350", tag: "Emergency 24/7" },
    { name: "AC Repair", img: "/images/ac-repair.jpg", text: "Gas recharging, deep jet service, compressor fixes.", price: "from ₹899", tag: "Best Value" },
    { name: "Painting", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80", text: "Full interior walls, exterior waterproofing, texture finishes.", price: "from ₹4,500", tag: "Free Inspection" },
    { name: "Appliance Repair", img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80", text: "Washing machines, microwave ovens, refrigerators.", price: "from ₹550", tag: "Verified Techs" },
];

const topPros = [
    {
        name: "Vikram Rathore",
        role: "Certified Master Electrician",
        jobs: 148,
        rating: 4.96,
        response: "< 10 min",
        avatar: "VikramPro",
        badge: "Top Rated",
        category: "Electrical"
    },
    {
        name: "Suresh Kumar",
        role: "Senior HVAC & AC Technician",
        jobs: 215,
        rating: 4.93,
        response: "< 15 min",
        avatar: "SureshPro",
        badge: "Super Pro",
        category: "AC Repair"
    },
    {
        name: "Raju Paswan",
        role: "Licensed Plumbing Contractor",
        jobs: 182,
        rating: 4.98,
        response: "< 12 min",
        avatar: "RajuPro",
        badge: "Lowest Quotes",
        category: "Plumbing"
    },
    {
        name: "Anita & Team",
        role: "Deep Sanitization Specialist",
        jobs: 310,
        rating: 4.95,
        response: "< 20 min",
        avatar: "AnitaPro",
        badge: "100% Inspected",
        category: "Cleaning"
    }
];

const reasons = [
    {
        title: "Transparent Reverse Auction",
        text: "Rather than paying fixed marked-up rates, providers compete openly for your job, bringing costs down naturally."
    },
    {
        title: "Verified Skill & Reputation",
        text: "Browse verified credentials, real homeowner star ratings, and detailed job histories before accepting any bid."
    },
    {
        title: "Milestone-Guaranteed Delivery",
        text: "Follow every milestone from bid acceptance to completion with clear status updates in real-time."
    },
    {
        title: "Post-Inspection Approval",
        text: "Jobs are only marked complete when you inspect the final work and authorize sign-off."
    },
];

const faqs = [
    {
        q: "How does competitive reverse bidding work?",
        a: "You submit a request describing your job, location, and preferred timing. Verified local contractors review the scope and submit their lowest price with an estimated turnaround. You compare quotes and pick the winning contractor."
    },
    {
        q: "Is there any cost or commitment to post a job?",
        a: "None whatsoever. Posting a request and receiving bids is 100% free with zero obligation. You only move forward if you like an offer."
    },
    {
        q: "How do I choose the best contractor?",
        a: "We automatically flag the 'Lowest price', 'Top rated', and 'Best value' across bids. You can also view contractor bios, past customer reviews, and estimated durations before accepting."
    },
    {
        q: "Can I set an urgent bidding deadline?",
        a: "Yes! Specify an optional deadline to start a real-time countdown. Bidding providers see the countdown and respond immediately."
    },
    {
        q: "What happens once I accept a bid?",
        a: "A binding booking contract is generated. The provider receives your location and coordinates the job schedule. Upon finish, an official itemized tax invoice is ready for download."
    }
];

const testimonials = [
    {
        quote: "Saved ₹1,800 on an emergency AC compressor repair. Within 20 minutes I had 4 bids from certified technicians.",
        author: "Pooja Varma",
        role: "Homeowner, Indiranagar",
        type: "CUSTOMER",
        avatar: "Pooja"
    },
    {
        quote: "As an independent master plumber, ServiceBid lets me fill idle gaps in my schedule without paying expensive lead broker fees.",
        author: "Farhan Siddiqui",
        role: "Licensed Plumbing Contractor",
        type: "PROVIDER",
        avatar: "Farhan"
    },
    {
        quote: "Comparing contractor ratings and itemized quotes side-by-side took the stress completely out of our deep renovation clean.",
        author: "Meera Nair",
        role: "Property Manager, Koramangala",
        type: "CUSTOMER",
        avatar: "Meera"
    }
];

const simOptions = [
    {
        name: "AC Repair",
        category: "AC Repair",
        agency: 2400,
        winning: 1650,
        savingsPct: 31,
        pros: 5,
        desc: "Deep Jet Cleaning + Gas Top-up"
    },
    {
        name: "Plumbing",
        category: "Plumbing",
        agency: 1200,
        winning: 780,
        savingsPct: 35,
        pros: 6,
        desc: "Leak Stop & Mixer Replacement"
    },
    {
        name: "Electrical",
        category: "Electrical",
        agency: 1600,
        winning: 1050,
        savingsPct: 34,
        pros: 4,
        desc: "Main MCB & Rewiring Check"
    },
    {
        name: "Cleaning",
        category: "Cleaning",
        agency: 3500,
        winning: 2400,
        savingsPct: 31,
        pros: 7,
        desc: "2BHK Complete Deep Sanitization"
    }
];

const liveBidsFeed = [
    { text: "Raju P. (Plumbing Pro) bid ₹780 for Tap & Mixer Replacement", time: "2 min ago" },
    { text: "Suresh K. submitted ₹1,650 for AC Jet Cleaning + Gas Top-up", time: "4 min ago" },
    { text: "Pooja V. accepted winning bid ₹2,400 for Deep Cleaning", time: "7 min ago" },
    { text: "Vikram R. (Electrician) bid ₹950 for Main MCB Board Repair", time: "11 min ago" },
    { text: "Anita S. posted new job: Bathroom Waterproofing & Seal", time: "15 min ago" }
];

const quickTags = [
    "AC Deep Clean",
    "Leaking Tap",
    "Wiring Short",
    "Sofa Sanitizing",
    "Ceiling Fan Fix"
];

function Home() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [openFaq, setOpenFaq] = useState(0);
    const [simIndex, setSimIndex] = useState(0);
    const [scope, setScope] = useState("standard");
    const [feedIndex, setFeedIndex] = useState(0);
    const [testiFilter, setTestiFilter] = useState("ALL");

    useEffect(() => {
        const timer = setInterval(() => {
            setFeedIndex((prev) => (prev + 1) % liveBidsFeed.length);
        }, 4500);
        return () => clearInterval(timer);
    }, []);

    function handleSearchSubmit(e) {
        e.preventDefault();
        const q = searchTerm.trim();
        navigate("/customer/services" + (q ? "?q=" + encodeURIComponent(q) : ""));
    }

    function handleQuickTagClick(tag) {
        setSearchTerm(tag);
        navigate("/customer/services?q=" + encodeURIComponent(tag));
    }

    const currentSim = simOptions[simIndex];
    const currentFeed = liveBidsFeed[feedIndex];

    const multiplier = scope === "quick" ? 0.7 : scope === "major" ? 1.8 : 1.0;
    const calcAgency = Math.round(currentSim.agency * multiplier);
    const calcWinning = Math.round(currentSim.winning * multiplier);
    const calcSaved = calcAgency - calcWinning;

    const filteredTestimonials = testimonials.filter((t) => {
        if (testiFilter === "ALL") return true;
        return t.type === testiFilter;
    });

    return (
        <div className="page-enter">
            {/* Bento Hero Section */}
            <div className="bento-hero">
                <div className="hero-main-card">
                    <div>
                        <div className="hero-pill">
                            <span className="hero-pill-dot" />
                            Marketplace Reverse Bidding • Verified Pros
                        </div>
                        <h1>
                            Competitive bidding for <span className="gradient-text">home services</span>.
                        </h1>
                        <p className="hero-sub">
                            Post what you need. Top-rated local professionals compete with transparent bids. You pick the best value.
                        </p>

                        {/* Search Command Bar */}
                        <form className="hero-search-wrap" onSubmit={handleSearchSubmit}>
                            <Icon name="search" size={20} />
                            <input
                                type="text"
                                placeholder="Search electrical, plumbing, AC repair, cleaning..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                aria-label="Search marketplace services"
                            />
                            <button type="submit" className="btn-link">
                                Find Quotes
                            </button>
                        </form>

                        {/* Quick Interactive Search Chips */}
                        <div className="hero-quick-chips">
                            <span className="hero-quick-label">Trending:</span>
                            {quickTags.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    className="quick-chip"
                                    onClick={() => handleQuickTagClick(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="hero-buttons" style={{ marginTop: 24 }}>
                        <Link to="/register" className="btn-link">
                            Post Job Request
                        </Link>
                        <Link to="/customer/services" className="btn-link btn-outline">
                            Explore Catalog
                        </Link>
                    </div>
                </div>

                {/* Right Bento Column - Interactive Simulator & Live Activity */}
                <div className="hero-side-column">
                    {/* Interactive Reverse Auction Simulator */}
                    <div className="sim-card">
                        <div className="sim-header">
                            <div>
                                <div className="bento-badge-tag" style={{ marginBottom: 4 }}>
                                    <Icon name="zap" size={13} /> Live Savings Simulator
                                </div>
                                <h3 style={{ margin: 0, fontSize: 18 }}>Instant Bidding Estimate</h3>
                            </div>
                            <span className="sim-savings-badge">
                                Save ₹{calcSaved.toLocaleString("en-IN")}
                            </span>
                        </div>

                        {/* Service Switcher Tabs */}
                        <div className="sim-service-selector">
                            {simOptions.map((opt, idx) => (
                                <button
                                    key={opt.name}
                                    type="button"
                                    className={"sim-service-btn" + (simIndex === idx ? " active" : "")}
                                    onClick={() => setSimIndex(idx)}
                                >
                                    {opt.name}
                                </button>
                            ))}
                        </div>

                        {/* Scope Selector */}
                        <div className="scope-selector">
                            <button
                                type="button"
                                className={"scope-chip" + (scope === "quick" ? " active" : "")}
                                onClick={() => setScope("quick")}
                            >
                                Minor Fix
                            </button>
                            <button
                                type="button"
                                className={"scope-chip" + (scope === "standard" ? " active" : "")}
                                onClick={() => setScope("standard")}
                            >
                                Standard Scope
                            </button>
                            <button
                                type="button"
                                className={"scope-chip" + (scope === "major" ? " active" : "")}
                                onClick={() => setScope("major")}
                            >
                                Full Overhaul
                            </button>
                        </div>

                        {/* Price Comparison Widget */}
                        <div className="sim-comparison-wrap">
                            <div className="sim-row">
                                <span className="sim-label">Standard Fixed Agency:</span>
                                <span className="sim-agency-price">₹{calcAgency.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="sim-row">
                                <span className="sim-label" style={{ fontWeight: 600, color: "var(--text)" }}>
                                    ServiceBid Winning Target:
                                </span>
                                <span className="sim-winning-price">₹{calcWinning.toLocaleString("en-IN")}</span>
                            </div>

                            {/* Visual Progress Bar */}
                            <div className="sim-savings-bar">
                                <div
                                    className="sim-savings-bar-fill"
                                    style={{ width: currentSim.savingsPct + "%" }}
                                />
                            </div>

                            <div className="sim-row" style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                                <span>{currentSim.desc}</span>
                                <span style={{ color: "var(--success)", fontWeight: 700 }}>
                                    {currentSim.pros} pros active
                                </span>
                            </div>
                        </div>

                        <Link
                            to={"/customer/services?cat=" + encodeURIComponent(currentSim.category)}
                            className="sim-action-btn"
                        >
                            <span>Get Free Bids for {currentSim.name}</span>
                            <span style={{ fontSize: 16 }}>&rarr;</span>
                        </Link>
                    </div>

                    {/* Interactive Rotating Live Bidding Feed */}
                    <div className="live-activity-card">
                        <div className="live-activity-top">
                            <div className="live-pulse-badge">
                                <span className="live-dot" /> Live Market Feed
                            </div>
                            <div className="live-feed-nav">
                                <button
                                    type="button"
                                    className="live-feed-btn"
                                    onClick={() => setFeedIndex((prev) => (prev - 1 + liveBidsFeed.length) % liveBidsFeed.length)}
                                    aria-label="Previous live update"
                                >
                                    &larr;
                                </button>
                                <button
                                    type="button"
                                    className="live-feed-btn"
                                    onClick={() => setFeedIndex((prev) => (prev + 1) % liveBidsFeed.length)}
                                    aria-label="Next live update"
                                >
                                    &rarr;
                                </button>
                            </div>
                        </div>

                        <div className="live-feed-content">
                            <span>{currentFeed.text}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--muted)" }}>
                            <span>Real-time contractor network</span>
                            <span>{currentFeed.time}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Marketplace Stats Strip */}
            <Reveal>
                <div className="stats-strip">
                    <div className="stats-strip-item">
                        <h4>14,200+</h4>
                        <p>Jobs Awarded</p>
                    </div>
                    <div className="stats-strip-item">
                        <h4>4.92 / 5</h4>
                        <p>Contractor Rating</p>
                    </div>
                    <div className="stats-strip-item">
                        <h4>28.4%</h4>
                        <p>Average Cost Saved</p>
                    </div>
                    <div className="stats-strip-item">
                        <h4>12 min</h4>
                        <p>First Bid Turnaround</p>
                    </div>
                </div>
            </Reveal>

            {/* Popular Categories */}
            <Reveal>
                <h3 className="category-title">Popular Service Categories</h3>
                <div className="cat-grid">
                    {categories.map((c) => (
                        <Link
                            key={c}
                            to={"/customer/services?cat=" + encodeURIComponent(c)}
                            className="cat-card"
                        >
                            <div className="cat-icon">
                                <Icon name={c} size={24} />
                            </div>
                            <span>{c}</span>
                        </Link>
                    ))}
                </div>
            </Reveal>

            {/* Trending Services */}
            <Reveal>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                    <div>
                        <h3 className="category-title" style={{ margin: "0 0 4px", flex: "none" }}>High-Demand Service Requests</h3>
                        <p className="muted-text" style={{ margin: 0, fontSize: 13.5 }}>Browse verified categories with live reverse bidding turnaround.</p>
                    </div>
                </div>

                <div className="trend-grid">
                    {trending.map((t) => (
                        <Link
                            key={t.name}
                            to={"/customer/services?q=" + encodeURIComponent(t.name)}
                            className="trend-card"
                        >
                            <img src={t.img} alt={t.name} loading="lazy" />
                            <div className="trend-overlay">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                    <span className="badge" style={{ background: "rgba(255,255,255,0.22)", color: "#ffffff", borderColor: "rgba(255,255,255,0.35)", fontSize: 11, padding: "2px 8px" }}>
                                        {t.tag}
                                    </span>
                                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#fca58f" }}>
                                        {t.price}
                                    </span>
                                </div>
                                <h4>{t.name}</h4>
                                <p>{t.text}</p>
                                <span className="trend-more">
                                    Get competitive quotes &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </Reveal>

            {/* Verified Contractor Spotlight Section */}
            <Reveal>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 40, marginBottom: 16 }}>
                    <div>
                        <h3 className="category-title" style={{ margin: "0 0 4px", flex: "none" }}>Verified Top-Rated Contractors</h3>
                        <p className="muted-text" style={{ margin: 0, fontSize: 13.5 }}>Background-checked licensed independent professionals ready to bid on your jobs.</p>
                    </div>
                    <Link to="/customer/services" className="btn-link btn-light" style={{ fontSize: 13, padding: "6px 14px" }}>
                        View All Providers &rarr;
                    </Link>
                </div>

                <div className="pro-grid">
                    {topPros.map((pro) => (
                        <div key={pro.name} className="pro-card">
                            <div className="pro-card-header">
                                <div style={{ position: "relative" }}>
                                    <img
                                        className="pro-avatar"
                                        src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(pro.avatar)}
                                        alt={pro.name}
                                    />
                                    <span className="pro-online-badge" />
                                </div>
                                <span className="pro-badge-tag">{pro.badge}</span>
                            </div>

                            <div className="pro-info">
                                <h4>{pro.name}</h4>
                                <span className="pro-role">{pro.role}</span>
                            </div>

                            <div className="pro-stats-row">
                                <div className="pro-stat">
                                    <span className="pro-stat-val">★ {pro.rating}</span>
                                    <span className="pro-stat-lbl">Rating</span>
                                </div>
                                <div className="pro-stat">
                                    <span className="pro-stat-val">{pro.jobs}</span>
                                    <span className="pro-stat-lbl">Jobs</span>
                                </div>
                                <div className="pro-stat">
                                    <span className="pro-stat-val">{pro.response}</span>
                                    <span className="pro-stat-lbl">Response</span>
                                </div>
                            </div>

                            <Link
                                to={"/customer/services?cat=" + encodeURIComponent(pro.category)}
                                className="pro-cta-btn"
                            >
                                Request Quote From {pro.name.split(" ")[0]} &rarr;
                            </Link>
                        </div>
                    ))}
                </div>
            </Reveal>

            {/* How It Works */}
            <Reveal>
                <h3 className="category-title">How Service Bidding Works</h3>
                <div className="steps">
                    <div className="step-card">
                        <div className="step-icon">01</div>
                        <h3>Post Scope & Budget</h3>
                        <p>Choose your service, specify job details, set a target budget, and choose timing.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon">02</div>
                        <h3>Contractors Compete</h3>
                        <p>Local pros receive your request and submit their best prices and estimated turnaround.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon">03</div>
                        <h3>Compare & Accept</h3>
                        <p>Review lowest prices, ratings, and contractor profiles side-by-side, then award the job.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon">04</div>
                        <h3>Inspect & Review</h3>
                        <p>Confirm successful completion, rate your provider, and download your official tax invoice.</p>
                    </div>
                </div>
            </Reveal>

            {/* Why Choose ServiceBid */}
            <Reveal>
                <div className="why-band">
                    <h3 className="category-title" style={{ marginTop: 8 }}>Why Homeowners Trust ServiceBid</h3>
                    <div className="why-grid">
                        {reasons.map((r) => (
                            <div key={r.title} className="why-item">
                                <h4>{r.title}</h4>
                                <p>{r.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>

            {/* Customer Testimonials with Interactive Category Filtering */}
            <Reveal>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 32, marginBottom: 16 }}>
                    <h3 className="category-title" style={{ margin: 0, flex: "none" }}>Verified Customer & Contractor Stories</h3>
                    <div className="testi-filter-bar" style={{ margin: 0 }}>
                        <button
                            type="button"
                            className={"testi-filter-chip" + (testiFilter === "ALL" ? " active" : "")}
                            onClick={() => setTestiFilter("ALL")}
                        >
                            All Stories ({testimonials.length})
                        </button>
                        <button
                            type="button"
                            className={"testi-filter-chip" + (testiFilter === "CUSTOMER" ? " active" : "")}
                            onClick={() => setTestiFilter("CUSTOMER")}
                        >
                            Homeowners
                        </button>
                        <button
                            type="button"
                            className={"testi-filter-chip" + (testiFilter === "PROVIDER" ? " active" : "")}
                            onClick={() => setTestiFilter("PROVIDER")}
                        >
                            Contractors
                        </button>
                    </div>
                </div>

                <div className="testimonials-grid" style={{ marginTop: 20 }}>
                    {filteredTestimonials.map((t, idx) => (
                        <div key={idx} className="testimonial-card">
                            <div style={{ display: "flex", gap: 3, color: "var(--accent)", marginBottom: 12 }}>
                                {[0, 1, 2, 3, 4].map((s) => (
                                    <Icon key={s} name="star" size={15} />
                                ))}
                            </div>
                            <p className="testimonial-quote">"{t.quote}"</p>
                            <div className="testimonial-author">
                                <img
                                    className="testimonial-avatar"
                                    src={"https://api.dicebear.com/9.x/avataaars/svg?seed=" + encodeURIComponent(t.avatar)}
                                    alt={t.author}
                                />
                                <div>
                                    <div className="testimonial-name">{t.author}</div>
                                    <div className="testimonial-role">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Reveal>

            {/* FAQ Accordion */}
            <Reveal>
                <h3 className="category-title">Frequently Asked Questions</h3>
                <div className="faq-list">
                    {faqs.map((f, i) => {
                        const isOpen = openFaq === i;
                        return (
                            <div key={i} className={"faq-item" + (isOpen ? " open" : "")}>
                                <button
                                    type="button"
                                    className="faq-header"
                                    onClick={() => setOpenFaq(isOpen ? null : i)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{f.q}</span>
                                    <span className="faq-icon">
                                        <Icon name="chevronDown" size={18} />
                                    </span>
                                </button>
                                {isOpen && (
                                    <div className="faq-body">
                                        {f.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Reveal>

            {/* Final Call to Action */}
            <Reveal>
                <div className="cta-band">
                    <h2>Ready to find your best contractor quote?</h2>
                    <p>
                        Post your request in minutes and let certified professionals compete for your business.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn-link">
                            Create Free Account
                        </Link>
                        <Link to="/customer/services" className="btn-link btn-outline">
                            Browse All Services
                        </Link>
                    </div>
                </div>
            </Reveal>
        </div>
    );
}

export default Home;