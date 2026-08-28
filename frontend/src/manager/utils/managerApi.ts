const managerApiBaseUrl =
    import.meta.env
        .VITE_MANAGER_API_BASE_URL

const managerApiKey =
    import.meta.env
        .VITE_MANAGER_API_KEY

if (
    !managerApiBaseUrl ||
    !managerApiKey
) {
    throw new Error(
        'Manager API configuration is missing.'
    )
}

export function managerApiUrl(
    path: string
) {
    return `${managerApiBaseUrl}${path}`
}

export function managerFetch(
    path: string,
    init: RequestInit = {}
) {
    const headers =
        new Headers(init.headers)

    headers.set(
        'X-Manager-Key',
        managerApiKey
    )

    return fetch(
        managerApiUrl(path),
        {
            ...init,
            headers,
        }
    )
}