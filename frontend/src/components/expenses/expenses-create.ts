import {HttpUtils} from "../../utils/http-utils";
import {ExpenseCreateResponseType} from "../../types/expenses-response.type";
import {ErrorResponse} from "../../types/response.type";
import {OpenNewRouteType} from "../../types/opennewroute.type";

export class ExpensesCreate {

    readonly openNewRoute: OpenNewRouteType;
    readonly expenseNameInput: HTMLInputElement | null | undefined;
    readonly createButtonElement: HTMLElement | null | undefined;
    readonly cancelButtonElement: HTMLElement | null | undefined;


    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        this.expenseNameInput = document.getElementById('expenses-create') as HTMLInputElement;
        this.createButtonElement = document.getElementById('create-btn');
        this.cancelButtonElement = document.getElementById('cancel-btn');
        if (this.createButtonElement) {
            this.createButtonElement.addEventListener('click', this.createExpense.bind(this));
        }
        if (this.cancelButtonElement) {
            this.cancelButtonElement.addEventListener('click', this.removeOnExpensesPage.bind(this));
        }
    }

    private validate(): boolean {
        let result: boolean = true;
        if (this.expenseNameInput) {
            if (this.expenseNameInput.value) {
                this.expenseNameInput.classList.remove('is-invalid');
            } else {
                result = false;
                this.expenseNameInput.classList.add('is-invalid');
            }
        }
        return result;
    }

    removeOnExpensesPage(): void {
        this.openNewRoute('/expenses');
    }

    private async createExpense(e: MouseEvent): Promise<void> {
        e.preventDefault()
        if (this.validate()) {
            const result: ExpenseCreateResponseType | ErrorResponse = await HttpUtils.request('/categories/expense', 'POST', true, {
                title: (this.expenseNameInput as HTMLInputElement).value
            });

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.response && (result as ExpenseCreateResponseType).response.title && !result.error) {
                console.log('Новая категория успешно создана');
                this.openNewRoute('/expenses');
            }
            if (result.error || !result.response || (result.response && (result as ErrorResponse).response.error)) {
                return console.log('Не удалось осуществить запрос, попробуйте позже');
            }
        }
    }

}