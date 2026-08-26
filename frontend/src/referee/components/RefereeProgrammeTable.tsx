import './RefereeProgrammeTable.css'
import {
    flexRender,
    rowSortingFeature,
    createSortedRowModel,
    sortFn_alphanumeric,
    sortFn_text,
    tableFeatures,
    useTable,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table'
import { useEffect, useRef, useState } from 'react'
import type { RefereeProgramme } from '../types/RefereeProgramme'
import { SortIcon } from '../../shared/icons/SortIcon'
import { ChevronIcon } from '../../shared/icons/ChevronIcon'

const refereeTableFeatures = tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),

    sortFns: {
        alphanumeric: sortFn_alphanumeric,
        text: sortFn_text,
    },
})

type RefereeTableFeatures =
    typeof refereeTableFeatures

const columns:
    ColumnDef<
        RefereeTableFeatures,
        RefereeProgramme,
        unknown
    >[] = [
    {
        id: 'programmeIdentity',
        header: 'Programme',
        columns: [
            {
                id: 'programmeShortName',
                accessorFn: programme =>
                    programme.programmeShortName,
                header: 'Programme',
                sortUndefined: 'last',

                cell: info => {
                    const programme =
                        info.row.original

                    const selected =
                        info.table.options.meta
                            ?.selectedProgrammeId
                        === programme.id

                    return (
                        <button
                            type="button"
                            className={
                                selected
                                    ? 'referee-details-trigger active'
                                    : 'referee-details-trigger'
                            }
                            onClick={() =>
                                info.table.options.meta
                                    ?.openProgrammeDetails?.(
                                        programme
                                    )
                            }
                        >
                            <span className="referee-details-name">
                                {programme.programmeShortName}
                            </span>

                            <span
                                className="referee-details-chevron-area"
                                aria-hidden="true"
                            >
                                <ChevronIcon
                                    className="referee-details-chevron"
                                    direction={
                                        selected
                                            ? 'left'
                                            : 'right'
                                    }
                                />
                            </span>
                        </button>
                    )
                },
            },
        ],
    },

    {
        id: 'programmeDetails',
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
        id: 'timeline',
        header: 'Timeline',
        columns: [
            {
                id: 'applicationOpens',
                accessorFn: programme =>
                    programme.applicationOpens ?? undefined,
                header: 'Opens',
                sortUndefined: 'last',
            },
            {
                id: 'deadline',
                accessorFn: programme =>
                    programme.deadline ?? undefined,
                header: 'Deadline',
                sortUndefined: 'last',
            },
        ],
    },

    {
        id: 'reference',
        header: 'Reference',
        columns: [
            {
                id: 'referenceSubmission',
                accessorFn: programme =>
                    programme.referenceSubmission ?? undefined,
                header: 'Submission',
                sortUndefined: 'last',
            },
        ],
    },
]

const REFEREE_TABLE_STATE_KEY =
    'refereeProgrammeTableState'

interface StoredRefereeTableState {
    sorting: SortingState
}

function loadRefereeTableState():
    StoredRefereeTableState | null {

    const stored =
        sessionStorage.getItem(
            REFEREE_TABLE_STATE_KEY
        )

    if (stored === null) {
        return null
    }

    try {
        return JSON.parse(
            stored
        ) as StoredRefereeTableState
    } catch {
        sessionStorage.removeItem(
            REFEREE_TABLE_STATE_KEY
        )

        return null
    }
}


interface RefereeProgrammeTableProps {
    programmes: RefereeProgramme[]
    selectedProgrammeId: number | null
    onSelectProgramme:
        (programme: RefereeProgramme) => void
}

export function RefereeProgrammeTable({
    programmes,
    selectedProgrammeId,
    onSelectProgramme,
}: RefereeProgrammeTableProps) {

    const [storedTableState] =
        useState(loadRefereeTableState)

    const [sorting, setSorting] =
        useState<SortingState>(
            storedTableState?.sorting ?? []
        )

    useEffect(() => {
        const state: StoredRefereeTableState = {
            sorting,
        }

        sessionStorage.setItem(
            REFEREE_TABLE_STATE_KEY,
            JSON.stringify(state)
        )
    }, [sorting])

    const table = useTable({
        features: refereeTableFeatures,
        data: programmes,
        columns,

        state: {
            sorting,
        },

        onSortingChange: setSorting,

        meta: {
            selectedProgrammeId,
            openProgrammeDetails:
                onSelectProgramme,
        },
    })

    const tableAreaRef = useRef<HTMLDivElement>(null)

    const tableRef = useRef<HTMLTableElement>(null)

    const horizontalScrollbarRef = useRef<HTMLDivElement>(null)

    const horizontalDragRef = useRef<{
        pointerId: number
        startX: number
        startScrollLeft: number
    } | null>(null)

    const separatorFadeTimeoutRef =
        useRef<
            ReturnType<typeof setTimeout> | null
        >(null)

    const [tableWidth, setTableWidth] = useState(0)

    useEffect(() => {
        const table = tableRef.current

        if (!table) {
            return
        }

        const updateWidth = () => {
            setTableWidth(table.scrollWidth)
        }

        updateWidth()

        const observer =
            new ResizeObserver(updateWidth)

        observer.observe(table)

        return () =>
            observer.disconnect()
    }, [])

    useEffect(() => {
        const tableArea =
            tableAreaRef.current

        const scrollbar =
            horizontalScrollbarRef.current

        if (!tableArea || !scrollbar) {
            return
        }

        function handleWheel(
            event: WheelEvent
        ) {
            let horizontalDelta = 0

            if (
                event.shiftKey &&
                event.deltaY !== 0
            ) {
                horizontalDelta =
                    event.deltaY
            } else if (event.deltaX !== 0) {
                horizontalDelta =
                    event.deltaX
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

            if (
                scrollbar!.scrollLeft
                !== previous
            ) {
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

    function updateTableScroll(
        scrollLeft: number
    ) {
        const tableArea =
            tableAreaRef.current

        if (!tableArea) {
            return
        }

        tableArea.style.setProperty(
            '--referee-table-scroll-left',
            `${scrollLeft}px`
        )

        if (
            separatorFadeTimeoutRef.current
            !== null
        ) {
            clearTimeout(
                separatorFadeTimeoutRef.current
            )

            separatorFadeTimeoutRef.current =
                null
        }

        if (scrollLeft > 0) {
            tableArea.classList.add(
                'is-horizontally-scrolled'
            )

            tableArea.classList.remove(
                'hide-pinned-separator'
            )

            return
        }

        separatorFadeTimeoutRef.current =
            setTimeout(() => {
                tableArea.classList.add(
                    'hide-pinned-separator'
                )

                separatorFadeTimeoutRef.current =
                    null
            }, 1000)
    }

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



    return (
        <div
            className="referee-table-area"
            ref={tableAreaRef}
            onPointerDown={handleHorizontalPointerDown}
            onPointerMove={handleHorizontalPointerMove}
            onPointerUp={handleHorizontalPointerEnd}
            onPointerCancel={handleHorizontalPointerEnd}
        >

            <div className="referee-programme-table">
                <table ref={tableRef}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr
                                key={headerGroup.id}
                                className={
                                    headerGroup.depth === 0
                                        ? 'referee-parent-header-row'
                                        : 'referee-column-header-row'
                                }
                            >
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className={
                                            header.column.id === 'programmeShortName' ||
                                            header.column.id === 'programmeIdentity'
                                                ? 'referee-pinned-programme'
                                                : undefined
                                        }
                                    >
                                        {header.isPlaceholder ? null : (
                                            headerGroup.depth === 0 ? (
                                                <div className="referee-parent-header-label">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </div>
                                            ) : (
                                                header.column.getCanSort() ? (
                                                    <button
                                                        type="button"
                                                        className="referee-sortable-header"
                                                        onClick={
                                                            header.column.getToggleSortingHandler()
                                                        }
                                                    >
                                                        <span className="referee-sortable-header-label">
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                        </span>

                                                        <span
                                                            className="referee-sort-indicator-area"
                                                            aria-hidden="true"
                                                        >
                                                            <SortIcon
                                                                className="referee-sort-indicator"
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
                            className="referee-header-boundary-row"
                            aria-hidden="true"
                        >
                            <th
                                colSpan={
                                    table.getAllLeafColumns().length
                                }
                            />
                        </tr>
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getAllCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className={
                                            cell.column.id === 'programmeShortName'
                                                ? 'referee-pinned-programme'
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

                <div
                    className="referee-table-horizontal-scrollbar"
                    ref={horizontalScrollbarRef}
                    onScroll={handleHorizontalScroll}
                >
                    <div
                        className="referee-table-horizontal-scrollbar-content"
                        style={{
                            width: `${tableWidth}px`,
                        }}
                    />
                </div>
            </div>

        </div>
    )
}
