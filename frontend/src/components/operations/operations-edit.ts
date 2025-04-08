import {HttpUtils} from "../../utils/http-utils";
import {
    OperationsResponseById
} from "../../types/operations-response.type";
import {ErrorResponse, IncomeAndResponseResponse} from "../../types/response.type";
import {ExpenseDefaultResponseType, ExpenseListResponseType} from "../../types/expenses-response.type";
import {IncomeResponse, IncomeResponseList} from "../../types/income-response.type";

export class OperationsEdit {

    readonly openNewRoute: Function;
    readonly formSelectTypeElement: HTMLElement | null;
    readonly formSelectCategoryElement: HTMLElement | null;
    readonly formAmountElement: HTMLElement | null;
    readonly formDateElement: HTMLElement | null;
    readonly formCommentElement: HTMLElement | null;
    readonly id: string | null;
    readonly cancelButtonElement: HTMLElement | null;
    readonly createButtonElement: HTMLElement | null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;
        this.formSelectTypeElement = document.getElementById('form-select-type') as HTMLSelectElement;
        this.formSelectCategoryElement = document.getElementById('form-select-category');
        this.formAmountElement = document.getElementById('amountInput');
        this.formDateElement = document.getElementById('dateInput');
        this.formCommentElement = document.getElementById('commentInput');
        this.cancelButtonElement = document.getElementById('cancel');
        this.createButtonElement = document.getElementById('create-operation');

        const url: URLSearchParams = new URLSearchParams(window.location.search)
        this.id = url.get('id')

        if (!this.id || isNaN(+this.id)) {
            this.openNewRoute('/operations');
        }

        this.getOperation().then();

        if (this.cancelButtonElement) {
            this.cancelButtonElement.addEventListener('click', () => this.openNewRoute('/operations'));
        }
        if (this.createButtonElement) {
            this.createButtonElement.addEventListener('click', this.updateData.bind(this));
        }
        if (this.formSelectTypeElement) {
            this.formSelectTypeElement.addEventListener('change', this.loadCategories.bind(this));
        }
    }

    private async getOperation(): Promise<void> {
        const response: OperationsResponseById | ErrorResponse = await HttpUtils.request(`/operations/${this.id}`);
        if (response.response && !response.error) {

            for (let i: number = 0; i < (this.formSelectTypeElement as HTMLSelectElement).options.length; i++) {
                if ((this.formSelectTypeElement as HTMLSelectElement).options[i].value === (response as OperationsResponseById).response.type) {
                    (this.formSelectTypeElement as HTMLSelectElement).selectedIndex = i;
                    this.getCategories((this.formSelectTypeElement as HTMLSelectElement).value, (response as OperationsResponseById).response.category).then();
                }
            }

            if (this.formAmountElement) {
                (this.formAmountElement as HTMLInputElement).value = (response as OperationsResponseById).response.amount.toString();
            }

            if (this.formDateElement) {
                (this.formDateElement as HTMLInputElement).value = (response as OperationsResponseById).response.date;
            }

            if (this.formCommentElement) {
                (this.formCommentElement as HTMLInputElement).value = (response as OperationsResponseById).response.comment;
            }

        }
    }

    private async getCategories(type: string, category: string): Promise<void> {
        if (type) {
            const response: IncomeAndResponseResponse | ErrorResponse = await HttpUtils.request(`/categories/${type}`);
            if (response.response && !response.error) {
                (response as IncomeAndResponseResponse).response.forEach((category: ExpenseDefaultResponseType) => {
                    const formOptionElement: HTMLOptionElement = document.createElement('option');
                    formOptionElement.innerText = category.title;
                    formOptionElement.value = category.id.toString();
                    if (this.formSelectCategoryElement) {
                        this.formSelectCategoryElement.append(formOptionElement);
                    }
                });
            }
            for (let i: number = 0; i < (this.formSelectCategoryElement as HTMLSelectElement).options.length; i++) {
                if ((this.formSelectCategoryElement as HTMLSelectElement)[i].innerText === category) {
                    (this.formSelectCategoryElement as HTMLSelectElement).selectedIndex = i;
                }
            }
        }
    }

    private async loadCategories(): Promise<void> {
        if ((this.formSelectTypeElement as HTMLSelectElement).selectedIndex === 0) {
            if (this.formSelectCategoryElement) {
                this.formSelectCategoryElement.innerHTML = '';
            }
            const responseIncome: IncomeResponse | ErrorResponse = await HttpUtils.request('/categories/income');

            if (responseIncome.response && !responseIncome.error) {
                (responseIncome as IncomeResponse).response.forEach((income: IncomeResponseList) => {
                    const optionElement: HTMLOptionElement = document.createElement('option');
                    optionElement.value = income.id.toString();
                    optionElement.innerText = income.title;
                    if (this.formSelectCategoryElement) {
                        this.formSelectCategoryElement.append(optionElement);
                    }
                })
            } else {
                console.log('Произошла ошибка, не удалось получить категории');
            }
        } else if ((this.formSelectTypeElement as HTMLSelectElement).selectedIndex === 1) {
            if (this.formSelectCategoryElement) {
                this.formSelectCategoryElement.innerHTML = '';
            }
            const responseExpense: ExpenseListResponseType | ErrorResponse = await HttpUtils.request('/categories/expense');

            if (responseExpense.response && !responseExpense.error) {
                (responseExpense as ExpenseListResponseType).response.forEach((expense: ExpenseDefaultResponseType) => {
                    const optionElement: HTMLOptionElement = document.createElement('option');
                    optionElement.value = expense.id.toString();
                    optionElement.innerText = expense.title;
                    if (this.formSelectCategoryElement) {
                        this.formSelectCategoryElement.append(optionElement);
                    }
                })
            } else {
                console.log('Произошла ошибка, не удалось получить категории');
            }
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

    async updateData(e: MouseEvent): Promise<void> {
        e.preventDefault();

        interface newDataType {
            type: string;
            category_id: number;
            amount: number;
            date: string;
            comment: string;
        }

        const newData = {} as newDataType
        if (this.validateForm()) {
            newData.type = (this.formSelectTypeElement as HTMLSelectElement).value;
            newData['category_id'] = +(this.formSelectCategoryElement as HTMLSelectElement).value;
            newData.amount = +(this.formAmountElement as HTMLInputElement).value;
            newData.date = (this.formDateElement as HTMLInputElement).value
            newData.comment = (this.formCommentElement as HTMLInputElement).value
        }

        if (Object.keys(newData).length > 0) {
            const response = await HttpUtils.request(`/operations/${this.id}`, 'PUT', true, newData);
            if (response.response && !response.error) {
                this.openNewRoute('/operations')
            } else {
                console.log(`Не удалось произвести изменение ${newData.type === 'income' ? 'дохода' : 'расхода'}, обратитесь в поддержку`);
            }
        }

    }

}