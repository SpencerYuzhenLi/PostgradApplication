import './ProgrammeDetailsPanel.css'
import type { Programme } from '../../shared/types/Programme'
import { useScrollable } from '../../shared/hooks/useScrollable'
import { ProgrammeDetailRow } from './ProgrammeDetailRow'
import { ExternalLinkIcon } from '../../shared/icons/ExternalLinkIcon'


function formatBoolean(value: boolean | null) {
    if (value === null) {
        return null
    }

    return value ? 'Yes' : 'No'
}

interface ProgrammeDetailsPanelProps {
    programme: Programme
    onClose: () => void
    onEdit: () => void
}

export function ProgrammeDetailsPanel({
    programme,
    onClose,
    onEdit,
}: ProgrammeDetailsPanelProps) {

    const {
        ref: panelRef,
        scrollable,
    } = useScrollable<HTMLElement>()

    const hasRequirements = Boolean(
        programme.ieltsSubmission ||
        programme.greMathRequirement ||
        programme.institutionEtsCode ||
        programme.departmentalEtsCode
    )

    const hasReferences = Boolean(
        programme.referenceCount !== null ||
        programme.referenceSubmission ||
        programme.referenceDeadline ||
        programme.informationForRefereesUrl
    )

    const hasFinance = Boolean(
        programme.applicationFee ||
        programme.annualTuition ||
        programme.fundingAvailable !== null ||
        programme.fundingGuaranteed !== null
    )

    const hasApplication = Boolean(
        programme.applicationOpens ||
        programme.applicationDeadline ||
        programme.applicationPortalUrl
    )

    const links = programme.links
    const hasLinks = links.length > 0

    const notes = programme.notes?.trim()
    const hasNotes = Boolean(notes)

    const refereeNotes = programme.refereeNotes?.trim()
    const hasRefereeNotes = Boolean(refereeNotes)


    return (
       <aside
           ref={panelRef}
           className={[
               'programme-details-panel',
               scrollable ? 'is-scrollable' : '',
           ]
               .filter(Boolean)
               .join(' ')}
       >
            <div className="details-header">
                <span className="details-label">
                    Details
                </span>

                <button
                    type="button"
                    className="details-close"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>

            <div className="details-identity">
                <div className="details-institution-row">
                    <div className="details-institution">
                        {programme.institutionName}
                    </div>

                    <button
                        type="button"
                        className="details-edit"
                        onClick={onEdit}
                    >
                        Edit
                    </button>
                </div>

                <div className="details-programme-name">
                    {programme.programmeName}
                </div>

                {programme.programmeLength && (
                    <div className="details-programme-length">
                        {programme.programmeLength}
                    </div>
                )}
            </div>

            {hasRequirements && (
                <section className="details-section">
                    <div className="details-divider" />
                    <h2>Requirements</h2>

                    <div className="programme-detail-rows">
                        <ProgrammeDetailRow
                            label="IELTS Submission"
                            value={programme.ieltsSubmission}
                        />

                        <ProgrammeDetailRow
                            label="GRE Math"
                            value={programme.greMathRequirement}
                        />

                        <ProgrammeDetailRow
                            label="Institution ETS code"
                            value={programme.institutionEtsCode}
                        />

                        <ProgrammeDetailRow
                            label="Departmental ETS code"
                            value={programme.departmentalEtsCode}
                        />
                    </div>
                </section>
            )}

            {hasReferences && (
                <section className="details-section">
                    <div className="details-divider" />
                    <h2>References</h2>

                    <div className="details-section-content">
                        <ProgrammeDetailRow
                            label="References"
                            value={programme.referenceCount}
                        />

                        <ProgrammeDetailRow
                            label="Submission"
                            value={programme.referenceSubmission}
                        />

                        <ProgrammeDetailRow
                            label="Deadline"
                            value={programme.referenceDeadline}
                        />

                        {programme.informationForRefereesUrl && (
                            <div className="details-links">
                                <a
                                    href={programme.informationForRefereesUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Information for referees</span>

                                    <span
                                        className="details-link-icon-area"
                                        aria-hidden="true"
                                    >
                                        <ExternalLinkIcon
                                            className="details-link-icon"
                                        />
                                    </span>
                                </a>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {hasFinance && (
                <section className="details-section">
                    <div className="details-divider" />
                    <h2>Finance</h2>

                    <div className="programme-detail-rows">
                        <ProgrammeDetailRow
                            label="Application fee"
                            value={programme.applicationFee}
                        />

                        <ProgrammeDetailRow
                            label="Annual tuition"
                            value={programme.annualTuition}
                        />

                        <ProgrammeDetailRow
                            label="Funding available"
                            value={formatBoolean(programme.fundingAvailable)}
                        />

                        <ProgrammeDetailRow
                            label="Funding guaranteed"
                            value={formatBoolean(programme.fundingGuaranteed)}
                        />
                    </div>
                </section>
            )}

            {hasApplication && (
                <section className="details-section">
                    <div className="details-divider" />

                    <h2>Application</h2>

                    <div className="details-section-content">
                        <ProgrammeDetailRow
                            label="Opens"
                            value={programme.applicationOpens}
                        />

                        <ProgrammeDetailRow
                            label="Deadline"
                            value={programme.applicationDeadline}
                        />

                        {programme.applicationPortalUrl && (
                            <div className="details-links">
                                <a
                                    href={programme.applicationPortalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Application portal</span>
                                    <span
                                        className="details-link-icon-area"
                                        aria-hidden="true"
                                    >
                                        <ExternalLinkIcon className="details-link-icon" />
                                    </span>
                                </a>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {hasLinks && (
                <section className="details-section">
                    <div className="details-divider" />

                    <h2>More Information</h2>

                    <div className="details-links">
                        {links.map(link => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span>
                                    {link.displayName}
                                </span>

                                <span
                                    className="details-link-icon-area"
                                    aria-hidden="true"
                                >
                                    <ExternalLinkIcon className="details-link-icon" />
                                </span>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {hasNotes && (
                <section className="details-section details-notes">
                    <div className="details-divider" />

                    <h2>Notes</h2>

                    <p>{notes}</p>
                </section>
            )}

            {hasRefereeNotes && (
                <section className="details-section details-notes">
                    <div className="details-divider" />

                    <h2>Referee Notes</h2>

                    <p>{refereeNotes}</p>
                </section>
            )}
        </aside>
    )
}