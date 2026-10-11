const paths = {
    "Cleaning": (<><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" /><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" /></>),
    "Plumbing": (<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />),
    "Electrical": (<path d="M13 2L4 14h7l-1 8 9-12h-7z" />),
    "AC Repair": (<path d="M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7" />),
    "Painting": (<><path d="M4 4h12v5H4z" /><path d="M16 6.5h3v5h-8v3M11 14.5v6" /></>),
    "Computer Repair": (<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>),
    "Appliance Repair": (<><rect x="4" y="2" width="16" height="20" rx="2" /><circle cx="12" cy="14" r="4" /><path d="M8 6h.01M11 6h.01" /></>),
    "Pest Control": (<path d="M9 9a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM12 9v9M5 11l4 1M19 11l-4 1M5 17l4-1M19 17l-4-1M9 6L7 3M15 6l2-3" />),
    "Salon at Home": (<><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.1 8.1L20 20M8.1 15.9L20 4" /></>),
    check: (<path d="M20 6L9 17l-5-5" />),
    money: (<path d="M6 4h12M6 9h12M9 4c4 0 6 2 6 5s-2 5-6 5H7l8 7" />),
    star: (<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />),
    users: (<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 5a3.5 3.5 0 0 1 0 7M18 14c2 .6 3.5 2.4 3.5 6" /></>),
    requests: (<path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h8" />),
    bookings: (<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
    inbox: (<path d="M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5" />),
};

function Icon({ name, size = 22 }) {
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
            aria-hidden="true"
        >
            {paths[name] || paths.inbox}
        </svg>
    );
}

export default Icon;