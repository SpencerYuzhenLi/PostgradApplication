interface FormFieldProps {
    label: string
    value: string
    type?: 'text' | 'date' | 'number' | 'email'
    min?: number
    onChange: (value: string) => void
}

export function FormField({
    label,
    value,
    type = 'text',
    min,
    onChange,
}: FormFieldProps) {
    return (
        <div className="form-field">
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