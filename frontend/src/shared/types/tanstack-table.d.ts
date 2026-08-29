import '@tanstack/react-table'
import type { Programme } from './Programme'

declare module '@tanstack/react-table' {
    interface TableMeta<
        TFeatures extends TableFeatures,
        TData
    > {
        abbreviateLocations?: boolean
        selectedProgrammeId?: number | null
        openProgrammeDetails?:
            (programme: TData) => void

        updatingSubmissionId?: number | null

        updateSubmission?: (
            programme: RefereeProgramme,
            submitted: boolean,
        ) => void
    }
}