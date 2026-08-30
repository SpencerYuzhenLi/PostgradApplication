import '../../shared/components/ConfirmationDialog.css'
import type {
    ManagedReferee,
} from '../types/ManagedReferee'

interface RefereeDeleteConfirmationProps {
    referee: ManagedReferee
    deleting: boolean
    error: string | null

    onCancel: () => void
    onConfirm: () => void
}

export function RefereeDeleteConfirmation({
    referee,
    deleting,
    error,
    onCancel,
    onConfirm,
}: RefereeDeleteConfirmationProps) {
    return (
        <div
            className="confirmation-backdrop"
            role="presentation"
        >
            <section
                className="confirmation-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="referee-delete-confirmation-title"
            >
                <h2
                    id="referee-delete-confirmation-title"
                >
                    Delete {referee.name}?
                </h2>

                <p>
                    This will permanently delete the referee
                    and remove them from all assigned programmes.
                    This action cannot be undone.
                </p>

                {error && (
                    <p className="confirmation-error">
                        {error}
                    </p>
                )}

                <div className="confirmation-actions">
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
                        className="primary-destructive-action"
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