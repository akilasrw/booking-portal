import { Component, Input, OnInit } from '@angular/core';
import { LoaderImageSize } from 'src/app/core/enums/common-enums';

@Component({
  selector: 'app-loader-flight',
  templateUrl: './loader-flight.component.html',
  styleUrls: ['./loader-flight.component.scss']
})
export class LoaderFlightComponent implements OnInit {

  @Input() loaderImageSize: LoaderImageSize = LoaderImageSize.Medium;

  constructor() { }

  ngOnInit(): void {
  }

}
