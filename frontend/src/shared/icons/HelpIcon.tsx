interface HelpIconProps {
    className?: string
}

export function HelpIcon({
    className,
}: HelpIconProps) {
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
                r="5.75"
            />

            <path d="M6.5 6.25C6.5 5.35 7.17 4.75 8.1 4.75C9.03 4.75 9.7 5.32 9.7 6.2C9.7 7.03 9.2 7.42 8.55 7.86C7.98 8.25 7.75 8.65 7.75 9.25" />

            <path d="M7.75 11.25H7.76" />
        </svg>
    )
}