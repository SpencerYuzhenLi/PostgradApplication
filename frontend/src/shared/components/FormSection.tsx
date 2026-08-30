import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronIcon } from '../icons/ChevronIcon'

interface FormSectionProps {
    title: string
    children: ReactNode
    defaultOpen?: boolean
}

export function FormSection({
    title,
    children,
    defaultOpen = false,
}: FormSectionProps) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <section
            className={[
                'form-section',
                open ? 'open' : '',
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <button
                type="button"
                className="form-section-trigger"
                onClick={() =>
                    setOpen(current => !current)
                }
                aria-expanded={open}
            >
                <span className="form-section-title">
                    {title}
                </span>

                <span
                    className="form-section-chevron-area"
                    aria-hidden="true"
                >
                    <ChevronIcon
                        className="form-section-chevron"
                        direction={open ? 'up' : 'down'}
                    />
                </span>
            </button>

            {open && (
                <div className="form-fields">
                    {children}
                </div>
            )}
        </section>
    )
}