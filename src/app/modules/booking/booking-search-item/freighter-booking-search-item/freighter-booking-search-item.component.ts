import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FlightSchedule } from 'src/app/_models/view-models/flight-schedule/flight-schedule.model';

@Component({
  selector: 'app-freighter-booking-search-item',
  templateUrl: './freighter-booking-search-item.component.html',
  styleUrls: ['./freighter-booking-search-item.component.scss']
})
export class FreighterBookingSearchItemComponent implements OnInit {

  @Input() flightSchedule!:FlightSchedule;
  @Input() flightScheduleId: string = '';
  @Input() elementIndex :number= 0;
  @Output() setCurrentSchedule = new EventEmitter<any>();


  constructor(private router: Router,private toastrService: ToastrService) { }

  ngOnInit(): void {
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
      this.router.navigate(['booking/freighterCreate'],{ state: { flightScheduleData: flightSchedule } });
    }
    else
      this.toastrService.warning('No available space.');
  }

  convertcm3Tom3(volume: number):number{
    return volume/1000000;
  }

}
