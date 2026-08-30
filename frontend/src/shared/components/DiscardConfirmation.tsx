import './ConfirmationDialog.css'

interface DiscardConfirmationProps {
    variant?: 'changes' | 'draft'

    allowSaveDraft?: boolean
    editingDraft?: boolean

    onSaveDraft?: () => void
    onCancel: () => void
    onDiscard: () => void
}

export function DiscardConfirmation({
    variant = 'changes',
    allowSaveDraft = false,
    editingDraft = false,
    onSaveDraft,
    onCancel,
    onDiscard,
}: DiscardConfirmationProps) {

    const discardingDraft =
        variant === 'draft'

    const title =
        discardingDraft
            ? 'Discard draft?'
            : 'Discard changes?'

    const message =
        discardingDraft
            ? 'The saved draft will be permanently removed.'
            : editingDraft
                ? 'Your changes to the draft have not been saved.'
                : 'Your unsaved changes will be lost.'

    return (
        <div className="confirmation-backdrop">
            <section
                className="confirmation-dialog"
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

                <div className="confirmation-actions">
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
                        className="primary-destructive-action"
                        onClick={onDiscard}
                    >
                        {discardingDraft
                            ? 'Discard draft'
                            : 'Discard'}
                    </button>
                </div>
            </section>
        </div>
    )
}