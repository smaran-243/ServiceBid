import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api.js";

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
            navigate("/login");
        } catch (err) {
            if (err.message.includes("409")) {
                setError("This email is already registered.");
            } else {
                setError("Registration failed. Check your details and try again.");
            }
        }
    }

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="CUSTOMER">Customer</option>
                        <option value="PROVIDER">Provider</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Register;