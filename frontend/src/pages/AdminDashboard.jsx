import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Icon from "../components/Icon.jsx";
import CountUp from "../components/CountUp.jsx";

function formatDate(value) {
    return value ? new Date(value).toLocaleString() : "-";
}

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [userRoleFilter, setUserRoleFilter] = useState("ALL");
    const [requestStatusFilter, setRequestStatusFilter] = useState("ALL");
    const [bookingStatusFilter, setBookingStatusFilter] = useState("ALL");

    useEffect(() => {
        Promise.all([
            apiFetch("/api/admin/users"),
            apiFetch("/api/admin/requests"),
            apiFetch("/api/admin/bookings"),
        ])
            .then(([u, r, b]) => {
                setUsers(u || []);
                setRequests(r || []);
                setBookings(b || []);
            })
            .catch(() => setError("Could not load admin data."))
            .finally(() => setLoading(false));
    }, []);

    const filteredUsers = users.filter((u) => {
        if (userRoleFilter === "ALL") return true;
        return u.role === userRoleFilter;
    });

    const filteredRequests = requests.filter((r) => {
        if (requestStatusFilter === "ALL") return true;
        return r.status === requestStatusFilter;
    });

    const filteredBookings = bookings.filter((b) => {
        if (bookingStatusFilter === "ALL") return true;
        return b.status === bookingStatusFilter;
    });

    return (
        <div className="page-enter">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
                <div>
                    <h2>Platform Administration</h2>
                    <p className="muted-text">Overview of platform accounts, active requests, and service bookings.</p>
                </div>
                <div className="action-row" style={{ margin: 0 }}>
                    <Link to="/admin/catalog" className="btn-link">
                        <Icon name="tag" size={16} /> Manage Service Catalog
                    </Link>
                </div>
            </div>

            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

            {loading && (
                <div className="card-list">
                    <div className="skeleton skeleton-row"></div>
                    <div className="skeleton skeleton-row"></div>
                </div>
            )}

            {!loading && (
                <div>
                    {/* Stat KPI Cards */}
                    <div className="stat-grid">
                        <div className="stat-card">
                            <div className="stat-icon"><Icon name="users" /></div>
                            <div className="stat-number"><CountUp value={users.length} /></div>
                            <div className="muted-text">Registered Users</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><Icon name="requests" /></div>
                            <div className="stat-number"><CountUp value={requests.length} /></div>
                            <div className="muted-text">Total Requests Posted</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon"><Icon name="bookings" /></div>
                            <div className="stat-number"><CountUp value={bookings.length} /></div>
                            <div className="muted-text">Total Bookings</div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="admin-filter-bar" style={{ marginTop: 28 }}>
                        <div className="category-title" style={{ margin: 0 }}>
                            Users ({filteredUsers.length})
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span className="muted-text" style={{ fontSize: 13, fontWeight: 600 }}>Role:</span>
                            <select
                                className="sort-select"
                                value={userRoleFilter}
                                onChange={(e) => setUserRoleFilter(e.target.value)}
                            >
                                <option value="ALL">All Roles</option>
                                <option value="CUSTOMER">Customers</option>
                                <option value="PROVIDER">Providers</option>
                                <option value="ADMIN">Admins</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Registered Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u.id}>
                                        <td><strong>#{u.id}</strong></td>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className="badge" style={{ fontSize: 11 }}>{u.role}</span>
                                        </td>
                                        <td>{formatDate(u.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Requests Table */}
                    <div className="admin-filter-bar" style={{ marginTop: 28 }}>
                        <div className="category-title" style={{ margin: 0 }}>
                            Customer Requests ({filteredRequests.length})
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span className="muted-text" style={{ fontSize: 13, fontWeight: 600 }}>Status:</span>
                            <select
                                className="sort-select"
                                value={requestStatusFilter}
                                onChange={(e) => setRequestStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="OPEN">Open</option>
                                <option value="ACCEPTED">Accepted</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Service</th>
                                    <th>Customer</th>
                                    <th>Budget</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((r) => (
                                    <tr key={r.id}>
                                        <td><strong>#{r.id}</strong></td>
                                        <td>{r.serviceName}</td>
                                        <td>{r.customerName}</td>
                                        <td style={{ fontWeight: 600, color: "var(--accent)" }}>
                                            ₹{Number(r.budget).toLocaleString("en-IN")}
                                        </td>
                                        <td>{r.location}</td>
                                        <td><StatusBadge status={r.status} /></td>
                                        <td>{formatDate(r.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bookings Table */}
                    <div className="admin-filter-bar" style={{ marginTop: 28 }}>
                        <div className="category-title" style={{ margin: 0 }}>
                            Contract Bookings ({filteredBookings.length})
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span className="muted-text" style={{ fontSize: 13, fontWeight: 600 }}>Status:</span>
                            <select
                                className="sort-select"
                                value={bookingStatusFilter}
                                onChange={(e) => setBookingStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="BID_ACCEPTED">Bid Accepted</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Service</th>
                                    <th>Customer</th>
                                    <th>Provider</th>
                                    <th>Agreed Amount</th>
                                    <th>Status</th>
                                    <th>Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((b) => (
                                    <tr key={b.id}>
                                        <td><strong>#{b.id}</strong></td>
                                        <td>{b.serviceName}</td>
                                        <td>{b.customerName}</td>
                                        <td>{b.providerName}</td>
                                        <td style={{ fontWeight: 600, color: "var(--accent)" }}>
                                            ₹{Number(b.agreedAmount).toLocaleString("en-IN")}
                                        </td>
                                        <td><StatusBadge status={b.status} /></td>
                                        <td>{formatDate(b.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;