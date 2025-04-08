import {HttpUtils} from "../../utils/http-utils";
import {
    IncomeResponseById, IncomeResponseList,
} from "../../types/income-response.type";
import {ErrorResponse} from "../../types/response.type";

export class IncomesEdit {

    readonly openNewRoute: Function;
    readonly inputNameElement: HTMLElement | null | undefined;
    readonly editButtonElement: HTMLElement | null | undefined;
    readonly cancelButtonElement: HTMLElement | null | undefined;
    private getIncomeResult: IncomeResponseList | null | undefined;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;
        this.editButtonElement = document.getElementById('edit-btn');
        this.cancelButtonElement = document.getElementById('cancel-btn');


        const url: URLSearchParams = new URLSearchParams(window.location.search);
        const incomeId: string | null = url.get('id');

        if (!incomeId) {
            return this.openNewRoute('/income');
        }

        this.inputNameElement = document.getElementById('income-create');

        this.getIncome(incomeId).then();

        if (this.editButtonElement) {
            this.editButtonElement.addEventListener('click', this.update.bind(this));
        }

        if (this.cancelButtonElement) {
            this.cancelButtonElement.addEventListener('click', () => {
                if (this.inputNameElement && this.getIncomeResult) {
                    (this.inputNameElement as HTMLInputElement).value = this.getIncomeResult.title;
                }
                this.openNewRoute('/income');
            });
        }


    }

    private async getIncome(id: string): Promise<void> {
        const result: IncomeResponseById | ErrorResponse = await HttpUtils.request(`/categories/income/${id}`);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result && !result.error) {
            (this.inputNameElement as HTMLInputElement).value = (result as IncomeResponseById).response.title;
        }

        if (result.error || !result.response || (result.response && (result as ErrorResponse).response.error)) {
            console.log('Произошла ошибка запроса расхода');
        }

        this.getIncomeResult = (result as IncomeResponseById).response;
    }

    private validateForm(): boolean {
        let result: boolean = true;

        if (this.inputNameElement) {
            if ((this.inputNameElement as HTMLInputElement).value) {
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
            if (this.inputNameElement && this.getIncomeResult) {
                if ((this.inputNameElement as HTMLInputElement).value !== this.getIncomeResult.title) {
                    const result = await HttpUtils.request(`/categories/income/${this.getIncomeResult.id}`, 'PUT', true, {
                        title: (this.inputNameElement as HTMLInputElement).value
                    });
                    if (result.response && !result.error) {
                        console.log('Название категории успешно обновилось');
                        return this.openNewRoute('/income');
                    }
                    if (result.error || !result.response || (result.response && result.response.error)) {
                        return console.log('Название категории не удалось обновить. Попробуйте позже.');
                    }
                }
            }
        }
    }
}
