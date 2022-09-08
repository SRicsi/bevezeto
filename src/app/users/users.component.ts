import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AppService } from '../app.service';
import { User } from './user.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[];
  displayedColumns = ['number', 'name', 'email', 'permissions'];
  numberOfUsers: number;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 15];
  pageIndex: number = 0;
  private dataChangeSubscription: Subscription;

  constructor(private userService: UserService, private appService: AppService) { }

  ngOnInit(): void {
    this.userService.changePageData(this.pageIndex, this.pageSize);
    this.userService.fetchUsers();
    this.dataChangeSubscription = this.userService.dataChanged.subscribe((data => {
      this.users = data;
      this.numberOfUsers = this.userService.userCount;
    }));
  }

  ngOnDestroy(): void {
    this.dataChangeSubscription.unsubscribe();
  }

  refreshSearch = (name: string): void => {
    this.pageIndex = 0;
    this.userService.refreshSearch(name, 0);
  }

  onPageChange(pageEvent: PageEvent) {
    this.appService.changeLoadingStatus(true);
    setTimeout(() => {
      this.pageIndex = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
      this.userService.changePageData(pageEvent.pageIndex, pageEvent.pageSize);
    }, 600);
  }

}
