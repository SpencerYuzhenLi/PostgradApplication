import {
    useEffect,
    useRef,
    useState,
} from 'react'

export function useScrollable<
    T extends HTMLElement
>() {
    const ref = useRef<T>(null)

    const [scrollable, setScrollable] =
        useState(false)

    useEffect(() => {
        const element = ref.current

        if (element === null) {
            return
        }

        const updateScrollable = () => {
            setScrollable(
                element.scrollHeight >
                element.clientHeight + 1
            )
        }

        updateScrollable()

        const resizeObserver =
            new ResizeObserver(
                updateScrollable
            )

        resizeObserver.observe(element)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    return {
        ref,
        scrollable,
    }
}