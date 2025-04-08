import {HttpUtils} from "../../utils/http-utils";
import {ErrorResponse} from "../../types/response.type";
import {IncomeResponse, IncomeResponseList} from "../../types/income-response.type";

export class IncomeList {

    readonly openNewRoute: Function;
    readonly confirmDeleteButton: HTMLElement | null;
    readonly cancelDeleteButton: HTMLElement | null;
    readonly modalDeleteElement: HTMLElement | null;


    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        this.confirmDeleteButton = document.getElementById('confirmDeleteButton') as HTMLButtonElement;
        this.cancelDeleteButton = document.getElementById('cancelDeleteButton') as HTMLButtonElement;
        this.modalDeleteElement = document.getElementById('modal-delete') as HTMLElement;

        this.init().then();

    }

    private async init(): Promise<void> {
        const incomes: ErrorResponse | IncomeResponse = await HttpUtils.request('/categories/income', 'GET', true);

        if ((incomes as ErrorResponse).error) {
            console.log((incomes as ErrorResponse).response.message);
            return (incomes as ErrorResponse).redirect
                ? this.openNewRoute((incomes as ErrorResponse).redirect)
                : console.log((incomes as ErrorResponse).response.message);
        }

        const incomesWrapper: HTMLElement | null = document.querySelector('.card-wrapper');

        (incomes as IncomeResponse).response.reverse();

        (incomes as IncomeResponse).response.forEach((income: IncomeResponseList) => {
            const cardWrapper: HTMLElement = document.createElement('div');
            cardWrapper.classList.add('card');

            const cardBody: HTMLElement = document.createElement('div');
            cardBody.classList.add('card-body');

            const cardTitle: HTMLElement = document.createElement('h5');
            cardTitle.classList.add('card-title');
            cardTitle.innerText = (income as IncomeResponseList).title;

            const editLink: HTMLAnchorElement = document.createElement('a');
            editLink.classList.add('btn', 'btn-primary');
            editLink.innerText = 'Редактировать';
            editLink.href = `/income/edit?id=${(income as IncomeResponseList).id}`;

            const deleteLink: HTMLElement | null = document.createElement('a');
            deleteLink.classList.add('btn', 'btn-danger', 'btn-delete');
            deleteLink.innerText = 'Удалить';


            deleteLink.addEventListener('click', (event: MouseEvent) => {
                event.preventDefault();
                if (this.modalDeleteElement && this.confirmDeleteButton) {
                    this.modalDeleteElement.classList.add('active');
                    (this.confirmDeleteButton as HTMLAnchorElement).href = `/income/delete?id=${(income as IncomeResponseList).id}`
                }
            });

            if (this.cancelDeleteButton) {
                this.cancelDeleteButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (this.modalDeleteElement) {
                        this.modalDeleteElement.classList.remove('active');
                    }
                });
            }

            cardBody.append(cardTitle);
            cardBody.append(editLink);
            cardBody.append(deleteLink);
            cardWrapper.append(cardBody);

            if (incomesWrapper) {
                incomesWrapper.prepend(cardWrapper);
            }
        });
    }
}