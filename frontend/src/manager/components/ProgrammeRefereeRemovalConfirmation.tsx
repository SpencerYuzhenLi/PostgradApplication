import '../../shared/components/ConfirmationDialog.css'
import type { Referee } from '../../shared/types/Referee'

interface ProgrammeRefereeRemovalConfirmationProps {
    referees: Referee[]

    onCancel: () => void
    onConfirm: () => void
}

export function ProgrammeRefereeRemovalConfirmation({
    referees,
    onCancel,
    onConfirm,
}: ProgrammeRefereeRemovalConfirmationProps) {

    return (
        <div
            className="confirmation-backdrop"
            role="presentation"
        >
            <section
                className="confirmation-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="referee-removal-confirmation-title"
            >
                <h2
                    id="referee-removal-confirmation-title"
                >
                    Remove submitted reference assignments?
                </h2>

                <p>
                    The following submitted
                    reference assignments will be
                    removed:
                </p>

                <ul className="confirmation-list">
                    {referees.map(
                        referee => (
                            <li key={referee.id}>
                                {referee.name}
                            </li>
                        )
                    )}
                </ul>

                <p>
                    Their submission status will
                    also be permanently deleted.
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
                        className="primary-destructive-action"
                        onClick={onConfirm}
                    >
                        Save changes
                    </button>
                </div>
            </section>
        </div>
    )
}