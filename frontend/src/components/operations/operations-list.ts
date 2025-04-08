import {HttpUtils} from "../../utils/http-utils";
import {
    OperationsBodyResponseType,
    OperationsForFilterResponseType,
    OperationsResponseType
} from "../../types/operations-response.type";
import {ErrorResponse} from "../../types/response.type";

export class OperationsList {

    readonly openNewRoute: Function;
    readonly tableBodyElement: HTMLElement | null;
    readonly links: NodeListOf<HTMLElement> | null;
    readonly dateElements: HTMLElement | null;
    readonly confirmDeleteButton: HTMLElement | null;
    readonly cancelDeleteButton: HTMLElement | null;
    readonly modalDeleteElement: HTMLElement | null;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        this.tableBodyElement = document.getElementById('table-body');
        this.links = document.querySelectorAll('.nav-date .nav-link');
        this.dateElements = document.getElementById('date-elements');

        this.confirmDeleteButton = document.getElementById('confirmDeleteButton');
        this.cancelDeleteButton = document.getElementById('cancelDeleteButton');
        this.modalDeleteElement = document.getElementById('modal-delete');

        this.navigation();
    }

    private navigation(): void {
        if (this.dateElements) {
            this.dateElements.style.opacity = '0';
        }

        const dateFrom: HTMLElement | null = document.getElementById('date-from');
        const dateTo: HTMLElement | null = document.getElementById('date-to');

        if (dateFrom) {
            dateFrom.addEventListener('change', () => {
                sessionStorage.setItem('dateFrom', (dateFrom as HTMLInputElement).value);
                if (this.tableBodyElement) {
                    this.tableBodyElement.innerHTML = '';
                }
                return this.getOperations(`/operations?period=interval&dateFrom=${(dateFrom as HTMLInputElement).value}&dateTo=${(dateTo as HTMLInputElement).value}`).then();
            });

            const getDateFrom: string | null = sessionStorage.getItem('dateFrom')

            if (getDateFrom) {
                (dateFrom as HTMLInputElement).value = getDateFrom
            }


        }

        if (dateTo) {
            dateTo.addEventListener('change', () => {
                sessionStorage.setItem('dateTo', (dateTo as HTMLInputElement).value);
                if (this.tableBodyElement) {
                    this.tableBodyElement.innerHTML = '';
                }
                return this.getOperations(`/operations?period=interval&dateFrom=${(dateFrom as HTMLInputElement).value}&dateTo=${(dateTo as HTMLInputElement).value}`).then();
            });

            const getDateTo: string | null = sessionStorage.getItem('dateTo')

            if (getDateTo) {
                (dateTo as HTMLInputElement).value = getDateTo
            }
        }

        const dateFromItem: string | null = sessionStorage.getItem('dateFrom');
        const dateToItem: string | null = sessionStorage.getItem('dateTo');
        const pathname: string | null = window.location.href.replace(window.location.origin, '');


        this.links!.forEach((activeLink: HTMLElement) => {
            activeLink.addEventListener('click', () => {
                activeLink.classList.remove('active');
                activeLink.classList.remove('disabled');
            });

            let linkPathname: string | null = (activeLink as HTMLAnchorElement).href.replace(window.location.origin, '');
            if (pathname === linkPathname) {
                activeLink.classList.add('disabled');
                activeLink.classList.add('active');
                this.getOperations(linkPathname).then();
                if (pathname.includes('period=interval')) {
                    if (this.dateElements) {
                        this.dateElements.style.opacity = '1';
                    }
                    let url = new URL(window.location.href);
                    if (dateFromItem) {
                        url.searchParams.append('dateFrom', dateFromItem);
                    }
                    if (dateToItem) {
                        url.searchParams.append('dateTo', dateToItem);
                    }
                    linkPathname = url.href.replace(window.location.origin, '');
                    console.log(linkPathname)
                    this.getOperations(linkPathname).then();
                    return;
                }
            }
        });
    }

    private async getOperations(url: string): Promise<void> {
        const response: OperationsResponseType | ErrorResponse = await HttpUtils.request(url);

        if (response.redirect) {
           this.openNewRoute(response.redirect);
           return;
        }

        if (response.response && !response.error) {
            this.printTable((response as OperationsResponseType).response);
        } else {
            console.log('Произошла ошибка запроса доходов и расходов. Обратитесь в поддержку');
        }
    }

    private printTable(operations: OperationsForFilterResponseType): void {
        if (this.tableBodyElement) {
            this.tableBodyElement.innerHTML = '';
        }

        if (operations && operations.length > 0) {
            operations.sort((a: OperationsBodyResponseType, b: OperationsBodyResponseType): number => a.id - b.id);

            operations.forEach((operation: OperationsBodyResponseType): void => {
                const trElement: HTMLTableRowElement = document.createElement('tr');

                const tdIdOperationElement: HTMLTableCellElement = document.createElement('td');
                tdIdOperationElement.classList.add('table-number');
                tdIdOperationElement.setAttribute('data-label', '№ операции:');
                if (tdIdOperationElement) {
                    tdIdOperationElement.innerText = operation.id.toString();
                }

                const tdTypeOperationElement: HTMLTableCellElement = document.createElement('td');
                tdTypeOperationElement.classList.add('table-label');
                tdTypeOperationElement.setAttribute('data-label', 'Тип:');
                const type: string = operation.type;
                switch (type) {
                    case 'expense':
                        tdTypeOperationElement.classList.add('table-expenses');
                        tdTypeOperationElement.innerText = 'Расход';
                        break;
                    case 'income':
                        tdTypeOperationElement.classList.add('table-income');
                        tdTypeOperationElement.innerText = 'Доход';
                        break;
                    default:
                        tdTypeOperationElement.innerText = 'Неизвестно'
                        break;
                }

                const tdCategoryOperationElement: HTMLTableCellElement = document.createElement('td');
                tdCategoryOperationElement.classList.add('table-label');
                tdCategoryOperationElement.setAttribute('data-label', 'Категория:');
                tdCategoryOperationElement.innerText = operation.category;

                const tdAmountOperationElement: HTMLTableCellElement = document.createElement('td');
                tdAmountOperationElement.classList.add('table-label');
                tdAmountOperationElement.setAttribute('data-label', 'Сумма:');
                tdAmountOperationElement.innerText = `${operation.amount} $`;

                const tdDateOperationElement: HTMLTableCellElement = document.createElement('td');
                tdDateOperationElement.classList.add('table-label');
                tdDateOperationElement.setAttribute('data-label', 'Дата:');
                const date = operation.date.split('-');
                const dateToUTC = new Date(Date.UTC(+date[0], +date[1] - 1, +date[2]));
                tdDateOperationElement.innerText = dateToUTC.toLocaleDateString('ru-RU');

                const tdCommentOperationElement: HTMLTableCellElement = document.createElement('td');
                tdCommentOperationElement.classList.add('table-label');
                tdCommentOperationElement.setAttribute('data-label', 'Комментарий:');
                tdCommentOperationElement.innerText = operation.comment;

                const tdToolsOperationElement: HTMLTableCellElement = document.createElement('td');
                tdToolsOperationElement.classList.add('table-icons');

                const tdToolDeleteOperationElement: HTMLAnchorElement = document.createElement('a');
                tdToolDeleteOperationElement.classList.add('table-icon');
                tdToolDeleteOperationElement.href = `javascript:void(0)`;
                tdToolDeleteOperationElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>`

                const tdToolEditOperationElement: HTMLAnchorElement = document.createElement('a');
                tdToolEditOperationElement.classList.add('table-icon');
                tdToolEditOperationElement.href = `operations/edit?id=${operation.id}`
                tdToolEditOperationElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                </svg>`

                tdToolDeleteOperationElement.addEventListener('click', (event: MouseEvent) => {
                    event.preventDefault();
                    if (this.confirmDeleteButton) {
                        (this.confirmDeleteButton as HTMLAnchorElement).href = `/operations/delete?id=${operation.id}`;
                    }
                    if (this.modalDeleteElement) {
                        this.modalDeleteElement.classList.add('active');
                    }
                })

                if (this.cancelDeleteButton) {
                    this.cancelDeleteButton.addEventListener('click', (event: MouseEvent) => {
                        event.preventDefault();
                        if (this.modalDeleteElement) {
                            this.modalDeleteElement.classList.remove('active');
                        }
                    })
                }

                tdToolsOperationElement.append(tdToolDeleteOperationElement, tdToolEditOperationElement)

                trElement.append(tdIdOperationElement, tdTypeOperationElement, tdCategoryOperationElement, tdAmountOperationElement, tdDateOperationElement, tdCommentOperationElement, tdToolsOperationElement);
                if (this.tableBodyElement) {
                    this.tableBodyElement.append(trElement);
                }
            })
        }
    }
}