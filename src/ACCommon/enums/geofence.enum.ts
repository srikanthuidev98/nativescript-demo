export const GeofencingThreshold = 400;
export const GeofencingTimeout = 10000;

export enum GeofencingOrigin {
    checkIn = 0,
    checkOut = 1,
    Location = 2
}

export enum GeofencingType {
    in = 0,
    out = 1
}

export enum InvalidLocationReason {
    ForceCloseIOS,
    LocationServiceTurnedOff,
    AlwaysLocationOff
}
