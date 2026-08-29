import './RefereeProgrammeDetailsPanel.css'
import type { RefereeProgramme } from '../types/RefereeProgramme'
import { DetailRow } from '../../shared/components/DetailRow'
import { useScrollable } from '../../shared/hooks/useScrollable'
import { ExternalLinkIcon } from '../../shared/icons/ExternalLinkIcon'

interface RefereeProgrammeDetailsPanelProps {
    programme: RefereeProgramme
    onClose: () => void
}

export function RefereeProgrammeDetailsPanel({
    programme,
    onClose,
}: RefereeProgrammeDetailsPanelProps) {

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
                'referee-programme-details-panel',
                scrollable ? 'is-scrollable' : '',
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <div className="referee-programme-details-header">
                <span className="referee-programme-details-label">
                    Details
                </span>

                <button
                    type="button"
                    className="referee-programme-details-close"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>

            <div className="referee-programme-details-identity">
                <div className="referee-programme-details-institution">
                    {programme.institutionName}
                </div>

                <div className="referee-programme-details-programme-name">
                    {programme.programmeName}
                </div>
            </div>

            <section className="referee-programme-details-section">
                <div className="referee-programme-details-divider" />

                <h2>Reference</h2>

                <div className="referee-programme-detail-rows">
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
                    <div className="referee-programme-details-links">
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
                                className="referee-programme-details-link-icon-area"
                                aria-hidden="true"
                            >
                                <ExternalLinkIcon
                                    className="referee-programme-details-link-icon"
                                />
                            </span>
                        </a>
                    </div>
                )}
            </section>

            {hasRefereeNotes && (
                <section className="referee-programme-details-section referee-details-notes">
                    <div className="referee-programme-details-divider" />

                    <h2>Referee notes</h2>

                    <p>{refereeNotes}</p>
                </section>
            )}
        </aside>
    )
}