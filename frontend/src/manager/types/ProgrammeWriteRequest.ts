import type {
    Region,
    Country,
    Degree,
    Status,
} from '../../shared/types/Programme'
import type { ProgrammeFormValues } from '../components/ProgrammeForm'

export interface ProgrammeWriteRequest {
    programmeShortName: string

    institutionName: string | null
    programmeName: string | null

    region: Region | null
    country: Country | null

    qsRanking: number | null
    usNewsRanking: number | null
    theRanking: number | null
    arwuRanking: number | null

    degree: Degree | null

    status: Status | null
    applicationOpens: string | null
    applicationDeadline: string | null
    applicationPortalUrl: string | null
    referenceDeadline: string | null

    programmeLength: string | null

    ieltsSubmission: string | null
    greMathRequirement: string | null
    institutionEtsCode: string | null
    departmentalEtsCode: string | null

    referenceCount: number | null
    referenceSubmission: string | null
    informationForRefereesUrl: string | null
    refereeNotes: string | null

    applicationFee: string | null
    annualTuition: string | null
    fundingAvailable: boolean | null
    fundingGuaranteed: boolean | null

    links: {
        id: number | null
        displayName: string
        url: string
    }[]

    notes: string | null
}

export function toProgrammeWriteRequest(
    values: ProgrammeFormValues
) {
    const nullableString = (value: string) => {
        const trimmed = value.trim()

        return trimmed === ''
            ? null
            : trimmed
    }

    const nullableNumber = (
        value: string
    ): number | null => {
        const trimmed = value.trim()

        if (trimmed === '') {
            return null
        }

        const number = Number(trimmed)

        return Number.isFinite(number)
            ? number
            : null
    }

    return {
        programmeShortName:
            values.programmeShortName.trim(),

        institutionName:
            nullableString(values.institutionName),

        programmeName:
            nullableString(values.programmeName),

        region:
            values.region,

        country:
            values.country,

        qsRanking:
            nullableNumber(values.qsRanking),

        usNewsRanking:
            nullableNumber(values.usNewsRanking),

        theRanking:
            nullableNumber(values.theRanking),

        arwuRanking:
            nullableNumber(values.arwuRanking),

        degree:
            values.degree,

        status:
            values.status,

        applicationOpens:
            nullableString(values.applicationOpens),

        applicationDeadline:
            nullableString(values.applicationDeadline),

        referenceDeadline:
            nullableString(values.referenceDeadline),

        applicationPortalUrl:
            nullableString(values.applicationPortalUrl),

        programmeLength:
            nullableString(values.programmeLength),

        ieltsSubmission:
            nullableString(values.ieltsSubmission),

        greMathRequirement:
            nullableString(values.greMathRequirement),

        institutionEtsCode:
            nullableString(values.institutionEtsCode),

        departmentalEtsCode:
            nullableString(values.departmentalEtsCode),

        referenceCount:
            nullableNumber(values.referenceCount),

        referenceSubmission:
            nullableString(values.referenceSubmission),

        informationForRefereesUrl:
            nullableString(values.informationForRefereesUrl),

        refereeNotes:
            nullableString(values.refereeNotes),

        applicationFee:
            nullableString(values.applicationFee),

        annualTuition:
            nullableString(values.annualTuition),

        fundingAvailable:
            values.fundingAvailable,

        fundingGuaranteed:
            values.fundingGuaranteed,

        links:
            values.links.map(link => ({
                id: link.id,

                displayName:
                    link.displayName.trim(),

                url:
                    link.url.trim(),
            })),

        notes:
            nullableString(values.notes),
    }
}
