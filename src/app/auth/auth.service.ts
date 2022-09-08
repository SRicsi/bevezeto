import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { sha512 } from "js-sha512";
import { Subject, tap } from "rxjs";
import { AuthUser } from "./auth-user.component";

interface LoginResponse {
    access_token: string;
    id: number;
    name: string;
    email: string;
    permissions: [];
}

@Injectable()
export class AuthService {
    private user: AuthUser;
    userChanged = new Subject<AuthUser>();

    constructor(private http: HttpClient) { }

    getLoggedInUser() {
        return this.user;
    }

    isAuthenticated() {
        const promise = new Promise(
            (resolve, reject) => {
                setTimeout(() => {
                    resolve(this.user);
                }, 100);
            }
        );
        return promise;
    }

    login(email: string, password: string) {
        return this.http.post('http://localhost:8000/auth/login', {
            email: email,
            password: sha512(password)
        }).pipe(tap(response => {
            const expirationDate = new Date(new Date().getTime() + 300 * 1000);
            const loginResponse = (<LoginResponse>response);
            this.user = new AuthUser(
                loginResponse.id,
                loginResponse.name,
                email,
                loginResponse.permissions,
                loginResponse.access_token,
                expirationDate
            );
            localStorage.setItem('userData', JSON.stringify(this.user));
            this.autoLogout(300 * 1000);
            this.userChanged.next(this.user);
        }));
    }

    autoLogin() {
        let userData: {
            email: string,
            id: number,
            name: string,
            permissions: [],
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return false;
        }
        this.user = new AuthUser(
            userData.id,
            userData.name,
            userData.email,
            userData.permissions,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );
        if (this.user.token) {
            let now = new Date().getTime();
            let expirationDate = this.user.expirationDate.getTime();
            this.autoLogout(expirationDate - now);
            this.userChanged.next(this.user);
            return true;
        }
        return false;
    }

    logOut() {
        this.user = undefined;
        localStorage.removeItem('userData');
        this.userChanged.next(undefined);
    }

    autoLogout(expirationDate: number) {
        setTimeout(() => {
            this.logOut();
        }, expirationDate)
    }
}