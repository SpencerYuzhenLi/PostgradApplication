import './RefereeDetailsPanel.css'
import type { RefereeProgramme } from '../types/RefereeProgramme'
import { DetailRow } from '../../shared/components/DetailRow'
import { useScrollable } from '../../shared/hooks/useScrollable'
import { ExternalLinkIcon } from '../../shared/icons/ExternalLinkIcon'

interface RefereeDetailsPanelProps {
    programme: RefereeProgramme
    onClose: () => void
}

export function RefereeDetailsPanel({
    programme,
    onClose,
}: RefereeDetailsPanelProps) {

    const {
        ref: panelRef,
        scrollable,
    } = useScrollable<HTMLElement>()

    const refereeNotes =
        programme.refereeNotes?.trim()

    const hasRefereeNotes =
        Boolean(refereeNotes)

    return (
        <aside
            ref={panelRef}
            className={[
                'referee-details-panel',
                scrollable ? 'is-scrollable' : '',
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
                <div className="referee-details-institution">
                    {programme.institutionName}
                </div>

                <div className="referee-details-programme-name">
                    {programme.programmeName}
                </div>
            </div>

            <section className="referee-details-section">
                <div className="referee-details-divider" />

                <h2>Reference</h2>

                <div className="referee-detail-rows">
                    {programme.deadline && (
                        <DetailRow
                            label="Deadline"
                            value={programme.deadline}
                        />
                    )}

                    {programme.referenceSubmission && (
                        <DetailRow
                            label="Submission"
                            value={
                                programme.referenceSubmission
                            }
                        />
                    )}

                    <DetailRow
                        label="Status"
                        value={
                            programme.submitted
                                ? 'Submitted'
                                : 'Outstanding'
                        }
                    />
                </div>

                {programme.informationForRefereesUrl && (
                    <div className="referee-details-links">
                        <a
                            href={
                                programme.informationForRefereesUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>
                                Information for referees
                            </span>

                            <span
                                className="referee-details-link-icon-area"
                                aria-hidden="true"
                            >
                                <ExternalLinkIcon
                                    className="referee-details-link-icon"
                                />
                            </span>
                        </a>
                    </div>
                )}
            </section>

            {hasRefereeNotes && (
                <section className="referee-details-section referee-details-notes">
                    <div className="referee-details-divider" />

                    <h2>Referee notes</h2>

                    <p>{refereeNotes}</p>
                </section>
            )}
        </aside>
    )
}