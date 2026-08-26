import './RefereeHelpModal.css'
import { useEffect, useRef } from 'react'

interface RefereeHelpModalProps {
    onClose: () => void
}

export function RefereeHelpModal({
    onClose,
}: RefereeHelpModalProps) {

    const closeButtonRef =
        useRef<HTMLButtonElement>(null)

    useEffect(() => {
        closeButtonRef.current?.focus()

        function handleKeyDown(
            event: KeyboardEvent
        ) {
            if (event.key === 'Escape') {
                event.preventDefault()
                onClose()
                return
            }

            if (event.key !== 'Tab') {
                return
            }

            const modal =
                closeButtonRef.current?.closest(
                    '.referee-help-modal'
                )

            if (!(modal instanceof HTMLElement)) {
                return
            }

            const focusableElements =
                Array.from(
                    modal.querySelectorAll<HTMLElement>(
                        [
                            'button:not(:disabled)',
                            'a[href]',
                            'input:not(:disabled)',
                            'select:not(:disabled)',
                            'textarea:not(:disabled)',
                            '[tabindex]:not([tabindex="-1"])',
                        ].join(',')
                    )
                )

            if (focusableElements.length === 0) {
                event.preventDefault()
                return
            }

            const first =
                focusableElements[0]

            const last =
                focusableElements[
                    focusableElements.length - 1
                ]

            if (
                event.shiftKey &&
                document.activeElement === first
            ) {
                event.preventDefault()
                last.focus()
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener(
            'keydown',
            handleKeyDown
        )

        return () => {
            document.removeEventListener(
                'keydown',
                handleKeyDown
            )
        }
    }, [onClose])

    return (
        <div
            className="referee-help-backdrop"
            onPointerDown={event => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose()
                }
            }}
        >
            <section
                className="referee-help-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="referee-help-title"
            >
                <header className="referee-help-header">
                    <h2 id="referee-help-title">
                        Help
                    </h2>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="neutral-action"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </header>

                <div className="referee-help-content">
                    <p>
                        This page lists the postgraduate
                        programmes I intend to apply for.
                    </p>

                    <section className="referee-help-section">
                        <h3>Using the table</h3>

                        <p>
                            Select a programme to view its
                            reference details. Select a
                            column heading to sort the table.
                        </p>
                    </section>

                    <section className="referee-help-section">
                        <h3>Columns</h3>

                        <p>
                            <strong>Opens</strong> is the
                            date the application opens.{' '}
                            <strong>Deadline</strong> is the
                            earlier of the application
                            deadline and the reference
                            deadline. and is therefore the
                            date by which the reference should
                            be submitted. A blank cell means
                            that no information is available.
                        </p>
                    </section>

                    <section className="referee-help-section">
                        <h3>Reference details</h3>

                        <p>
                            Open a programme to see how the
                            reference should be submitted,
                            official information for
                            referees, and any additional
                            notes.
                        </p>
                    </section>
                </div>
            </section>
        </div>
    )
}