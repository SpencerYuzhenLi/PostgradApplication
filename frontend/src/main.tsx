import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const refereeOnly =
    import.meta.env.VITE_APP_MODE ===
    'referee'

const base =
    import.meta.env.BASE_URL

const pathname =
    window.location.pathname

const relativePath =
    pathname
        .slice(base.length - 1)
        .replace(/\/+$/, '')

const isRefereeView =
    refereeOnly ||
    relativePath === '/referee'

async function renderApp() {
    const root =
        createRoot(
            document.getElementById('root')!
        )

    if (isRefereeView) {
        const { RefereeApp } =
            await import(
                './referee/RefereeApp.tsx'
            )

        root.render(
            <StrictMode>
                <RefereeApp />
            </StrictMode>
        )

        return
    }

    const { default: App } =
        await import('./App.tsx')

    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    )
}

void renderApp()