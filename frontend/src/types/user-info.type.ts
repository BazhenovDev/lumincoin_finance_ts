export type FullUserInfoType = {
    accessToken: string,
    refreshToken: string,
    userInfo: UserInfoType
}

export type UserInfoType = {
    name: string,
    lastName: string,
    id: number
}