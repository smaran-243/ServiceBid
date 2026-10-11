import Icon from "./Icon.jsx";

function EmptyState({ title, text, icon = "inbox", children }) {
    return (
        <div className="empty-state">
            <div className="empty-icon">
                <Icon name={icon} size={28} />
            </div>
            <h3>{title}</h3>
            <p className="muted-text">{text}</p>
            {children}
        </div>
    );
}

export default EmptyState;