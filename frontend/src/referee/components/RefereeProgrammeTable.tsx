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
import { useEffect, useState } from 'react'
import type { RefereeProgramme } from '../types/RefereeProgramme'
import { useTableScroll } from '../../shared/hooks/useTableScroll'
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
                    programme
                        .referenceSubmission ??
                    undefined,
                header: 'Submission',
                sortUndefined: 'last',
            },

            {
                id: 'submitted',
                accessorFn: programme =>
                    programme.submitted,
                header: 'Submitted',

                cell: info => {
                    const programme =
                        info.row.original

                    const updating =
                        info.table.options.meta
                            ?.updatingSubmissionId
                        === programme.id

                    return (
                        <label className="referee-submitted-control">
                            <input
                                type="checkbox"
                                checked={
                                    programme.submitted
                                }
                                disabled={updating}
                                onChange={event =>
                                    info.table.options.meta
                                        ?.updateSubmission?.(
                                            programme,
                                            event.target
                                                .checked
                                        )
                                }
                                aria-label={
                                    `Reference submitted for ${programme.programmeShortName}`
                                }
                            />

                            {updating && (
                                <span
                                    className="referee-submitted-saving"
                                    aria-live="polite"
                                >
                                    Saving…
                                </span>
                            )}
                        </label>
                    )
                },
            },
        ],
    },
]

const DEFAULT_REFEREE_SORTING: SortingState = [
    {
        id: 'programmeShortName',
        desc: false,
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
    updatingSubmissionId: number | null

    onSelectProgramme:
        (programme: RefereeProgramme) => void

    onSubmissionChange:
        (
            programme: RefereeProgramme,
            submitted: boolean,
        ) => void
}

export function RefereeProgrammeTable({
    programmes,
    selectedProgrammeId,
    updatingSubmissionId,
    onSelectProgramme,
    onSubmissionChange,
}: RefereeProgrammeTableProps) {

    const [storedTableState] =
        useState(loadRefereeTableState)

    const [sorting, setSorting] =
        useState<SortingState>(
            storedTableState?.sorting ??
                DEFAULT_REFEREE_SORTING
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

    const {
        tableAreaRef,
        tableContainerRef,
        tableRef,
        horizontalScrollbarRef,
        tableWidth,
        handleHorizontalScroll,
        handlePointerDown,
        handlePointerMove,
        handlePointerEnd,
        handleKeyDown,
    } = useTableScroll({
        scrollLeftProperty:
            '--referee-table-scroll-left',
    })

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

            updatingSubmissionId,

            updateSubmission:
                onSubmissionChange,
        },
    })

    return (
        <div
            className="referee-table-area"
            ref={tableAreaRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
        >

            <div className="referee-programme-table">
                <div
                    ref={tableContainerRef}
                    className="referee-table-container"
                >
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
                </div>

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
