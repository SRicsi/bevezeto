import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AppService {
    loading =  new Subject<boolean>();
    loadingValue = false;

    constructor(private http: HttpClient) { }

    changeLoadingStatus(value: boolean) {
        this.loadingValue = value;
        this.loading.next(this.loadingValue);
    }
}