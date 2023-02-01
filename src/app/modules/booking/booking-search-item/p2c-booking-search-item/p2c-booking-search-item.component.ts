import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FlightSchedule } from 'src/app/_models/view-models/flight-schedule/flight-schedule.model';

@Component({
  selector: 'app-p2c-booking-search-item',
  templateUrl: './p2c-booking-search-item.component.html',
  styleUrls: ['./p2c-booking-search-item.component.scss']
})
export class P2cBookingSearchItemComponent implements OnInit {

  @Input() flightSchedule!:FlightSchedule;
  @Input() flightScheduleId: string = '';
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

  validateSpace(flightSchedule: FlightSchedule): boolean {
    if (flightSchedule.flightScheduleSectorCargoPositions.filter(x => x.availableSpaceCount > 0).length > 0)
      return true;

    return false;
  }

  goToBookingCreate(flightSchedule: FlightSchedule) {
    var recordCount = flightSchedule.flightScheduleSectorCargoPositions.filter(x => x.availableSpaceCount > 0).length;
    if (recordCount > 0) {
      this.setCurrentSchedule.emit();
      this.router.navigate(['booking/p2cCreate'],{ state: { flightScheduleData: flightSchedule } });
    }
    else
      this.toastrService.warning('No available space.');
  }

}
