import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import ProviderDashboard from "./pages/ProviderDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function Home() {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        fetch("http://localhost:8080/api/health")
            .then((res) => res.text())
            .then((data) => setMessage(data))
            .catch(() => setMessage("Cannot reach backend"));
    }, []);

    return <p>Backend says: {message}</p>;
}

function App() {
    return (
        <div>
            <h1>ServiceBid</h1>
            <nav>
                <Link to="/">Home</Link> | <Link to="/register">Register</Link> |{" "}
                <Link to="/login">Login</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/customer"
                    element={
                        <ProtectedRoute role="CUSTOMER">
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/provider"
                    element={
                        <ProtectedRoute role="PROVIDER">
                            <ProviderDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;