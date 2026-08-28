const managerApiBaseUrl =
    import.meta.env
        .VITE_MANAGER_API_BASE_URL

const managerApiKey =
    import.meta.env
        .VITE_MANAGER_API_KEY

export function managerFetch(
    path: string,
    init: RequestInit = {}
) {
    if (
        !managerApiBaseUrl ||
        !managerApiKey
    ) {
        throw new Error(
            'Manager API configuration is missing.'
        )
    }

    const headers =
        new Headers(init.headers)

    headers.set(
        'X-Manager-Key',
        managerApiKey
    )

    return fetch(
        `${managerApiBaseUrl}${path}`,
        {
            ...init,
            headers,
        }
    )
}