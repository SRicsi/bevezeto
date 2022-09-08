import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, OnDestroy {
  title: string;
  id: number;
  editMode: boolean;
  productForm: FormGroup;
  private urlParamsSubscription: Subscription;
  private dataFetchingSubscription: Subscription;

  constructor(private route: ActivatedRoute, private productService: ProductService,
    private router: Router, private authService: AuthService, private _snackbar: MatSnackBar, private appService: AppService) { }

  ngOnInit(): void {
    this.urlParamsSubscription = this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.title = params['id'] != null ? 'Termék Szerkesztése' : 'Termék Létrehozása';
          this.initForm();
        }
      )
  }

  ngOnDestroy(): void {
    this.urlParamsSubscription.unsubscribe();
    /* if (this.dataFetchingSubscription) {
      this.dataFetchingSubscription.unsubscribe();
    } // nem működik mert hamarabb törli mint hogy végbemenjen a HTTP kérés*/
  }

  private initForm() {
    let name: string;
    let price: number;
    let description: string;
    let creationDate = moment();

    if (this.editMode) {
      const product = this.productService.getProduct(this.id);
      if (!product) {
        this.router.navigate(['/products']);
      } else {
        name = product.name;
        price = product.price;
        description = product.description;
        creationDate = moment(product.creationDate, 'YYYY.MM.DD');
      }
    }

    this.productForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'price': new FormControl(price, Validators.required),
      'description': new FormControl(description, Validators.required),
      'creationDate': new FormControl(creationDate, Validators.required)
    });
    console.log(this.productForm);
    
  }

  onSubmit() {
    this.dataFetchingSubscription = this.productService.fetchProductWithHighestId().subscribe(
      response => {
        const product = <Product>response[0];
        let creationDate: Moment = this.productForm.value.creationDate;
        let newProduct = new Product(
          product.id + 1,
          this.productForm.value.name,
          this.productForm.value.price,
          this.productForm.value.description,
          creationDate.format('YYYY.MM.DD'),
          this.authService.getLoggedInUser().id
        );
        if (this.editMode) {
          this.productService.updateProduct(this.id, newProduct);
          this._snackbar.open('Termék sikeresen módosítva', '', { duration: 3000, panelClass: ['info-snackbar'] });
        } else {
          this.productService.addProduct(newProduct);
          this._snackbar.open('Új termék sikeresen felvéve', '', { duration: 3000, panelClass: ['info-snackbar'] });
        }
      }
    );
    this.router.navigate(['/products']);
  }

  onBack() {
    this.router.navigate(['/products']);
  }

}
