import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-auto-complete-dropdown',
  templateUrl: './auto-complete-dropdown.component.html',
  styleUrls: ['./auto-complete-dropdown.component.scss']
})
export class AutoCompleteDropdownComponent implements OnInit {

  @Input() keyword: string = '';
  @Input() data: any = [];
  @Input() selectedIndex?: number;
  @Output() selectFileOutput = new EventEmitter<any>();
  @Output() clearSearch = new EventEmitter<any>();
  @Output() changeSearch = new EventEmitter<any>();
  @ViewChild('autocompleteDropdown') autocompleteDropdown: any;


  ngOnInit(): void {
    setTimeout(() => {
      if (this.selectedIndex != null && this.data.length > 0) {
        this.autocompleteDropdown.initialValue = this.data[this.selectedIndex]?.value;
        this.autocompleteDropdown.searchInput.nativeElement.value = this.data[this.selectedIndex]?.value;
      }
    }, 1000);
  }

  selectEvent(item: any) {
    this.selectFileOutput.emit(item);
  }

  onChangeSearch(val: string) {
    this.changeSearch.emit();
  }

  onFocused(e: any) {
    console.log('onFocused');
  }
  onClearSearch() {
    this.clearSearch.emit();
  }

}
