interface FormSelectProps<T extends string> {
    label: string
    value: T | null
    options: Record<T, string>
    onChange: (value: T | null) => void

    unselectedValue?: T
    allowUnselected?: boolean
}

export function FormSelect<T extends string>({
    label,
    value,
    options,
    onChange,
    unselectedValue,
    allowUnselected = true,
}: FormSelectProps<T>) {

    const unselected =
        value === null ||
        value === unselectedValue

    return (
        <div className="form-field">
            <span>{label}</span>

            <select
                value={value ?? ''}
                className={
                    unselected
                        ? 'unselected'
                        : undefined
                }
                aria-label={label}
                onChange={event =>
                    onChange(
                        event.target.value === ''
                            ? null
                            : event.target.value as T
                    )
                }
            >
                {allowUnselected && (
                    <option value="">
                        Unselected
                    </option>
                )}

                {Object.entries(options).map(
                    ([optionValue, optionLabel]) => (
                        <option
                            key={optionValue}
                            value={optionValue}
                        >
                            {optionLabel as string}
                        </option>
                    )
                )}
            </select>
        </div>
    )
}