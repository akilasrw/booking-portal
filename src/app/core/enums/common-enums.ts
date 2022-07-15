export enum MenuType {
  None = 0,
  DashBoard = 1,
  BookingInformation = 2,
  BookingLookup = 3,
  RateView = 4,
  TrackAWB = 5,
  Notifications = 6
}

export enum BookingStatus {
  None = 0,
  Pending = 10,
  Accepted = 20,
  Loading = 30,
  Invoiced = 40,
  Dispatched = 50,
  Exported = 60
}

export enum PackageItemStatus {
  None = 0,
  Pending = 1,
  AddedAWB = 2
}

export enum PackageContainerType {
  None = 0,
  OnFloor = 1,
  OnOneSeat = 2,
  UnderSeat = 3,
  Overhead = 4,
  OnThreeSeats = 5
}

export enum PackageItemCategory {
  None = 0,
  General = 1,
  Animal = 2,
  Artwork = 3,
  Dgr = 4
}

export enum PackagePriorityType {
  None = 0,
  Urgent = 1
}

export enum PackageBoxType {
  None = 0,
  Container = 1,
  CustomBox = 2
}

export enum UnitType {
  None = 0,
  Length = 1,
  Mass = 2
}

export enum PackageProductType {
  None = 0,
  Electronic = 1,
  Stationery = 2,
}

export enum LoaderImageSize {
  Small = 1,
  Medium = 2,
  Large = 3
}

export enum AircraftLayoutType{
  Both = 1,
  Freighter = 2,
  P2C = 3
}
