export interface Profile {
    Name: string;
    FriendlyName: string;
    Email: string;
    Address: string;
    SecondAddress: string;
    Cellphone: string;
    Credentials: any[];
    PictureInfo: PictureInfo;
    FinancialInfo: FinancialInfo;
}

export interface FinancialInfo {
    SocialSecurityNumber: string;
    EmployerIdentification: string;
    BankRoutingNumber: string;
    BankAccountNumber: string;
}

export interface PictureInfo {
    HasPicture: boolean;
    ModifiedDate: Date;
}
