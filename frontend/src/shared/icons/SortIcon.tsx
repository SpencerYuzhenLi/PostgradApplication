interface SortIconProps {
    direction:
        | 'none'
        | 'asc'
        | 'desc'
    className?: string
}

export function SortIcon({
    direction,
    className,
}: SortIconProps) {
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
            {direction === 'none' && (
                <>
                    <path d="M5 12.5v-9M2.75 5.75L5 3.5l2.25 2.25" />
                    <path d="M11 3.5v9M8.75 10.25L11 12.5l2.25-2.25" />
                </>
            )}

            {direction === 'asc' && (
                <path d="M8 3.5v9M4.75 9.25L8 12.5l3.25-3.25" />
            )}

            {direction === 'desc' && (
                <path d="M8 12.5v-9M4.75 6.75L8 3.5l3.25 3.25" />
            )}
        </svg>
    )
}