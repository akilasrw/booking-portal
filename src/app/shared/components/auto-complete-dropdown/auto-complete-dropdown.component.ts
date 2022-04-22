import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-auto-complete-dropdown',
  templateUrl: './auto-complete-dropdown.component.html',
  styleUrls: ['./auto-complete-dropdown.component.scss']
})
export class AutoCompleteDropdownComponent implements OnInit {

  @Input() keyword: string = '';
  //@Input() placeholder: string = 'Select Airport';
  @Input() data: any = [];
  @Output() selectFileOutput = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  selectEvent(item: any) {
    this.selectFileOutput.emit(item);

  }

  onChangeSearch(val: string) {
    console.log('onChangeSearch');
  }

  onFocused(e: any){
    console.log('onFocused');
  }

}
