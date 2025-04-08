import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {DefaultErrorResponseType, LoginResponseType, SignUpResponseType} from "../../types/auth-response.type";

export class SignupPage {

    readonly openNewRoute: Function;
    readonly nameInputElement: HTMLInputElement | null | undefined;
    readonly emailInputElement: HTMLInputElement | null | undefined;
    readonly passwordInputElement: HTMLInputElement | null | undefined;
    readonly confirmPasswordInputElement: HTMLInputElement | null | undefined;
    readonly emailValidText: HTMLElement | null | undefined;
    readonly signupButtonElement: HTMLElement | null | undefined;
    private modal: HTMLElement | null | undefined;
    private modalText: HTMLElement | null | undefined;
    private modalBtn: HTMLElement | null | undefined;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getUserInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.nameInputElement = document.getElementById('name-form') as HTMLInputElement;
        this.emailInputElement = document.getElementById('email-form') as HTMLInputElement;
        this.passwordInputElement = document.getElementById('password-form') as HTMLInputElement;
        this.confirmPasswordInputElement = document.getElementById('confirm-password-form') as HTMLInputElement;
        this.emailValidText = document.getElementById('email-formFeedback') as HTMLInputElement;
        this.signupButtonElement = document.getElementById('signup-btn');

        if (this.signupButtonElement) {
            this.signupButtonElement.addEventListener('click', this.signup.bind(this));
        }
    }

    private async signup(): Promise<void> {

        let error: boolean = false;

        if (this.nameInputElement) {
            if (!this.nameInputElement.value.match(/^[А-Я]{1}[а-яё]+\s+[А-Я]{1}[а-яё]+\s*/)) {
                this.nameInputElement.classList.add('is-invalid');
                error = true;
            } else {
                this.nameInputElement.classList.remove('is-invalid');
                this.nameInputElement.classList.add('is-valid');
            }
        }
        if (this.emailInputElement) {
            if (!this.emailInputElement.value.match(/[a-zA-Z0-9_\.-]+@[a-zA-Z0-9_\.-]+\.[a-zA-Z0-9_\.-]+/)) {
                if (this.emailValidText) {
                    this.emailValidText.innerText = 'Введите корректный e-mail';
                }
                this.emailInputElement.classList.add('is-invalid');
                error = true;
            } else {
                this.emailInputElement.classList.remove('is-invalid');
                this.emailInputElement.classList.add('is-valid');
            }
        }
        if (this.passwordInputElement) {
            if (!this.passwordInputElement.value.match(/^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*[0-9]).{8,}/)) {
                this.passwordInputElement.classList.add('is-invalid');
                error = true;
            } else {
                this.passwordInputElement.classList.remove('is-invalid');
                this.passwordInputElement.classList.add('is-valid');
            }
        }
        if (this.confirmPasswordInputElement && this.passwordInputElement) {
            if (!this.confirmPasswordInputElement.value || this.confirmPasswordInputElement.value !== this.passwordInputElement.value) {
                this.confirmPasswordInputElement.classList.add('is-invalid');
                error = true;
            } else {
                this.confirmPasswordInputElement.classList.remove('is-invalid');
                this.confirmPasswordInputElement.classList.add('is-valid');
            }
        }

        if (!error) {

            const fullName: Array<string> = (this.nameInputElement as HTMLInputElement).value.split(' ');

            const name: string = fullName[0];
            const lastName: string = fullName[1];

            const resultSignUp: DefaultErrorResponseType | SignUpResponseType = await HttpUtils.request('/signup', 'POST', false, {
                name: name,
                lastName: lastName,
                email: (this.emailInputElement as HTMLInputElement).value,
                password: (this.passwordInputElement as HTMLInputElement).value,
                passwordRepeat: (this.confirmPasswordInputElement as HTMLInputElement).value
            });

            if (!resultSignUp.error && resultSignUp.response && (resultSignUp as SignUpResponseType).response.user && (resultSignUp as SignUpResponseType).response.user.id && (resultSignUp as SignUpResponseType).response.user.email && (resultSignUp as SignUpResponseType).response.user.name && (resultSignUp as SignUpResponseType).response.user.lastName) {
                const resultLogIn: LoginResponseType | DefaultErrorResponseType = await HttpUtils.request('/login', 'POST', false, {
                    email: (resultSignUp as SignUpResponseType).response.user.email,
                    password: (this.passwordInputElement as HTMLInputElement).value,
                    rememberMe: false
                });
                if (resultLogIn.response && (resultLogIn as LoginResponseType).response.tokens && (resultLogIn as LoginResponseType).response.tokens.accessToken && (resultLogIn as LoginResponseType).response.tokens.refreshToken && (resultLogIn as LoginResponseType).response.user) {
                    AuthUtils.setUserInfo((resultLogIn as LoginResponseType).response.tokens.accessToken, (resultLogIn as LoginResponseType).response.tokens.refreshToken, {
                        name: (resultLogIn as LoginResponseType).response.user.name,
                        lastName: (resultLogIn as LoginResponseType).response.user.lastName,
                        id: (resultLogIn as LoginResponseType).response.user.id
                    })
                }
            } else {
                if ((resultSignUp as DefaultErrorResponseType).response.error) {
                    this.modal = document.getElementById('custom-modal');
                    this.modalText = document.getElementById('modal-text');
                    this.modalBtn = document.getElementById('custom-modal-btn');

                    if (!lastName) {
                        if (this.modalText) {
                            this.modalText.innerHTML = `<p>Необходимо ввести Фамилию после имени в стоке ФИО</p>`;
                        }
                        if (this.modal) {
                            this.modal.style.display = 'flex';
                        }
                        if (this.nameInputElement) {
                            this.nameInputElement.classList.remove('is-valid');
                            this.nameInputElement.classList.add('is-invalid');
                        }

                        if (this.modalBtn) {
                            this.modalBtn.addEventListener('click', () => {
                                if (this.modal) {
                                    this.modal.style.display = 'none';
                                }
                            })
                        }
                        return;

                    } else if ((resultSignUp as DefaultErrorResponseType).response.message.toLowerCase() === 'user with given email already exist') {
                        if (this.modalText) {
                            this.modalText.innerHTML = `<p>Пользователь с таким e-mail уже существует</p>`;
                        }
                        if (this.emailValidText) {
                            this.emailValidText.innerText = 'Пользователь с таким e-mail уже существует';
                        }
                        if (this.emailInputElement) {
                            this.emailInputElement.classList.remove('is-valid');
                        }
                        if (this.emailInputElement) {
                            this.emailInputElement.classList.add('is-invalid');
                        }
                        if (this.modal) {
                            this.modal.style.display = 'flex';
                        }
                        if (this.modalBtn) {
                            this.modalBtn.addEventListener('click', () => {
                                if (this.modal) {
                                    this.modal.style.display = 'none';
                                }
                            })
                        }

                        return;
                    } else {
                        if (this.modalText) {
                            this.modalText.innerHTML = `<p>Произошла ошибка на сервере</p> <p>Обратитесь в тех.поддержку или попробуйте зарегистрироваться позже</p>`;
                        }
                        if (this.modal) {
                            this.modal.style.display = 'flex';
                        }
                        if (this.modalBtn) {
                            this.modalBtn.addEventListener('click', () => {
                                if (this.modal) {
                                    this.modal.style.display = 'none';
                                }
                            })
                        }
                        return;
                    }
                }
            }
            return this.openNewRoute('/');
        }
    }
}