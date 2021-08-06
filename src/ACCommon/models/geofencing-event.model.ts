import { GeofencingOrigin, GeofencingType } from '../enums';

export interface GeofencingEvent {
    CaregiverId: number;
    Distance: number;
    Accuracy: number;
    Threshold: number;
    Latitude: number;
    Longitude: number;
    TargetLatitude: number;
    TargetLongitude: number;
    EventDate: string;
    EventType: GeofencingOrigin;
    GeofencingType: GeofencingType;
}
