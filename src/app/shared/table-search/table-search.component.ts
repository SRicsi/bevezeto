import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.css']
})
export class TableSearchComponent implements OnInit {
  searchForm: FormGroup;
  private typingTimer;

  @Input() refreshSearch: (name: string) => void;

  constructor() { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      'name': new FormControl('')
    })
  }

  onFilterChanged() {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.refreshSearch(this.searchForm.value.name);
    }, 600);
  }

}
