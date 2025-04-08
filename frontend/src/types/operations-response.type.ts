export type OperationsResponseType = {
    error: boolean;
    redirect?: string,
    response: Array<OperationsBodyResponseType>;
}

export type OperationsBodyResponseType = {
    id: number,
    type: string,
    amount: number,
    date: string,
    comment: string,
    category: string
}

export type OperationsForFilterResponseType = Array<OperationsBodyResponseType>;

export type OperationsResultForData = Array<{
    category: string,
    amount: number,
}>

export type OperationsResponseById = {
    error: boolean,
    redirect?: string,
    response: OperationsBodyResponseType;
}
