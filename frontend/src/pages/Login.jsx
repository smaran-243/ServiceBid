import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch, saveToken } from "../api/api.js";
import toast from "react-hot-toast";
import Icon from "../components/Icon.jsx";
import Logo from "../components/Logo.jsx";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            saveToken(data.token);

            const me = await apiFetch("/api/me");

            if (me.roles.includes("ADMIN")) {
                navigate("/admin");
            } else if (me.roles.includes("PROVIDER")) {
                navigate("/provider");
            } else {
                navigate("/customer");
            }
        } catch (err) {
            if (err.message && err.message.includes("401")) {
                toast.error("Wrong email or password.");
            } else {
                toast.error("Login failed. Please try again.");
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
                    <h2 style={{ margin: "0 0 6px" }}>Welcome Back</h2>
                    <p className="muted-text">Sign in to your ServiceBid account</p>
                </div>

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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

                <button
                    className="btn-link"
                    type="submit"
                    disabled={loading}
                    style={{ width: "100%", padding: "12px", marginTop: 8 }}
                >
                    <Icon name="check" size={16} /> {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="muted-text" style={{ marginTop: 20, textAlign: "center", fontSize: 14 }}>
                    New to ServiceBid? <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;