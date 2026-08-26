import './ProgrammeDiscardConfirmation.css'

interface ProgrammeDiscardConfirmationProps {
    variant?: 'changes' | 'draft'

    allowSaveDraft?: boolean
    editingDraft?: boolean

    onSaveDraft?: () => void
    onCancel: () => void
    onDiscard: () => void
}

export function ProgrammeDiscardConfirmation({
    variant = 'changes',
    allowSaveDraft = false,
    editingDraft = false,
    onSaveDraft,
    onCancel,
    onDiscard,
}: ProgrammeDiscardConfirmationProps) {

    const discardingDraft =
        variant === 'draft'

    const title =
        discardingDraft
            ? 'Discard draft?'
            : 'Discard changes?'

    const message =
        discardingDraft
            ? 'The saved draft will be permanently removed.'
            : allowSaveDraft
                ? editingDraft
                    ? 'Your changes to the draft have not been saved.'
                    : 'Your unsaved programme has not been added.'
                : 'Your unsaved changes will be lost.'

    return (
        <div className="discard-confirmation-backdrop">
            <section
                className="discard-confirmation"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="discard-confirmation-title"
            >
                <h2 id="discard-confirmation-title">
                    {title}
                </h2>

                <p>
                    {message}
                </p>

                <div className="discard-confirmation-actions">
                    {!discardingDraft &&
                        allowSaveDraft &&
                        onSaveDraft && (
                            <button
                                type="button"
                                className="neutral-action"
                                onClick={onSaveDraft}
                            >
                                Save as draft
                            </button>
                        )}

                    <div className="discard-confirmation-actions-end">
                        <button
                            type="button"
                            className="neutral-action"
                            onClick={onCancel}
                        >
                            {discardingDraft
                                ? 'Cancel'
                                : 'Keep editing'}
                        </button>

                        <button
                            type="button"
                            className={
                                discardingDraft
                                    ? 'discard-confirmation-discard-draft'
                                    : 'discard-confirmation-discard'
                            }
                            onClick={onDiscard}
                        >
                            {discardingDraft
                                ? 'Discard draft'
                                : 'Discard'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}