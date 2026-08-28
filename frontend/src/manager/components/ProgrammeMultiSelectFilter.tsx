import { useEffect, useRef } from 'react'


interface FilterOption {
    value: string
    label: string
}

interface ProgrammeMultiSelectFilterProps {
    label: string
    values: string[]
    options: FilterOption[]
    onChange: (value: string[]) => void

    isOpen: boolean
    onToggle: () => void
    onClose: () => void
}

export function ProgrammeMultiSelectFilter({
    label,
    values,
    options,
    onChange,
    isOpen,
    onToggle,
    onClose,
}: ProgrammeMultiSelectFilterProps) {

    const dropdownRef = useRef<HTMLDivElement>(null)

    function toggleValue(value: string) {
        if (values.includes(value)) {
            onChange(
                values.filter(existingValue => existingValue !== value)
            )
        } else {
            onChange([...values, value])
        }
    }

    useEffect(() => {
        if (!isOpen) {
            return
        }

        function handlePointerDown(event: PointerEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target as Node
                )
            ) {
                onClose()
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener(
            'pointerdown',
            handlePointerDown
        )

        document.addEventListener(
            'keydown',
            handleKeyDown
        )

        return () => {
            document.removeEventListener(
                'pointerdown',
                handlePointerDown
            )

            document.removeEventListener(
                'keydown',
                handleKeyDown
            )
        }
    }, [isOpen, onClose])

    return (
        <div
                className="filter-dropdown"
                ref={dropdownRef}
            >
                <button
                    type="button"
                    className={
                        values.length > 0
                            ? 'filter-dropdown-trigger active'
                            : 'filter-dropdown-trigger'
                    }
                    onClick={onToggle}
                    aria-expanded={isOpen}
                >
                    <span className="filter-dropdown-trigger-label">
                        {label}

                        {values.length > 0 && (
                            <sup className="filter-dropdown-count">
                                {values.length}
                            </sup>
                        )}
                    </span>
                </button>

                {isOpen && (
                    <div className="filter-dropdown-menu">
                        {options.map(option => (
                            <label key={option.value}>
                                <input
                                    type="checkbox"
                                    checked={
                                        values.includes(option.value)
                                    }
                                    onChange={() =>
                                        toggleValue(option.value)
                                    }
                                />

                                {option.label}
                            </label>
                        ))}
                    </div>
                )}
            </div>
    )
}