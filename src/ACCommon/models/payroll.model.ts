export interface Payroll {
    PayrollId: number;
    CustomerId: number;
    CustomerName: string;
    PayrollDate: string;
    PeriodStartDate: string;
    PeriodEndDate: string;
    SenttoLTCI: boolean;
    SenttoLTCIDate: string;
    PayrollFrequencyName: string;
    GrossAmountforPayroll: string;
    CustomerStatus: string;
    ReadyforQA: boolean;
    HFRepresentative: string;
    RegistryPayment: string;
    FeeAmount: string;
    NetPayrollAmount: string;
    NetPaycheck: string;
    TotalPayrollAmount: string;
    ACHAmount: string;
    WorkCompAmount: string;
    InvoiceAdjustment: string;
    TotalInvoiceAmount: string;
    PaperlessProcess: string;
    OKtoPay: boolean;
    AuthorizedApprover: string;
    PayrollFinalized: boolean;
    ApprovedBy: string;
    ApprovedOn: string;
    TimeEntryStatus: string;
    Hospitalization: string;
    HospitalizationComment: string;
    HealthProfessional: string;
    HealthProfessionalComment: string;
    Falls: string;
    FallsComment: string;
    CareCharges: string;
    CareChangesComment: string;
    DigitalSignature: string;
    DigitalIPAddress: string;
    DigitalSigDate: string;
    AccountApproving: string;
    PassCode?: any;
    IsEditable: number;
}

export interface ClientPayroll {
    customerId: number;
    payrolls: Payroll[];
}
