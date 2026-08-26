interface ProgrammeDetailRowProps {
    label: string
    value: React.ReactNode
}

export function ProgrammeDetailRow({
    label,
    value,
}: ProgrammeDetailRowProps) {
    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return null
    }

    return (
        <div className="programme-detail-row">
            <span className="programme-detail-label">
                {label}
            </span>

            <span className="programme-detail-value">
                {value}
            </span>
        </div>
    )
}