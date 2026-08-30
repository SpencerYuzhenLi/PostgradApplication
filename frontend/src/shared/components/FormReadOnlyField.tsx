interface FormReadOnlyFieldProps {
    label: string
    value: string
}

export function FormReadOnlyField({
    label,
    value,
}: FormReadOnlyFieldProps) {
    return (
        <div className="form-field">
            <span>{label}</span>

            <input
                type="text"
                value={value}
                readOnly
                tabIndex={-1}
                aria-readonly="true"
                className="form-readonly-field"
            />
        </div>
    )
}