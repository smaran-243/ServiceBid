import { useNavigate } from "react-router-dom";
import { removeToken } from "../api/api.js";

function LogoutButton() {
    const navigate = useNavigate();

    function handleLogout() {
        removeToken();
        navigate("/login");
    }

    return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;