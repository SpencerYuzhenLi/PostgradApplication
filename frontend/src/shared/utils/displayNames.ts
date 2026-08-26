import type {
    Region,
    Country,
    Degree,
    Status,
} from '../types/Programme'


export const regionNames: Record<Region, string> = {
    NORTH_AMERICA: 'North America',
    EUROPE: 'Europe',
    UNITED_KINGDOM: 'United Kingdom',
}

export const regionAbbreviations: Record<Region, string> = {
    NORTH_AMERICA: 'NA',
    EUROPE: 'EU',
    UNITED_KINGDOM: 'UK',
}

export const countryNames: Record<Country, string> = {
    UNITED_STATES: 'United States',
    CANADA: 'Canada',
    UNITED_KINGDOM: 'United Kingdom',
    FRANCE: 'France',
    GERMANY: 'Germany',
    SWITZERLAND: 'Switzerland',
}

export const countryAbbreviations: Record<Country, string> = {
    UNITED_STATES: 'US',
    CANADA: 'CA',
    UNITED_KINGDOM: 'UK',
    FRANCE: 'FR',
    GERMANY: 'DE',
    SWITZERLAND: 'CH',
}

export const degreeNames: Record<Degree, string> = {
    MASTER: "Master's",
    DOCTORATE: 'Doctorate',
}

export const statusNames: Record<Status, string> = {
    CONSIDERING: 'Considering',
    PREPARING: 'Preparing',
    SUBMITTED: 'Submitted',
    SHORTLISTED: 'Shortlisted',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
}

