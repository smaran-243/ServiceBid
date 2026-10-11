import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import toast from "react-hot-toast";

function AdminCatalog() {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [catName, setCatName] = useState("");
    const [editingCat, setEditingCat] = useState(null);

    const [svcName, setSvcName] = useState("");
    const [svcDesc, setSvcDesc] = useState("");
    const [svcCat, setSvcCat] = useState("");
    const [editingSvc, setEditingSvc] = useState(null);

    async function load() {
        try {
            const [c, s] = await Promise.all([
                apiFetch("/api/categories"),
                apiFetch("/api/services"),
            ]);
            setCategories(c);
            setServices(s);
            return { c, s };
        } catch {
            toast.error("Could not load catalog");
            return null;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
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
            load();
        } catch {
            toast.error("Could not save category (name may already exist)");
        }
    }

    function startEditCat(c) {
        setEditingCat(c.id);
        setCatName(c.name);
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
            // some responses have no body; we check the list below
        }
        const result = await load();
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
            load();
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
            // some responses have no body; we check the list below
        }
        const result = await load();
        if (result && result.s.some((x) => x.id === s.id)) {
            toast.error("Could not delete. It may be used by requests.");
        } else {
            toast.success("Service deleted");
        }
    }

    return (
        <div>
            <p><Link to="/admin">Back to admin</Link></p>
            <h2>Manage catalog</h2>

            {loading && (
                <div className="card-list">
                    <div className="skeleton skeleton-row"></div>
                    <div className="skeleton skeleton-row"></div>
                </div>
            )}

            {!loading && (
                <div>
                    <div className="category-title">Categories</div>
                    <form className="form-card" onSubmit={saveCategory}>
                        <label className="form-label">
                            {editingCat ? "Rename category" : "New category"}
                        </label>
                        <input
                            placeholder="e.g. Gardening"
                            value={catName}
                            onChange={(e) => setCatName(e.target.value)}
                        />
                        <div className="btn-row">
                            <button className="btn-link" type="submit">
                                {editingCat ? "Save" : "Add category"}
                            </button>
                            {editingCat && (
                                <button className="btn-light" type="button" onClick={cancelEditCat}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="table-wrap" style={{ marginTop: 16 }}>
                        <table className="admin-table">
                            <thead>
                            <tr><th>ID</th><th>Name</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                            {categories.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.name}</td>
                                    <td>
                                        <button className="btn-light" onClick={() => startEditCat(c)}>Rename</button>
                                        <button className="btn-danger" onClick={() => deleteCategory(c)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="category-title">Services</div>
                    <form className="form-card" onSubmit={saveService}>
                        <label className="form-label">
                            {editingSvc ? "Edit service" : "New service"}
                        </label>
                        <input
                            placeholder="Service name"
                            value={svcName}
                            onChange={(e) => setSvcName(e.target.value)}
                        />
                        <textarea
                            rows={2}
                            placeholder="Short description"
                            value={svcDesc}
                            onChange={(e) => setSvcDesc(e.target.value)}
                        />
                        <label className="form-label">Category</label>
                        <select value={svcCat} onChange={(e) => setSvcCat(e.target.value)}>
                            <option value="">Choose a category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <div className="btn-row">
                            <button className="btn-link" type="submit">
                                {editingSvc ? "Save" : "Add service"}
                            </button>
                            {editingSvc && (
                                <button className="btn-light" type="button" onClick={cancelEditSvc}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="table-wrap" style={{ marginTop: 16 }}>
                        <table className="admin-table">
                            <thead>
                            <tr><th>ID</th><th>Name</th><th>Category</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                            {services.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.name}</td>
                                    <td>{s.categoryName}</td>
                                    <td>
                                        <button className="btn-light" onClick={() => startEditSvc(s)}>Edit</button>
                                        <button className="btn-danger" onClick={() => deleteService(s)}>Delete</button>
                                    </td>
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

export default AdminCatalog;