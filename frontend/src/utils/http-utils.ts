import config from "../config/config";
import {AuthUtils} from "./auth-utils";
import {ResponseType} from "../types/response.type";

export class HttpUtils {
    public static async request(url: string, method: string = "GET", authToken: boolean = true, body: any = null): Promise<any> {

        const result: ResponseType = {
            error: false,
            response: null,
        }

        const params: any = {
            method: method,
            headers: {
                'Content-type': 'Application/json',
                'Accept': 'Application/json'
            }
        }

        let accessToken: string | null = null;

        if (authToken) {
            accessToken = AuthUtils.getUserInfo(AuthUtils.accessTokenKey) as string;
            if (accessToken) {
                params.headers['x-auth-token'] = accessToken;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }


        // Подумать над Response
        let response: Response | null = null;

        try {
            response = await fetch(`${config.host}${url}`, params);
            result.response = await response.json();

        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (authToken && response.status === 401) {
                if (accessToken) {
                    const updateRefreshToken: boolean = await AuthUtils.updateTokensWithRefresh();
                    if (updateRefreshToken) {
                        return this.request(url, method, authToken, body);
                    } else {
                        result.redirect = '/login';
                    }
                } else {
                    result.redirect = '/login';
                }
            }
        }
        return result;
    }
}