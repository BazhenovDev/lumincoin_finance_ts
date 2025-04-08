import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {DefaultErrorResponseType, LogoutResponseType} from "../../types/auth-response.type";

export class LogoutPage {

    readonly openNewRoute: Function;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        this.logout().then();
    }

    private async logout(): Promise<void> {
        const result: LogoutResponseType | DefaultErrorResponseType = await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.getUserInfo(AuthUtils.refreshTokenKey)
        });

        if (result && !(result as LogoutResponseType).error) {
            AuthUtils.removeUserInfo();
            return this.openNewRoute('/login');
        }
    }
}