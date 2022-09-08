import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth-guard.service";
import { LoginAuthGuard } from "./login-auth-guard.service";
import { LoginComponent } from "./auth/login/login.component";
import { UserAuthGuard } from "./user-auth-guard.service";
import { UsersComponent } from "./users/users.component";

const appRoutes: Routes = [
    { path: '', redirectTo: '/products', pathMatch: 'full'},
    { path: 'login', component: LoginComponent, canActivate: [LoginAuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard, UserAuthGuard] },
    { path: '**', redirectTo: '/products' }
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}