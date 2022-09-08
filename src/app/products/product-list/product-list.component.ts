import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[];
  displayedColumns = ['id', 'name', 'price', 'description', 'creationDate', 'menu'];
  numberOfProducts: number;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 15];
  pageIndex: number = 0;
  private dataChangeSubscription: Subscription;
  private dialogSubscription: Subscription;

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router,
    private appService: AppService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.numberOfProducts = this.productService.productCount;
    this.productService.changePageData(this.pageIndex, this.pageSize);

    this.dataChangeSubscription = this.productService.dataChanged.subscribe(
      (data => {
        this.products = data;
        this.numberOfProducts = this.productService.productCount;
      })
    );
  }

  ngOnDestroy(): void {
    //this.dataChangeSubscription.unsubscribe();
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }

  refreshSearch = (name: string): void => {
    this.pageIndex = 0;
    this.productService.refreshSearch(name, 0);
  }

  onPageChange(pageEvent: PageEvent) {
    this.appService.changeLoadingStatus(true);
    setTimeout(() => {
      this.pageIndex = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
      this.productService.changePageData(this.pageIndex, this.pageSize);
    }, 600);
  }

  onCreate() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEdit(id: number) {
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  onDelete(id: number) {
    let selectToDelete = this.products.filter(product => product.id === id)[0];
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '40%',
      data: { product: selectToDelete },
    });
    this.dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
