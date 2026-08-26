import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RefereeApp } from './referee/RefereeApp.tsx'

const refereeOnly =
    import.meta.env.VITE_APP_MODE === 'referee'

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

createRoot(
    document.getElementById('root')!
).render(
    <StrictMode>
        {isRefereeView
            ? <RefereeApp />
            : <App />}
    </StrictMode>
)
