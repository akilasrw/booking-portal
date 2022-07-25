import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-loader',
  templateUrl: './table-loader.component.html',
  styleUrls: ['./table-loader.component.scss']
})
export class TableLoaderComponent implements OnInit {

  @Input() columnCount: number=0;
  @Input() rowCount: number=0;
  @Input() displayHeader: boolean = true;
  
  constructor() { }

  ngOnInit(): void {
  }

  tableColumns(){
    return new Array(this.columnCount);
  }
 
  rowCounts(){
     return new Array(this.rowCount);
  }

}
