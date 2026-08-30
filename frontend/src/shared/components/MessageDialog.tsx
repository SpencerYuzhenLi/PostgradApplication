import './MessageDialog.css'


interface MessageDialogProps {
    title: string
    message: string
    onClose: () => void
}

export function MessageDialog({
    title,
    message,
    onClose,
}: MessageDialogProps) {
    return (
        <div className="message-dialog-backdrop">
            <section
                className="message-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="message-dialog-title"
            >
                <h2 id="message-dialog-title">
                    {title}
                </h2>

                <p>{message}</p>

                <div className="message-dialog-actions">
                    <button
                        type="button"
                        className="neutral-action"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </section>
        </div>
    )
}