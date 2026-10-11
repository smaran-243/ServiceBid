import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import toast from "react-hot-toast";
import Icon from "../components/Icon.jsx";

function AdminCatalog() {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("categories");

    const [catName, setCatName] = useState("");
    const [editingCat, setEditingCat] = useState(null);

    const [svcName, setSvcName] = useState("");
    const [svcDesc, setSvcDesc] = useState("");
    const [svcCat, setSvcCat] = useState("");
    const [editingSvc, setEditingSvc] = useState(null);

    function refreshCatalog() {
        return Promise.all([
            apiFetch("/api/categories"),
            apiFetch("/api/services"),
        ])
            .then(([c, s]) => {
                setCategories(c || []);
                setServices(s || []);
                return { c, s };
            })
            .catch(() => {
                toast.error("Could not load catalog");
                return null;
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        let mounted = true;
        Promise.all([
            apiFetch("/api/categories"),
            apiFetch("/api/services"),
        ])
            .then(([c, s]) => {
                if (!mounted) return;
                setCategories(c || []);
                setServices(s || []);
            })
            .catch(() => {
                if (mounted) toast.error("Could not load catalog");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, []);

    async function saveCategory(e) {
        e.preventDefault();
        if (!catName.trim()) {
            toast.error("Category name is required");
            return;
        }
        try {
            await apiFetch(
                editingCat ? "/api/admin/categories/" + editingCat : "/api/admin/categories",
                {
                    method: editingCat ? "PUT" : "POST",
                    body: JSON.stringify({ name: catName.trim() }),
                }
            );
            toast.success(editingCat ? "Category updated" : "Category added");
            setCatName("");
            setEditingCat(null);
            refreshCatalog();
        } catch {
            toast.error("Could not save category (name may already exist)");
        }
    }

    function startEditCat(c) {
        setEditingCat(c.id);
        setCatName(c.name);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEditCat() {
        setEditingCat(null);
        setCatName("");
    }

    async function deleteCategory(c) {
        if (!window.confirm("Delete category " + c.name + "?")) return;
        try {
            await apiFetch("/api/admin/categories/" + c.id, { method: "DELETE" });
        } catch {
            // some responses have no body
        }
        const result = await refreshCatalog();
        if (result && result.c.some((x) => x.id === c.id)) {
            toast.error("Could not delete. It may still have services.");
        } else {
            toast.success("Category deleted");
        }
    }

    async function saveService(e) {
        e.preventDefault();
        if (!svcName.trim() || !svcCat) {
            toast.error("Service name and category are required");
            return;
        }
        try {
            await apiFetch(
                editingSvc ? "/api/admin/services/" + editingSvc : "/api/admin/services",
                {
                    method: editingSvc ? "PUT" : "POST",
                    body: JSON.stringify({
                        name: svcName.trim(),
                        description: svcDesc.trim(),
                        categoryId: Number(svcCat),
                    }),
                }
            );
            toast.success(editingSvc ? "Service updated" : "Service added");
            cancelEditSvc();
            refreshCatalog();
        } catch {
            toast.error("Could not save service (name may already exist)");
        }
    }

    function startEditSvc(s) {
        setEditingSvc(s.id);
        setSvcName(s.name);
        setSvcDesc(s.description || "");
        setSvcCat(String(s.categoryId));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEditSvc() {
        setEditingSvc(null);
        setSvcName("");
        setSvcDesc("");
        setSvcCat("");
    }

    async function deleteService(s) {
        if (!window.confirm("Delete service " + s.name + "?")) return;
        try {
            await apiFetch("/api/admin/services/" + s.id, { method: "DELETE" });
        } catch {
            // some responses have no body
        }
        const result = await refreshCatalog();
        if (result && result.s.some((x) => x.id === s.id)) {
            toast.error("Could not delete. It may be used by requests.");
        } else {
            toast.success("Service deleted");
        }
    }

    return (
        <div className="page-enter">
            <p>
                <Link to="/admin" className="card-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    &larr; Back to admin overview
                </Link>
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                <div>
                    <h2>Manage Service Catalog</h2>
                    <p className="muted-text">Create, rename, and manage service categories and service offerings.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="filter-bar">
                <div className="chip-group">
                    <button
                        type="button"
                        className={"chip" + (activeTab === "categories" ? " active" : "")}
                        onClick={() => setActiveTab("categories")}
                    >
                        Categories ({categories.length})
                    </button>
                    <button
                        type="button"
                        className={"chip" + (activeTab === "services" ? " active" : "")}
                        onClick={() => setActiveTab("services")}
                    >
                        Services ({services.length})
                    </button>
                </div>
            </div>

            {loading && (
                <div className="card-list">
                    <div className="skeleton skeleton-row"></div>
                    <div className="skeleton skeleton-row"></div>
                </div>
            )}

            {!loading && (
                <div>
                    {/* CATEGORIES TAB */}
                    {activeTab === "categories" && (
                        <div className="page-enter">
                            <form className="form-card" onSubmit={saveCategory} style={{ marginBottom: 24, maxWidth: 540 }}>
                                <h3 style={{ margin: "0 0 12px" }}>
                                    {editingCat ? "Rename Category" : "Add New Category"}
                                </h3>
                                <label className="form-label">Category Name</label>
                                <input
                                    placeholder="e.g. Home Gardening, Pest Control..."
                                    value={catName}
                                    onChange={(e) => setCatName(e.target.value)}
                                    required
                                />
                                <div className="btn-row">
                                    <button className="btn-link" type="submit">
                                        <Icon name="check" size={16} /> {editingCat ? "Save Changes" : "Create Category"}
                                    </button>
                                    {editingCat && (
                                        <button className="btn-light" type="button" onClick={cancelEditCat}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div className="table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Category Name</th>
                                            <th>Services Count</th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((c) => {
                                            const count = services.filter((s) => s.categoryId === c.id).length;
                                            return (
                                                <tr key={c.id}>
                                                    <td><strong>#{c.id}</strong></td>
                                                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                                                    <td>
                                                        <span className="badge">{count} services</span>
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        <button className="btn-light" style={{ padding: "5px 12px", fontSize: 13 }} onClick={() => startEditCat(c)}>
                                                            Rename
                                                        </button>
                                                        <button className="btn-danger" style={{ padding: "5px 12px", fontSize: 13 }} onClick={() => deleteCategory(c)}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* SERVICES TAB */}
                    {activeTab === "services" && (
                        <div className="page-enter">
                            <form className="form-card" onSubmit={saveService} style={{ marginBottom: 24, maxWidth: 640 }}>
                                <h3 style={{ margin: "0 0 12px" }}>
                                    {editingSvc ? "Edit Service" : "Add New Service"}
                                </h3>

                                <label className="form-label">Service Name</label>
                                <input
                                    placeholder="e.g. Deep Sofa Cleaning, Kitchen Sink Unclogging..."
                                    value={svcName}
                                    onChange={(e) => setSvcName(e.target.value)}
                                    required
                                />

                                <label className="form-label">Parent Category</label>
                                <select value={svcCat} onChange={(e) => setSvcCat(e.target.value)} required>
                                    <option value="">Select a Category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>

                                <label className="form-label">Service Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="Detailed overview of what is included in this service..."
                                    value={svcDesc}
                                    onChange={(e) => setSvcDesc(e.target.value)}
                                />

                                <div className="btn-row">
                                    <button className="btn-link" type="submit">
                                        <Icon name="check" size={16} /> {editingSvc ? "Save Changes" : "Create Service"}
                                    </button>
                                    {editingSvc && (
                                        <button className="btn-light" type="button" onClick={cancelEditSvc}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div className="table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Service Name</th>
                                            <th>Category</th>
                                            <th>Description</th>
                                            <th style={{ textAlign: "right" }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map((s) => (
                                            <tr key={s.id}>
                                                <td><strong>#{s.id}</strong></td>
                                                <td style={{ fontWeight: 600 }}>{s.name}</td>
                                                <td>
                                                    <span className="badge">{s.categoryName}</span>
                                                </td>
                                                <td style={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis" }} title={s.description}>
                                                    {s.description || "-"}
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <button className="btn-light" style={{ padding: "5px 12px", fontSize: 13 }} onClick={() => startEditSvc(s)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn-danger" style={{ padding: "5px 12px", fontSize: 13 }} onClick={() => deleteService(s)}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminCatalog;