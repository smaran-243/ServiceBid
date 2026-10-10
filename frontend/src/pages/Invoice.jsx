import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api/api.js";

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
                const found = data.find((b) => String(b.id) === String(bookingId));
                setBooking(found || null);
            })
            .catch(() => setBooking(null))
            .finally(() => setLoading(false));
    }, [bookingId]);

    if (loading) return <div className="skeleton skeleton-row"></div>;

    if (!booking || booking.status !== "COMPLETED") {
        return (
            <div>
                <p><Link to="/customer/bookings">Back to my bookings</Link></p>
                <p className="muted-text">Invoice not available. Only completed bookings have an invoice.</p>
            </div>
        );
    }

    const invoiceNo = "SB-" + String(booking.id).padStart(5, "0");

    return (
        <div>
            <div className="no-print action-row">
                <Link to="/customer/bookings" className="btn-link btn-light">Back to my bookings</Link>
                <button className="btn-link" onClick={() => window.print()}>Print / Save as PDF</button>
            </div>

            <div className="invoice-sheet">
                <div className="invoice-top">
                    <div>
                        <div className="invoice-brand">ServiceBid</div>
                        <div className="muted-text">Competitive bidding for home services</div>
                    </div>
                    <div className="invoice-right">
                        <div className="invoice-title">INVOICE</div>
                        <div className="muted-text">{invoiceNo}</div>
                        <div className="muted-text">
                            Booking date: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("en-IN") : "-"}
                        </div>
                    </div>
                </div>

                <div className="invoice-parties">
                    <div>
                        <div className="invoice-label">Billed to</div>
                        <strong>{booking.customerName}</strong>
                    </div>
                    <div>
                        <div className="invoice-label">Service provider</div>
                        <strong>{booking.providerName}</strong>
                    </div>
                </div>

                <table className="invoice-table">
                    <thead>
                    <tr>
                        <th>Service</th>
                        <th>Status</th>
                        <th className="invoice-num">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{booking.serviceName}</td>
                        <td>Completed</td>
                        <td className="invoice-num">{money(booking.agreedAmount)}</td>
                    </tr>
                    </tbody>
                </table>

                <div className="invoice-total">
                    <span>Total</span>
                    <strong>{money(booking.agreedAmount)}</strong>
                </div>

                <p className="muted-text invoice-note">
                    Amount agreed through ServiceBid bidding. Thank you for using ServiceBid.
                </p>
            </div>
        </div>
    );
}

export default Invoice;