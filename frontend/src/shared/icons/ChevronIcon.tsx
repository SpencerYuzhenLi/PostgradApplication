interface ChevronIconProps {
    direction: 'left' | 'right' | 'up' | 'down'
    className?: string
}

export function ChevronIcon({
    direction,
    className,
}: ChevronIconProps) {
    const path = {
        right: 'M6 3.5L10.5 8 6 12.5',
        left: 'M10 3.5L5.5 8 10 12.5',
        down: 'M3.5 6L8 10.5 12.5 6',
        up: 'M3.5 10L8 5.5 12.5 10',
    }[direction]

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
            <path
                d={path}
                transform="translate(1.6 1.6) scale(0.8)"
            />
        </svg>
    )
}