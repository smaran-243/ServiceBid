import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";
import Icon from "../components/Icon.jsx";

function money(n) {
    return "\u20B9" + Number(n).toLocaleString("en-IN");
}

function Invoice() {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch("/api/customer/bookings")
            .then((data) => {
                const found = (data || []).find((b) => String(b.id) === String(bookingId));
                setBooking(found || null);
            })
            .catch(() => setBooking(null))
            .finally(() => setLoading(false));
    }, [bookingId]);

    if (loading) return <div className="skeleton skeleton-row"></div>;

    if (!booking || booking.status !== "COMPLETED") {
        return (
            <div className="page-enter">
                <p>
                    <Link to="/customer/bookings" className="card-link">&larr; Back to my bookings</Link>
                </p>
                <p className="muted-text">Invoice not available. Only completed bookings have an official invoice.</p>
            </div>
        );
    }

    const invoiceNo = "SB-" + String(booking.id).padStart(5, "0");

    return (
        <div className="page-enter" style={{ maxWidth: 840, margin: "0 auto" }}>
            <div className="no-print action-row" style={{ justifyContent: "space-between" }}>
                <Link to="/customer/bookings" className="btn-link btn-light">
                    &larr; Back to my bookings
                </Link>
                <button className="btn-link" onClick={() => window.print()}>
                    <Icon name="fileText" size={16} /> Print / Save as PDF
                </button>
            </div>

            <div className="invoice-sheet">
                <div className="invoice-top">
                    <div>
                        <div className="brand-wrap" style={{ marginBottom: 4 }}>
                            <span className="brand-icon-box" style={{ width: 28, height: 28, fontSize: 16 }}>S</span>
                            <span className="invoice-brand">ServiceBid</span>
                        </div>
                        <div className="muted-text">Competitive Bidding Service Marketplace</div>
                        <div className="muted-text" style={{ fontSize: 12 }}>GST / Tax Receipt • Verified Transaction</div>
                    </div>
                    <div className="invoice-right">
                        <div className="invoice-title">TAX INVOICE</div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{invoiceNo}</div>
                        <div className="muted-text" style={{ fontSize: 13, marginTop: 4 }}>
                            Date: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("en-IN") : "-"}
                        </div>
                    </div>
                </div>

                <div className="invoice-parties">
                    <div>
                        <div className="invoice-label">Billed To (Customer)</div>
                        <strong style={{ fontSize: 16 }}>{booking.customerName}</strong>
                        <div className="muted-text" style={{ fontSize: 13 }}>Verified Customer</div>
                    </div>
                    <div>
                        <div className="invoice-label">Service Provider</div>
                        <strong style={{ fontSize: 16 }}>{booking.providerName}</strong>
                        <div className="muted-text" style={{ fontSize: 13 }}>Registered Contractor</div>
                    </div>
                </div>

                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Service Description</th>
                            <th>Status</th>
                            <th className="invoice-num">Agreed Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>{booking.serviceName}</strong>
                                <div className="muted-text" style={{ fontSize: 12 }}>Completed via ServiceBid bidding</div>
                            </td>
                            <td>
                                <span className="badge badge-COMPLETED">Completed</span>
                            </td>
                            <td className="invoice-num" style={{ fontWeight: 700, fontSize: 16 }}>
                                {money(booking.agreedAmount)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="invoice-total">
                    <span style={{ color: "var(--muted)" }}>Grand Total:</span>
                    <strong style={{ color: "var(--accent)", fontSize: 24 }}>{money(booking.agreedAmount)}</strong>
                </div>

                <p className="muted-text invoice-note">
                    Payment agreed and settled through the ServiceBid competitive marketplace.
                    Thank you for trusting ServiceBid for your home service needs.
                </p>
            </div>
        </div>
    );
}

export default Invoice;