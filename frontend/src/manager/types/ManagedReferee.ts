import type {
    RefereeProgrammeAssignment,
} from './RefereeProgrammeAssignment'

export interface ManagedReferee {
    id: number
    name: string
    email: string | null

    accessActive: boolean

    programmes:
        RefereeProgrammeAssignment[]
}