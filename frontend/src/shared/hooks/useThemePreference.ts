import {
    useEffect,
    useState,
} from 'react'
import type {
    ThemePreference,
} from '../types/Preferences'

const THEME_PREFERENCE_KEY =
    'themePreference'

function loadThemePreference():
    ThemePreference {

    const stored =
        localStorage.getItem(
            THEME_PREFERENCE_KEY
        )

    if (
        stored === 'system' ||
        stored === 'light' ||
        stored === 'dark'
    ) {
        return stored
    }

    return 'system'
}

function getSystemTheme():
    'light' | 'dark' {

    return window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches
        ? 'dark'
        : 'light'
}

export function useThemePreference() {
    const [
        themePreference,
        setThemePreference,
    ] = useState<ThemePreference>(
        loadThemePreference
    )

    useEffect(() => {
        localStorage.setItem(
            THEME_PREFERENCE_KEY,
            themePreference
        )

        const mediaQuery =
            window.matchMedia(
                '(prefers-color-scheme: dark)'
            )

        function applyTheme() {
            const theme =
                themePreference === 'system'
                    ? getSystemTheme()
                    : themePreference

            document.documentElement.dataset.theme =
                theme
        }

        applyTheme()

        if (themePreference !== 'system') {
            return
        }

        mediaQuery.addEventListener(
            'change',
            applyTheme
        )

        return () => {
            mediaQuery.removeEventListener(
                'change',
                applyTheme
            )
        }
    }, [themePreference])

    return {
        themePreference,
        setThemePreference,
    }
}