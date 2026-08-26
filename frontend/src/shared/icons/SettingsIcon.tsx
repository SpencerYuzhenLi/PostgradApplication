interface IconProps {
    className?: string
}

export function SettingsIcon({
    className,
}: IconProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle
                cx="8"
                cy="8"
                r="2"
            />

            <path d="M8 1.75v1.3M8 12.95v1.3M1.75 8h1.3M12.95 8h1.3M3.58 3.58l.92.92M11.5 11.5l.92.92M12.42 3.58l-.92.92M4.5 11.5l-.92.92" />

            <circle
                cx="8"
                cy="8"
                r="4.95"
            />
        </svg>
    )
}