import './RefereeAccessConfirmation.css'
import type { ManagedReferee } from '../types/ManagedReferee'

interface RefereeAccessConfirmationProps {
    referee: ManagedReferee

    action:
        | 'regenerate'
        | 'revoke'

    onCancel: () => void
    onConfirm: () => void
}

export function RefereeAccessConfirmation({
    referee,
    action,
    onCancel,
    onConfirm,
}: RefereeAccessConfirmationProps) {

    const regenerate =
        action === 'regenerate'

    return (
        <div
            className="confirmation-backdrop"
            role="presentation"
        >
            <section
                className="confirmation-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="referee-access-confirmation-title"
                aria-describedby="referee-access-confirmation-message"
            >
                <h2
                    id="referee-access-confirmation-title"
                >
                    {regenerate
                        ? 'Generate new access link?'
                        : 'Revoke access?'}
                </h2>

                <p
                    id="referee-access-confirmation-message"
                >
                    {regenerate
                        ? `Generating a new access link will immediately invalidate ${referee.name}'s current link.`
                        : `Revoking access will immediately invalidate ${referee.name}'s current link.`}
                </p>

                <div className="confirmation-actions">
                    <button
                        type="button"
                        className="neutral-action"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className={
                            regenerate
                                ? 'neutral-action'
                                : 'primary-destructive-action'
                        }
                        onClick={onConfirm}
                    >
                        {regenerate
                            ? 'Generate new link'
                            : 'Revoke access'}
                    </button>
                </div>
            </section>
        </div>
    )
}