export type BalanceResponseType = {
    redirect?: string,
    error: boolean,
    response: {
        balance: number,
    }
}