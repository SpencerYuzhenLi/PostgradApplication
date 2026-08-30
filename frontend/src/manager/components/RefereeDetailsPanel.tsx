import './RefereeDetailsPanel.css'
import type { ManagedReferee } from '../types/ManagedReferee'
import { useScrollable } from '../../shared/hooks/useScrollable'
import { DetailRow } from '../../shared/components/DetailRow'

interface RefereeDetailsPanelProps {
    referee: ManagedReferee
    onClose: () => void
    onEdit: () => void
}

export function RefereeDetailsPanel({
    referee,
    onClose,
    onEdit,
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
                <div className="referee-details-name-row">
                    <div className="referee-details-name">
                        {referee.name}
                    </div>

                    <button
                        type="button"
                        className="referee-details-edit"
                        onClick={onEdit}
                    >
                        Edit
                    </button>
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
                </div>
            </section>
        </aside>
    )
}