import { useNavigate } from "react-router-dom";
import { removeToken } from "../api/api.js";
import Icon from "./Icon.jsx";

function LogoutButton({ className = "nav-logout-btn", showIcon = true }) {
    const navigate = useNavigate();

    function handleLogout() {
        removeToken();
        navigate("/login");
    }

    return (
        <button
            className={className}
            onClick={handleLogout}
            title="Sign out of ServiceBid"
            aria-label="Sign out"
        >
            {showIcon && <Icon name="logout" size={16} />}
            <span>Logout</span>
        </button>
    );
}

export default LogoutButton;