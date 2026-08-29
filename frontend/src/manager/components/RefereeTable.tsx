import './RefereeTable.css'
import type { ManagedReferee } from '../types/ManagedReferee'
import { useTableScroll } from '../../shared/hooks/useTableScroll'
import { ChevronIcon } from '../../shared/icons/ChevronIcon'

interface RefereeTableProps {
    referees: ManagedReferee[]
    selectedRefereeId: number | null

    onSelectReferee:
        (referee: ManagedReferee) => void
}

export function RefereeTable({
    referees,
    selectedRefereeId,
    onSelectReferee,
}: RefereeTableProps) {

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
            '--referee-manager-table-scroll-left',
    })

    return (
        <div className="manager-referee-table">
            <div
                ref={tableAreaRef}
                className="manager-referee-table-area"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
            >
                <div
                    ref={tableContainerRef}
                    className="manager-referee-table-container"
                >
                    <table ref={tableRef}>
                        <colgroup>
                            <col className="manager-referee-name-column" />
                            <col />
                            <col />
                            <col />
                        </colgroup>

                        <thead>
                            <tr>
                                <th className="manager-referee-pinned">
                                    Referee
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    References
                                </th>

                                <th>
                                    Access
                                </th>
                            </tr>

                            <tr
                                className="manager-referee-header-boundary"
                                aria-hidden="true"
                            >
                                <th colSpan={4} />
                            </tr>
                        </thead>

                        <tbody>
                            {referees.map(
                                referee => {
                                    const submittedCount =
                                        referee.programmes
                                            .filter(
                                                programme =>
                                                    programme
                                                        .submitted
                                            )
                                            .length

                                    return (
                                        <tr
                                            key={
                                                referee.id
                                            }
                                        >
                                            <td className="manager-referee-pinned">
                                                <button
                                                    type="button"
                                                    className={
                                                        selectedRefereeId === referee.id
                                                            ? 'manager-referee-details-trigger active'
                                                            : 'manager-referee-details-trigger'
                                                    }
                                                    onClick={() =>
                                                        onSelectReferee(referee)
                                                    }
                                                >
                                                    <span className="manager-referee-details-name">
                                                        {referee.name}
                                                    </span>

                                                    <span
                                                        className="manager-referee-details-chevron-area"
                                                        aria-hidden="true"
                                                    >
                                                        <ChevronIcon
                                                            className="manager-referee-details-chevron"
                                                            direction={
                                                                selectedRefereeId === referee.id
                                                                    ? 'left'
                                                                    : 'right'
                                                            }
                                                        />
                                                    </span>
                                                </button>
                                            </td>

                                            <td>
                                                {
                                                    referee.email ??
                                                    ''
                                                }
                                            </td>

                                            <td>
                                                {
                                                    submittedCount
                                                }
                                                {' / '}
                                                {
                                                    referee
                                                        .programmes
                                                        .length
                                                }
                                            </td>

                                            <td>
                                                {
                                                    referee
                                                        .accessActive
                                                        ? 'Active'
                                                        : 'Not issued'
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            )}
                        </tbody>
                    </table>
                </div>

                <div
                    ref={
                        horizontalScrollbarRef
                    }
                    className="manager-referee-horizontal-scrollbar"
                    onScroll={
                        handleHorizontalScroll
                    }
                >
                    <div
                        className="manager-referee-horizontal-scrollbar-content"
                        style={{
                            width:
                                `${tableWidth}px`,
                        }}
                    />
                </div>
            </div>
        </div>
    )
}