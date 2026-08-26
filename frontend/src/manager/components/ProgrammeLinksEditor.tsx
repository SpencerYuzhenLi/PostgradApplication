import './ProgrammeLinksEditor.css'
import type { ProgrammeLinkFormValue } from './ProgrammeForm'
import { ProgrammeFormField } from './ProgrammeFormField'

interface ProgrammeLinksEditorProps {
    links: ProgrammeLinkFormValue[]
    onChange: (links: ProgrammeLinkFormValue[]) => void
}

export function ProgrammeLinksEditor({
    links,
    onChange,
}: ProgrammeLinksEditorProps) {

    function addLink() {
        onChange([
            ...links,
            {
                id: null,
                displayName: '',
                url: '',
            },
        ])
    }

    function updateLink(
        index: number,
        update: Partial<ProgrammeLinkFormValue>
    ) {
        onChange(
            links.map((link, currentIndex) =>
                currentIndex === index
                    ? {
                        ...link,
                        ...update,
                    }
                    : link
            )
        )
    }

    function removeLink(index: number) {
        onChange(
            links.filter(
                (_, currentIndex) =>
                    currentIndex !== index
            )
        )
    }

    function moveLink(
        index: number,
        offset: -1 | 1
    ) {
        const targetIndex = index + offset

        if (
            targetIndex < 0 ||
            targetIndex >= links.length
        ) {
            return
        }

        const reordered = [...links]
        const current = reordered[index]

        reordered[index] = reordered[targetIndex]
        reordered[targetIndex] = current

        onChange(reordered)
    }

    return (
        <div className="programme-links-editor">
            {links.map((link, index) => (
                <div
                    key={link.id ?? `new-${index}`}
                    className="programme-link-editor"
                >

                    <ProgrammeFormField
                        label="Display name"
                        value={link.displayName}
                        onChange={value =>
                            updateLink(index, {
                                displayName: value,
                            })
                        }
                    />

                    <ProgrammeFormField
                        label="URL"
                        value={link.url}
                        onChange={value =>
                            updateLink(index, {
                                url: value,
                            })
                        }
                    />

                    <div className="programme-link-actions">
                        <button
                            type="button"
                            className="programme-link-move"
                            onClick={() => moveLink(index, -1)}
                            disabled={index === 0}
                        >
                            <span aria-hidden="true">↑</span>
                            Move up
                        </button>

                        <button
                            type="button"
                            className="programme-link-move"
                            onClick={() => moveLink(index, 1)}
                            disabled={index === links.length - 1}
                        >
                            <span aria-hidden="true">↓</span>
                            Move down
                        </button>

                        <button
                            type="button"
                            className="programme-link-remove"
                            onClick={() => removeLink(index)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            <button
                type="button"
                className="programme-link-add"
                onClick={addLink}
            >
                <span aria-hidden="true">+</span>
                Add link
            </button>
        </div>
    )
}