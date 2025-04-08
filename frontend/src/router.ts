import {MainPage} from "./components/main-page";
import {LoginPage} from "./components/auth/login-page";
import {IncomeList} from "./components/incomes/income-list";
import {LogoutPage} from "./components/auth/logout-page";
import {SignupPage} from "./components/auth/signup-page";
import {AuthUtils} from "./utils/auth-utils";
import {HttpUtils} from "./utils/http-utils";
import {CheckAuthUtils} from "./utils/check-auth-utils";
import {ExpensesList} from "./components/expenses/expenses-list";
import {ExpensesEdit} from "./components/expenses/expenses-edit";
import {ExpensesDelete} from "./components/expenses/expenses-delete";
import {ExpensesCreate} from "./components/expenses/expenses-create";
import {IncomesCreate} from "./components/incomes/incomes-create";
import {IncomesEdit} from "./components/incomes/income-edit";
import {IncomeDelete} from "./components/incomes/incomes-delete";
import {OperationsList} from "./components/operations/operations-list";
import {OperationsCreate} from "./components/operations/operations-create";
import {OperationsEdit} from "./components/operations/operations-edit";
import {OperationsDelete} from "./components/operations/operations-delete";
import {RouterType} from "./types/router.type";
import {UserInfoType} from "./types/user-info.type";
import {BalanceResponseType} from "./types/balance-response.type";
import {ErrorResponse} from "./types/response.type";

export class Router {

    readonly contentPageElement: HTMLElement | null;
    readonly titlePageElement: HTMLElement | null;
    private route: RouterType[];
    private balanceSum: HTMLElement | null | undefined;
    private balanceSumInPopup: HTMLInputElement | null | undefined;
    private balancePopupWindow: HTMLElement | null | undefined;
    private balanceError: HTMLElement | null | undefined;
    private balance: number | null | undefined;


    constructor() {

        this.loadPageEvent();
        this.contentPageElement = document.getElementById('content');
        this.titlePageElement = document.getElementById('title');

        this.route = [
            {
                title: 'Главная страница',
                route: '/',
                filePathTemplate: '/templates/pages/main.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new MainPage(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Такой страницы нет',
                route: '/404',
                filePathTemplate: '/templates/pages/404.html',
            },
            {
                title: 'Страница авторизации',
                route: '/login',
                filePathTemplate: '/templates/pages/auth/login.html',
                load: () => {
                    new LoginPage(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Страница регистрации',
                route: '/signup',
                filePathTemplate: '/templates/pages/auth/signup.html',
                load: () => {
                    new SignupPage(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/logout',
                load: () => {
                    new LogoutPage(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Страница доходов',
                route: '/income',
                filePathTemplate: '/templates/pages/incomes/income.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new IncomeList(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Создание категории доходов',
                route: '/income/create',
                filePathTemplate: '/templates/pages/incomes/income-create.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new IncomesCreate(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Редактирование категории доходов',
                route: '/income/edit',
                filePathTemplate: '/templates/pages/incomes/income-edit.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new IncomesEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/delete',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new IncomeDelete(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Расходы',
                route: '/expenses',
                filePathTemplate: '/templates/pages/expenses/expenses.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new ExpensesList(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Создание категории расхода',
                route: '/expenses/create',
                filePathTemplate: '/templates/pages/expenses/expenses-create.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new ExpensesCreate(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Редактирование категории расхода',
                route: '/expenses/edit',
                filePathTemplate: '/templates/pages/expenses/expenses-edit.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new ExpensesEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses/delete',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new ExpensesDelete(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Доходы и расходы',
                route: '/operations',
                filePathTemplate: '/templates/pages/operations/operations.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new OperationsList(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Создание дохода/расхода',
                route: '/operations/create',
                filePathTemplate: '/templates/pages/operations/operations-create.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new OperationsCreate(this.openNewRoute.bind(this));
                },
            },
            {
                title: 'Редактирование дохода/расхода',
                route: '/operations/edit',
                filePathTemplate: '/templates/pages/operations/operations-edit.html',
                layout: '/templates/layout.html',
                load: () => {
                    new CheckAuthUtils(this.openNewRoute.bind(this));
                    new OperationsEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations/delete',
                load: () => {
                    new OperationsDelete(this.openNewRoute.bind(this));
                },
            },
        ];
    }

    private loadPageEvent(): void {
        window.addEventListener('DOMContentLoaded', this.openRoute.bind(this, null));
        window.addEventListener('popstate', this.openRoute.bind(this, null));
        document.addEventListener('click', this.clickTracking.bind(this));
    }


    // Не могу понять какой тип у event, MouseEvent не подходит, не уверен, что : Promise<void> возвращает
    private async clickTracking(event: any): Promise<void> {
        let link: HTMLAnchorElement | null = null;

        if (event) {
            if (event.target.tagName === 'A') {
                link = event.target;
            } else if (event.target.parentNode.tagName === 'A') {
                link = event.target.parentNode;
            }
        }

        if (link) {
            event.preventDefault();
            const url: string = link.href.replace(window.location.origin, '');
            const currentRoute: string = window.location.pathname;

            if (!url || url === '/#' || url.startsWith('javascript:void(0)') || currentRoute === url.replace('#', '')) {
                return;
            }

            await this.openNewRoute(url)
        }
    }

    private async openNewRoute(url: string): Promise<void> {
        const currentRoute: string = window.location.pathname

        history.pushState({}, '', url);

        // await this.openRoute(null, currentRoute);
        await this.openRoute(null, currentRoute);
    }

    private async openRoute(e: MouseEvent | null, oldRoute: any | null): Promise<void> {
    // private async openRoute(e: any | null): Promise<void> {
        const urlRoute: string = window.location.pathname;
        const currentRoute: RouterType | undefined = this.route.find((route: RouterType) => route.route === urlRoute);

        if (currentRoute) {

            if (this.titlePageElement) {
                this.titlePageElement.innerText = `${currentRoute.title} | Lumincoin Finance`;
            }

            if (currentRoute.layout) {
                if (this.contentPageElement) {
                    this.contentPageElement.innerHTML = await fetch(currentRoute.layout)
                        .then((response: Response) => response.text());
                }

                const contentWrapper: HTMLElement | null = document.getElementById('content-wrapper');
                if (contentWrapper && currentRoute.filePathTemplate) {
                    contentWrapper.innerHTML = await fetch(currentRoute.filePathTemplate)
                        .then((response: Response) => response.text());
                }

                const layoutElement: HTMLElement | null = document.getElementById('layout-wrapper');
                const burgerElement: HTMLElement | null = document.getElementById('burger');

                if (layoutElement && burgerElement) {
                    burgerElement.addEventListener('click', () => {
                        burgerElement.classList.toggle('active');
                        layoutElement.classList.toggle('show');
                    });
                }

                this.activateMenuLink(currentRoute);

                this.showCollapse();

                this.showBalance().then();

                const userInfo = AuthUtils.getUserInfo(AuthUtils.userInfoKey) as UserInfoType;

                if (!userInfo) {
                    AuthUtils.removeUserInfo();
                } else {
                    const layoutUserName: HTMLElement | null = document.querySelector('.layout-user-name');
                    if (layoutUserName) {
                        layoutUserName.innerText = `${userInfo.name} ${userInfo.lastName}`
                    }

                    const userLabelName: HTMLElement | null = document.getElementById('user-label');
                    const dropDownUserLabel: HTMLElement | null = document.getElementById('dropdown-logout');

                    if (userLabelName && dropDownUserLabel) {
                        userLabelName.addEventListener('click', () => {
                            dropDownUserLabel.classList.toggle('show');
                        });
                    }

                }
            } else {
                if (this.contentPageElement && currentRoute.filePathTemplate) {
                    this.contentPageElement.innerHTML = await fetch(currentRoute.filePathTemplate)
                        .then(response => response.text())
                }
            }

            if (currentRoute.load && typeof currentRoute.load === 'function') {
                currentRoute.load();
            }

        } else {
            history.pushState({}, '', '/404');
            await this.openRoute(null, null);
            // await this.openRoute('/404');
        }
    }

    private activateMenuLink(currentRoute: RouterType): void {
        const linksMenu: NodeListOf<HTMLElement> = document.querySelectorAll('.menu-links .nav-link');
        linksMenu.forEach((link: HTMLElement): void => {
            const href: string | null = link.getAttribute('href') as string;
            if (href) {
                if ((currentRoute.route.includes(href) && href !== '/') || (currentRoute.route === '/' && href === '/') || (window.location.pathname.startsWith('/operations') && href !== '/')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });

        const collapseMenu: NodeListOf<Element> = document.querySelectorAll('#dashboard-collapse .collapse-link');

        collapseMenu.forEach((link: Element) => {
            const href: string | null = link.getAttribute('href');
            if (href) {
                if ((currentRoute.route.includes(href) && href !== '/') || (currentRoute.route === '/' && href === '/')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    private showCollapse(): void {
        const collapseButton: HTMLElement | null = document.getElementById('collapse-button');
        const collapseDashboard: HTMLElement | null = document.getElementById('dashboard-collapse');
        if (collapseDashboard) {
            collapseDashboard.style.transition = 'all .25s';
        }
        let booleanToggleForArrow: boolean = true;

        const currentPath: string = window.location.href.replace(window.location.origin, '');
        if (currentPath.includes('/expenses') || currentPath.includes('/income')) {

            if (collapseButton) {
                collapseButton.setAttribute('aria-expanded', booleanToggleForArrow.toString());
            }

            if (collapseDashboard) {
                collapseDashboard.style.opacity = '1';
                collapseDashboard.style.display = 'block';
            }
        }

        if (collapseButton) {
            collapseButton.addEventListener('click', () => {
                collapseButton.setAttribute('aria-expanded', booleanToggleForArrow.toString());
                if (collapseDashboard) {
                    if (booleanToggleForArrow) {
                        collapseDashboard.style.opacity = '1';
                    } else {
                        collapseDashboard.style.opacity = '0';
                    }
                }
                booleanToggleForArrow = !booleanToggleForArrow;
            });
        }
    }

    private async showBalance(): Promise<void> {
        const result: BalanceResponseType | ErrorResponse = await HttpUtils.request('/balance');
        if (result.response && !result.redirect) {
            this.balance = Number((result as BalanceResponseType).response.balance);
            this.balanceSum = document.getElementById('layout-balance-sum');
            this.balanceSumInPopup = document.getElementById('balance-popup') as HTMLInputElement;
            if (this.balanceSumInPopup && this.balanceSum) {
                this.balanceSum.innerText = this.balance.toString();
                this.balanceSumInPopup.value = this.balance.toString();
            }
        } else {
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }
        }
        this.showBalancePopup();
    }


    // Работа с балансом
    private showBalancePopup(): void {
        this.balancePopupWindow = document.querySelector('.balance-popup') as HTMLElement;
        if (this.balanceSum) {
            this.balanceSum.addEventListener('click', () => {
                if (this.balancePopupWindow) {
                    this.balancePopupWindow.style.display = 'flex';
                }
            });
        }
        const balanceButtonElement: HTMLElement | null = document.getElementById('balance-btn');
        if (balanceButtonElement) {
            balanceButtonElement.addEventListener('click', this.changeBalance.bind(this));
        }
    }

    private validateBalance(): boolean {
        let result: boolean = true;
        this.balanceError = document.querySelector('.balance-popup-error') as HTMLElement;

        if ((this.balanceSumInPopup as HTMLInputElement).value) {
            this.balanceError.style.display = 'none';
        } else {
            this.balanceError.style.display = 'block';
            result = false;
        }
        return result;
    }

    private async changeBalance(): Promise<void> {
        if (this.validateBalance()) {
            if (+(this.balanceSumInPopup as HTMLInputElement).value !== this.balance) {
                const result: BalanceResponseType | ErrorResponse = await HttpUtils.request('/balance', 'PUT', true, {
                    newBalance: (this.balanceSumInPopup as HTMLInputElement).value
                });

                if (result.response && (result as BalanceResponseType).response.balance && !result.error && !(result as ErrorResponse).response.error) {
                    console.log('Баланс успешно обновился');
                    if (this.balanceSum) {
                        this.balanceSum.innerText = (result as BalanceResponseType).response.balance.toString();
                    }
                    // Перезаписываем this.balance, для того, чтобы постоянно не отправлялся PUT запрос, даже если баланс не изменялся
                    this.balance = (result as BalanceResponseType).response.balance;
                }

                if (result.response && result.error || (result.response && (result as ErrorResponse).response.error)) {
                    console.log('Баланс не получилось обновить, попробуйте позже');
                }
            }

            (this.balancePopupWindow as HTMLElement).style.display = 'none';
        }
    }

}