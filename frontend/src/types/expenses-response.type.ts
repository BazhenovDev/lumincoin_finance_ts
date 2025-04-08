export type ExpenseDeleteResponseType = {
    redirect?: string,
    error: boolean
    response: {
        error: string,
        message: string,
    }
}

export type ExpenseCreateResponseType = {
    redirect?: string,
    error: boolean
    response: {
        id: number,
        title: string,
    }
}

export type ExpenseEditResponseType = {
    redirect?: string,
    error: boolean,
    response: {
        id: number,
        title: string,
    }
}

export type ExpenseEditResultResponseType = {
    id: number,
    title: string,
}

export type ExpenseListResponseType = {
    error: boolean,
    redirect?: string,
    response: Array<ExpenseDefaultResponseType>,
}

export type ExpenseDefaultResponseType = {
    id: number,
    title: string,
}
