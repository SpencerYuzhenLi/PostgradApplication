import {
    useEffect,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
    type PointerEvent as ReactPointerEvent,
} from 'react'

interface UseTableScrollOptions {
    scrollLeftProperty: string
    scrolledClass?: string
    hiddenSeparatorClass?: string
    keyboardScrollStep?: number
    separatorFadeDelay?: number
}

export function useTableScroll({
    scrollLeftProperty,
    scrolledClass = 'is-horizontally-scrolled',
    hiddenSeparatorClass = 'hide-pinned-separator',
    keyboardScrollStep = 48,
    separatorFadeDelay = 1000,
}: UseTableScrollOptions) {

    const tableAreaRef =
        useRef<HTMLDivElement>(null)

    const tableContainerRef =
        useRef<HTMLDivElement>(null)

    const tableRef =
        useRef<HTMLTableElement>(null)

    const horizontalScrollbarRef =
        useRef<HTMLDivElement>(null)

    const horizontalDragRef =
        useRef<{
            pointerId: number
            startX: number
            startScrollLeft: number
        } | null>(null)

    const separatorFadeTimeoutRef =
        useRef<
            ReturnType<typeof setTimeout> | null
        >(null)

    const [tableWidth, setTableWidth] =
        useState(0)

    /*
     * Measure the actual table width so the
     * synthetic horizontal scrollbar has the
     * correct scroll range.
     */
    useEffect(() => {
        const table = tableRef.current

        if (!table) {
            return
        }

        const updateWidth = () => {
            setTableWidth(
                table.scrollWidth
            )
        }

        updateWidth()

        const observer =
            new ResizeObserver(updateWidth)

        observer.observe(table)

        return () => {
            observer.disconnect()
        }
    }, [])

    /*
     * Shift + wheel and native horizontal
     * trackpad/wheel input.
     */
    useEffect(() => {
        const tableArea =
            tableAreaRef.current

        if (!tableArea) {
            return
        }

        function handleWheel(
            event: WheelEvent
        ) {
            const scrollbar =
                horizontalScrollbarRef.current

            if (!scrollbar) {
                return
            }

            let horizontalDelta = 0

            if (
                event.shiftKey &&
                event.deltaY !== 0
            ) {
                horizontalDelta =
                    event.deltaY
            } else if (
                event.deltaX !== 0
            ) {
                horizontalDelta =
                    event.deltaX
            }

            if (horizontalDelta === 0) {
                return
            }

            const maxScrollLeft =
                scrollbar.scrollWidth -
                scrollbar.clientWidth

            if (maxScrollLeft <= 0) {
                return
            }

            const previous =
                scrollbar.scrollLeft

            scrollbar.scrollLeft +=
                horizontalDelta

            if (
                scrollbar.scrollLeft !==
                previous
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
        const tableContainer =
            tableContainerRef.current

        if (!tableContainer) {
            return
        }

        tableContainer.style.setProperty(
            scrollLeftProperty,
            `${scrollLeft}px`
        )

        if (
            separatorFadeTimeoutRef.current !==
            null
        ) {
            clearTimeout(
                separatorFadeTimeoutRef.current
            )

            separatorFadeTimeoutRef.current =
                null
        }

        if (scrollLeft > 0) {
            tableContainer.classList.add(
                scrolledClass
            )

            tableContainer.classList.remove(
                hiddenSeparatorClass
            )

            return
        }

        separatorFadeTimeoutRef.current =
            setTimeout(() => {
                tableContainer.classList.add(
                    hiddenSeparatorClass
                )

                separatorFadeTimeoutRef.current =
                    null
            }, separatorFadeDelay)
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

    function handlePointerDown(
        event:
            ReactPointerEvent<HTMLDivElement>
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
            startScrollLeft:
                scrollbar.scrollLeft,
        }
    }

    function handlePointerMove(
        event:
            ReactPointerEvent<HTMLDivElement>
    ) {
        const drag =
            horizontalDragRef.current

        const scrollbar =
            horizontalScrollbarRef.current

        if (
            !drag ||
            !scrollbar ||
            event.pointerId !==
                drag.pointerId
        ) {
            return
        }

        const deltaX =
            event.clientX -
            drag.startX

        scrollbar.scrollLeft =
            drag.startScrollLeft -
            deltaX
    }

    function handlePointerEnd(
        event:
            ReactPointerEvent<HTMLDivElement>
    ) {
        if (
            horizontalDragRef.current
                ?.pointerId !==
            event.pointerId
        ) {
            return
        }

        horizontalDragRef.current =
            null
    }

    function handleKeyDown(
        event:
            ReactKeyboardEvent<HTMLDivElement>
    ) {
        const target =
            event.target as HTMLElement

        /*
         * Preserve normal arrow-key behaviour
         * inside text/form controls.
         */
        if (
            target instanceof
                HTMLInputElement ||
            target instanceof
                HTMLTextAreaElement ||
            target instanceof
                HTMLSelectElement
        ) {
            return
        }

        if (
            event.key === 'ArrowLeft' ||
            event.key === 'ArrowRight'
        ) {
            const scrollbar =
                horizontalScrollbarRef.current

            if (!scrollbar) {
                return
            }

            const direction =
                event.key === 'ArrowRight'
                    ? 1
                    : -1

            const previous =
                scrollbar.scrollLeft

            scrollbar.scrollLeft +=
                direction *
                keyboardScrollStep

            if (
                scrollbar.scrollLeft !==
                previous
            ) {
                event.preventDefault()
            }

            return
        }

        if (
            event.key === 'ArrowUp' ||
            event.key === 'ArrowDown'
        ) {
            const tableContainer =
                tableContainerRef.current

            if (!tableContainer) {
                return
            }

            const direction =
                event.key === 'ArrowDown'
                    ? 1
                    : -1

            const previous =
                tableContainer.scrollTop

            tableContainer.scrollTop +=
                direction *
                keyboardScrollStep

            if (
                tableContainer.scrollTop !==
                previous
            ) {
                event.preventDefault()
            }
        }
    }

    /*
     * Don't leave a pending timeout behind if
     * the table is unmounted.
     */
    useEffect(() => {
        return () => {
            if (
                separatorFadeTimeoutRef
                    .current !== null
            ) {
                clearTimeout(
                    separatorFadeTimeoutRef
                        .current
                )
            }
        }
    }, [])

    return {
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
    }
}