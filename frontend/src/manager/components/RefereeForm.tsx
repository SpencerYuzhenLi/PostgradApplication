import { useEffect, useMemo } from 'react'
import type { ManagedReferee } from '../types/ManagedReferee'
import { FormField } from '../../shared/components/FormField'
import { FormSection } from '../../shared/components/FormSection'

export interface RefereeFormValues {
    name: string
    email: string
}

export function getRefereeFormValues(
    referee?: ManagedReferee
): RefereeFormValues {
    return {
        name: referee?.name ?? '',
        email: referee?.email ?? '',
    }
}

interface RefereeFormProps {
    values: RefereeFormValues
    initialValues: RefereeFormValues

    onChange:
        (values: RefereeFormValues) => void

    onSubmit:
        (values: RefereeFormValues) => void

    onDirtyChange:
        (dirty: boolean) => void

    onValidationError:
        (message: string) => void
}

export function RefereeForm({
    values,
    initialValues,
    onChange,
    onSubmit,
    onDirtyChange,
    onValidationError,
}: RefereeFormProps) {

    const dirty = useMemo(
        () =>
            JSON.stringify(values) !==
            JSON.stringify(initialValues),
        [values, initialValues]
    )

    useEffect(() => {
        onDirtyChange(dirty)
    }, [dirty, onDirtyChange])

    function updateField<
        K extends keyof RefereeFormValues
    >(
        field: K,
        value: RefereeFormValues[K]
    ) {
        onChange({
            ...values,
            [field]: value,
        })
    }

    function validateValues(
        values: RefereeFormValues
    ): string | null {
        if (values.name.trim() === '') {
            return 'Name is required.'
        }

        const email =
            values.email.trim()

        if (
            email !== '' &&
            !email.includes('@')
        ) {
            return 'Email must be a valid email address.'
        }

        return null
    }

    function handleSubmit() {
        const validationError =
            validateValues(values)

        if (validationError !== null) {
            onValidationError(
                validationError
            )
            return
        }

        onSubmit(values)
    }

    return (
        <form
            id="referee-form"
            className="form"
            noValidate
            onSubmit={event => {
                event.preventDefault()
                handleSubmit()
            }}
        >
            <FormSection
                title="Referee"
                defaultOpen
            >
                <FormField
                    label="Name"
                    value={values.name}
                    onChange={value =>
                        updateField(
                            'name',
                            value
                        )
                    }
                />

                <FormField
                    label="Email"
                    type="email"
                    value={values.email}
                    onChange={value =>
                        updateField(
                            'email',
                            value
                        )
                    }
                />
            </FormSection>
        </form>
    )
}