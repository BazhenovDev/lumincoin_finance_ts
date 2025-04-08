import {HttpUtils} from "../../utils/http-utils";
import {ErrorResponse, IncomeAndResponseResponse, IncomeAndExpenseResponseList} from "../../types/response.type";
import {OperationsBodyResponseType} from "../../types/operations-response.type";

export class OperationsCreate {

    readonly openNewRoute: Function;
    readonly formSelectTypeElement: HTMLElement | null;
    readonly formSelectCategoryElement: HTMLElement | null;
    readonly formAmountElement: HTMLElement | null;
    readonly formDateElement: HTMLElement | null;
    readonly formCommentElement: HTMLElement | null;
    readonly cancelButtonElement: HTMLElement | null;
    readonly createButtonElement: HTMLElement | null;

    constructor(openNewRoute: Function) {

        this.openNewRoute = openNewRoute;
        this.formSelectTypeElement = document.getElementById('form-select-type');
        this.formSelectCategoryElement = document.getElementById('form-select-category');
        this.formAmountElement = document.getElementById('amountInput');
        this.formDateElement = document.getElementById('dateInput');
        this.formCommentElement = document.getElementById('commentInput');
        this.cancelButtonElement = document.getElementById('cancel');
        this.createButtonElement = document.getElementById('create-operation');

        const url: URLSearchParams = new URLSearchParams(window.location.search);
        const category: string | null = url.get('category');

        if (category) {
            switch (category) {
                case 'income':
                    if (this.formSelectTypeElement) {
                        (this.formSelectTypeElement as HTMLSelectElement).selectedIndex = 0;
                    }
                    this.loadCategories().then();
                    break;
                case 'expense':
                    if (this.formSelectTypeElement) {
                        (this.formSelectTypeElement as HTMLSelectElement).selectedIndex = 1;
                    }
                    this.loadCategories().then();
                    break;
            }
        }

        if (this.cancelButtonElement) {
            this.cancelButtonElement.addEventListener('click', () => this.openNewRoute('/operations'));
        }

        if (this.createButtonElement) {
            this.createButtonElement.addEventListener('click', this.sendData.bind(this));
        }

        if (this.formSelectTypeElement) {
            this.formSelectTypeElement.addEventListener('change', this.loadCategories.bind(this));
        }
    }

    private validateForm(): boolean {
        let result: boolean = true;

        if (this.formAmountElement) {
            if ((this.formAmountElement as HTMLInputElement).value) {
                this.formAmountElement.classList.remove('is-invalid');
            } else {
                result = false;
                this.formAmountElement.classList.add('is-invalid');
            }
        }

        if (this.formDateElement) {
            if ((this.formDateElement as HTMLInputElement).value) {
                this.formDateElement.classList.remove('is-invalid');
            } else {
                result = false;
                this.formDateElement.classList.add('is-invalid');
            }
        }

        if (this.formCommentElement) {
            if ((this.formCommentElement as HTMLInputElement).value) {
                this.formCommentElement.classList.remove('is-invalid');
            } else {
                result = false;
                this.formCommentElement.classList.add('is-invalid');
            }
        }

        return result;
    }

    private async loadCategories(): Promise<void> {
        if (this.formSelectCategoryElement) {
            this.formSelectCategoryElement.innerHTML = '';
        }
        const response: IncomeAndResponseResponse | ErrorResponse = (this.formSelectTypeElement as HTMLSelectElement).selectedIndex === 0
            ? await HttpUtils.request('/categories/income')
            : await HttpUtils.request('/categories/expense');

        if (response.response && !response.error) {
            (response as IncomeAndResponseResponse).response.forEach((item: IncomeAndExpenseResponseList) => {
                const optionElement: HTMLOptionElement = document.createElement('option');
                optionElement.value = item.id.toString();
                optionElement.innerText = item.title;
                if (this.formSelectCategoryElement) {
                    this.formSelectCategoryElement.append(optionElement);
                }
            })
        } else {
            console.log('Произошла ошибка, не удалось получить категории');
        }
    }

    private async sendData(e: MouseEvent): Promise<void> {
        e.preventDefault();
        if (this.validateForm()) {
            const response: OperationsBodyResponseType | ErrorResponse = await HttpUtils.request('/operations', 'POST', true, {
                type: (this.formSelectTypeElement as HTMLInputElement).value,
                amount: +(this.formAmountElement as HTMLInputElement).value,
                date: (this.formDateElement as HTMLInputElement).value,
                comment: (this.formCommentElement as HTMLInputElement).value,
                category_id: +(this.formSelectCategoryElement as HTMLInputElement).value
            })
            if (response && !(response as ErrorResponse).error) {
                this.openNewRoute('/operations?period=today');
            } else {
                console.log(`Не удалось создать ${(this.formSelectTypeElement as HTMLSelectElement).value === 'income' ? 'Доход' : 'Расход'}`);
            }
        }

    }

}