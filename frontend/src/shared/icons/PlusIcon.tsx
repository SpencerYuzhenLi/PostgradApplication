interface IconProps {
    className?: string
}

export function PlusIcon({
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
            <path d="M8 3.25v9.5M3.25 8h9.5" />
        </svg>
    )
}