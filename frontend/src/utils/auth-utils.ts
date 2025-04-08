import config from "../config/config";
import {FullUserInfoType, UserInfoType} from "../types/user-info.type";
import {RefreshResponseType} from "../types/auth-response.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userInfoKey: string = 'userInfo';

    public static setUserInfo(accessToken: string, refreshToken: string, userInfo?: UserInfoType): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
        }
    }

    public static getUserInfo(key: string | null = null): string | FullUserInfoType | UserInfoType {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoKey].includes(key)) {
            if (key === this.userInfoKey) {
                return JSON.parse(localStorage.getItem(this.userInfoKey) as string) as UserInfoType;
            }
            return localStorage.getItem(key) as string;
        } else {
            // const fullUserInfo: string  = localStorage.getItem(this.userInfoKey)!;
                return {
                    [this.accessTokenKey]: (localStorage.getItem(this.accessTokenKey)) as string,
                    [this.refreshTokenKey]: (localStorage.getItem(this.refreshTokenKey)) as string,
                    [this.userInfoKey]: (JSON.parse(this.userInfoKey)) as UserInfoType,
                } as FullUserInfoType;
        }
    }

    public static removeUserInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoKey);
    }

    public static async updateTokensWithRefresh(): Promise<boolean> {

        let result: boolean = false;

        const refreshToken = this.getUserInfo(this.refreshTokenKey) as string;

        if (refreshToken) {
            const response: Response = await fetch(`${config.host}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            });

            if (response && response.status === 200) {
                const tokens: RefreshResponseType = await response.json();
                if (tokens && !tokens.error) {
                    this.setUserInfo(tokens.tokens.accessToken, tokens.tokens.refreshToken);
                    result = true;
                }
            }
        }
        if (!result) {
            this.removeUserInfo();
        }
        return result;
    }
}