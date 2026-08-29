import './RefereeDetailsPanel.css'
import { useState } from 'react'
import { RefereeAccessConfirmation } from './RefereeAccessConfirmation'
import type { ManagedReferee } from '../types/ManagedReferee'
import { useScrollable } from '../../shared/hooks/useScrollable'
import { DetailRow } from '../../shared/components/DetailRow'

interface RefereeDetailsPanelProps {
    referee: ManagedReferee
    onClose: () => void
}

export function RefereeDetailsPanel({
    referee,
    onClose,
}: RefereeDetailsPanelProps) {

    const {
        ref: panelRef,
        scrollable,
    } = useScrollable<HTMLElement>()

    const submittedCount =
        referee.programmes.filter(
            programme =>
                programme.submitted
        ).length

    const sortedProgrammes =
        [...referee.programmes].sort(
            (a, b) => {
                if (
                    a.submitted !==
                    b.submitted
                ) {
                    return a.submitted
                        ? 1
                        : -1
                }

                if (
                    a.deadline !==
                    b.deadline
                ) {
                    if (a.deadline === null) {
                        return 1
                    }

                    if (b.deadline === null) {
                        return -1
                    }

                    return a.deadline.localeCompare(
                        b.deadline
                    )
                }

                return (
                    a.programmeShortName
                        .localeCompare(
                            b.programmeShortName
                        )
                )
            }
        )

    const [
        accessConfirmation,
        setAccessConfirmation,
    ] = useState<
        'regenerate' |
        'revoke' |
        null
    >(null)

    return (
        <aside
            ref={panelRef}
            className={[
                'referee-details-panel',
                scrollable
                    ? 'is-scrollable'
                    : '',
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <div className="referee-details-header">
                <span className="referee-details-label">
                    Details
                </span>

                <button
                    type="button"
                    className="referee-details-close"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>

            <div className="referee-details-identity">
                <div className="referee-details-name">
                    {referee.name}
                </div>

                {referee.email && (
                    <div className="referee-details-email">
                        {referee.email}
                    </div>
                )}
            </div>

            <section className="referee-details-section">
                <div className="referee-details-divider" />

                <div className="referee-details-section-header">
                    <h2>References</h2>

                    <span className="referee-details-section-summary">
                        {submittedCount}
                        {' / '}
                        {referee.programmes.length}
                    </span>
                </div>

                {sortedProgrammes.length > 0 ? (
                    <div className="referee-reference-list">
                        {sortedProgrammes.map(
                            programme => (
                                <div
                                    key={
                                        programme.programmeId
                                    }
                                    className="referee-reference-row"
                                >
                                    <span className="referee-reference-programme">
                                        {
                                            programme
                                                .programmeShortName
                                        }
                                    </span>

                                    <span className="referee-reference-deadline">
                                        {
                                            programme.deadline ??
                                            ''
                                        }
                                    </span>

                                    <span className="referee-reference-status">
                                        {programme.submitted
                                            ? 'Submitted'
                                            : 'Outstanding'}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <p className="referee-reference-empty">
                        No programmes assigned.
                    </p>
                )}
            </section>

            <section className="referee-details-section">
                <div className="referee-details-divider" />

                <h2>Access</h2>

                <div className="referee-details-section-content">
                    <DetailRow
                        label="Status"
                        value={
                            referee.accessActive
                                ? 'Active'
                                : 'Not issued'
                        }
                    />

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
                                >
                                    Revoke access
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="neutral-action"
                            >
                                Generate access link
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {accessConfirmation && (
                <RefereeAccessConfirmation
                    referee={referee}
                    action={accessConfirmation}
                    onCancel={() =>
                        setAccessConfirmation(null)
                    }
                    onConfirm={() => {
                        /*
                         * Backend operation comes next.
                         */
                        setAccessConfirmation(null)
                    }}
                />
            )}
        </aside>
    )
}