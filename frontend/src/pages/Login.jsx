import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch, saveToken } from "../api/api.js";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

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
            if (err.message.includes("401")) {
                setError("Wrong email or password.");
            } else {
                setError("Login failed. Please try again.");
            }
        }
    }

    return (
        <div className="auth-wrap">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2>Welcome back</h2>
                <p className="muted-text">Log in to continue to ServiceBid.</p>

                <label className="form-label">Email</label>
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
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
                <button className="btn-link" type="submit">Login</button>

                <p className="muted-text" style={{ marginTop: 16 }}>
                    New here? <Link to="/register">Create an account</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;