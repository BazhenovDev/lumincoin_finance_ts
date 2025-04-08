export type LoginResponseType = {
    error: boolean;
    response: {
        tokens: {
            accessToken: string,
            refreshToken: string,
        },
        user: {
            name: string,
            lastName: string,
            id: number
        }
        error?: boolean;
        message?: string;
    }
}

export type LogoutResponseType = {
    error?: boolean;
    message?: string;
    response: {
        error: boolean,
        message: string,
    }
}

export type SignUpResponseType = {
    error?: boolean,
    message?: string,
    response: {
        error?: boolean,
        message?: string,
        user: {
            id: number,
            email: string,
            lastName: string,
            name: string
        }
    }
}


export type DefaultErrorResponseType = {
    error?: boolean,
    message?: string,
    response: {
        error: boolean
        message: string
        validation?: Array<{
            key?: string,
            message?: string
        }>
    }
}

export type RefreshResponseType = {
        tokens: {
            accessToken: string,
            refreshToken: string,
        },
        error?: boolean,
        message?: string,
}
