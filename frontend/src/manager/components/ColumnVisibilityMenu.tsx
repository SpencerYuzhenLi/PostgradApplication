import { useEffect, useRef, useState } from 'react'
import type { Column } from '@tanstack/react-table'
import type { Programme } from '../../shared/types/Programme'
import type {
    ProgrammeTableFeatures,
} from '../configs/programmeTableFeatures'

interface ColumnVisibilityControl {
    label: string
    columnIds: string[]
}

interface ColumnVisibilityMenuProps {
    controls: ColumnVisibilityControl[]
    getColumns: (
        columnIds: string[]
    ) => Column<
        ProgrammeTableFeatures,
        Programme,
        unknown
    >[]
}

export function ColumnVisibilityMenu({
    controls,
    getColumns,
}: ColumnVisibilityMenuProps) {
    const [open, setOpen] = useState(false)

    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handlePointerDown(event: PointerEvent) {
            const menu = menuRef.current

            if (
                open &&
                menu &&
                !menu.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
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

    return (
        <div
            className="column-menu"
            ref={menuRef}
        >
            <button
                type="button"
                className="column-menu-trigger"
                onClick={() =>
                    setOpen(current => !current)
                }
                aria-expanded={open}
            >
                Columns
            </button>

            {open && (
                <div className="column-menu-popover">
                    {controls.map(control => {
                        const columns =
                            getColumns(control.columnIds)

                        const visible =
                            columns.length > 0 &&
                            columns.every(
                                column =>
                                    column.getIsVisible()
                            )

                        return (
                            <label
                                key={control.label}
                                className="column-menu-option"
                            >
                                <input
                                    type="checkbox"
                                    checked={visible}
                                    onChange={event => {
                                        const nextVisible =
                                            event.target.checked

                                        columns.forEach(
                                            column =>
                                                column.toggleVisibility(
                                                    nextVisible
                                                )
                                        )
                                    }}
                                />

                                <span>
                                    {control.label}
                                </span>
                            </label>
                        )
                    })}
                </div>
            )}
        </div>
    )
}