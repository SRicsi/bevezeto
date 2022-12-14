import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.authService.getLoggedInUser();
        if (!user) {
            return next.handle(req);
        }
        const modifiedReq = req.clone({
            headers: new HttpHeaders().set('Authorization', 'Bearer ' + user.token)
        })
        return next.handle(modifiedReq);
    }

}