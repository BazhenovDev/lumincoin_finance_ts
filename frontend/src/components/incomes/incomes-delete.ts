import {HttpUtils} from "../../utils/http-utils";
import {DeleteResponse, ErrorResponse} from "../../types/response.type";

export class IncomeDelete {

    readonly openNewRoute: Function;
    readonly id: string | null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        const url: URLSearchParams = new URLSearchParams(window.location.search);
        this.id = url.get('id');

        this.incomeDelete().then();
    }
    private async incomeDelete(): Promise<void> {
        if (this.id) {
            const result: DeleteResponse | ErrorResponse = await HttpUtils.request(`/categories/income/${this.id}`, 'DELETE', true);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }
            if (!result || result.error || (result.response && (result as ErrorResponse).response.error)) {
               return console.log('Произошла ошибка по удалению дохода');
            }
           return this.openNewRoute('/income');
        }
    }
}