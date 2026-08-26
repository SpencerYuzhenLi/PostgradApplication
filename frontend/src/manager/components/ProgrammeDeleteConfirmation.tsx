import './ProgrammeDeleteConfirmation.css'
import type { Programme } from '../../shared/types/Programme'

interface ProgrammeDeleteConfirmationProps {
    programme: Programme
    deleting: boolean
    error: string | null
    onCancel: () => void
    onConfirm: () => void
}

export function ProgrammeDeleteConfirmation({
    programme,
    deleting,
    error,
    onCancel,
    onConfirm,
}: ProgrammeDeleteConfirmationProps) {

    return (
        <div className="delete-confirmation-backdrop">
            <section
                className="delete-confirmation"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-confirmation-title"
            >
                <h2 id="delete-confirmation-title">
                    Delete {programme.programmeShortName}?
                </h2>

                <p>
                    This will permanently delete the programme
                    and its associated links. This action cannot
                    be undone.
                </p>

                {error && (
                    <p className="delete-confirmation-error">
                        {error}
                    </p>
                )}

                <div className="delete-confirmation-actions">
                    <button
                        type="button"
                        className="neutral-action"
                        onClick={onCancel}
                        disabled={deleting}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="confirm-delete"
                        onClick={onConfirm}
                        disabled={deleting}
                    >
                        {deleting
                            ? 'Deleting...'
                            : 'Delete'}
                    </button>
                </div>
            </section>
        </div>
    )
}