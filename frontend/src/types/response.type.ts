export type ResponseType = {
    redirect?: string,
    error: boolean,
    response: Object | null
}

export type ErrorResponse = {
    error: boolean,
    redirect?: string,
    response: {
        error: boolean,
        message: string,
    }
}

export type DeleteResponse = {
    error: boolean,
    redirect?: string,
    response: {
        error: boolean,
        message: string,
    }
}

export type IncomeAndResponseResponse = {
    error: boolean,
    redirect?: string,
    response: Array<IncomeAndExpenseResponseList>
}

export type IncomeAndExpenseResponseList = {
    id: number,
    title: string,
}
