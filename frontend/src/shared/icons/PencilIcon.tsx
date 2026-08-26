interface IconProps {
    className?: string
}

export function PencilIcon({
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
            <path d="M3.25 11.75l.55-2.45 6.75-6.75a1.25 1.25 0 0 1 1.77 0l1.13 1.13a1.25 1.25 0 0 1 0 1.77L6.7 12.2l-2.45.55z" />
            <path d="M9.65 3.45l2.9 2.9" />
        </svg>
    )
}