import './DetailRow.css'

interface ProgrammeDetailRowProps {
    label: string
    value: React.ReactNode
}

export function DetailRow({
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
        <div className="detail-row">
            <span className="detail-label">
                {label}
            </span>

            <span className="detail-value">
                {value}
            </span>
        </div>
    )
}