import {HttpUtils} from "../../utils/http-utils";
import {
    ExpenseDefaultResponseType,
    ExpenseListResponseType
} from "../../types/expenses-response.type";
import {ErrorResponse} from "../../types/response.type";
import {OpenNewRouteType} from "../../types/opennewroute.type";

export class ExpensesList {

    readonly openNewRoute: OpenNewRouteType;
    readonly confirmDeleteButton: HTMLElement | null;
    readonly cancelDeleteButton: HTMLElement | null;
    readonly modalDeleteElement: HTMLElement | null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        this.confirmDeleteButton = document.getElementById('confirmDeleteButton');
        this.cancelDeleteButton = document.getElementById('cancelDeleteButton');
        this.modalDeleteElement = document.getElementById('modal-delete');

        this.createExpenses().then();

    }

    async createExpenses(): Promise<void> {
        const expenses: ExpenseListResponseType | ErrorResponse = await HttpUtils.request('/categories/expense', 'GET', true);

        if (expenses.error) {
            console.log((expenses as ErrorResponse).response.message);
            expenses.redirect ? this.openNewRoute(expenses.redirect) : null;
            return;
        }

        const expensesWrapper: HTMLElement | null = document.querySelector('.card-wrapper');

        (expenses as ExpenseListResponseType).response.reverse();

        (expenses as ExpenseListResponseType).response.forEach((expense: ExpenseDefaultResponseType) => {
            const cardWrapper: HTMLElement | null = document.createElement('div');
            cardWrapper.classList.add('card');

            const cardBody: HTMLElement | null = document.createElement('div');
            cardBody.classList.add('card-body');

            const cardTitle: HTMLElement | null = document.createElement('h5');
            cardTitle.classList.add('card-title');
            cardTitle.innerText = expense.title;

            const editLink: HTMLAnchorElement | null = document.createElement('a');
            editLink.classList.add('btn', 'btn-primary');
            editLink.innerText = 'Редактировать';
            editLink.href = `/expenses/edit?id=${expense.id}`;

            const deleteLink: HTMLAnchorElement | null = document.createElement('a');
            deleteLink.classList.add('btn', 'btn-danger', 'btn-delete');
            deleteLink.innerText = 'Удалить';

            deleteLink.addEventListener('click', (event: MouseEvent) => {
                event.preventDefault();
                if (this.modalDeleteElement) {
                    this.modalDeleteElement.classList.add('active');
                }
                if (this.cancelDeleteButton) {
                    (this.confirmDeleteButton as HTMLAnchorElement).href = `/expenses/delete?id=${expense.id}`
                }
            });

            if (this.cancelDeleteButton) {
                this.cancelDeleteButton.addEventListener('click', (event: MouseEvent) => {
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

            if (expensesWrapper) {
                expensesWrapper.prepend(cardWrapper);
            }

        });
    }
}