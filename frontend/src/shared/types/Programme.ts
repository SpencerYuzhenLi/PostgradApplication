import type { ProgrammeLink } from './ProgrammeLink'


export type Region =
    | 'NORTH_AMERICA'
    | 'EUROPE'
    | 'UNITED_KINGDOM'

export type Country =
    | 'UNITED_STATES'
    | 'CANADA'
    | 'UNITED_KINGDOM'
    | 'FRANCE'
    | 'GERMANY'
    | 'SWITZERLAND'

export type Degree =
    | 'MASTER'
    | 'DOCTORATE'

export type Status =
    | 'CONSIDERING'
    | 'PREPARING'
    | 'SUBMITTED'
    | 'SHORTLISTED'
    | 'ACCEPTED'
    | 'REJECTED'

export interface Programme {
    id: number
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
    referenceDeadline: string | null
    applicationPortalUrl: string | null

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

    links: ProgrammeLink[]

    notes: string | null
}