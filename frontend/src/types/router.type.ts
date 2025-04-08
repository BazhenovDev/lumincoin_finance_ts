export type RouterType = {
    title?: string,
    route: string,
    filePathTemplate?: string,
    layout?: string,
    load?(): void
}