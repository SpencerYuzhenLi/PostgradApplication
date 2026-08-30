import './App.css'
import './shared/components/StartupState.css'
import './shared/components/HeaderActions.css'
import './shared/components/Settings.css'
import './shared/components/FormModal.css'
import './shared/components/Form.css'
import { useEffect, useRef, useState } from 'react'
import { managerFetch } from './manager/utils/managerApi'
import { SettingsSelect } from './shared/components/SettingsSelect'
import type { LocationDisplayPreference } from './shared/types/Preferences'
import { useThemePreference } from './shared/hooks/useThemePreference'
import { themeOptions } from './shared/configs/preferences'
import type { Programme } from './shared/types/Programme'
import type { ManagedReferee } from './manager/types/ManagedReferee'
import type { ProgrammeFormValues } from './manager/components/ProgrammeForm'
import { ProgrammeTable } from './manager/components/ProgrammeTable'
import { RefereeTable } from './manager/components/RefereeTable'
import { ProgrammeDetailsPanel } from './manager/components/ProgrammeDetailsPanel'
import { RefereeDetailsPanel } from './manager/components/RefereeDetailsPanel'
import { ProgrammeFormModal } from './manager/components/ProgrammeFormModal'
import { RefereeFormModal } from './manager/components/RefereeFormModal'
import { PlusIcon } from './shared/icons/PlusIcon'
import { PencilIcon } from './shared/icons/PencilIcon'
import { SettingsIcon } from './shared/icons/SettingsIcon'



const locationDisplayOptions = [
    {
        value: 'full',
        label: 'Full',
    },
    {
        value: 'abbreviated',
        label: 'Abbreviated',
    },
] as const


type ProgrammeModalState =
    | {
        mode: 'add'
        draft?: ProgrammeFormValues
    }
    | {
        mode: 'edit'
        programme: Programme
    }
    | null

type RefereeModalState =
    | {
        mode: 'add'
    }
    | {
        mode: 'edit'
        refereeId: number
    }
    | null

function App() {

    useEffect(() => {
        document.title =
            'Postgraduate Applications'
    }, [])

    const {
        themePreference,
        setThemePreference,
    } = useThemePreference()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [programmes, setProgrammes] = useState<Programme[]>([])
    const [referees, setReferees] = useState<ManagedReferee[]>([])

    type ManagerView = 'programmes' | 'referees'

    const [managerView, setManagerView] =
        useState<ManagerView>(
            'programmes'
        )

    async function loadReferees() {
        const response =
            await managerFetch(
                '/api/referees'
            )

        if (!response.ok) {
            throw new Error(
                `Could not load referees (${response.status}).`
            )
        }

        const data: ManagedReferee[] =
            await response.json()

        setReferees(
            data.sort((a, b) =>
                a.name.localeCompare(b.name)
            )
        )
    }

    const [programmeDraft, setProgrammeDraft] =
        useState<ProgrammeFormValues | null>(() => {
            const stored =
                sessionStorage.getItem('programmeDraft')

            if (stored === null) {
                return null
            }

            try {
                return JSON.parse(stored) as ProgrammeFormValues
            } catch {
                sessionStorage.removeItem('programmeDraft')
                return null
            }
        })

    useEffect(() => {
        if (programmeDraft === null) {
            sessionStorage.removeItem('programmeDraft')
            return
        }

        sessionStorage.setItem(
            'programmeDraft',
            JSON.stringify(programmeDraft)
        )
    }, [programmeDraft])

    const [selectedProgrammeId, setSelectedProgrammeId] =
        useState<number | null>(null)

    const selectedProgramme =
        programmes.find(
            programme =>
                programme.id === selectedProgrammeId
        ) ?? null

    const [selectedRefereeId, setSelectedRefereeId] =
        useState<number | null>(null)

    const selectedReferee =
        referees.find(
            referee =>
                referee.id === selectedRefereeId
        ) ?? null

    const [programmeModal, setProgrammeModal] =
        useState<ProgrammeModalState>(null)

    const programmeModalTriggerRef =
        useRef<HTMLElement | null>(null)

    function openProgrammeModal(
        modal: Exclude<
            ProgrammeModalState,
            null
        >
    ) {
        const activeElement =
            document.activeElement

        programmeModalTriggerRef.current =
            activeElement instanceof HTMLElement
                ? activeElement
                : null

        setProgrammeModal(modal)
    }

    function closeProgrammeModal() {
        setProgrammeModal(null)

        requestAnimationFrame(() => {
            programmeModalTriggerRef.current
                ?.focus()

            programmeModalTriggerRef.current =
                null
        })
    }

    const [refereeModal,setRefereeModal] =
        useState<RefereeModalState>(null)

    const refereeModalTriggerRef =
        useRef<HTMLElement | null>(null)

    const modalReferee =
        refereeModal?.mode === 'edit'
            ? referees.find(
                referee =>
                    referee.id ===
                    refereeModal.refereeId
            ) ?? null
            : null

    function openRefereeModal(
        modal: Exclude<
            RefereeModalState,
            null
        >
    ) {
        const activeElement =
            document.activeElement

        refereeModalTriggerRef.current =
            activeElement instanceof HTMLElement
                ? activeElement
                : null

        setRefereeModal(modal)
    }

    function closeRefereeModal() {
        setRefereeModal(null)

        requestAnimationFrame(() => {
            const trigger =
                refereeModalTriggerRef.current

            if (
                trigger &&
                document.contains(trigger)
            ) {
                trigger.focus()
            }

            refereeModalTriggerRef.current =
                null
        })
    }

    const [
        locationDisplayPreference,
        setLocationDisplayPreference,
    ] = useState<LocationDisplayPreference>(() => {
        const stored =
            localStorage.getItem(
                'locationDisplayPreference'
            )

        return stored === 'full' ||
            stored === 'abbreviated'
            ? stored
            : 'abbreviated'
    })

    useEffect(() => {
        localStorage.setItem(
            'locationDisplayPreference',
            locationDisplayPreference
        )
    }, [locationDisplayPreference])

    const abbreviateLocations =
        locationDisplayPreference === 'abbreviated'

    const [settingsOpen, setSettingsOpen] = useState(false)
    const settingsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handlePointerDown(event: PointerEvent) {
            const settings = settingsRef.current

            if (
                settingsOpen &&
                settings &&
                !settings.contains(event.target as Node)
            ) {
                setSettingsOpen(false)
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== 'Escape') {
                return
            }

            setSettingsOpen(false)

            const activeElement = document.activeElement

            if (activeElement instanceof HTMLElement) {
                activeElement.blur()
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)

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

    useEffect(() => {
        Promise.all([
            managerFetch('/api/programmes'),
            managerFetch('/api/referees'),
        ])
            .then(async ([
                programmesResponse,
                refereesResponse,
            ]) => {
                if (!programmesResponse.ok) {
                    throw new Error(
                        `Could not load programmes (${programmesResponse.status}).`
                    )
                }

                if (!refereesResponse.ok) {
                    throw new Error(
                        `Could not load referees (${refereesResponse.status}).`
                    )
                }

                return Promise.all([
                    programmesResponse.json(),
                    refereesResponse.json(),
                ])
            })
            .then(([
                programmeData,
                refereeData,
            ]) => {
                setProgrammes(programmeData)
                setReferees(refereeData)
            })
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
    }, [])

    if (loading) {
        return showLoading ? (
            <main className="startup-state">
                <div className="startup-state-content">
                    <h1>Postgraduate Applications</h1>

                    <div
                        className="startup-loading"
                        role="status"
                    >
                        <span className="startup-loading-track">
                            <span className="startup-loading-indicator" />
                        </span>

                        <span>Loading programmes...</span>
                    </div>
                </div>
            </main>
        ) : null
    }

    if (error) {
        return (
            <main className="startup-state">
                <div className="startup-state-content">
                    <h1>Postgraduate Applications</h1>

                    <section
                        className="startup-error"
                        role="alert"
                    >
                        <h2>Could not load programmes</h2>

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
        <>
            <main
                className={
                    selectedProgramme ||
                    selectedReferee
                        ? 'app-layout details-open'
                        : 'app-layout'
                }
            >
                <div className="app-main-pane">

                    <header className="page-header">
                        <div className="page-identity">
                            <h1>
                                Postgraduate Applications
                            </h1>

                            <span className="page-context">
                                MANAGER
                            </span>
                        </div>

                        <div className="page-actions">
                            <div
                                className="settings"
                                ref={settingsRef}
                            >
                                <button
                                    type="button"
                                    className="header-icon-button"
                                    onClick={() =>
                                        setSettingsOpen(current => !current)
                                    }
                                    aria-expanded={settingsOpen}
                                >
                                    <SettingsIcon className="header-icon" />
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

                                            <div className="settings-option">
                                                <span>Location names</span>

                                                <SettingsSelect
                                                    ariaLabel="Location names"
                                                    value={locationDisplayPreference}
                                                    options={locationDisplayOptions}
                                                    onChange={
                                                        setLocationDisplayPreference
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <nav
                        className="manager-navigation"
                        aria-label="Manager views"
                    >
                        <div className="manager-navigation-tabs">
                            <button
                                type="button"
                                className={
                                    managerView === 'programmes'
                                        ? 'manager-navigation-tab active'
                                        : 'manager-navigation-tab'
                                }
                                aria-current={
                                    managerView === 'programmes'
                                        ? 'page'
                                        : undefined
                                }
                                onClick={() => {
                                    setSelectedRefereeId(null)
                                    setManagerView('programmes')
                                }}
                            >
                                Programmes
                            </button>

                            <button
                                type="button"
                                className={
                                    managerView === 'referees'
                                        ? 'manager-navigation-tab active'
                                        : 'manager-navigation-tab'
                                }
                                aria-current={
                                    managerView === 'referees'
                                        ? 'page'
                                        : undefined
                                }
                                onClick={() => {
                                    setSelectedProgrammeId(null)
                                    setManagerView('referees')
                                }}
                            >
                                Referees
                            </button>
                        </div>

                        <div className="manager-view-actions">
                            {managerView === 'programmes' ? (
                                <button
                                    type="button"
                                    className="page-action-button"
                                    onClick={() => {
                                        openProgrammeModal({
                                            mode: 'add',
                                            draft:
                                                programmeDraft ??
                                                undefined,
                                        })
                                    }}
                                >
                                    {programmeDraft ? (
                                        <PencilIcon
                                            className="page-action-icon"
                                        />
                                    ) : (
                                        <PlusIcon
                                            className="page-action-icon"
                                        />
                                    )}

                                    {programmeDraft
                                        ? 'Edit draft'
                                        : 'Add programme'}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="page-action-button"
                                    onClick={() =>
                                        openRefereeModal({
                                            mode: 'add',
                                        })
                                    }
                                >
                                    <PlusIcon
                                        className="page-action-icon"
                                    />

                                    Add referee
                                </button>
                            )}
                        </div>
                    </nav>

                    {managerView === 'programmes' ? (
                        <ProgrammeTable
                            programmes={programmes}
                            abbreviateLocations={
                                abbreviateLocations
                            }
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
                    ) : (
                        <RefereeTable
                            referees={referees}
                            selectedRefereeId={
                                selectedRefereeId
                            }
                            onSelectReferee={referee =>
                                setSelectedRefereeId(
                                    current =>
                                        current === referee.id
                                            ? null
                                            : referee.id
                                )
                            }
                        />
                    )}

                </div>

                {selectedProgramme && (
                    <ProgrammeDetailsPanel
                        programme={selectedProgramme}
                        onClose={() =>
                            setSelectedProgrammeId(null)
                        }
                        onEdit={() =>
                            openProgrammeModal({
                                mode: 'edit',
                                programme: selectedProgramme,
                            })
                        }
                    />
                )}

                {selectedReferee && (
                    <RefereeDetailsPanel
                        referee={selectedReferee}
                        onClose={() =>
                            setSelectedRefereeId(null)
                        }
                        onEdit={() =>
                            openRefereeModal({
                                mode: 'edit',
                                refereeId: selectedReferee.id,
                            })
                        }
                    />
                )}
            </main>


            {programmeModal && (
                <ProgrammeFormModal
                    key={
                        programmeModal.mode === 'edit'
                            ? `edit-${programmeModal.programme.id}`
                            : 'add'
                    }
                    mode={programmeModal.mode}
                    programme={
                        programmeModal.mode === 'edit'
                            ? programmeModal.programme
                            : undefined
                    }
                    draft={
                        programmeModal.mode === 'add'
                            ? programmeModal.draft
                            : undefined
                    }
                    referees={referees}
                    onClose={closeProgrammeModal}
                    onCreated={programme => {
                        setProgrammes(current => [
                            ...current,
                            programme,
                        ])

                        setProgrammeDraft(null)

                        void loadReferees()
                    }}
                    onUpdated={updatedProgramme => {
                        setProgrammes(current =>
                            current.map(programme =>
                                programme.id ===
                                updatedProgramme.id
                                    ? updatedProgramme
                                    : programme
                            )
                        )

                        void loadReferees()
                    }}
                    onDeleted={programmeId => {
                        setProgrammes(current =>
                            current.filter(
                                programme =>
                                    programme.id !==
                                    programmeId
                            )
                        )

                        void loadReferees()
                    }}
                    onSaveDraft={values => {
                        setProgrammeDraft(values)
                    }}
                    onDiscardDraft={() => {
                        setProgrammeDraft(null)
                    }}
                />
            )}

            {refereeModal &&
                (
                    refereeModal.mode === 'add' ||
                    modalReferee
                ) && (
                <RefereeFormModal
                    key={
                        refereeModal.mode === 'edit'
                            ? `edit-referee-${refereeModal.refereeId}`
                            : 'add-referee'
                    }
                    mode={refereeModal.mode}
                    referee={
                        refereeModal.mode === 'edit'
                            ? modalReferee ?? undefined
                            : undefined
                    }
                    onClose={closeRefereeModal}
                    onCreated={referee => {
                        setReferees(current =>
                            [...current, referee]
                                .sort((a, b) =>
                                    a.name.localeCompare(
                                        b.name
                                    )
                                )
                        )
                    }}
                    onUpdated={updatedReferee => {
                        setReferees(current =>
                            current
                                .map(referee =>
                                    referee.id ===
                                    updatedReferee.id
                                        ? updatedReferee
                                        : referee
                                )
                                .sort((a, b) =>
                                    a.name.localeCompare(
                                        b.name
                                    )
                                )
                        )

                        setProgrammes(current =>
                            current.map(programme => ({
                                ...programme,

                                referees:
                                    programme.referees.map(
                                        referee =>
                                            referee.id ===
                                            updatedReferee.id
                                                ? {
                                                    ...referee,
                                                    name:
                                                        updatedReferee.name,
                                                    email:
                                                        updatedReferee.email,
                                                }
                                                : referee
                                    ),
                            }))
                        )
                    }}
                    onDeleted={refereeId => {
                        setReferees(current =>
                            current.filter(
                                referee =>
                                    referee.id !== refereeId
                            )
                        )

                        setProgrammes(current =>
                            current.map(programme => ({
                                ...programme,

                                referees:
                                    programme.referees.filter(
                                        referee =>
                                            referee.id !== refereeId
                                    ),
                            }))
                        )

                        setSelectedRefereeId(
                            current =>
                                current === refereeId
                                    ? null
                                    : current
                        )
                    }}
                    onAccessChanged={(
                        refereeId,
                        accessActive
                    ) => {
                        setReferees(current =>
                            current.map(referee =>
                                referee.id === refereeId
                                    ? {
                                        ...referee,
                                        accessActive,
                                    }
                                    : referee
                            )
                        )
                    }}
                />
            )}

        </>
    )
}

export default App