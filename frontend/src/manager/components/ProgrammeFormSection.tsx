import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronIcon } from '../../shared/icons/ChevronIcon'

interface ProgrammeFormSectionProps {
    title: string
    children: ReactNode
    defaultOpen?: boolean
}

export function ProgrammeFormSection({
    title,
    children,
    defaultOpen = false,
}: ProgrammeFormSectionProps) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <section
            className={[
                'programme-form-section',
                open ? 'open' : '',
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <button
                type="button"
                className="programme-form-section-trigger"
                onClick={() =>
                    setOpen(current => !current)
                }
                aria-expanded={open}
            >
                <span className="programme-form-section-title">
                    {title}
                </span>

                <span
                    className="programme-form-section-chevron-area"
                    aria-hidden="true"
                >
                    <ChevronIcon
                        className="programme-form-section-chevron"
                        direction={open ? 'up' : 'down'}
                    />
                </span>
            </button>

            {open && (
                <div className="programme-form-fields">
                    {children}
                </div>
            )}
        </section>
    )
}