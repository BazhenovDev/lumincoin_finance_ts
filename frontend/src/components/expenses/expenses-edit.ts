import {HttpUtils} from "../../utils/http-utils";
import {ExpenseEditResponseType, ExpenseEditResultResponseType} from "../../types/expenses-response.type";
import {ErrorResponse} from "../../types/response.type";
import {OpenNewRouteType} from "../../types/opennewroute.type";

export class ExpensesEdit {

    readonly openNewRoute: OpenNewRouteType;
    readonly inputNameElement: HTMLInputElement | null | undefined;
    private getExpenseResult: ExpenseEditResultResponseType | undefined;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        const url: URLSearchParams = new URLSearchParams(window.location.search);
        const expenseId: string | null = url.get('id');

        if (!expenseId) {
            this.openNewRoute('/expenses').then();
            return;
        }

        this.inputNameElement = document.getElementById('expenses-create') as HTMLInputElement;


        this.getExpense(expenseId).then();
    }

    private async getExpense(id: string): Promise<any> {
        const result: ExpenseEditResponseType | ErrorResponse = await HttpUtils.request(`/categories/expense/${id}`);

        if (result.redirect) {
           return this.openNewRoute(result.redirect);
        }

        if (result && !result.error) {
            if (this.inputNameElement) {
                this.inputNameElement.value = (result as ExpenseEditResponseType).response.title;
            }
        }

        if (result.error || !result.response || (result.response && (result as ErrorResponse).response.error)) {
            console.log('Произошла ошибка запроса расхода');
        }

        this.getExpenseResult = (result as ExpenseEditResponseType).response;

        const editButtonElement: HTMLElement | null = document.getElementById('edit-btn');
        const cancelButtonElement: HTMLElement | null = document.getElementById('cancel-btn');

        if (editButtonElement) {
            editButtonElement.addEventListener('click', this.update.bind(this));
        }
        if (cancelButtonElement) {
            cancelButtonElement.addEventListener('click', () => {
                if (this.inputNameElement && this.getExpenseResult) {
                    this.inputNameElement.value = this.getExpenseResult.title;
                }
                this.openNewRoute('/expenses');
            });
        }

    }

    private validateForm(): boolean {
        let result: boolean = true;

        if (this.inputNameElement) {
            if (this.inputNameElement.value) {
                this.inputNameElement.classList.remove('is-invalid');
            } else {
                this.inputNameElement.classList.add('is-invalid');
                result = false;
            }
        }

        return result;
    }

    private async update(e: MouseEvent): Promise<void> {
        e.preventDefault();

        if (this.validateForm()) {
            if (this.inputNameElement && this.getExpenseResult) {
                if (this.inputNameElement.value !== this.getExpenseResult.title) {
                    const result: ExpenseEditResponseType | ErrorResponse = await HttpUtils.request(`/categories/expense/${this.getExpenseResult.id}`, 'PUT', true, {
                        title: this.inputNameElement.value
                    });

                    if (result.redirect) {
                        this.openNewRoute(result.redirect).then();
                    }

                    if (result.response && !result.error) {
                        console.log('Название категории успешно обновилось');
                        return this.openNewRoute('/expenses');
                    }

                    if (result.error || !result.response || (result.response && (result as ErrorResponse).response.error)) {
                        return console.log('Название категории не удалось обновить. Попробуйте позже.');
                    }

                } else if (this.inputNameElement.value === this.getExpenseResult.title) {
                    return this.openNewRoute('/expenses');
                }
            }
        }
    }

}
