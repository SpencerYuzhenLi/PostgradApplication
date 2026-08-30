import './RefereeFormModal.css'
import { useEffect, useRef, useState } from 'react'
import { FormSection } from '../../shared/components/FormSection'
import type { ManagedReferee } from '../types/ManagedReferee'
import { RefereeForm, getRefereeFormValues, type RefereeFormValues } from './RefereeForm'
import { RefereeDeleteConfirmation } from './RefereeDeleteConfirmation'
import { DiscardConfirmation } from '../../shared/components/DiscardConfirmation'
import { MessageDialog } from '../../shared/components/MessageDialog'
import { RefereeAccessConfirmation } from './RefereeAccessConfirmation'
import { RefereeAccessLinkDialog } from './RefereeAccessLinkDialog'
import { managerFetch } from '../utils/managerApi'
import { getResponseError } from '../../shared/utils/api'
import { toRefereeWriteRequest } from '../types/RefereeWriteRequest'

interface RefereeFormModalProps {
    mode: 'add' | 'edit'
    referee?: ManagedReferee

    onClose: () => void
    onCreated?: (referee: ManagedReferee) => void
    onUpdated?: (referee: ManagedReferee) => void
    onDeleted?: (refereeId: number) => void
    onAccessChanged?: (
        refereeId: number,
        accessActive: boolean
    ) => void
}

export function RefereeFormModal({
    mode,
    referee,
    onClose,
    onCreated,
    onUpdated,
    onDeleted,
    onAccessChanged,
}: RefereeFormModalProps) {

    const title =
        mode === 'edit'
            ? 'Edit Referee'
            : 'Add Referee'

    const [initialValues] =
        useState<RefereeFormValues>(
            () =>
                mode === 'edit' &&
                referee
                    ? getRefereeFormValues(
                        referee
                    )
                    : getRefereeFormValues()
        )

    const [values, setValues] =
        useState<RefereeFormValues>(
            initialValues
        )

    const [saving, setSaving] =
        useState(false)

    const [dirty, setDirty] =
        useState(false)

    const [
        discardConfirmationOpen,
        setDiscardConfirmationOpen,
    ] = useState(false)

    const [deleting, setDeleting] =
        useState(false)

    const [deleteError, setDeleteError] =
        useState<string | null>(null)

    const [
        updatingAccess,
        setUpdatingAccess,
    ] = useState(false)

    const [
        generatedAccessUrl,
        setGeneratedAccessUrl,
    ] = useState<string | null>(null)

    const [
        deleteConfirmationOpen,
        setDeleteConfirmationOpen,
    ] = useState(false)

    const [
        accessConfirmation,
        setAccessConfirmation,
    ] = useState<
        'regenerate' |
        'revoke' |
        null
    >(null)

    const [
        messageDialog,
        setMessageDialog,
    ] = useState<{
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
        accessConfirmation !== null ||
        messageDialog !== null ||
        generatedAccessUrl !== null

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

            const modal =
                modalRef.current

            if (!modal) {
                return
            }

            const focusableElements =
                Array.from(
                    modal.querySelectorAll<
                        HTMLElement
                    >(
                        [
                            'button:not(:disabled)',
                            'a[href]',
                            'input:not(:disabled)',
                            'select:not(:disabled)',
                            'textarea:not(:disabled)',
                            '[tabindex]:not([tabindex="-1"])',
                        ].join(',')
                    )
                ).filter(element =>
                    element.closest(
                        '[role="dialog"]'
                    ) === modal
                )

            if (
                focusableElements.length ===
                0
            ) {
                event.preventDefault()
                return
            }

            const first =
                focusableElements[0]

            const last =
                focusableElements[
                    focusableElements.length -
                    1
                ]

            if (
                event.shiftKey &&
                document.activeElement ===
                    first
            ) {
                event.preventDefault()
                last.focus()
            } else if (
                !event.shiftKey &&
                document.activeElement ===
                    last
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

        return () =>
            document.removeEventListener(
                'keydown',
                handleTab,
                true
            )
    }, [childDialogOpen])

    useEffect(() => {
        function handleKeyDown(
            event: KeyboardEvent
        ) {
            if (event.key !== 'Escape') {
                return
            }

            event.preventDefault()
            event.stopPropagation()

            if (generatedAccessUrl) {
                setGeneratedAccessUrl(null)
                return
            }

            if (messageDialog) {
                setMessageDialog(null)
                return
            }

            if (deleteConfirmationOpen) {
                setDeleteConfirmationOpen(false)
                setDeleteError(null)
                return
            }

            if (accessConfirmation) {
                setAccessConfirmation(null)
                return
            }

            if (discardConfirmationOpen) {
                setDiscardConfirmationOpen(
                    false
                )
                return
            }

            requestClose()
        }

        document.addEventListener(
            'keydown',
            handleKeyDown,
            true
        )

        return () =>
            document.removeEventListener(
                'keydown',
                handleKeyDown,
                true
            )
    }, [
       dirty,
       saving,
       deleting,
       messageDialog,
       accessConfirmation,
       deleteConfirmationOpen,
       discardConfirmationOpen,
   ])

    useEffect(() => {
        const previousOverflow =
            document.body.style.overflow

        document.body.style.overflow =
            'hidden'

        return () => {
            document.body.style.overflow =
                previousOverflow
        }
    }, [])

    function requestClose() {
        if (
            saving ||
            deleting ||
            updatingAccess
        ) {
            return
        }

        if (dirty) {
            setDiscardConfirmationOpen(true)
            return
        }

        onClose()
    }

    async function handleGenerateAccessLink() {
        if (
            mode !== 'edit' ||
            !referee
        ) {
            return
        }

        setUpdatingAccess(true)

        try {
            const response =
                await managerFetch(
                    `/api/referees/${referee.id}/access-link`,
                    {
                        method: 'POST',
                    }
                )

            if (!response.ok) {
                throw new Error(
                    await getResponseError(response)
                )
            }

            const data: {
                accessUrl: string
            } = await response.json()

            setAccessConfirmation(null)

            onAccessChanged?.(
                referee.id,
                true
            )

            setGeneratedAccessUrl(
                data.accessUrl
            )
        } catch (error) {
            setAccessConfirmation(null)

            setMessageDialog({
                title:
                    'Could not generate access link',

                message:
                    error instanceof TypeError
                        ? 'Could not connect to the server.'
                        : error instanceof Error
                            ? error.message
                            : 'An unexpected error occurred.',
            })
        } finally {
            setUpdatingAccess(false)
        }
    }

    async function handleRevokeAccess() {
        if (
            mode !== 'edit' ||
            !referee
        ) {
            return
        }

        setUpdatingAccess(true)

        try {
            const response =
                await managerFetch(
                    `/api/referees/${referee.id}/access-link`,
                    {
                        method: 'DELETE',
                    }
                )

            if (!response.ok) {
                throw new Error(
                    await getResponseError(response)
                )
            }

            setAccessConfirmation(null)

            onAccessChanged?.(
                referee.id,
                false
            )
        } catch (error) {
            setAccessConfirmation(null)

            setMessageDialog({
                title:
                    'Could not revoke access',

                message:
                    error instanceof TypeError
                        ? 'Could not connect to the server.'
                        : error instanceof Error
                            ? error.message
                            : 'An unexpected error occurred.',
            })
        } finally {
            setUpdatingAccess(false)
        }
    }

    async function handleDelete() {
        if (
            mode !== 'edit' ||
            !referee
        ) {
            return
        }

        setDeleting(true)
        setDeleteError(null)

        try {
            const response =
                await managerFetch(
                    `/api/referees/${referee.id}`,
                    {
                        method: 'DELETE',
                    }
                )

            if (!response.ok) {
                throw new Error(
                    await getResponseError(response)
                )
            }

            onDeleted?.(referee.id)
            onClose()
        } catch (error) {
            setDeleteError(
                error instanceof TypeError
                    ? 'Could not connect to the server.'
                    : error instanceof Error
                        ? error.message
                        : 'Could not delete the referee.'
            )
        } finally {
            setDeleting(false)
        }
    }

    async function handleSubmit(
        values: RefereeFormValues
    ) {
        setSaving(true)

        try {
            const request =
                toRefereeWriteRequest(values)

            const response =
                await managerFetch(
                    mode === 'add'
                        ? '/api/referees'
                        : `/api/referees/${referee!.id}`,
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
                    await getResponseError(
                        response
                    )
                )
            }

            const savedReferee:
                ManagedReferee =
                    await response.json()

            if (mode === 'add') {
                onCreated?.(
                    savedReferee
                )
            } else {
                onUpdated?.(
                    savedReferee
                )
            }

            onClose()
        } catch (error) {
            setMessageDialog({
                title:
                    mode === 'add'
                        ? 'Could not add referee'
                        : 'Could not save changes',

                message:
                    error instanceof TypeError
                        ? 'Could not connect to the server.'
                        : error instanceof Error
                            ? error.message
                            : 'An unexpected error occurred.',
            })
        } finally {
            setSaving(false)
        }
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
                aria-labelledby="referee-modal-title"
            >
                <header className="form-modal-header">
                    <h2
                        id="referee-modal-title"
                    >
                        {title}
                    </h2>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="neutral-action"
                        onClick={requestClose}
                        disabled={saving || deleting || updatingAccess}
                    >
                        Close
                    </button>
                </header>

                <div className="form-modal-body">
                    <div className="form-modal-body-content">
                        <RefereeForm
                            values={values}
                            initialValues={initialValues}
                            onChange={setValues}
                            onSubmit={handleSubmit}
                            onDirtyChange={setDirty}
                            onValidationError={message =>
                                setMessageDialog({
                                    title: 'Invalid value',
                                    message,
                                })
                            }
                        />

                        {mode === 'edit' && referee && (
                            <FormSection
                                title="Access"
                                defaultOpen
                            >
                                <div className="referee-access-status">
                                    <span>Status</span>

                                    <span>
                                        {referee.accessActive
                                            ? 'Active'
                                            : 'Not issued'}
                                    </span>
                                </div>

                                <div className="referee-access-actions">
                                    {referee.accessActive ? (
                                        <>
                                            <button
                                                type="button"
                                                className="neutral-action"
                                                onClick={() =>
                                                    setAccessConfirmation(
                                                        'regenerate'
                                                    )
                                                }
                                                disabled={
                                                    saving ||
                                                    deleting ||
                                                    updatingAccess
                                                }
                                            >
                                                Generate new link
                                            </button>

                                            <button
                                                type="button"
                                                className="destructive-action"
                                                onClick={() =>
                                                    setAccessConfirmation(
                                                        'revoke'
                                                    )
                                                }
                                                disabled={
                                                    saving ||
                                                    deleting ||
                                                    updatingAccess
                                                }
                                            >
                                                Revoke access
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            className="neutral-action"
                                            onClick={
                                                handleGenerateAccessLink
                                            }
                                            disabled={
                                                saving ||
                                                deleting ||
                                                updatingAccess
                                            }
                                        >
                                            {updatingAccess
                                                ? 'Generating...'
                                                : 'Generate access link'}
                                        </button>
                                    )}
                                </div>
                            </FormSection>
                        )}
                    </div>
                </div>

                <footer className="form-modal-footer">
                    <div className="form-modal-footer-start">
                        {mode === 'edit' && referee && (
                            <button
                                type="button"
                                className="destructive-action"
                                onClick={() =>
                                    setDeleteConfirmationOpen(true)
                                }
                                disabled={saving || deleting || updatingAccess}
                            >
                                Delete referee
                            </button>
                        )}
                    </div>

                    <div className="form-modal-footer-end">
                        <button
                            type="button"
                            className="neutral-action"
                            onClick={requestClose}
                            disabled={saving || deleting || updatingAccess}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            form="referee-form"
                            className="form-modal-submit"
                            disabled={saving || deleting || updatingAccess}
                        >
                            {saving
                                ? mode === 'add'
                                    ? 'Adding...'
                                    : 'Saving...'
                                : mode === 'add'
                                    ? 'Add referee'
                                    : 'Save changes'}
                        </button>
                    </div>
                </footer>

                {deleteConfirmationOpen &&
                    mode === 'edit' &&
                    referee && (
                        <RefereeDeleteConfirmation
                            referee={referee}
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
                        onCancel={() =>
                            setDiscardConfirmationOpen(
                                false
                            )
                        }
                        onDiscard={() => {
                            setDiscardConfirmationOpen(
                                false
                            )
                            onClose()
                        }}
                    />
                )}

                {messageDialog && (
                    <MessageDialog
                        title={
                            messageDialog.title
                        }
                        message={
                            messageDialog.message
                        }
                        onClose={() =>
                            setMessageDialog(null)
                        }
                    />
                )}

                {accessConfirmation &&
                    referee && (
                        <RefereeAccessConfirmation
                            referee={referee}
                            action={accessConfirmation}
                            updating={updatingAccess}
                            onCancel={() =>
                                setAccessConfirmation(null)
                            }
                            onConfirm={
                                accessConfirmation === 'regenerate'
                                    ? handleGenerateAccessLink
                                    : handleRevokeAccess
                            }
                        />
                    )}

                {generatedAccessUrl &&
                    referee && (
                        <RefereeAccessLinkDialog
                            refereeName={
                                referee.name
                            }
                            accessUrl={
                                generatedAccessUrl
                            }
                            onClose={() =>
                                setGeneratedAccessUrl(
                                    null
                                )
                            }
                        />
                    )}

            </section>
        </div>
    )
}