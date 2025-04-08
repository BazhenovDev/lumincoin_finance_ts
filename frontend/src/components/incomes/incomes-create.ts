import {HttpUtils} from "../../utils/http-utils";
import {IncomeResponseById} from "../../types/income-response.type";
import {ErrorResponse} from "../../types/response.type";

export class IncomesCreate {

    readonly openNewRoute: Function;
    readonly incomeNameInput: HTMLElement | null | undefined;
    readonly createButtonElement: HTMLElement | null;
    readonly cancelButtonElement: HTMLElement | null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;
        this.createButtonElement = document.getElementById('create-btn');
        this.cancelButtonElement = document.getElementById('cancel-btn');

        this.incomeNameInput = document.getElementById('income-create');
        if (this.createButtonElement) {
            this.createButtonElement.addEventListener('click', this.createIncome.bind(this));
        }
        if (this.cancelButtonElement) {
            this.cancelButtonElement.addEventListener('click', this.removeOnIncomePage.bind(this));
        }
    }

    private validate(): boolean {
        let result: boolean = true;
        if (this.incomeNameInput) {
            if ((this.incomeNameInput as HTMLInputElement).value) {
                this.incomeNameInput.classList.remove('is-invalid');
            } else {
                result = false;
                this.incomeNameInput.classList.add('is-invalid');
            }
        }
        return result;
    }

    private removeOnIncomePage(): void {
        this.openNewRoute('/income');
    }

    private async createIncome(e: MouseEvent): Promise<void> {
        e.preventDefault()
        if (this.validate()) {
            const result: IncomeResponseById | ErrorResponse = await HttpUtils.request('/categories/income', 'POST', true, {
                title: (this.incomeNameInput as HTMLInputElement).value
            })
            if (result.response && (result as IncomeResponseById).response.title && !result.error) {
                console.log('Новая категория успешно создана');
                this.openNewRoute('/income')
            }
            if (result.error || !result.response || (result.response && (result as ErrorResponse).response.error)) {
                return console.log('Не удалось осуществить запрос, попробуйте позже');
            }
        }
    }

}