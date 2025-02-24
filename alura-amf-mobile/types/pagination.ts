export type PaginationResponse<T> = {
    data: T[]
    meta: {
        currentPage: number
        firstPage: number
        lastPage: number
        perPage: number
        total: number
        firstPageUrl: string
        lastPageUrl: string
        nextPageUrl: string
        previousPageUrl: string
    }
}

export type Pagination = {
    currentPage: number
    firstPage: number
    lastPage: number
    perPage: number
    total: number
    firstPageUrl: string
    lastPageUrl: string
    nextPageUrl: string
    previousPageUrl: string
}

export type PaginationConfig = {
    page: number
    limit?: number
    orderBy?: string
    orderByDirection?: "asc" | "desc"
}

export type DatagridPaginationRender = {
    page: boolean
    limit: boolean
    orderBy: boolean
    orderByDirection: boolean
}