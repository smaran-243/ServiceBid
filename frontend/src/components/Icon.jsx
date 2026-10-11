const paths = {
    // Categories
    "Cleaning": (
        <>
            <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
            <path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" />
        </>
    ),
    "Plumbing": (
        <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
    ),
    "Electrical": (
        <path d="M13 2L4 14h7l-1 8 9-12h-7z" />
    ),
    "AC Repair": (
        <path d="M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7" />
    ),
    "Painting": (
        <>
            <path d="M4 4h12v5H4z" />
            <path d="M16 6.5h3v5h-8v3M11 14.5v6" />
        </>
    ),
    "Computer Repair": (
        <>
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M8 20h8M12 16v4" />
        </>
    ),
    "Appliance Repair": (
        <>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <circle cx="12" cy="14" r="4" />
            <path d="M8 6h.01M11 6h.01" />
        </>
    ),
    "Pest Control": (
        <path d="M9 9a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM12 9v9M5 11l4 1M19 11l-4 1M5 17l4-1M19 17l-4-1M9 6L7 3M15 6l2-3" />
    ),
    "Salon at Home": (
        <>
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M8.1 8.1L20 20M8.1 15.9L20 4" />
        </>
    ),

    // System & General Icons
    check: (<path d="M20 6L9 17l-5-5" />),
    money: (<path d="M6 4h12M6 9h12M9 4c4 0 6 2 6 5s-2 5-6 5H7l8 7" />),
    star: (<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />),
    users: (
        <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 5a3.5 3.5 0 0 1 0 7M18 14c2 .6 3.5 2.4 3.5 6" />
        </>
    ),
    requests: (<path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h8" />),
    bookings: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
        </>
    ),
    inbox: (<path d="M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5" />),
    search: (
        <>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
        </>
    ),
    heart: (
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
    heartFilled: (
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" />
    ),
    shield: (
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
    clock: (
        <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </>
    ),
    location: (
        <>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </>
    ),
    tag: (
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" />
    ),
    fileText: (
        <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </>
    ),
    arrowUp: (
        <path d="M12 19V5M5 12l7-7 7 7" />
    ),
    chevronDown: (
        <path d="M6 9l6 6 6-6" />
    ),
    menu: (
        <path d="M3 12h18M3 6h18M3 18h18" />
    ),
    close: (
        <path d="M18 6L6 18M6 6l12 12" />
    ),
    alertCircle: (
        <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
        </>
    ),
    logout: (
        <>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </>
    ),
    sparkles: (
        <path d="M12 3l1.9 4.8L18.7 9.7l-4.8 1.9L12 16.4l-1.9-4.8L5.3 9.7l4.8-1.9zM19 16l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
    ),
    zap: (
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    ),
    sliders: (
        <>
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
        </>
    ),
};

function Icon({ name, size = 22, className = "" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {paths[name] || paths.inbox}
        </svg>
    );
}

export default Icon;