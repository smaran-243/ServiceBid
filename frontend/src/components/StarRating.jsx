function StarRating({ value, onChange }) {
    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    className={n <= value ? "star star-on" : "star"}
                    onClick={() => onChange(n)}
                    aria-label={n + " star"}
                >
                    {"\u2605"}
                </button>
            ))}
        </div>
    );
}

export default StarRating;