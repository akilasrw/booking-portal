import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FlightScheduleSector } from 'src/app/_models/view-models/flight-schedule-sectors/flight-schedule-sector.model';

@Component({
  selector: 'app-p2c-booking-search-item',
  templateUrl: './p2c-booking-search-item.component.html',
  styleUrls: ['./p2c-booking-search-item.component.scss']
})
export class P2cBookingSearchItemComponent implements OnInit {

  @Input() flightScheduleSector!:FlightScheduleSector;
  @Input() flightScheduleSectorId: string = '';
  @Input() elementIndex:number = 0;
  @Output() setCurrentSchedule = new EventEmitter<any>();


  constructor(private router: Router,private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  getAvailableCargoSpace(value: number) {
    let position: string = '';
    switch (value) {
      case 1:
        position = "On Floor";
        break;
      case 2:
        position = "On Seat";
        break;
      case 3:
        position = "Under Seat";
        break;
      case 4:
        position = "Over Head";
        break;

    }
    return position;
  }

  validateSpace(flightScheduleSector: FlightScheduleSector): boolean {
    if (flightScheduleSector.flightScheduleSectorCargoPositions.filter(x => x.availableSpaceCount > 0).length > 0)
      return true;

    return false;
  }

  goToBookingCreate(flightScheduleSector: FlightScheduleSector) {
    let id = flightScheduleSector.id;
    var recordCount = flightScheduleSector.flightScheduleSectorCargoPositions.filter(x => x.availableSpaceCount > 0).length;
    if (recordCount > 0) {
      this.setCurrentSchedule.emit();
      this.router.navigate(['booking/p2cCreate', id]);
    }
    else
      this.toastrService.warning('No available space.');
  }

}
