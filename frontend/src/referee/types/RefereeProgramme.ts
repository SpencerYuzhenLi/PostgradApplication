export interface RefereeProgramme {
    id: number

    programmeShortName: string
    institutionName: string | null
    programmeName: string | null

    applicationOpens: string | null
    deadline: string | null

    referenceSubmission: string | null
    submitted: boolean
    informationForRefereesUrl: string | null
    refereeNotes: string | null
}