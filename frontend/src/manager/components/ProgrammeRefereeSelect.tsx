import './ProgrammeRefereeSelect.css'
import {
    useEffect,
    useRef,
    useState,
} from 'react'
import type {
    Referee,
} from '../../shared/types/Referee'
import {
    ChevronIcon,
} from '../../shared/icons/ChevronIcon'

interface ProgrammeRefereeSelectProps {
    referees: Referee[]
    value: number[]
    onChange: (value: number[]) => void
}

export function ProgrammeRefereeSelect({
    referees,
    value,
    onChange,
}: ProgrammeRefereeSelectProps) {
    const [open, setOpen] =
        useState(false)

    const selectRef =
        useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handlePointerDown(
            event: PointerEvent
        ) {
            const select =
                selectRef.current

            if (
                open &&
                select &&
                !select.contains(
                    event.target as Node
                )
            ) {
                setOpen(false)
            }
        }

        function handleKeyDown(
            event: KeyboardEvent
        ) {
            if (event.key === 'Escape') {
                setOpen(false)
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
    }, [open])

    const sortedReferees =
        [...referees].sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        )

    const selectedReferees =
        sortedReferees.filter(referee =>
            value.includes(referee.id)
        )

    const displayValue =
        selectedReferees.length === 0
            ? 'None'
            : selectedReferees
                .map(referee => referee.name)
                .join(', ')

    function toggleReferee(
        refereeId: number,
        selected: boolean
    ) {
        if (selected) {
            onChange([
                ...value,
                refereeId,
            ])
            return
        }

        onChange(
            value.filter(
                id => id !== refereeId
            )
        )
    }

    return (
        <div className="programme-form-field">
            <span>Referees</span>

            <div
                className="programme-referee-select"
                ref={selectRef}
            >
                <button
                    type="button"
                    className={[
                        'programme-referee-select-trigger',
                        selectedReferees.length === 0
                            ? 'unselected'
                            : '',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    onClick={() =>
                        setOpen(current => !current)
                    }
                    aria-expanded={open}
                >
                    <span className="programme-referee-select-value">
                        {displayValue}
                    </span>

                    <ChevronIcon
                        className="programme-referee-select-chevron"
                        direction={
                            open
                                ? 'up'
                                : 'down'
                        }
                    />
                </button>

                {open && (
                    <div className="programme-referee-select-popover">
                        {referees.length === 0 ? (
                            <span className="programme-referee-select-empty">
                                No referees available
                            </span>
                        ) : (
                            sortedReferees.map(referee => (
                                <label
                                    key={referee.id}
                                    className="programme-referee-select-option"
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            value.includes(
                                                referee.id
                                            )
                                        }
                                        onChange={event =>
                                            toggleReferee(
                                                referee.id,
                                                event.target.checked
                                            )
                                        }
                                    />

                                    <span>
                                        {referee.name}
                                    </span>
                                </label>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}