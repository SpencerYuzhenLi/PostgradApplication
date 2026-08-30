interface FormTextareaProps {
    label: string
    value: string
    onChange: (value: string) => void
}

export function FormTextarea({
    label,
    value,
    onChange,
}: FormTextareaProps) {
    return (
        <label className="form-field form-textarea">
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