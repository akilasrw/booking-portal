import { PackageItemStatus, PackageContainerType, PackageBoxType } from './../enums/common-enums';
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

  public static GetBookingStatus(bookingStatus: BookingStatus): string { debugger
    let statusString = "None";
    switch (bookingStatus) {
      case BookingStatus.None:
        statusString = "None";
        break;
      case BookingStatus.Pending:
        statusString = "Pending";
        break;
      case BookingStatus.Accepted:
        statusString = "Accepted";
        break;
      case BookingStatus.Dispatched:
        statusString = "Dispatched";
        break;
      case BookingStatus.Exported:
        statusString = "Exported";
        break;
      case BookingStatus.Invoiced:
        statusString = "Invoiced";
        break;
      case BookingStatus.Loading:
        statusString = "Loading";
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
      case PackageItemStatus.AddedAWB:
        statusString = "Added AWB";
        break;
      default:
        break;
    }
    return statusString;
  }

  public static GetPackageDimentions(length:number,width:number,height:number):string{
    return (length == null ? 0 : length)+" x "+(width == null ? 0 : width)+" x "+(height == null ? 0 : height)
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
    }
    return cargoType;
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

  public static GetAWBProductType(type: number) {
    let productType="";
    switch(type){
      case 1:
        productType = "Electronic";
        break;
      case 2:
        productType = "Stationery";
        break;
    }
    return productType;
  }

  public static TitleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

}



