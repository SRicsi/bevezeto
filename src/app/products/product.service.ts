import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { AppService } from "../app.service";
import { Product } from "./product.model";

@Injectable()
export class ProductService {
    private products: Product[] = [];
    dataChanged = new Subject<Product[]>();
    productCount: number;
    private pageIndex = 0;
    private pageLimit = 5;
    private filterValue = '';

    constructor(private http: HttpClient, private authService: AuthService, private appService: AppService) { }

    fetchProducts() {
        const url = 'http://localhost:8000/products?userid=' + this.authService.getLoggedInUser().id
            + '&_start=' + this.pageIndex * this.pageLimit
            + '&_limit=' + this.pageLimit
            + '&name_like=' + this.filterValue;
        this.http.get(url, {observe: 'response'})
            .subscribe(
                (response => {
                    this.productCount = +response.headers.get('X-Total-Count');
                    this.products = <Product[]>response.body;
                    this.dataChanged.next(this.products);
                    this.appService.changeLoadingStatus(false);
                })
            )
    }

    getProduct(id: number): Product {
        for (let product of this.products) {
            if (product.id === id) {
                return product;
            }
        }
        return undefined;
    }

    refreshSearch(filterValue: string, index: number) {
        this.filterValue = filterValue;
        this.pageIndex = index;
        this.fetchProducts();
    }

    changePageData(pageIndex: number, pageLimit: number) {
        this.pageIndex = pageIndex;
        this.pageLimit = pageLimit;
        this.fetchProducts();
    }

    fetchProductWithHighestId() {
        return this.http.get('http://localhost:8000/products?_sort=id&_order=desc&_limit=1');
    }

    deleteProduct(id: number) {
        this.http.delete('http://localhost:8000/products/' + id)
            .subscribe(response => console.log(response));
        this.refreshSearch(this.filterValue, this.pageIndex);
    }

    addProduct(product: Product) {
        this.http.post('http://localhost:8000/products', product)
            .subscribe(response => console.log(response));
        this.refreshSearch(this.filterValue, this.pageIndex);
    }

    updateProduct(id: number, product: Product) {
        this.http.patch('http://localhost:8000/products/' + id, product)
            .subscribe(response => console.log(response));
        this.refreshSearch(this.filterValue, this.pageIndex);
    }
}