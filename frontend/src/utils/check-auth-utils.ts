import {AuthUtils} from "./auth-utils";

export class CheckAuthUtils {
    readonly openNewRoute: Function
    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;
        this.init();
    }

    private init(): void {
        let result: boolean = true;

        const accessToken = AuthUtils.getUserInfo(AuthUtils.accessTokenKey) as string;
        const refreshToken = AuthUtils.getUserInfo(AuthUtils.refreshTokenKey) as string;

        if (!accessToken || !refreshToken) {
           result = false;
        }

        if (!result) {
          this.openNewRoute('/login');
          return;
        }
    }
}