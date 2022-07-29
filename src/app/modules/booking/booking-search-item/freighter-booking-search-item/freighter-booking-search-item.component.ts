import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FlightScheduleSector } from 'src/app/_models/view-models/flight-schedule-sectors/flight-schedule-sector.model';

@Component({
  selector: 'app-freighter-booking-search-item',
  templateUrl: './freighter-booking-search-item.component.html',
  styleUrls: ['./freighter-booking-search-item.component.scss']
})
export class FreighterBookingSearchItemComponent implements OnInit {

  @Input() flightScheduleSector!:FlightScheduleSector;
  @Input() flightScheduleSectorId: string = '';
  @Output() setCurrentSchedule = new EventEmitter<any>();


  constructor(private router: Router,private toastrService: ToastrService) { }

  ngOnInit(): void {
  }

  validateSpace(flightScheduleSector: FlightScheduleSector): boolean {
    //if (flightScheduleSector.flightScheduleSectorCargoPositions.filter(x => x.availableSpaceCount > 0).length > 0)
      return true;

    //return false;
  }

  goToBookingCreate(flightScheduleSector: FlightScheduleSector) {
    let id = flightScheduleSector.id;
    var recordCount = flightScheduleSector.flightScheduleSectorCargoPositions.filter(x => x.availableSpaceCount > 0).length;
    if (recordCount > 0) {
      this.setCurrentSchedule.emit();
      this.router.navigate(['booking/freighterCreate', id]);
    }
    else
      this.toastrService.warning('No available space.');
  }

  convertcm3Tom3(volume: number):number{
    return volume/1000000;
  }

}
