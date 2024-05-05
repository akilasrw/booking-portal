import { AwbService } from './../../../_services/awb.service';
import { AccountService } from 'src/app/account/account.service';
import { CargoBookingDetail } from './../../../_models/view-models/cargo-booking/cargo-booking-detail/cargo-booking-detail.model';
import { CargoBookingDetailQuery } from './../../../_models/queries/cargo-booking/cargo-booking-detail-query.model';
import { Component, Input, OnInit } from '@angular/core';
import { BookingService } from 'src/app/_services/booking.service';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import {
  AWBStatus,
  BookingStatus,
  PackageAudit,
  PackageItemStatus,
} from 'src/app/core/enums/common-enums';
import { AWBCreateRM } from 'src/app/_models/request-models/awb/awb-create-rm.model';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user.model';
import { ToastrService } from 'ngx-toastr';
import { PackageItem } from 'src/app/_models/view-models/package-item.model';
import { CargoAgentQuery } from 'src/app/_models/queries/cargo-agent/cargo-agent-query.model';
import { CargoAgent } from 'src/app/_models/view-models/cargo-agent/cargo-agent.model';
import { CargoBooking } from '../../../_models/view-models/cargo-booking/cargo-booking.model';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-booking-view-detail',
  templateUrl: './booking-view-detail.component.html',
  styleUrls: ['./booking-view-detail.component.scss'],
})
export class BookingViewDetailComponent implements OnInit {
  @Input() cargoBooking?: CargoBooking;
  cargoBookingDetail?: CargoBookingDetail;
  modalVisible = false;
  modalVisibleAnimate = false;
  awbModel?: AWBCreateRM;
  subscription?: Subscription;
  currentUser?: User | null;
  cargoAgent?: CargoAgent;
  pickedUpBoxes: PackageAudit[] = [];
  wh_rec: PackageAudit[] = [];
  dWh_rec: PackageAudit[] = [];
  uld_packed: PackageAudit[] = [];
  dispached: PackageAudit[] = [];
  offloaded: PackageAudit[] = [];
  uld_unpacked: PackageAudit[] = [];
  delivered: PackageAudit[] = [];
  dUld_packed: PackageAudit[] = [];
  dDispached: PackageAudit[] = [];
  dUld_unpacked: PackageAudit[] = [];
  dDelivered: PackageAudit[] = [];
  openList?: string | null = null;

  constructor(
    private bookingSerice: BookingService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private awbService: AwbService
  ) {
    //@ts-ignore
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    //@ts-ignore
    pdfMake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf',
      },
    };
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getBookingDetail();
  }

  setOpenList(x: string) {
    if (x == this.openList) {
      this.openList = null;
    } else {
      this.openList = x;
    }
  }

  getBookingDetail() {
    if (this.cargoBooking?.id != null) {
      this.bookingSerice
        .getPackageAuditStatus(this.cargoBooking.id)
        .subscribe((res: any) => {
          console.log(res);
          this.cargoBookingDetail = res;
          this.pickedUpBoxes = res.filter(
            (x: PackageAudit) => x.packageStatus == PackageItemStatus.Booking_Made
          );
          this.wh_rec = res.filter(
            (x: PackageAudit) => x.packageStatus == PackageItemStatus.Cargo_Received
          );
          this.uld_packed = res.filter(
            (x: PackageAudit) =>
              x.packageStatus == PackageItemStatus.AcceptedForFlight
          );
          this.offloaded = res.filter(
            (x: PackageAudit) =>
              x.packageStatus == PackageItemStatus.Offloaded
          );
          this.uld_unpacked = res.filter(
            (x: PackageAudit) =>
              x.packageStatus == PackageItemStatus.InDestinationWarehouse
          );
          this.dispached = res.filter(
            (x: PackageAudit) =>
              x.packageStatus == PackageItemStatus.FlightDispatched
          );
          this.delivered = res.filter(
            (x: PackageAudit) =>
              x.packageStatus == PackageItemStatus.Delivered
          );
          this.dWh_rec =
            1 > 0
              ? this.pickedUpBoxes.filter(
                  (x) =>
                    this.wh_rec.filter((y) => y.packageId == x.packageId)
                      .length == 0
                )
              : [];
          this.dUld_packed =
            1 > 0
              ? this.wh_rec
                  .filter(
                    (x) =>
                      this.uld_packed.filter((y) => y.packageId == x.packageId)
                        .length == 0
                  )
                  .filter(
                    (i) =>
                      this.offloaded.filter((o) => o.packageId == i.packageId)
                        .length == 0
                  )
              : [];
          this.dDispached =
            1 > 0
              ? this.uld_packed
                  .filter(
                    (x) =>
                      this.dispached.filter((y) => y.packageId == x.packageId)
                        .length == 0
                  )
                  .filter(
                    (i) =>
                      this.offloaded.filter((o) => o.packageId == i.packageId)
                        .length == 0
                  )
              : [];
          this.dUld_unpacked =
            1 > 0
              ? this.dispached.filter(
                  (x) =>
                    this.uld_unpacked.filter((y) => y.packageId == x.packageId)
                      .length == 0
                )
              : [];
          this.dDelivered =
            1 > 0
              ? this.uld_unpacked.filter(
                  (x) =>
                    this.delivered.filter((y) => y.packageId == x.packageId)
                      .length == 0
                )
              : [];
        });
    }
  }

  generatePDF(x:PackageAudit[]) {

    console.log(x, 'audit')

    let body = [['Package ID', 'Collected Date', 'Flight Number', "AwbNumber"]]
    x.forEach((y:PackageAudit) => {
        body.push([y.packageNumber, y.collectedDate, y.flightNumber,y.awb.toString()])     
    });
    const documentDefinition = {

      

      content: [
        {
          text: 'Package List',
          style: 'header',
        },
        {
          table: {
            widths: [100, '*', '*', 100],
            body: body,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
      },
    };
    // @ts-ignore
    pdfMake.createPdf(documentDefinition).download('package_list.pdf');
  }


  getBookingStatus(status: number): string {
    return CoreExtensions.GetBookingStatus(status);
  }

  getAWBStatus(status: number): string {
    return CoreExtensions.GetAWBStatus(status);
  }

  addAWB() {
    this.awbModel = new AWBCreateRM();
    this.awbModel.agentAccountNumber = this.cargoAgent?.cargoAccountNumber;
    this.awbModel.agentAITACode = this.cargoAgent?.agentIATACode;
    this.awbModel.agentCity = this.cargoAgent?.city;
    this.awbModel.agentName = this.cargoAgent?.agentName;
    this.awbModel.routingAndDestinationTo =
      this.cargoBookingDetail?.destinationAirportCode;
    this.awbModel.routingAndDestinationBy =
      this.cargoBookingDetail?.flightNumber.substring(0, 2);
    this.awbModel.requestedFlightDate =
      this.cargoBookingDetail?.scheduledDepartureDateTime;
    this.awbModel.destinationAirportName =
      this.cargoBookingDetail?.destinationAirportName;
    this.awbModel.destinationAirportId =
      this.cargoBookingDetail?.destinationAirportId;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  editAWB(cargoBookingDetail?: CargoBookingDetail) {
    if (cargoBookingDetail != null) {
      this.awbModel = cargoBookingDetail!.awbInformation;
      this.awbModel!.isEditAWB = true;
      this.modalVisible = true;
      setTimeout(() => (this.modalVisibleAnimate = true));
    }
  }

  closeAWBForm() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  submitAWBDetail(awb: AWBCreateRM) {
    awb.userId = this.currentUser?.id != null ? this.currentUser?.id : '';
    awb.cargoBookingId = this.cargoBooking?.id;
    this.awbModel = awb;
    if (this.awbModel != null && this.awbModel?.isEditAWB) {
      this.awbService.update(this.awbModel).subscribe({
        next: (res) => {
          this.toastr.success('Successfully update AWB details.');
          this.getBookingDetail();
        },
        error: (err) => {
          this.toastr.error('Unable to update AWB details.');
        },
      });
    } else if (this.awbModel != null) {
      this.awbService.create(this.awbModel).subscribe({
        next: (res) => {
          this.toastr.success('Successfully add AWB details.');
          this.getBookingDetail();
        },
        error: (err) => {
          this.toastr.error('Unable to add AWB details.');
        },
      });
    }
  }

  get bookingStatus(): typeof BookingStatus {
    return BookingStatus;
  }
  get awbStatus(): typeof AWBStatus {
    return AWBStatus;
  }
  getPackageStatus(status: number): string {
    return CoreExtensions.GetPackageStatus(status);
  }

  get packageItemStatus(): typeof PackageItemStatus {
    return PackageItemStatus;
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe((res) => {
      this.currentUser = res;
      if (this.cargoBookingDetail?.awbStatus != AWBStatus.AddedAWB) {
        this.getCargoAgentDetails(this.currentUser!.id);
      }
    });
  }

  getCargoAgentDetails(userId: string) {
    var query = new CargoAgentQuery();
    query.appUserId = userId;
    query.isCountryInclude = true;
    this.accountService.getUserDetail(query).subscribe((res) => {
      this.cargoAgent = res;
    });
  }

  public readonly BookingStatus = BookingStatus;
}
