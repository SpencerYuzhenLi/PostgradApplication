import type {
    RefereeProgramme,
} from '../types/RefereeProgramme'

export async function loadRefereeProgrammes():
    Promise<RefereeProgramme[]> {

    const url = import.meta.env.DEV
        ? '/api/referee-programmes'
        : `${import.meta.env.BASE_URL}data/referee-programmes.json`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(
            `HTTP error: ${response.status}`
        )
    }

    return response.json()
}