import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import ProviderDashboard from "./pages/ProviderDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import BrowseServices from "./pages/BrowseServices.jsx";
import CreateRequest from "./pages/CreateRequest.jsx";
import RequestDetail from "./pages/RequestDetail.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import PlaceBid from "./pages/PlaceBid.jsx";
import MyBids from "./pages/MyBids.jsx";
import ProviderBookings from "./pages/ProviderBookings.jsx";
import ProviderProfile from "./pages/ProviderProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Navbar from "./components/Navbar.jsx";




function App() {
    return (
        <div>
            <Navbar />

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
                <Route
                    path="/customer/services"
                    element={
                        <ProtectedRoute role="CUSTOMER">
                            <BrowseServices />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customer/request/:serviceId"
                    element={
                        <ProtectedRoute role="CUSTOMER">
                            <CreateRequest />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customer/requests/:requestId"
                    element={
                        <ProtectedRoute role="CUSTOMER">
                            <RequestDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/customer/bookings"
                    element={
                        <ProtectedRoute role="CUSTOMER">
                            <MyBookings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/provider/requests/:requestId"
                    element={
                        <ProtectedRoute role="PROVIDER">
                            <PlaceBid />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/provider/bids"
                    element={
                        <ProtectedRoute role="PROVIDER">
                            <MyBids />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/provider/bookings"
                    element={
                        <ProtectedRoute role="PROVIDER">
                            <ProviderBookings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/provider/profile"
                    element={
                        <ProtectedRoute role="PROVIDER">
                            <ProviderProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;