import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { User } from "./users/user.model";

@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | Observable<boolean> | Promise<boolean> {
            return this.authService.isAuthenticated()
            .then(
                (authenticatedUser: User) => {
                    if (authenticatedUser && !authenticatedUser.permissions.includes('ADMIN')) {
                        this.router.navigate(['/products']);
                        return false;
                    } else {
                        return true;
                    }
                }
            )
    }
}