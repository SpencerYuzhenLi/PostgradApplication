interface ProgrammeFormTextareaProps {
    label: string
    value: string
    onChange: (value: string) => void
}

export function ProgrammeFormTextarea({
    label,
    value,
    onChange,
}: ProgrammeFormTextareaProps) {
    return (
        <label className="programme-form-field programme-form-textarea">
            <span>{label}</span>

            <textarea
                value={value}
                onChange={event =>
                    onChange(event.target.value)
                }
            />
        </label>
    )
}