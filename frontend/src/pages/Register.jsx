import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import toast from "react-hot-toast";
import Icon from "../components/Icon.jsx";
import Logo from "../components/Logo.jsx";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CUSTOMER");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await apiFetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password, role }),
            });
            toast.success("Account created. Please log in.");
            navigate("/login");
        } catch (err) {
            if (err.message && err.message.includes("409")) {
                toast.error("This email is already registered.");
            } else {
                toast.error("Registration failed. Check your details and try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-wrap page-enter">
            <form className="form-card" onSubmit={handleSubmit}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                        <Logo size="lg" to="/" />
                    </div>
                    <h2 style={{ margin: "0 0 6px" }}>Create Your Account</h2>
                    <p className="muted-text">Join the competitive bidding home marketplace</p>
                </div>

                <label className="form-label">Full Name</label>
                <input
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label className="form-label">Email Address</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label className="form-label">Password</label>
                <input
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label className="form-label">I want to join as</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="CUSTOMER">Customer (Post jobs & hire providers)</option>
                    <option value="PROVIDER">Service Provider (Bid on local jobs)</option>
                </select>

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

                <button
                    className="btn-link"
                    type="submit"
                    disabled={loading}
                    style={{ width: "100%", padding: "12px", marginTop: 8 }}
                >
                    <Icon name="check" size={16} /> {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="muted-text" style={{ marginTop: 20, textAlign: "center", fontSize: 14 }}>
                    Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Log in</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;