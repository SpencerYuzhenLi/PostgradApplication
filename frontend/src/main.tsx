import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RefereeApp } from './referee/RefereeApp.tsx'

const base =
    import.meta.env.BASE_URL

const pathname =
    window.location.pathname

const relativePath =
    pathname
        .slice(base.length - 1)
        .replace(/\/+$/, '')

const isRefereeView =
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