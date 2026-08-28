import {
    regionNames,
    regionAbbreviations,
    countryNames,
    countryAbbreviations,
    degreeNames,
    statusNames,
} from '../../shared/utils/displayNames'

interface FilterControl {
    label: string
    columnId: string
    options: Record<string, string>
    abbreviatedOptions?: Record<string, string>
}

export const filterControls: FilterControl[] = [
    {
        label: 'Region',
        columnId: 'region',
        options: regionNames,
        abbreviatedOptions: regionAbbreviations,
    },
    {
        label: 'Country',
        columnId: 'country',
        options: countryNames,
        abbreviatedOptions: countryAbbreviations,
    },
    {
        label: 'Degree',
        columnId: 'degree',
        options: degreeNames,
    },
    {
        label: 'Status',
        columnId: 'status',
        options: statusNames,
    },
]

export const viewControls = [
    {
        label: 'Location',
        columnIds: ['region', 'country'],
        defaultVisible: false,
    },
    {
        label: 'Rankings',
        columnIds: [
            'qsRanking',
            'usNewsRanking',
            'theRanking',
            'arwuRanking',
        ],
        defaultVisible: false,
    },
    {
        label: 'Degree',
        columnIds: ['degree',],
        defaultVisible: true,
    },
    {
        label: 'Status',
        columnIds: ['status'],
        defaultVisible: true,
    },
    {
        label: 'Application Opens',
        columnIds: ['applicationOpens'],
        defaultVisible: false,
    },
    {
        label: 'Reference Deadline',
        columnIds: ['referenceDeadline'],
        defaultVisible: false,
    },
]

export const initialColumnVisibility = Object.fromEntries(
        viewControls.flatMap(control =>
            control.columnIds.map(columnId => [
                columnId,
                control.defaultVisible,
            ])
        )
    )
