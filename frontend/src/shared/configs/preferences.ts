import type {
    ThemePreference,
} from '../types/Preferences'

export const themeOptions = [
    {
        value: 'system',
        label: 'System',
    },
    {
        value: 'light',
        label: 'Light',
    },
    {
        value: 'dark',
        label: 'Dark',
    },
] satisfies {
    value: ThemePreference
    label: string
}[]