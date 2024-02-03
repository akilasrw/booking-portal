export enum MenuType {
  None = 0,
  DashBoard = 1,
  BookingInformation = 2,
  BookingLookup = 3,
  RateView = 4,
  TrackAWB = 5,
  Notifications = 6,
  Message = 7
}

export enum BookingStatus {
  None = 0,
  Booking_Made = 10,
  AWB_Added = 20,
  Cargo_Received = 30,
  IndestinationWarehouse= 35,
  Off_Loaded = 40,
  Partialy_Dispatched = 45,
  Flight_Dispatched = 50,
  Partialy_Arrived = 55,
  Flight_Arrived = 60,
  Cancelled = 70,
  Accepted_for_Flight = 80,
  Partshipment_for_Flight = 75,
  TruckForDelivery = 85,
  Deliverd = 90
}

export enum AWBStatus {
  None = 0,
  Pending = 1,
  AddedAWB = 2
}

// export enum PackageItemStatus {
//   None = 0,
//   Pending = 1
// }
export enum PackageItemStatus {
  Booking_Made = 0,
  Cargo_Received = 1,
  AcceptedForFlight = 2,
  Returned = 3,
  Offloaded = 4,
  FlightDispatched = 5,
  Arrived = 6,
  InDestinationWarehouse = 7,
  TruckForDelivery = 8,
  Delivered = 9,
  Pending = 10,
  None = 11,
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

export enum LoaderImageSize {
  Small = 1,
  Medium = 2,
  Large = 3
}

export enum AircraftConfigType {
  None = 0,
  P2C = 1,
  Freighter = 2,
}

export enum WeightType {
  None = 0,
  M = 1,
  Minus45K = 2,
  Plus45K = 3,
  Plus100K = 4,
  Plus300K = 5,
  Plus500K = 6,
  Plus1000K = 7
}

export enum CargoAgentStatus {
  None = 0,
  Pending = 1,
  Active = 2,
  Suspended = 3
}

export enum NotificationType{
  None = 0,
  Booking = 1,
  Rate = 2,
}

export enum NotificationFilterType{
  None = 0,
  All = 1,
  Read = 2,
  UnRead = 3,
}

export enum RateType{
  None=0,
  SpotRate =1,
  PromotionalRate=2,
  ContractRate=3,
  MarketPublishRate=4
}
