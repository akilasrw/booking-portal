
export class Constants {
  public static get LANGUAGE(): string { return "UserSelectedLanguage"; };
  public static BASE_WEIGHT_UNIT_ID = "BC1E3D49-5C26-4DE5-9CD4-576BBF6E9D0C"
  public static CM_VOLUME_UNIT_ID ="9F0928DF-5D33-4E5D-AFFC-F7E2E2B72680";
  public static METER_VOLUME_UNIT_ID = "FE919429-80EA-4A0E-A218-5DB6E16F690C";
  public static INCH_VOLUME_UNIT_ID = "11C39205-4153-49F1-AB50-BBA8913C5BB9";
}

export class RouteConstants{
  public static DefaultRoute : string = "";
  public static AccountRoute : string = "account";
  public static DashboardRoute : string = "home";
  public static BookingInformationRoute : string = "booking";
  public static BookingLookupRoute : string = "booking-lookup";
  public static StatusOfFlightAvilabilityRoute : string = "";
  public static RateViewRoute : string = "cargo-rate";
  public static TrackAWBRoute : string = "track-awb";
  public static NotificationsRoute : string = "notification";
}
