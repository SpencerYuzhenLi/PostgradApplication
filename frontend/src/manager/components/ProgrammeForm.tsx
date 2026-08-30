import { useEffect, useMemo } from 'react'
import { FormSection } from '../../shared/components/FormSection'
import { FormField } from '../../shared/components/FormField'
import { FormSelect } from '../../shared/components/FormSelect'
import { FormTextarea } from '../../shared/components/FormTextarea'
import { ProgrammeLinksEditor } from './ProgrammeLinksEditor'
import type { Degree, Region, Country, Status, Programme } from '../../shared/types/Programme'
import type { Referee } from '../../shared/types/Referee'
import { degreeNames, regionNames, countryNames, statusNames, refereeStatusNames } from '../../shared/utils/displayNames'




type BooleanOption = 'YES' | 'NO'

const booleanNames = {
    YES: 'Yes',
    NO: 'No',
} as const

export type ProgrammeRefereeStatus =
    | 'UNASSIGNED'
    | 'OUTSTANDING'
    | 'SUBMITTED'

export interface ProgrammeRefereeFormValue {
    refereeId: number
    status: ProgrammeRefereeStatus
}

function sortRefereeAssignments(
    assignments:
        ProgrammeRefereeFormValue[]
) {
    return [...assignments].sort(
        (a, b) =>
            a.refereeId -
            b.refereeId
    )
}

export interface ProgrammeLinkFormValue {
    id: number | null
    displayName: string
    url: string
}

export interface ProgrammeFormValues {
    programmeShortName: string
    institutionName: string
    programmeName: string
    programmeLength: string
    degree: Degree | null

    region: Region | null
    country: Country | null

    qsRanking: string
    usNewsRanking: string
    theRanking: string
    arwuRanking: string

    status: Status | null
    applicationOpens: string
    applicationDeadline: string
    applicationPortalUrl: string

    ieltsSubmission: string
    greMathRequirement: string
    institutionEtsCode: string
    departmentalEtsCode: string

    referenceCount: string
    referenceDeadline: string
    referenceSubmission: string
    informationForRefereesUrl: string
    refereeNotes: string

    refereeAssignments: ProgrammeRefereeFormValue[]

    applicationFee: string
    annualTuition: string
    fundingAvailable: boolean | null
    fundingGuaranteed: boolean | null

    links: ProgrammeLinkFormValue[]

    notes: string
}

export function getProgrammeFormValues(
    programme?: Programme
): ProgrammeFormValues {
    return {
        programmeShortName:
            programme?.programmeShortName ?? '',

        institutionName:
            programme?.institutionName ?? '',

        programmeName:
            programme?.programmeName ?? '',

        programmeLength:
            programme?.programmeLength ?? '',

        degree:
            programme?.degree ?? null,

        region:
            programme?.region ?? null,

        country:
            programme?.country ?? null,

        qsRanking:
            programme?.qsRanking?.toString() ?? '',

        usNewsRanking:
            programme?.usNewsRanking?.toString() ?? '',

        theRanking:
            programme?.theRanking?.toString() ?? '',

        arwuRanking:
            programme?.arwuRanking?.toString() ?? '',

        status:
            programme?.status ?? null,

        applicationOpens:
            programme?.applicationOpens ?? '',

        applicationDeadline:
            programme?.applicationDeadline ?? '',

        applicationPortalUrl:
            programme?.applicationPortalUrl ?? '',

        ieltsSubmission:
            programme?.ieltsSubmission ?? '',

        greMathRequirement:
            programme?.greMathRequirement ?? '',

        institutionEtsCode:
            programme?.institutionEtsCode ?? '',

        departmentalEtsCode:
            programme?.departmentalEtsCode ?? '',

        referenceCount:
            programme?.referenceCount?.toString() ?? '',

        referenceDeadline:
            programme?.referenceDeadline ?? '',

        referenceSubmission:
            programme?.referenceSubmission ?? '',

        informationForRefereesUrl:
            programme?.informationForRefereesUrl ?? '',

        refereeNotes:
            programme?.refereeNotes ?? '',

        refereeAssignments:
            programme
                ? sortRefereeAssignments(
                    programme.referees.map(
                        referee => ({
                            refereeId:
                                referee.id,

                            status:
                                referee.submitted
                                    ? 'SUBMITTED'
                                    : 'OUTSTANDING',
                        })
                    )
                )
                : [],

        applicationFee:
            programme?.applicationFee ?? '',

        annualTuition:
            programme?.annualTuition ?? '',

        fundingAvailable:
            programme?.fundingAvailable ?? null,

        fundingGuaranteed:
            programme?.fundingGuaranteed ?? null,

        links: programme
            ? programme.links.map(link => ({
                ...link,
            }))
            : [],

        notes:
            programme?.notes ?? '',
    }
}

interface ProgrammeFormProps {
    values: ProgrammeFormValues
    initialValues: ProgrammeFormValues
    referees: Referee[]

    onChange: (values: ProgrammeFormValues) => void
    onSubmit: (values: ProgrammeFormValues) => void
    onDirtyChange: (dirty: boolean) => void
    onValidationError: (message: string) => void
}

export function ProgrammeForm({
    values,
    initialValues,
    referees,
    onChange,
    onSubmit,
    onDirtyChange,
    onValidationError,
}: ProgrammeFormProps) {

    const dirty = useMemo(
        () =>
            JSON.stringify(values) !==
            JSON.stringify(initialValues),
        [values, initialValues]
    )
    useEffect(() => {
        onDirtyChange(dirty)
    }, [dirty, onDirtyChange])

    function updateField<K extends keyof ProgrammeFormValues>(
        field: K,
        value: ProgrammeFormValues[K]
    ) {
        onChange({
            ...values,
            [field]: value,
        })
    }

    function getRefereeStatus(
        refereeId: number
    ): ProgrammeRefereeStatus {
        return (
            values.refereeAssignments.find(
                assignment =>
                    assignment.refereeId ===
                    refereeId
            )?.status ??
            'UNASSIGNED'
        )
    }

    function updateRefereeStatus(
        refereeId: number,
        status: ProgrammeRefereeStatus
    ) {
        const existing =
            values.refereeAssignments.some(
                assignment =>
                    assignment.refereeId ===
                    refereeId
            )

        /*
         * Keep the form state compact:
         * UNASSIGNED is represented by absence.
         */
        if (status === 'UNASSIGNED') {
            updateField(
                'refereeAssignments',
                values.refereeAssignments.filter(
                    assignment =>
                        assignment.refereeId !==
                        refereeId
                )
            )

            return
        }

        if (existing) {
            updateField(
                'refereeAssignments',
                values.refereeAssignments.map(
                    assignment =>
                        assignment.refereeId ===
                        refereeId
                            ? {
                                ...assignment,
                                status,
                            }
                            : assignment
                )
            )

            return
        }

        updateField(
            'refereeAssignments',
            [
                ...values.refereeAssignments,
                {
                    refereeId,
                    status,
                },
            ]
        )
    }

    function getLinkDescription(
        link: ProgrammeLinkFormValue,
        index: number
    ) {
        const displayName =
            link.displayName.trim()

        return displayName !== ''
            ? `"${displayName}"`
            : `Link ${index + 1}`
    }

    function validateValues(
        values: ProgrammeFormValues
    ): string | null {
        if (values.programmeShortName.trim() === '') {
            return 'Programme short name is required.'
        }

        const rankings = [
            ['QS ranking', values.qsRanking],
            ['US News ranking', values.usNewsRanking],
            ['THE ranking', values.theRanking],
            ['ARWU ranking', values.arwuRanking],
        ] as const

        for (const [label, value] of rankings) {
            if (value.trim() === '') {
                continue
            }

            const ranking = Number(value)

            if (
                !Number.isInteger(ranking) ||
                ranking < 1
            ) {
                return `${label} must be a whole number of at least 1.`
            }
        }

        if (values.applicationPortalUrl.trim() !== '') {
            try {
                const url =
                    new URL(values.applicationPortalUrl.trim())

                if (
                    url.protocol !== 'http:' &&
                    url.protocol !== 'https:'
                ) {
                    return 'Application portal must use an HTTP or HTTPS URL.'
                }
            } catch {
                return 'Application portal must have a valid URL.'
            }
        }

        if (values.referenceCount.trim() !== '') {
            const count =
                Number(values.referenceCount)

            if (
                !Number.isInteger(count) ||
                count < 0
            ) {
                return 'Reference count must be a non-negative whole number.'
            }
        }

        const validRefereeIds =
            new Set(
                referees.map(
                    referee => referee.id
                )
            )

        if (
            values.refereeAssignments.some(
                assignment =>
                    !validRefereeIds.has(
                        assignment.refereeId
                    )
            )
        ) {
            return 'One or more selected referees are no longer available.'
        }

        if (values.informationForRefereesUrl.trim() !== '') {
            try {
                const url =
                    new URL(
                        values.informationForRefereesUrl.trim()
                    )

                if (
                    url.protocol !== 'http:' &&
                    url.protocol !== 'https:'
                ) {
                    return 'Information for referees URL must use HTTP or HTTPS.'
                }
            } catch {
                return 'Information for referees URL must be a valid URL.'
            }
        }

        for (let index = 0; index < values.links.length; index++) {
            const link = values.links[index]

            const description =
                getLinkDescription(link, index)

            if (link.displayName.trim() === '') {
                return `${description} must have a display name.`
            }

            if (link.url.trim() === '') {
                return `${description} must have a URL.`
            }

            try {
                const url = new URL(link.url.trim())

                if (
                    url.protocol !== 'http:' &&
                    url.protocol !== 'https:'
                ) {
                    return `${description} must use an HTTP or HTTPS URL.`
                }
            } catch {
                return `${description} must have a valid URL.`
            }
        }

        return null
    }

    function handleSubmit() {
        const validationError =
            validateValues(values)

        if (validationError !== null) {
            onValidationError(validationError)
            return
        }

        onSubmit(values)
    }

    return (
        <form
            id="programme-form"
            className="form"
            noValidate
            onSubmit={event => {
                event.preventDefault()
                handleSubmit()
            }}
        >
            <FormSection
                title="Programme"
                defaultOpen
            >

                <FormField
                    label="Short name"
                    value={values.programmeShortName}
                    onChange={value =>
                        updateField('programmeShortName', value)
                    }
                />

                <FormField
                    label="Institution"
                    value={values.institutionName}
                    onChange={value =>
                        updateField('institutionName', value)
                    }
                />

                <FormField
                    label="Programme name"
                    value={values.programmeName}
                    onChange={value =>
                        updateField('programmeName', value)
                    }
                />

                <FormField
                    label="Programme length"
                    value={values.programmeLength}
                    onChange={value =>
                        updateField('programmeLength', value)
                    }
                />

                <FormSelect
                    label="Degree"
                    value={values.degree}
                    options={degreeNames}
                    onChange={value =>
                        updateField('degree', value)
                    }
                />
            </FormSection>

            <FormSection title="Location">
                <FormSelect
                    label="Region"
                    value={values.region}
                    options={regionNames}
                    onChange={value =>
                        updateField('region', value)
                    }
                />

                <FormSelect
                    label="Country"
                    value={values.country}
                    options={countryNames}
                    onChange={value =>
                        updateField('country', value)
                    }
                />
            </FormSection>

            <FormSection title="Rankings">
                <FormField
                    label="QS"
                    type="number"
                    min={1}
                    value={values.qsRanking}
                    onChange={value =>
                        updateField('qsRanking', value)
                    }
                />

                <FormField
                    label="US News"
                    type="number"
                    min={1}
                    value={values.usNewsRanking}
                    onChange={value =>
                        updateField('usNewsRanking', value)
                    }
                />

                <FormField
                    label="THE"
                    type="number"
                    min={1}
                    value={values.theRanking}
                    onChange={value =>
                        updateField('theRanking', value)
                    }
                />

                <FormField
                    label="ARWU"
                    type="number"
                    min={1}
                    value={values.arwuRanking}
                    onChange={value =>
                        updateField('arwuRanking', value)
                    }
                />
            </FormSection>

            <FormSection title="Application">
                <FormSelect
                    label="Status"
                    value={values.status}
                    options={statusNames}
                    onChange={value =>
                        updateField('status', value)
                    }
                />

                <FormField
                    label="Application opens"
                    type="date"
                    value={values.applicationOpens}
                    onChange={value =>
                        updateField('applicationOpens', value)
                    }
                />

                <FormField
                    label="Application deadline"
                    type="date"
                    value={values.applicationDeadline}
                    onChange={value =>
                        updateField('applicationDeadline', value)
                    }
                />

                <FormField
                    label="Application portal"
                    value={values.applicationPortalUrl}
                    onChange={value =>
                        updateField('applicationPortalUrl', value)
                    }
                />
            </FormSection>

            <FormSection title="Requirements">
                <FormField
                    label="IELTS submission"
                    value={values.ieltsSubmission}
                    onChange={value =>
                        updateField('ieltsSubmission', value)
                    }
                />

                <FormField
                    label="GRE Math"
                    value={values.greMathRequirement}
                    onChange={value =>
                        updateField('greMathRequirement', value)
                    }
                />

                <FormField
                    label="Institution ETS code"
                    value={values.institutionEtsCode}
                    onChange={value =>
                        updateField('institutionEtsCode', value)
                    }
                />

                <FormField
                    label="Departmental ETS code"
                    value={values.departmentalEtsCode}
                    onChange={value =>
                        updateField('departmentalEtsCode', value)
                    }
                />
            </FormSection>

            <FormSection title="References">
                <FormField
                    label="Reference count"
                    type="number"
                    value={values.referenceCount}
                    onChange={value =>
                        updateField('referenceCount', value)
                    }
                />

                <FormField
                    label="Reference deadline"
                    type="date"
                    value={values.referenceDeadline}
                    onChange={value =>
                        updateField('referenceDeadline', value)
                    }
                />

                <FormField
                    label="Reference submission"
                    value={values.referenceSubmission}
                    onChange={value =>
                        updateField('referenceSubmission', value)
                    }
                />

                <FormField
                    label="Information for referees URL"
                    value={values.informationForRefereesUrl}
                    onChange={value =>
                        updateField('informationForRefereesUrl', value)
                    }
                />

                <FormTextarea
                    label="Referee notes"
                    value={values.refereeNotes}
                    onChange={value =>
                        updateField('refereeNotes', value)
                    }
                />
            </FormSection>

            <FormSection title="Referees">
                {[...referees]
                    .sort(
                        (a, b) =>
                            a.name.localeCompare(
                                b.name
                            )
                    )
                    .map(referee => (
                        <FormSelect<ProgrammeRefereeStatus>
                            key={referee.id}
                            label={referee.name}
                            value={getRefereeStatus(referee.id)}
                            options={refereeStatusNames}
                            unselectedValue="UNASSIGNED"
                            allowUnselected={false}
                            onChange={status =>
                                updateRefereeStatus(
                                    referee.id,
                                    status ?? 'UNASSIGNED'
                                )
                            }
                        />
                    ))
                }
            </FormSection>

            <FormSection title="Finance">
                <FormField
                    label="Application fee"
                    value={values.applicationFee}
                    onChange={value =>
                        updateField('applicationFee', value)
                    }
                />

                <FormField
                    label="Annual tuition"
                    value={values.annualTuition}
                    onChange={value =>
                        updateField('annualTuition', value)
                    }
                />

                <FormSelect<BooleanOption>
                    label="Funding available"
                    value={
                        values.fundingAvailable === null
                            ? null
                            : values.fundingAvailable
                                ? 'YES'
                                : 'NO'
                    }
                    options={booleanNames}
                    onChange={value =>
                        updateField(
                            'fundingAvailable',
                            value === null
                                ? null
                                : value === 'YES'
                        )
                    }
                />

                <FormSelect<BooleanOption>
                    label="Funding guaranteed"
                    value={
                        values.fundingGuaranteed === null
                            ? null
                            : values.fundingGuaranteed
                                ? 'YES'
                                : 'NO'
                    }
                    options={booleanNames}
                    onChange={value =>
                        updateField(
                            'fundingGuaranteed',
                            value === null
                                ? null
                                : value === 'YES'
                        )
                    }
                />
            </FormSection>

            <FormSection title="Links">
                <ProgrammeLinksEditor
                    links={values.links}
                    onChange={links =>
                        updateField('links', links)
                    }
                />
            </FormSection>

            <FormSection title="Notes">
                <FormTextarea
                    label="Notes"
                    value={values.notes}
                    onChange={value =>
                        updateField('notes', value)
                    }
                />
            </FormSection>

        </form>
    )
}