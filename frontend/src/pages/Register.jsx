import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import toast from "react-hot-toast";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CUSTOMER");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            await apiFetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ name, email, password, role }),
            });
            toast.success("Account created. Please log in.");
            navigate("/login");
        } catch (err) {
            if (err.message.includes("409")) {
                toast.error("This email is already registered.");
            } else {
                toast.error("Registration failed. Check your details and try again.");
            }
        }
    }

    return (
        <div className="auth-wrap">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2>Create your account</h2>
                <p className="muted-text">Join ServiceBid as a customer or a provider.</p>

                <label className="form-label">Name</label>
                <input
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

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
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label className="form-label">I am a</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="CUSTOMER">Customer</option>
                    <option value="PROVIDER">Provider</option>
                </select>

                {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
                <button className="btn-link" type="submit">Register</button>

                <p className="muted-text" style={{ marginTop: 16 }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;