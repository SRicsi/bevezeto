import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  loading = false;
  private loadingSubscription: Subscription;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.appService.loading.subscribe(
      (value: boolean) => {
        this.loading = value;
      }
    );
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

}
