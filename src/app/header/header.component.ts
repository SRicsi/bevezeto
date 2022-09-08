import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthUser } from '../auth/auth-user.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedInUser: AuthUser;
  isAdmin = false;
  private authUserSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    this.isAdmin = this.loggedInUser && this.loggedInUser.isAdmin();

    this.authUserSubscription = this.authService.userChanged
    .subscribe(
      user => {
        this.loggedInUser = this.authService.getLoggedInUser();
        this.isAdmin = this.loggedInUser && this.loggedInUser.isAdmin();
      }
    )
  }

  ngOnDestroy(): void {
    this.authUserSubscription.unsubscribe();
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

}
