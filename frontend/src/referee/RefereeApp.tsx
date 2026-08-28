import './RefereeApp.css'
import '../shared/components/StartupState.css'
import '../shared/components/Settings.css'
import { useEffect, useRef, useState } from 'react'
import { getRefereeAccessToken } from './utils/refereeAccessToken'
import { HelpIcon } from '../shared/icons/HelpIcon'
import { RefereeHelpModal } from './components/RefereeHelpModal'
import { SettingsSelect } from '../shared/components/SettingsSelect'
import { SettingsIcon } from '../shared/icons/SettingsIcon'
import { useThemePreference } from '../shared/hooks/useThemePreference'
import { themeOptions } from '../shared/configs/preferences'
import { RefereeProgrammeTable } from './components/RefereeProgrammeTable'
import { RefereeDetailsPanel } from './components/RefereeDetailsPanel'
import type { RefereeProgramme } from './types/RefereeProgramme'
import { apiUrl } from '../shared/utils/apiUrl'


export function RefereeApp() {

    const [accessToken] =
        useState<string | null>(
            getRefereeAccessToken
        )

    const {
        themePreference,
        setThemePreference,
    } = useThemePreference()

    const [helpOpen, setHelpOpen] = useState(false)

    const [settingsOpen, setSettingsOpen] =
        useState(false)

    const settingsRef =
        useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handlePointerDown(
            event: PointerEvent
        ) {
            const settings =
                settingsRef.current

            if (
                settingsOpen &&
                settings &&
                !settings.contains(
                    event.target as Node
                )
            ) {
                setSettingsOpen(false)
            }
        }

        function handleKeyDown(
            event: KeyboardEvent
        ) {
            if (event.key !== 'Escape') {
                return
            }

            setSettingsOpen(false)

            const activeElement =
                document.activeElement

            if (
                activeElement
                instanceof HTMLElement
            ) {
                activeElement.blur()
            }
        }

        document.addEventListener(
            'pointerdown',
            handlePointerDown
        )

        document.addEventListener(
            'keydown',
            handleKeyDown
        )

        return () => {
            document.removeEventListener(
                'pointerdown',
                handlePointerDown
            )

            document.removeEventListener(
                'keydown',
                handleKeyDown
            )
        }
    }, [settingsOpen])

    const [programmes, setProgrammes] = useState<RefereeProgramme[]>([])

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState<string | null>(null)

    const [showLoading, setShowLoading] =
            useState(false)

        useEffect(() => {
            if (!loading) {
                setShowLoading(false)
                return
            }

            const timeout = setTimeout(() => {
                setShowLoading(true)
            }, 250)

            return () => clearTimeout(timeout)
        }, [loading])

    const [
        selectedProgrammeId,
        setSelectedProgrammeId,
    ] = useState<number | null>(null)

    const selectedProgramme =
            programmes.find(
                programme =>
                    programme.id === selectedProgrammeId
            ) ?? null

    useEffect(() => {
        if (!accessToken) {
            setProgrammes([])
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        fetch(
            apiUrl('/api/referee-programmes'),
            {
                headers: {
                    'X-Referee-Token':
                        accessToken,
                },
            }
        )
            .then(async response => {
                if (!response.ok) {
                    throw new Error(
                        response.status === 401
                            ? 'This referee access link is invalid or no longer active.'
                            : `Could not load programmes (${response.status}).`
                    )
                }

                return response.json()
            })
            .then(
                (data: RefereeProgramme[]) => {
                    setProgrammes(data)
                }
            )
            .catch(error => {
                setError(
                    error instanceof TypeError
                        ? 'Could not connect to the server.'
                        : error instanceof Error
                            ? error.message
                            : 'An unexpected error occurred.'
                )
            })
            .finally(() => {
                setLoading(false)
            })
    }, [accessToken])

    const helpButtonRef =
        useRef<HTMLButtonElement>(null)

    function closeHelp() {
        setHelpOpen(false)

        requestAnimationFrame(() => {
            helpButtonRef.current?.focus()
        })
    }

    if (!accessToken) {
        return (
            <main className="startup-state">
                <div className="startup-state-content">
                    <h1>
                        Postgraduate Applications
                    </h1>

                    <section className="startup-error">
                        <h2>
                            Referee access required
                        </h2>

                        <p>
                            Please open the personal
                            referee link you were
                            provided.
                        </p>
                    </section>
                </div>
            </main>
        )
    }

    if (loading) {
        return showLoading ? (
            <main className="startup-state">
                <div className="startup-state-content">
                    <h1>
                        Postgraduate Applications
                    </h1>

                    <div
                        className="startup-loading"
                        role="status"
                    >
                        <span className="startup-loading-track">
                            <span className="startup-loading-indicator" />
                        </span>

                        <span>
                            Loading programmes...
                        </span>
                    </div>
                </div>
            </main>
        ) : null
    }

    if (error) {
        return (
            <main className="startup-state">
                <div className="startup-state-content">
                    <h1>
                        Postgraduate Applications
                    </h1>

                    <section
                        className="startup-error"
                        role="alert"
                    >
                        <h2>
                            Could not load programmes
                        </h2>

                        <p>{error}</p>

                        <button
                            type="button"
                            className="neutral-action"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try again
                        </button>
                    </section>
                </div>
            </main>
        )
    }

    return (
        <main className="referee-app">
            <div className="referee-layout">
                <div className="referee-main-pane">
                    <header className="referee-header">
                        <div className="referee-identity">
                            <h1>
                                Postgraduate Applications
                            </h1>
                        </div>

                        <div className="referee-actions">
                            <button
                                ref={helpButtonRef}
                                type="button"
                                className="referee-header-action"
                                onClick={() => {
                                    setSettingsOpen(false)
                                    setHelpOpen(true)
                                }}
                            >
                                <HelpIcon className="referee-header-action-icon" />

                                Help
                            </button>

                            <div
                                className="settings"
                                ref={settingsRef}
                            >
                                <button
                                    type="button"
                                    className="settings-button"
                                    onClick={() =>
                                        setSettingsOpen(current => !current)
                                    }
                                    aria-expanded={settingsOpen}
                                >
                                    <SettingsIcon className="settings-icon" />

                                    Settings
                                </button>

                                {settingsOpen && (
                                    <div className="settings-popover">
                                        <div className="settings-section">
                                            <span className="settings-section-title">
                                                Display
                                            </span>

                                            <div className="settings-option">
                                                <span>Appearance</span>

                                                <SettingsSelect
                                                    ariaLabel="Appearance"
                                                    value={themePreference}
                                                    options={themeOptions}
                                                    onChange={setThemePreference}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <div className="referee-content">
                        <RefereeProgrammeTable
                            programmes={programmes}
                            selectedProgrammeId={
                                selectedProgrammeId
                            }
                            onSelectProgramme={programme =>
                                setSelectedProgrammeId(
                                    current =>
                                        current === programme.id
                                            ? null
                                            : programme.id
                                )
                            }
                        />
                    </div>
                </div>

                {selectedProgramme && (
                    <RefereeDetailsPanel
                        programme={selectedProgramme}
                        onClose={() =>
                            setSelectedProgrammeId(null)
                        }
                    />
                )}
            </div>

            {helpOpen && (
                <RefereeHelpModal
                    onClose={closeHelp}
                />
            )}
        </main>
    )


}