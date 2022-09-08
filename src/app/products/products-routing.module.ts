import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth-guard.service";
import { ProductEditComponent } from "./product-edit/product-edit.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductsComponent } from "./products.component";

const routes: Routes = [
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuard], children: [
        { path: '', component: ProductListComponent, pathMatch: 'full'},
        { path: 'new', component: ProductEditComponent},
        { path: ':id/edit', component: ProductEditComponent}
    ] },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule {}