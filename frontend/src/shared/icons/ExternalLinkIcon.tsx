interface ExternalLinkIconProps {
    className?: string
}

export function ExternalLinkIcon({
    className,
}: ExternalLinkIconProps) {
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
            <g transform="translate(0 1.5)">
                <path d="M6.25 3.25H3.5a1.25 1.25 0 0 0-1.25 1.25v8a1.25 1.25 0 0 0 1.25 1.25h8a1.25 1.25 0 0 0 1.25-1.25V9.75" />

                <path d="M8.25 2.25h5.5v5.5M13.5 2.5L7.25 8.75" />
            </g>
        </svg>
    )
}