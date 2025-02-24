export const DateFormatter = {
    /** @example "2024-11-01T00:00:00.000Z" > "2024-11-01" */
    removeTime: (date: string) => {
        return date.split("T")[0]
    },
    /** @example "2024-11-01T00:00:00.000Z" > "00:00:00" */
    removeDate: (date: string) => {
        return date.split("T")[1].split(".")[0]
    },
    forBackend: {
        date: (unix?: number) => {
            let date = new Date()
            if (unix) date = new Date(unix)
            const formatted = DateFormatter.removeTime(date.toISOString())
            return formatted.replace("-", "/").replace("-", "/")
        },
        time: (unix?: number) => {
            let date = new Date()
            if (unix) date = new Date(unix)
            return DateFormatter.removeDate(date.toISOString())
        },
        timestamp: (unix?: number) => {
            let date = new Date()
            if (unix) date = new Date(unix)
            return `${ DateFormatter.forBackend.date(date.getTime()) } ${ DateFormatter.forBackend.time(date.getTime()) }`
        }
    },
    decreaseTime: (hours: number, unix?: number) => {
        let date = new Date(new Date().getTime() - (3600000 * hours))
        if (unix) date = new Date(unix - (3600000 * hours))
        return date
    },
    increaseTime: (hours: number, unix?: number) => {
        let date = new Date(new Date().getTime() + (3600000 * hours))
        if (unix) date = new Date(unix + (3600000 * hours))
        return date
    },
    fixUTC: (unix: number) => {
        return DateFormatter.decreaseTime(3, unix)
    },
}