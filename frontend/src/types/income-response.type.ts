export type IncomeResponse = {
    error: boolean,
    redirect?: string,
    response: Array<IncomeResponseList>
};

export type IncomeResponseList = {
    id: number,
    title: string,
}

export type IncomeResponseById = {
    error: boolean,
    redirect?: string,
    response: {
        id: number,
        title: string,
    }
}
