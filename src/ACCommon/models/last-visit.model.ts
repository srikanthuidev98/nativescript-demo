import { Client, DualClient, Visit } from '.';

export interface LastVisit {
    Client?: Client;
    DualClient?: DualClient;
    Visit: Visit;
}
