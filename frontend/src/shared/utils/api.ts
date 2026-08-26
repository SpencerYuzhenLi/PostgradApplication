interface ApiError {
    message?: string
}

export async function getResponseError(
    response: Response
): Promise<string> {
    try {
        const error =
            await response.json() as ApiError

        if (error.message) {
            return error.message
        }
    } catch {
        // Response had no usable JSON body.
    }

    return `Request failed (${response.status}).`
}