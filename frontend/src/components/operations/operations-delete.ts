import {HttpUtils} from "../../utils/http-utils";
import {DeleteResponse, ErrorResponse} from "../../types/response.type";
import {OpenNewRouteType} from "../../types/opennewroute.type";

export class OperationsDelete {

    readonly openNewRoute: OpenNewRouteType;
    readonly id: string | null;

    constructor(openNewRoute: OpenNewRouteType) {

        this.openNewRoute = openNewRoute;

        const url: URLSearchParams = new URLSearchParams(window.location.search);
        this.id = url.get('id');

        this.operationDelete().then();
    }


    private async operationDelete(): Promise<void> {
        if (this.id) {
            const result: DeleteResponse | ErrorResponse = await HttpUtils.request(`/operations/${this.id}`, 'DELETE', true);

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (!result || result.error || (result.response && result.response.error)) {
                return console.log('Произошла ошибка по удалению расхода');
            }
            this.openNewRoute('/operations?period=today');
            return;
        }
    }

}