import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AppService } from "../app.service";
import { User } from "./user.model";

@Injectable()
export class UserService {
    private filterValue = '';
    private pageIndex = 0;
    private pageLimit = 5;
    dataChanged = new Subject<User[]>();
    userCount: number;

    constructor(private http: HttpClient, private dataStorageService: AppService) {}

    fetchUsers() {
        const url = 'http://localhost:8000/users?_start=' + this.pageIndex * this.pageLimit
            + '&_limit=' + this.pageLimit
            + '&name_like=' + this.filterValue;
        this.http.get(url, {observe: 'response'})
            .subscribe(
                (response => {
                    this.userCount = +response.headers.get('X-Total-Count');
                    this.dataChanged.next(<User[]>response.body);
                    this.dataStorageService.changeLoadingStatus(false);
                })
            )
    }

    refreshSearch(filterValue: string, index: number) {
        this.filterValue = filterValue;
        this.pageIndex = index;
        this.fetchUsers();
    }

    changePageData(pageIndex: number, pageSize: number) {
        this.pageIndex = pageIndex;
        this.pageLimit = pageSize;
        this.fetchUsers();
    }
}