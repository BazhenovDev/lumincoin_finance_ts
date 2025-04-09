import {HttpUtils} from "../../utils/http-utils";
import {ExpenseDeleteResponseType} from "../../types/expenses-response.type";
import {OpenNewRouteType} from "../../types/opennewroute.type";

export class ExpensesDelete {

    readonly openNewRoute: OpenNewRouteType;
    readonly id: string | null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        const url = new URLSearchParams(window.location.search);
        this.id = url.get('id');

        this.expenseDelete().then();
    }

    private async expenseDelete(): Promise<void> {
        if (this.id) {
            const result: ExpenseDeleteResponseType = await HttpUtils.request(`/categories/expense/${this.id}`, 'DELETE', true);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }
            if (!result || result.error || (result.response && result.response.error)) {
                console.log('Произошла ошибка по удалению расхода');
                return;
            }
            return this.openNewRoute('/expenses');
        }
    }
}