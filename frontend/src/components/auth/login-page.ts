import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {LoginResponseType} from "../../types/auth-response.type";

export class LoginPage {

    readonly openNewRoute: Function;

    // Почему-то если не добавить undefined, то будет ошибка
    readonly emailInputElement: HTMLInputElement | null | undefined;
    readonly passwordInputElement: HTMLInputElement | null | undefined;
    private rememberMeElement: HTMLElement | null | undefined;
    readonly loginButtonElement: HTMLElement | null | undefined;

    constructor(openNewRoute: Function) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getUserInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.emailInputElement = document.getElementById('email-form') as HTMLInputElement;
        this.passwordInputElement = document.getElementById('password-form') as HTMLInputElement;
        this.rememberMeElement = document.getElementById('remember-me') as HTMLInputElement;
        this.loginButtonElement = document.getElementById('login-btn');

        if (this.loginButtonElement) {
            this.loginButtonElement.addEventListener('click', this.login.bind(this));
        }
    }

    private async login(): Promise<void> {

        let error: boolean = false;
        if (this.emailInputElement) {
            if (!this.emailInputElement.value.match(/^\S+@\S+\.\S+$/)) {
                error = true;
                this.emailInputElement.classList.add('is-invalid');
            } else {
                this.emailInputElement.classList.remove('is-invalid');
                this.emailInputElement.classList.add('is-valid');
            }
        }

        if (this.passwordInputElement) {
            if (this.passwordInputElement.value.length < 6) {
                error = true;
                this.passwordInputElement.classList.add('is-invalid');
            } else {
                this.passwordInputElement.classList.remove('is-invalid');
                this.passwordInputElement.classList.add('is-valid');
            }
        }

        let result: LoginResponseType | null = null;

        if (!error) {
            result = await HttpUtils.request('/login', 'POST', false, {
                email: (this.emailInputElement as HTMLInputElement).value,
                password: (this.passwordInputElement as HTMLInputElement).value,
                rememberMe: (this.rememberMeElement as HTMLInputElement).checked
            }) as LoginResponseType;
        }

        if (result && result.response.tokens && result.response.user) {
            AuthUtils.setUserInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                name: result.response.user.name,
                lastName: result.response.user.lastName,
                id: result.response.user.id
            })
            return this.openNewRoute('/');
        }

        if (result && result.error && result.response.message) {
            const modalText: HTMLElement | null = document.getElementById('modal-text');

            if (modalText) {
                result.response.message.toLowerCase() === "invalid email or password"
                    ? modalText.innerHTML = `<p>Вы ввели неверный пароль</p>`
                    : modalText.innerHTML = `<p>Пользователь с таким e-mail не найден</p>`
            }

            const customModal: HTMLElement | null = document.getElementById('custom-modal');
            const customModalButton: HTMLElement | null = document.getElementById('custom-modal-btn');

            if (customModal) {
                customModal.style.display = 'flex';
                if (customModalButton) {
                    customModalButton.addEventListener('click', () => {
                        customModal.style.display = 'none';
                    });
                }
            }
        }
    }
}