import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
            // 1. Log in and save the token
            const data = await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            saveToken(data.token);

            // 2. Ask the backend who we are, to find the role
            const me = await apiFetch("/api/me");

            // 3. Go to the right dashboard
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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Login;