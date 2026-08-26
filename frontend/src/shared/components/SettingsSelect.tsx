import './SettingsSelect.css'

interface SettingsSelectOption<T extends string> {
    value: T
    label: string
}

interface SettingsSelectProps<T extends string> {
    value: T
    options: readonly SettingsSelectOption<T>[]
    onChange: (value: T) => void
    ariaLabel: string
}

export function SettingsSelect<T extends string>({
    value,
    options,
    onChange,
    ariaLabel,
}: SettingsSelectProps<T>) {
    return (
        <select
            className="settings-select"
            value={value}
            aria-label={ariaLabel}
            onChange={event =>
                onChange(event.target.value as T)
            }
        >
            {options.map(option => (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select>
    )
}