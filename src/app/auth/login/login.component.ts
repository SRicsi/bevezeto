import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hide = true;
  private emailFormControl: FormControl;
  private passwordFormControl: FormControl;
  private authSubscribtion: Subscription;

  constructor(private authService: AuthService, private router: Router, private _snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    this.passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.loginForm = new FormGroup({
      "email": this.emailFormControl,
      'password': this.passwordFormControl
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscribtion) {
      this.authSubscribtion.unsubscribe();
    }
  }

  getEmailErrorMessage(): string {
    if (this.emailFormControl.hasError('required')) {
      return 'E-mail cím megadása kötelező.';
    } else if (this.emailFormControl.hasError('email')) {
      return 'Nem megfelelő e-mail cím formátum.';
    } else {
      return '';
    }
  }

  getPasswordErrorMessage(): string {
    if (this.passwordFormControl.hasError('required')) {
      return 'Jelszó megadása kötelező.';
    } else if (this.passwordFormControl.hasError('minlength')) {
      return 'A jelszónak minimum 8 karakter hosszúnak kell lennie';
    } else {
      return '';
    }
  }

  onSubmit() {
    this.authSubscribtion = this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      response => {
        this.router.navigate(['/products']);
      },
      error => {
        this._snackbar.open('Nem megfelelő E-mail cím vagy Jelszó!', '', { duration: 3000, panelClass: ['warning-snackbar'] });
      }
    )
  }

}
