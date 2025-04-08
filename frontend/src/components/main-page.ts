import {HttpUtils} from "../utils/http-utils";
import {
    OperationsForFilterResponseType,
    OperationsBodyResponseType,
    OperationsResponseType, OperationsResultForData
} from "../types/operations-response.type";
import {Chart} from "chart.js/auto";

export class MainPage {

    readonly openNewRoute: Function;
    readonly dateElements: HTMLElement | null;
    readonly dateFromElement: HTMLInputElement | null;
    readonly dateToElement: HTMLInputElement | null;
    readonly links: NodeListOf<Element> | null;
    readonly incomesChartElement: HTMLElement | null;
    readonly expenseChartElement: HTMLElement | null;

    constructor(openNewRoute: Function) {

        this.openNewRoute = openNewRoute;

        this.dateElements = document.getElementById('date-elements');
        this.dateFromElement = document.getElementById('date-from') as HTMLInputElement;
        this.dateToElement = document.getElementById('date-to') as HTMLInputElement;

        this.links = document.querySelectorAll('.nav-date .nav-link');
        this.incomesChartElement = document.getElementById('incomesChart');
        this.expenseChartElement = document.getElementById('expenseChart');
        this.navigate();
    }

    private navigate(): void {
        if (this.dateElements) {
            this.dateElements.style.display = 'none';
        }

        let dateFrom: string | null = sessionStorage.getItem('dateFrom');
        let dateTo: string | null = sessionStorage.getItem('dateTo');

        if (dateFrom) {
            if (this.dateFromElement) {
                this.dateFromElement.value = dateFrom;
            }
        }

        if (dateTo) {
            if (this.dateToElement) {
                this.dateToElement.value = dateTo;
            }
        }

        if (this.dateFromElement) {
            this.dateFromElement.addEventListener('change', () => {
                sessionStorage.setItem('dateFrom', (this.dateFromElement as HTMLInputElement).value);
                return this.getDataForChart(`interval&dateFrom=${(this.dateFromElement as HTMLInputElement).value}&dateTo=${(this.dateToElement as HTMLInputElement).value}`).then();
            });
        }

        if (this.dateToElement) {
            this.dateToElement.addEventListener('change', () => {
                sessionStorage.setItem('dateTo', (this.dateToElement as HTMLInputElement).value);
                return this.getDataForChart(`interval&dateFrom=${(this.dateFromElement as HTMLInputElement).value}&dateTo=${(this.dateToElement as HTMLInputElement).value}`).then();
            });
        }

        this.getDataForChart('today').then();
        if (this.links) {
            this.links[0].classList.add('active');
            this.links[0].classList.add('disabled');

            this.links.forEach((activeLink: Element) => {
                activeLink.addEventListener('click', () => {
                    (this.links as NodeListOf<Element>).forEach((links: Element) => {
                        links.classList.remove('active');
                        links.classList.remove('disabled');
                    });
                    switch (activeLink.id) {
                        case 'today':
                            if (this.dateElements) {
                                this.dateElements.style.display = 'none';
                            }
                            activeLink.classList.add('disabled');
                            activeLink.classList.add('active');
                            this.getDataForChart('today').then();
                            break;
                        case 'week':
                            if (this.dateElements) {
                                this.dateElements.style.display = 'none';
                            }
                            activeLink.classList.add('disabled');
                            activeLink.classList.add('active');
                            this.getDataForChart('week').then();
                            break;
                        case 'month':
                            if (this.dateElements) {
                                this.dateElements.style.display = 'none';
                            }
                            activeLink.classList.add('disabled');
                            activeLink.classList.add('active');
                            this.getDataForChart('month').then();
                            break;
                        case 'all':
                            if (this.dateElements) {
                                this.dateElements.style.display = 'none';
                            }
                            activeLink.classList.add('disabled');
                            activeLink.classList.add('active');
                            this.getDataForChart('all').then();
                            break;
                        case 'period-interval':
                            activeLink.classList.add('disabled');
                            activeLink.classList.add('active');
                            if (this.dateElements) {
                                this.dateElements.style.display = 'block';
                            }
                            this.getDataForChart(`interval&dateFrom=${(this.dateFromElement as HTMLInputElement).value}&dateTo=${(this.dateToElement as HTMLInputElement).value}`).then();
                            break;
                        default:
                            break;
                    }
                });
            });
        }


    }

    private async getDataForChart(period: string): Promise<void> {
        const result: OperationsResponseType = await HttpUtils.request(`/operations?period=${period}`);

        if (result.response && !result.error) {

            const incomeArray: OperationsForFilterResponseType = result.response.filter((item: OperationsBodyResponseType): boolean => item.type === 'income');
            const expenseArray: OperationsForFilterResponseType = result.response.filter((item: OperationsBodyResponseType): boolean => item.type === 'expense');

            if (incomeArray) {
                let chartStatus: any = Chart.getChart('incomesChart');
                if (chartStatus) {
                    chartStatus.destroy();
                }

                const incomeNames: Array<string> = []
                incomeArray.forEach((item: OperationsBodyResponseType) => incomeNames.push(item.category));
                const uniqueNamesIncome: Array<string> = Array.from(new Set(incomeNames));

                const labelsCategoryIncome: Array<string> = [];
                const datasetsDataIncome: Array<number> = [];

                uniqueNamesIncome.forEach((name: string) => {
                    this.createDataForChart(name, incomeArray, labelsCategoryIncome, datasetsDataIncome)
                })


                const config: any = {
                    type: 'pie',
                    data: {
                        labels: labelsCategoryIncome,
                        datasets: [{
                            data: datasetsDataIncome,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        color: 'black',
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    font: {
                                        size: 12,
                                        family: 'RobotoMedium',
                                    },
                                    boxWidth: 35,
                                },
                            },
                            title: {
                                display: true,
                                text: 'Доходы',
                                color: '#290661',
                                font: {
                                    size: 28,
                                    family: 'RobotoMedium'
                                }
                            },
                        },
                    },
                }

                    new Chart((this.incomesChartElement as HTMLCanvasElement), config);
            }

            if (expenseArray) {
                let chartStatus: any = Chart.getChart('expenseChart');
                if (chartStatus) {
                    chartStatus.destroy();
                }

                const expenseNames: Array<string> = []
                expenseArray.forEach((item: OperationsBodyResponseType) => expenseNames.push(item.category));
                const uniqueNamesExpense: string[] = Array.from(new Set(expenseNames));

                const labelsCategoryExpense: Array<string> = [];
                const datasetsDataExpense: Array<number> = [];

                uniqueNamesExpense.forEach(name => {
                    this.createDataForChart(name, expenseArray, labelsCategoryExpense, datasetsDataExpense)
                })

                const config: any = {
                    type: 'pie',
                    data: {
                        labels: labelsCategoryExpense,
                        datasets: [{
                            data: datasetsDataExpense,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        color: 'black',
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    font: {
                                        size: 12,
                                        family: 'RobotoMedium',
                                    },
                                    boxWidth: 35,
                                },
                            },
                            title: {
                                display: true,
                                text: 'Расходы',
                                color: '#290661',
                                font: {
                                    size: 28,
                                    family: 'RobotoMedium'
                                }
                            },
                        },
                    },
                }

                new Chart((this.expenseChartElement as HTMLCanvasElement), config);
            }


        } else {
            console.log('Не удалось получить данные по доходам и расходам')
        }
    }

    private createDataForChart(name: string, array: Array<OperationsBodyResponseType>, label: string[], data: number[]): void {
        const res: Array<OperationsBodyResponseType> = array.filter((item: OperationsBodyResponseType) => {
            return item.category === name
        });
        const sum: number = res.reduce((acc: number, item: OperationsBodyResponseType) => {
            return acc += item.amount
        }, 0)
        const result: OperationsResultForData = res.map((item: OperationsBodyResponseType): {category: string, amount: number} => {
            return {
                category: item.category,
                amount: sum
            }
        })
        label.push(result[0].category)
        data.push(result[0].amount)
    }
}