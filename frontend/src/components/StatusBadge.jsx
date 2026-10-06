function StatusBadge({ status }) {
    return <span className={"badge badge-" + status}>{status.replace("_", " ")}</span>;
}

export default StatusBadge;