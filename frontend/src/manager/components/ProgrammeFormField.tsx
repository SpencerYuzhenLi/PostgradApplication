interface ProgrammeFormFieldProps {
    label: string
    value: string
    type?: 'text' | 'date' | 'number'
    min?: number
    onChange: (value: string) => void
}

export function ProgrammeFormField({
    label,
    value,
    type = 'text',
    min,
    onChange,
}: ProgrammeFormFieldProps) {
    return (
        <div className="programme-form-field">
            <span>{label}</span>

            <input
                type={type}
                value={value}
                min={min}
                aria-label={label}
                onChange={event =>
                    onChange(event.target.value)
                }
            />
        </div>
    )
}