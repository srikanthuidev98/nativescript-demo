export enum VisitStatus    {
    Ok = 0,
    Unassigned = 1,
    Cancelled = 2, // Cancelled by Scheduler
    Held = 3,
    Optional = 4,
    Rider = 5,
    Started = 6,
    Completed = 7,
    NotAuthorized = 8,
    ClockworkExempt = 9,
    Conflict = 10,
    EmployeeNotAvailable = 11,
    CancelledByClient = 12, // Cancelled by Client
    CancelledByEmployee = 13, // Cancelled by Caregiver
    UnavailableOverride = 14,
    CancelledByOther = 15, // Cancelled by Other
    CompletedWithException = 16, // Visits never set to this status, used for flag color
    Paid = 20, // Visits set to Paid/reimbursed from payroll process
    ContiguousVisit = 255 // Not used in Apex
}
