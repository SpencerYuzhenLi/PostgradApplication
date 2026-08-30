import { useEffect, useRef, useState } from 'react'
import { managerFetch } from '../utils/managerApi'
import type { Programme } from '../../shared/types/Programme'
import type { Referee } from '../../shared/types/Referee'
import type { ProgrammeFormValues } from './ProgrammeForm'
import { ProgrammeForm, getProgrammeFormValues } from './ProgrammeForm'
import { toProgrammeWriteRequest } from '../types/ProgrammeWriteRequest'
import { ProgrammeDeleteConfirmation } from './ProgrammeDeleteConfirmation'
import { DiscardConfirmation } from '../../shared/components/DiscardConfirmation'
import { MessageDialog } from '../../shared/components/MessageDialog'
import { getResponseError } from '../../shared/utils/api'


interface ProgrammeFormModalProps {
    mode: 'add' | 'edit'
    programme?: Programme
    draft?: ProgrammeFormValues
    referees: Referee[]

    onClose: () => void
    onCreated?: (programme: Programme) => void
    onUpdated?: (programme: Programme) => void
    onDeleted?: (programmeId: number) => void
    onSaveDraft?: (values: ProgrammeFormValues) => void
    onDiscardDraft?: () => void
}

export function ProgrammeFormModal({
    mode,
    programme,
    draft,
    referees,
    onClose,
    onCreated,
    onUpdated,
    onDeleted,
    onSaveDraft,
    onDiscardDraft,
}: ProgrammeFormModalProps) {

    const editingDraft =
        mode === 'add' && draft !== undefined

    const title =
        mode === 'edit'
            ? 'Edit Programme'
            : editingDraft
                ? 'Edit Draft'
                : 'Add Programme'

    const [initialValues] =
        useState<ProgrammeFormValues>(() =>
            mode === 'edit' && programme
                ? getProgrammeFormValues(programme)
                : draft ?? getProgrammeFormValues()
        )

    const [values, setValues] =
        useState<ProgrammeFormValues>(
            initialValues
        )

    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [dirty, setDirty] = useState(false)
    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [discardDraftConfirmationOpen, setDiscardDraftConfirmationOpen] = useState(false)

    const [messageDialog, setMessageDialog] =
        useState<{
            title: string
            message: string
        } | null>(null)

    const modalRef =
        useRef<HTMLElement>(null)

    const closeButtonRef =
        useRef<HTMLButtonElement>(null)

    useEffect(() => {
        closeButtonRef.current?.focus()
    }, [])

    const childDialogOpen =
        deleteConfirmationOpen ||
        discardConfirmationOpen ||
        discardDraftConfirmationOpen ||
        messageDialog !== null

    useEffect(() => {
        if (childDialogOpen) {
            return
        }

        function handleTab(
            event: KeyboardEvent
        ) {
            if (event.key !== 'Tab') {
                return
            }

            const modal = modalRef.current

            if (!modal) {
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
                ).filter(element => {
                    /*
                     * Ignore controls belonging to nested dialogs.
                     */
                    return (
                        element.closest('[role="dialog"]')
                        === modal
                    )
                })

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
            handleTab,
            true
        )

        return () => {
            document.removeEventListener(
                'keydown',
                handleTab,
                true
            )
        }
    }, [childDialogOpen])

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Escape') {
                return
            }

            event.preventDefault()
            event.stopPropagation()

            if (messageDialog) {
                setMessageDialog(null)
                return
            }

            if (deleteConfirmationOpen) {
                setDeleteConfirmationOpen(false)
                setDeleteError(null)
                return
            }

            if (discardDraftConfirmationOpen) {
                setDiscardDraftConfirmationOpen(false)
                return
            }

            if (discardConfirmationOpen) {
                setDiscardConfirmationOpen(false)
                return
            }

            requestClose()
        }

        document.addEventListener(
            'keydown',
            handleKeyDown,
            true
        )

        return () => {
            document.removeEventListener(
                'keydown',
                handleKeyDown,
                true
            )
        }
    }, [
        dirty,
        saving,
        deleting,
        messageDialog,
        deleteConfirmationOpen,
        discardConfirmationOpen,
        discardDraftConfirmationOpen,
    ])

    useEffect(() => {
        const previousOverflow =
            document.body.style.overflow

        document.body.style.overflow = 'hidden'

        return () => {
            document.body.style.overflow =
                previousOverflow
        }
    }, [])

    async function handleSubmit(
        values: ProgrammeFormValues,
    ) {
        setSaving(true)

        try {
            const request =
                toProgrammeWriteRequest(values)

            const response =
                await managerFetch(
                    mode === 'add'
                        ? '/api/programmes'
                        : `/api/programmes/${programme!.id}`,
                    {
                        method:
                            mode === 'add'
                                ? 'POST'
                                : 'PUT',

                        headers: {
                            'Content-Type':
                                'application/json',
                        },

                        body:
                            JSON.stringify(request),
                    }
                )

            if (!response.ok) {
                throw new Error(
                    await getResponseError(response)
                )
            }

            const savedProgramme: Programme =
                await response.json()

            if (mode === 'add') {
                onCreated?.(savedProgramme)
            } else {
                onUpdated?.(savedProgramme)
            }

            onClose()
        } catch (error) {
            setMessageDialog({
                title:
                    mode === 'add'
                        ? 'Could not add programme'
                        : 'Could not save changes',

                message:
                    error instanceof TypeError
                        ? 'Could not connect to the server.'
                        : error instanceof Error
                            ? error.message
                            : 'An unexpected error occurred.'
            })
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete() {
        if (
            mode !== 'edit' ||
            !programme
        ) {
            return
        }

        setDeleting(true)
        setDeleteError(null)

        try {
            const response =
                await managerFetch(
                    `/api/programmes/${programme.id}`,
                    {
                        method: 'DELETE',
                    }
                )

            if (!response.ok) {
                throw new Error(
                    await getResponseError(response)
                )
            }

            onDeleted?.(programme.id)
            onClose()
        } catch (error) {
            setDeleteError(
                error instanceof TypeError
                    ? 'Could not connect to the server.'
                    : error instanceof Error
                        ? error.message
                        : 'Could not delete the programme.'
            )
        } finally {
            setDeleting(false)
        }
    }

    function requestClose() {
        if (saving || deleting) {
            return
        }

        if (dirty) {
            setDiscardConfirmationOpen(true)
            return
        }

        onClose()
    }

    return (
        <div
            className="form-modal-backdrop"
            role="presentation"
        >
            <section
                ref={modalRef}
                className="form-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="programme-modal-title"
            >
                <header className="form-modal-header">
                    <h2 id="programme-modal-title">
                        {title}
                    </h2>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="neutral-action"
                        onClick={requestClose}
                        disabled={saving || deleting}
                    >
                        Close
                    </button>
                </header>

                <div className="form-modal-body">
                    <div className="form-modal-body-content">
                        <ProgrammeForm
                            values={values}
                            referees={referees}
                            onChange={setValues}
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            onDirtyChange={setDirty}
                            onValidationError={message =>
                                setMessageDialog({
                                    title: 'Invalid value',
                                    message,
                                })
                            }
                        />
                    </div>
                </div>

                <footer className="form-modal-footer">
                    <div className="form-modal-footer-start">
                        {editingDraft ? (
                            <button
                                type="button"
                                className="destructive-action"
                                onClick={() =>
                                    setDiscardDraftConfirmationOpen(true)
                                }
                                disabled={saving || deleting}
                            >
                                Discard draft
                            </button>
                        ) : mode === 'edit' ? (
                            <button
                                type="button"
                                className="destructive-action"
                                onClick={() =>
                                    setDeleteConfirmationOpen(true)
                                }
                                disabled={saving || deleting}
                            >
                                Delete programme
                            </button>
                        ) : null}
                    </div>

                    <div className="form-modal-footer-end">
                        <button
                            type="button"
                            className="neutral-action"
                            onClick={requestClose}
                            disabled={saving || deleting}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            form="programme-form"
                            className="form-modal-submit"
                            disabled={saving || deleting}
                        >
                            {saving
                                ? mode === 'add'
                                    ? 'Adding...'
                                    : 'Saving...'
                                : mode === 'add'
                                    ? 'Add programme'
                                    : 'Save changes'}
                        </button>
                    </div>
                </footer>

                {deleteConfirmationOpen &&
                    mode === 'edit' &&
                    programme && (
                        <ProgrammeDeleteConfirmation
                            programme={programme}
                            deleting={deleting}
                            error={deleteError}
                            onCancel={() => {
                                setDeleteConfirmationOpen(false)
                                setDeleteError(null)
                            }}
                            onConfirm={handleDelete}
                        />
                    )
                }

                {discardConfirmationOpen && (
                    <DiscardConfirmation
                        allowSaveDraft={mode === 'add'}
                        editingDraft={editingDraft}
                        onSaveDraft={
                            mode === 'add'
                                ? () => {
                                    onSaveDraft?.(values)
                                    setDiscardConfirmationOpen(false)
                                    onClose()
                                }
                                : undefined
                        }
                        onCancel={() =>
                            setDiscardConfirmationOpen(false)
                        }
                        onDiscard={() => {
                            setDiscardConfirmationOpen(false)
                            onClose()
                        }}
                    />
                )}

                {discardDraftConfirmationOpen && (
                    <DiscardConfirmation
                        variant="draft"
                        onCancel={() =>
                            setDiscardDraftConfirmationOpen(false)
                        }
                        onDiscard={() => {
                            setDiscardDraftConfirmationOpen(false)
                            onDiscardDraft?.()
                            onClose()
                        }}
                    />
                )}

                {messageDialog && (
                    <MessageDialog
                        title={messageDialog.title}
                        message={messageDialog.message}
                        onClose={() =>
                            setMessageDialog(null)
                        }
                    />
                )}
            </section>
        </div>
    )
}