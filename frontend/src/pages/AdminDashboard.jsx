import { useState, useEffect } from "react";
import { apiFetch } from "../api/api.js";

function formatDate(value) {
    return value ? new Date(value).toLocaleString() : "";
}

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([
            apiFetch("/api/admin/users"),
            apiFetch("/api/admin/requests"),
            apiFetch("/api/admin/bookings"),
        ])
            .then(([u, r, b]) => {
                setUsers(u);
                setRequests(r);
                setBookings(b);
            })
            .catch(() => setError("Could not load admin data."));
    }, []);

    return (
        <div>
            <h2>Admin</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3>Users ({users.length})</h3>
            <table className="admin-table">
                <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Created</th></tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>{formatDate(u.createdAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>Requests ({requests.length})</h3>
            <table className="admin-table">
                <thead>
                <tr><th>ID</th><th>Service</th><th>Customer</th><th>Budget</th><th>Location</th><th>Status</th><th>Created</th></tr>
                </thead>
                <tbody>
                {requests.map((r) => (
                    <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.serviceName}</td>
                        <td>{r.customerName}</td>
                        <td>{r.budget}</td>
                        <td>{r.location}</td>
                        <td>{r.status}</td>
                        <td>{formatDate(r.createdAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>Bookings ({bookings.length})</h3>
            <table className="admin-table">
                <thead>
                <tr><th>ID</th><th>Service</th><th>Customer</th><th>Provider</th><th>Amount</th><th>Status</th><th>Created</th></tr>
                </thead>
                <tbody>
                {bookings.map((b) => (
                    <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.serviceName}</td>
                        <td>{b.customerName}</td>
                        <td>{b.providerName}</td>
                        <td>{b.agreedAmount}</td>
                        <td>{b.status}</td>
                        <td>{formatDate(b.createdAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;