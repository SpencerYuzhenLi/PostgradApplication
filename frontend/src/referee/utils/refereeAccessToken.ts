const STORAGE_KEY =
    'refereeAccessToken'

export function getRefereeAccessToken():
    string | null {
    const url =
        new URL(window.location.href)

    const urlToken =
        url.searchParams.get('t')?.trim()

    if (urlToken) {
        sessionStorage.setItem(
            STORAGE_KEY,
            urlToken
        )

        url.searchParams.delete('t')

        window.history.replaceState(
            {},
            '',
            `${url.pathname}${url.search}${url.hash}`
        )

        return urlToken
    }

    return sessionStorage.getItem(
        STORAGE_KEY
    )
}

export function clearRefereeAccessToken() {
    sessionStorage.removeItem(
        STORAGE_KEY
    )
}