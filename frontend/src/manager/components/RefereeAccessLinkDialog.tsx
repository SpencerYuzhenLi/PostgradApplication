import './RefereeAccessLinkDialog.css'
import {
    useRef,
    useState,
} from 'react'
import '../../shared/components/ConfirmationDialog.css'

interface RefereeAccessLinkDialogProps {
    refereeName: string
    accessUrl: string
    onClose: () => void
}

export function RefereeAccessLinkDialog({
    refereeName,
    accessUrl,
    onClose,
}: RefereeAccessLinkDialogProps) {

    const [copied, setCopied] =
        useState(false)

    const inputRef =
        useRef<HTMLInputElement>(null)

    async function handleCopy() {
        try {
            await navigator.clipboard
                .writeText(accessUrl)

            setCopied(true)
        } catch {
            /*
             * Fallback: select the URL so it can
             * be copied manually.
             */
            inputRef.current?.select()
        }
    }

    return (
        <div
            className="confirmation-backdrop"
            role="presentation"
        >
            <section
                className="confirmation-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="referee-access-link-title"
                aria-describedby="referee-access-link-message"
            >
                <h2
                    id="referee-access-link-title"
                >
                    Access link
                </h2>

                <p
                    id="referee-access-link-message"
                >
                    A new access link has been
                    generated for {refereeName}.
                    Copy it now; it cannot be
                    shown again after this dialog
                    is closed.
                </p>

                <input
                    ref={inputRef}
                    className="referee-access-link-value"
                    type="text"
                    value={accessUrl}
                    readOnly
                    aria-label={`${refereeName}'s access link`}
                    onFocus={event =>
                        event.currentTarget.select()
                    }
                />

                <div className="confirmation-actions">
                    <button
                        type="button"
                        className="neutral-action"
                        onClick={handleCopy}
                    >
                        {copied
                            ? 'Copied'
                            : 'Copy link'}
                    </button>

                    <button
                        type="button"
                        className="neutral-action"
                        onClick={onClose}
                    >
                        Done
                    </button>
                </div>
            </section>
        </div>
    )
}