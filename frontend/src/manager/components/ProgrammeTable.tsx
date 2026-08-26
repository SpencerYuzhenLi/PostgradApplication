import './ProgrammeTable.css'
import { useEffect, useRef, useState, useMemo } from 'react'
import {
    flexRender,
    useTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type FilterFn,
} from '@tanstack/react-table'
import type { Programme } from '../../shared/types/Programme'
import {
    programmeTableFeatures,
    type ProgrammeTableFeatures,
} from '../configs/programmeTableFeatures'
import { ProgrammeMultiSelectFilter } from './ProgrammeMultiSelectFilter'
import { ColumnVisibilityMenu } from './ColumnVisibilityMenu'
import {
    regionNames,
    regionAbbreviations,
    countryNames,
    countryAbbreviations,
    degreeNames,
    statusNames,
} from '../../shared/utils/displayNames'
import {
    filterControls,
    initialColumnVisibility,
    viewControls,
} from '../configs/programmeTableConfig'
import { SortIcon } from '../../shared/icons/SortIcon'
import { ChevronIcon } from '../../shared/icons/ChevronIcon'

type ProgrammeColumnVisibility =
    Record<string, boolean>

const multiSelectFilter:
    FilterFn<ProgrammeTableFeatures, Programme> = (
        row,
        columnId,
        filterValue: string[],
    ) => {
        if (filterValue.length === 0) {
            return true
        }

        const cellValue =
            row.getValue(columnId)

        return filterValue.includes(
            cellValue as string
        )
    }

const columns:
    ColumnDef<
        ProgrammeTableFeatures,
        Programme,
        unknown
    >[] = [
    {
        id: 'programmeIdentity',
        header: 'Programme',
        columns: [
            {
                id: 'programmeShortName',
                accessorFn: programme =>
                    programme.programmeShortName ?? undefined,
                header: 'Programme',
                sortUndefined: 'last',

                cell: info => {
                    const programme = info.row.original

                    const selected =
                        info.table.options.meta?.selectedProgrammeId
                        === programme.id

                    return (
                        <button
                            type="button"
                            className={
                                selected
                                    ? 'programme-details-trigger active'
                                    : 'programme-details-trigger'
                            }
                            onClick={() =>
                                info.table.options.meta
                                    ?.openProgrammeDetails?.(programme)
                            }
                        >
                            <span className="programme-details-name">
                                {programme.programmeShortName}
                            </span>

                            <span
                                className="programme-details-chevron-area"
                                aria-hidden="true"
                            >
                                <ChevronIcon
                                    className="programme-details-chevron"
                                    direction={
                                        selected
                                            ? 'left'
                                            : 'right'
                                    }
                                />
                            </span>
                        </button>
                    )
                }
            },
        ],
    },

    {
        header: 'Details',
        columns: [
            {
                id: 'institutionName',
                accessorFn: programme =>
                    programme.institutionName ?? undefined,
                header: 'Institution',
                sortUndefined: 'last',
            },
            {
                id: 'programmeName',
                accessorFn: programme =>
                    programme.programmeName ?? undefined,
                header: 'Programme',
                sortUndefined: 'last',
            },
        ],
    },

    {
        header: 'Location',
        columns: [
            {
                id: 'region',
                accessorFn: programme =>
                    programme.region ?? undefined,
                header: 'Region',
                filterFn: multiSelectFilter,
                sortUndefined: 'last',

                cell: info => {
                    const region =
                        info.getValue() as Programme['region']

                    if (region === null) {
                        return ''
                    }

                    const abbreviateLocations =
                        info.table.options.meta?.abbreviateLocations

                    return abbreviateLocations
                        ? regionAbbreviations[region]
                        : regionNames[region]
                },
            },
            {
                id: 'country',
                accessorFn: programme =>
                    programme.country ?? undefined,
                header: 'Country',
                filterFn: multiSelectFilter,
                sortUndefined: 'last',

                cell: info => {
                    const country =
                        info.getValue() as Programme['country']

                    if (country === null) {
                        return ''
                    }

                    const abbreviateLocations =
                        info.table.options.meta?.abbreviateLocations

                    return abbreviateLocations
                        ? countryAbbreviations[country]
                        : countryNames[country]
                },
            },
        ],
    },


    {
        header: 'Ranking',
        columns: [
            {
                id: 'qsRanking',
                accessorFn: programme =>
                    programme.qsRanking ?? undefined,
                header: 'QS',
                sortDescFirst: false,
                sortUndefined: 'last',
            },
            {
                id: 'usNewsRanking',
                accessorFn: programme =>
                    programme.usNewsRanking ?? undefined,
                header: 'US News',
                sortDescFirst: false,
                sortUndefined: 'last',
            },
            {
                id: 'theRanking',
                accessorFn: programme =>
                    programme.theRanking ?? undefined,
                header: 'THE',
                sortDescFirst: false,
                sortUndefined: 'last',
            },
            {
                id: 'arwuRanking',
                accessorFn: programme =>
                    programme.arwuRanking ?? undefined,
                header: 'ARWU',
                sortDescFirst: false,
                sortUndefined: 'last',
            },
        ],
    },


    {
        header: 'Degree',
        columns: [
            {
                id: 'degree',
                accessorFn: programme =>
                    programme.degree ?? undefined,
                header: 'Degree',
                filterFn: multiSelectFilter,
                sortUndefined: 'last',

                cell: info => {
                    const degree = info.getValue() as Programme['degree']

                    return degree === null
                        ? ''
                        : degreeNames[degree]
                },
            },
        ],
    },

    {
        header: 'Status',
        columns: [
            {
                id: 'status',
                accessorFn: programme =>
                    programme.status ?? undefined,
                header: 'Status',
                filterFn: multiSelectFilter,
                sortUndefined: 'last',

                cell: info => {
                    const status =
                        info.getValue() as Programme['status']

                    return status === null
                        ? ''
                        : statusNames[status]
                },
            },
        ],
    },


    {
        header: 'Timeline',
        columns: [
            {
                id: 'applicationOpens',
                accessorFn: programme =>
                    programme.applicationOpens ?? undefined,
                header: 'Application Opens',
                sortUndefined: 'last',
            },
            {
                id: 'applicationDeadline',
                accessorFn: programme =>
                    programme.applicationDeadline ?? undefined,
                header: 'Application Deadline',
                sortUndefined: 'last',
            },
            {
                id: 'referenceDeadline',
                accessorFn: programme =>
                    programme.referenceDeadline ?? undefined,
                header: 'Reference Deadline',
                sortUndefined: 'last',
            },
        ],
    },
]

interface StoredProgrammeTableState {
    search: string
    columnFilters: ColumnFiltersState
    sorting: SortingState
    columnVisibility: ProgrammeColumnVisibility
}

const PROGRAMME_TABLE_STATE_KEY = 'programmeTableState'

function loadProgrammeTableState():
    StoredProgrammeTableState | null {

    const stored =
        sessionStorage.getItem(
            PROGRAMME_TABLE_STATE_KEY
        )

    if (stored === null) {
        return null
    }

    try {
        return JSON.parse(
            stored
        ) as StoredProgrammeTableState
    } catch {
        sessionStorage.removeItem(
            PROGRAMME_TABLE_STATE_KEY
        )

        return null
    }
}



interface ProgrammeTableProps {
    programmes: Programme[]
    abbreviateLocations: boolean
    selectedProgrammeId: number | null
    onSelectProgramme: (programme: Programme) => void
}

export function ProgrammeTable({
    programmes,
    abbreviateLocations,
    selectedProgrammeId,
    onSelectProgramme,
}: ProgrammeTableProps) {

    const [storedTableState] =
        useState(loadProgrammeTableState)

    const [search, setSearch] =
        useState(
            storedTableState?.search ?? ''
        )

    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>(
            storedTableState?.columnFilters ?? []
        )

    const [sorting, setSorting] =
        useState<SortingState>(
            storedTableState?.sorting ?? []
        )

    const [columnVisibility, setColumnVisibility] =
        useState<ProgrammeColumnVisibility>(
            storedTableState?.columnVisibility ??
            initialColumnVisibility
        )

    useEffect(() => {
        const state: StoredProgrammeTableState = {
            search,
            columnFilters,
            sorting,
            columnVisibility,
        }

        sessionStorage.setItem(
            PROGRAMME_TABLE_STATE_KEY,
            JSON.stringify(state)
        )
    }, [
        search,
        columnFilters,
        sorting,
        columnVisibility,
    ])

    const [openFilter, setOpenFilter] = useState<string | null>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
            function handleKeyDown(event: KeyboardEvent) {
                if (
                    (event.ctrlKey || event.metaKey) &&
                    event.key.toLowerCase() === 'f'
                ) {
                    event.preventDefault()
                    searchInputRef.current?.focus()
                }
            }

            document.addEventListener('keydown', handleKeyDown)

            return () => {
                document.removeEventListener('keydown', handleKeyDown)
            }
        }, [])

    const searchedProgrammes = useMemo(() => {
        const query = search.trim().toLowerCase()

        if (query === '') {
            return programmes
        }

        return programmes.filter(programme =>
            programme.programmeShortName
                .toLowerCase()
                .includes(query) ||

            programme.institutionName
                ?.toLowerCase()
                .includes(query) ||

            programme.programmeName
                ?.toLowerCase()
                .includes(query)
        )
    }, [programmes, search])

    const tableAreaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const tableArea = tableAreaRef.current
        const scrollbar = horizontalScrollbarRef.current

        if (!tableArea || !scrollbar) {
            return
        }

        function handleWheel(event: WheelEvent) {
            let horizontalDelta = 0

            if (event.shiftKey && event.deltaY !== 0) {
                /*
                 * Conventional Shift + wheel.
                 */
                horizontalDelta = event.deltaY
            } else if (event.deltaX !== 0) {
                /*
                 * Native horizontal trackpad/wheel input,
                 * particularly useful on macOS.
                 */
                horizontalDelta = event.deltaX
            }

            if (horizontalDelta === 0) {
                return
            }

            const maxScrollLeft =
                scrollbar!.scrollWidth -
                scrollbar!.clientWidth

            if (maxScrollLeft <= 0) {
                return
            }

            const previous =
                scrollbar!.scrollLeft

            scrollbar!.scrollLeft +=
                horizontalDelta

            /*
             * Only consume the wheel event if horizontal
             * scrolling actually occurred.
             */
            if (scrollbar!.scrollLeft !== previous) {
                event.preventDefault()
            }
        }

        tableArea.addEventListener(
            'wheel',
            handleWheel,
            { passive: false }
        )

        return () => {
            tableArea.removeEventListener(
                'wheel',
                handleWheel
            )
        }
    }, [])

    const table = useTable({
        features: programmeTableFeatures,
        data: searchedProgrammes,
        columns,

        state: {
            columnFilters,
            sorting,
            columnVisibility,
        },

        onColumnFiltersChange:
            setColumnFilters,

        onSortingChange:
            setSorting,

        onColumnVisibilityChange:
            setColumnVisibility,

        meta: {
            abbreviateLocations,
            selectedProgrammeId,
            openProgrammeDetails: onSelectProgramme,
        },
    })

    const tableContainerRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef<HTMLTableElement>(null)
    const horizontalScrollbarRef = useRef<HTMLDivElement>(null)
    const separatorFadeTimeoutRef =
            useRef<ReturnType<typeof setTimeout> | null>(null)
    const [tableWidth, setTableWidth] = useState(0)
    const horizontalDragRef = useRef<{
        pointerId: number
        startX: number
        startScrollLeft: number
    } | null>(null)

    function handleHorizontalScroll() {
        const scrollbar =
            horizontalScrollbarRef.current

        if (!scrollbar) {
            return
        }

        updateTableScroll(
            scrollbar.scrollLeft
        )
    }

    function handleHorizontalPointerDown(
        event: React.PointerEvent<HTMLDivElement>
    ) {
        if (event.pointerType !== 'touch') {
            return
        }

        const scrollbar =
            horizontalScrollbarRef.current

        if (!scrollbar) {
            return
        }

        horizontalDragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startScrollLeft: scrollbar.scrollLeft,
        }
    }

    function handleHorizontalPointerMove(
        event: React.PointerEvent<HTMLDivElement>
    ) {
        const drag = horizontalDragRef.current
        const scrollbar =
            horizontalScrollbarRef.current

        if (
            !drag ||
            !scrollbar ||
            event.pointerId !== drag.pointerId
        ) {
            return
        }

        const deltaX =
            event.clientX - drag.startX

        scrollbar.scrollLeft =
            drag.startScrollLeft - deltaX
    }

    function handleHorizontalPointerEnd(
        event: React.PointerEvent<HTMLDivElement>
    ) {
        if (
            horizontalDragRef.current?.pointerId
            !== event.pointerId
        ) {
            return
        }

        horizontalDragRef.current = null
    }

    useEffect(() => {
        const table = tableRef.current

        if (!table) {
            return
        }

        const updateWidth = () => {
            setTableWidth(table.scrollWidth)
        }

        updateWidth()

        const observer = new ResizeObserver(updateWidth)
        observer.observe(table)

        return () => observer.disconnect()
    }, [])

    const viewControlsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = viewControlsRef.current

        if (!element) {
            return
        }

        const updateHeight = () => {
            document.documentElement.style.setProperty(
                '--view-controls-height',
                `${element.getBoundingClientRect().height}px`
            )
        }

        updateHeight()

        const observer = new ResizeObserver(updateHeight)
        observer.observe(element)

        return () => observer.disconnect()
    }, [])

    const getColumns = (ids: string[]) => ids
            .map(id => table.getColumn(id))
            .filter(column => column !== undefined)

    function updateTableScroll(scrollLeft: number) {
        const tableContainer =
            tableContainerRef.current

        if (!tableContainer) {
            return
        }

        tableContainer.style.setProperty(
            '--table-scroll-left',
            `${scrollLeft}px`
        )

        if (
            separatorFadeTimeoutRef.current !== null
        ) {
            clearTimeout(
                separatorFadeTimeoutRef.current
            )

            separatorFadeTimeoutRef.current = null
        }

        if (scrollLeft > 0) {
            tableContainer.classList.add(
                'is-horizontally-scrolled'
            )

            tableContainer.classList.remove(
                'hide-pinned-separator'
            )

            return
        }

        separatorFadeTimeoutRef.current =
            setTimeout(() => {
                tableContainer.classList.add(
                    'hide-pinned-separator'
                )

                separatorFadeTimeoutRef.current = null
            }, 1000)
    }

    return (
        <div className="programme-table">

            <div className="find-controls">
                <div className="search">
                    <span className="search-label">
                        Search
                    </span>

                    <input
                        ref={searchInputRef}
                        id="programme-search"
                        type="search"
                        value={search}
                        onChange={event =>
                            setSearch(event.target.value)
                        }
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                event.preventDefault()
                                event.currentTarget.blur()
                            }
                        }}
                        placeholder="Institution or programme"
                        aria-label="Search programmes"
                    />

                    <button
                        type="button"
                        className="find-clear"
                        onClick={() => {
                            setSearch('')
                            searchInputRef.current?.focus()
                        }}
                        disabled={search === ''}
                    >
                        Clear
                    </button>
                </div>

                <div className="filters">
                    <span className="filter-label">
                        Filter
                    </span>

                    <div className="filter-controls">
                        {filterControls.map(control => {
                            const column =
                                table.getColumn(control.columnId)

                            const options =
                                abbreviateLocations &&
                                control.abbreviatedOptions
                                    ? control.abbreviatedOptions
                                    : control.options

                            return (
                                <ProgrammeMultiSelectFilter
                                    key={control.columnId}
                                    label={control.label}
                                    values={
                                        (column?.getFilterValue() as string[] | undefined) ?? []
                                    }
                                    options={
                                        Object.entries(options).map(
                                            ([value, label]) => ({
                                                value,
                                                label,
                                            })
                                        )
                                    }
                                    onChange={values =>
                                        column?.setFilterValue(
                                            values.length === 0
                                                ? undefined
                                                : values
                                        )
                                    }
                                    isOpen={
                                        openFilter === control.columnId
                                    }
                                    onToggle={() =>
                                        setOpenFilter(current =>
                                            current === control.columnId
                                                ? null
                                                : control.columnId
                                        )
                                    }
                                    onClose={() =>
                                        setOpenFilter(null)
                                    }
                                />
                            )
                        })}
                    </div>

                    <button
                        type="button"
                        className="find-clear"
                        onClick={() =>
                            setColumnFilters([])
                        }
                        disabled={columnFilters.length === 0}
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="table-status">
                <p className="programme-count">
                    Showing {table.getRowModel().rows.length} of {programmes.length} programmes
                </p>

                <ColumnVisibilityMenu
                    controls={viewControls}
                    getColumns={getColumns}
                />
            </div>

            <div
                className="table-area"
                ref={tableAreaRef}
                onPointerDown={handleHorizontalPointerDown}
                onPointerMove={handleHorizontalPointerMove}
                onPointerUp={handleHorizontalPointerEnd}
                onPointerCancel={handleHorizontalPointerEnd}
            >

                <div
                    ref={tableContainerRef}
                    className="table-container"
                >
                    <table ref={tableRef}>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr
                                    key={headerGroup.id}
                                    className={
                                        headerGroup.depth === 0
                                            ? 'parent-header-row'
                                            : 'column-header-row'
                                    }
                                >
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={[
                                                headerGroup.depth === 0
                                                    ? 'parent-header-cell'
                                                    : '',

                                                header.column.id === 'programmeShortName' ||
                                                header.column.id === 'programmeIdentity'
                                                    ? 'pinned-programme'
                                                    : '',
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                        >
                                            {header.isPlaceholder ? null : (
                                                headerGroup.depth === 0 ? (
                                                    <div className="parent-header-label">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                ) : (
                                                    header.column.getCanSort() ? (
                                                        <button
                                                            className="sortable-header"
                                                            onClick={
                                                                header.column.getToggleSortingHandler()
                                                            }
                                                        >
                                                            <span className="sortable-header-label">
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                            </span>

                                                            <span
                                                                className="sort-indicator-area"
                                                                aria-hidden="true"
                                                            >
                                                                <SortIcon
                                                                    className="sort-indicator"
                                                                    direction={
                                                                        header.column.getIsSorted() === 'asc'
                                                                            ? 'asc'
                                                                            : header.column.getIsSorted() === 'desc'
                                                                                ? 'desc'
                                                                                : 'none'
                                                                    }
                                                                />
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )
                                                    )
                                                )
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}

                            <tr
                                className="header-boundary-row"
                                aria-hidden="true"
                            >
                                <th
                                    colSpan={
                                        table.getVisibleLeafColumns().length
                                    }
                                />
                            </tr>
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className={
                                                cell.column.id === 'programmeShortName'
                                                    ? 'pinned-programme'
                                                    : undefined
                                            }
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div
                    className="table-horizontal-scrollbar"
                    ref={horizontalScrollbarRef}
                    onScroll={handleHorizontalScroll}
                >
                    <div
                        className="table-horizontal-scrollbar-content"
                        style={{
                            width: `${tableWidth}px`,
                        }}
                    />
                </div>

            </div>

        </div>
    )
}