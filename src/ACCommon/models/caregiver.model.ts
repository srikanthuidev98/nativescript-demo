export interface Caregiver {
    Name: string;
    Token: string;
    APIToken: string;
    Expires: Date;
    RefreshToken: string;
    Id: number;
    Uuid?: string;
    PushId?: string;
}

export interface RefreshTokenResponse {
    APIToken: string;
    Expires: Date;
    RefreshToken: string;
}
