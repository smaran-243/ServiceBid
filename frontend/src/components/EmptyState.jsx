function EmptyState({ title, text, children }) {
    return (
        <div className="empty-state">
            <h3>{title}</h3>
            <p className="muted-text">{text}</p>
            {children}
        </div>
    );
}

export default EmptyState;