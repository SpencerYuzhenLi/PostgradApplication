import {
    rowSortingFeature,
    createSortedRowModel,
    sortFn_alphanumeric,
    sortFn_text,
    columnFilteringFeature,
    createFilteredRowModel,
    columnVisibilityFeature,
    tableFeatures,
} from '@tanstack/react-table'

export const programmeTableFeatures =
    tableFeatures({
        rowSortingFeature,
        sortedRowModel:
            createSortedRowModel(),

        columnFilteringFeature,
        filteredRowModel:
            createFilteredRowModel(),

        columnVisibilityFeature,

        sortFns: {
            alphanumeric:
                sortFn_alphanumeric,
            text:
                sortFn_text,
        },
    })

export type ProgrammeTableFeatures =
    typeof programmeTableFeatures