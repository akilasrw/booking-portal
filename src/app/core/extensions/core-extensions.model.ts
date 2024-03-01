import { PackageItemStatus, PackageContainerType, PackageBoxType, AWBStatus, WeightType, RateType } from './../enums/common-enums';
import { HttpParams } from "@angular/common/http";
import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";
import { BookingStatus } from "../enums/common-enums";

export class CoreExtensions {
  public static AsPaginate(
    params: HttpParams,
    filter: BasePaginationQuery
  ): HttpParams {
    if (filter.pageIndex) {
      params = params.append("pageIndex", filter.pageIndex.toString());
    }
    if (filter.pageSize) {
      params = params.append("pageSize", filter.pageSize.toString());
    }
    return params;
  }

  public static GetBookingStatus(bookingStatus: BookingStatus): string {
    let statusString = "None";
    switch (bookingStatus) {
      case BookingStatus.None:
        statusString = "None";
        break;
      case BookingStatus.Booking_Made:
        statusString = "Booked";
        break;
      case BookingStatus.AWB_Added:
        statusString = "AWB Added";
        break;
      case BookingStatus.Cargo_Received:
        statusString = "Received";
        break;
      case BookingStatus.IndestinationWarehouse:
        statusString = "In destination Warehouse";
        break;
      case BookingStatus.Flight_Dispatched:
        statusString = "Dispatched";
        break;
      case BookingStatus.Cancelled:
        statusString = "Cancelled";
        break;
      case BookingStatus.Flight_Arrived:
        statusString = "Arrived";
        break;
      case BookingStatus.Off_Loaded:
        statusString = "Off Loaded";
        break;
      case BookingStatus.Accepted_for_Flight:
        statusString = "Accepted for Flight";
        break;
      case BookingStatus.Partshipment_for_Flight:
        statusString = "Part Shipment";
        break;
      case BookingStatus.Deliverd | BookingStatus.TruckForDelivery:
        statusString = "Delivered to Agent";
        break;
      default:
        break;
    }
    return statusString;
  }
  public static GetAWBStatus(awbStatus: AWBStatus): string {
    let statusString = "None";
    switch (awbStatus) {
      case AWBStatus.None:
        statusString = "None";
        break;
      case AWBStatus.Pending:
        statusString = "Pending";
        break;
      case AWBStatus.AddedAWB:
        statusString = "Added AWB";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetPackageStatus(packageStatus: PackageItemStatus): string {
    let statusString = "None";
    switch (packageStatus) {
      case PackageItemStatus.None:
        statusString = "None";
        break;
      case PackageItemStatus.Pending:
        statusString = "Pending";
        break;
      case PackageItemStatus.Booking_Made:
        statusString = "Booked with AWB";
        break;
      case PackageItemStatus.Cargo_Received:
        statusString = "Received";
        break;
      case PackageItemStatus.InDestinationWarehouse:
        statusString = "In destination Warehouse";
        break;
      case PackageItemStatus.FlightDispatched:
        statusString = "Dispatched";
        break;
      case PackageItemStatus.Returned:
        statusString = "Returned";
        break;
      case PackageItemStatus.Arrived:
        statusString = "Arrived";
        break;
      case PackageItemStatus.Offloaded:
        statusString = "Off Loaded";
        break;
      case PackageItemStatus.AcceptedForFlight:
        statusString = "Accepted for Flight";
        break;
      case PackageItemStatus.Delivered | PackageItemStatus.TruckForDelivery:
        statusString = "Delivered to Agent";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetPackageDimentions(length:number,width:number,height:number):string{
    return (length == null ? 0 : length)+" x "+(width == null ? 0 : width)+" x "+(height == null ? 0 : height);
  }

  public static RoundToTwoDecimalPlaces(numberValue:number):number{
    return Math.round((numberValue + Number.EPSILON) * 100) / 100;
  }

  public static GramToKilogramConversion(weight:number,isReverse:boolean = false):number{
            if (isReverse)
                return weight * 1000;
            else
                return weight / 1000;
  }

  public static GetPackageContainerType(type: PackageContainerType): string {
    let statusString = "None";
    switch (type) {
      case PackageContainerType.None:
        statusString = "None";
        break;
      case PackageContainerType.OnOneSeat:
        statusString = "On One Seat";
        break;
      case PackageContainerType.UnderSeat:
        statusString = "Under Seat";
        break;
      case PackageContainerType.Overhead:
        statusString = "Overhead";
        break;
      case PackageContainerType.OnThreeSeats:
        statusString = "On Three Seats";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetCargoType(type: number) {
    let cargoType="";
    switch(type){
      case 1:
        cargoType = "General";
        break;
      case 2:
        cargoType = "DGR";
        break;
    }
    return cargoType;
  }

  public static GetRateType(type:RateType):string{
    let statusString = "None";
    switch (type) {
      case RateType.SpotRate:
        statusString = "Spot Rate";
        break;
      case RateType.ContractRate:
        statusString = "Contract Rate";
        break
      case RateType.PromotionalRate:
        statusString = "Promotional Rate";
        break
      case RateType.MarketPublishRate:
        statusString = "Market Publish Rate";
        break
      default:
        break;
    }
    return statusString;
  }

  public static GetContainerName(packageContainerType: PackageContainerType) {
    let displayWord ='';
    let prefix = ' Container - ';
    switch(packageContainerType) {
      case PackageContainerType.OnOneSeat:
        displayWord = prefix + 'On One Seat';
        break;
      case PackageContainerType.OnThreeSeats:
        displayWord = prefix + 'On Three Seat';
        break;
      case PackageContainerType.Overhead:
        displayWord = prefix + 'Overhead';
        break;
      case PackageContainerType.UnderSeat:
        displayWord = prefix + 'Under the Seat';
        break;
      default:
        displayWord = 'Custom'
        break
    }
    return displayWord;
  }

  public static GetPackageBoxType(type: PackageBoxType): string {
    let statusString = "None";
    switch (type) {
      case PackageBoxType.None:
        statusString = "None";
        break;
      case PackageBoxType.Container:
        statusString = "Container";
        break;
      case PackageBoxType.CustomBox:
        statusString = "Custom Box";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static TitleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  public static PadLeadingZeros(num:number, size:number) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  public static GetWeightType(type: WeightType): string {
    let statusString = "None";
    switch (type) {
      case WeightType.None:
        statusString = "None";
        break;
      case WeightType.M:
        statusString = "M";
        break;
      case WeightType.Minus45K:
        statusString = "-45K";
        break;
      case WeightType.Plus45K:
        statusString = "+45K";
        break;
      case WeightType.Plus100K:
        statusString = "+100K";
        break;
      case WeightType.Plus300K:
        statusString = "+300K";
        break;
      case WeightType.Plus500K:
        statusString = "+500K";
        break;
      case WeightType.Plus1000K:
        statusString = "+1000K";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetFirstLetters(str: string) {
    if(str.indexOf(' ')>0) {
      var res = str.split(' ');
      if(res.length> 0)
          return res[0][0]+ ''+ res[1][0];
    } else if(str.length>0) {
      return str[0];
    }
    return '';
}

}



