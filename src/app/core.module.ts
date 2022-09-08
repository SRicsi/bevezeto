import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthGuard } from "./auth-guard.service";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { AuthService } from "./auth/auth.service";
import { LoginAuthGuard } from "./login-auth-guard.service";
import { ProductService } from "./products/product.service";
import { UserAuthGuard } from "./user-auth-guard.service";
import { UserService } from "./users/user.service";

@NgModule({
    providers: [
        ProductService,
        UserService,
        AuthService,
        AuthGuard,
        LoginAuthGuard,
        UserAuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }
    ]
    
})
export class CoreModule {}