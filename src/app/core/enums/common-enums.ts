export enum MenuType {
    None = 0,
    DashBoard = 1,
    BookingInformation = 2,
    BookingLookup = 3,
    RateView = 4,
    TrackAWB = 5,
    Notifications = 6
  }

  export enum BookingStatus{
    None = 0,
    Dispatched  = 1,
    Invoiced = 2,
    Accepted = 3,
    Loading = 4,
    Exported = 5
  }

  export enum PackageItemStatus{
    None = 0,
    Pending = 1,
    AddedAWB = 2
  }

  export enum PackageContainerType{
    None = 0,
    OnOneSeat = 2,
    UnderSeat = 3,
    Overhead = 4,
    OnThreeSeats = 5
  }

  export enum PackageItemCategory
  {
    None = 0,
    General = 1,
    Animal = 2,
    Artwork = 3,
    Dgr = 4
  }

  export enum PackagePriorityType
  {
    None = 0,
    Urgent = 1
  }
  export enum PackageBoxType
  {
    None = 0,
    Container = 1,
    CustomBox = 2
  }

