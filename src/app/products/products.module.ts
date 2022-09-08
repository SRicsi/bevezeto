import { NgModule } from "@angular/core";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "../shared/shared.module";
import { ProductEditComponent } from "./product-edit/product-edit.component";
import { DeleteDialogComponent } from "./product-list/delete-dialog/delete-dialog.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductsRoutingModule } from "./products-routing.module";
import { ProductsComponent } from "./products.component";

@NgModule({
    declarations: [
        ProductsComponent,
        ProductEditComponent,
        ProductListComponent,
        DeleteDialogComponent
    ],
    imports: [
        SharedModule,
        MatDatepickerModule,
        MatMomentDateModule,
        ProductsRoutingModule,
        MatDialogModule
    ],
    exports: [
        ProductsRoutingModule
    ]
})
export class ProductsModule {}