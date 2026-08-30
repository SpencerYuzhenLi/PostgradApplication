import type {
    RefereeFormValues,
} from '../components/RefereeForm'

export interface RefereeWriteRequest {
    name: string
    email: string
}

export function toRefereeWriteRequest(
    values: RefereeFormValues
): RefereeWriteRequest {
    return {
        name: values.name.trim(),
        email: values.email.trim(),
    }
}