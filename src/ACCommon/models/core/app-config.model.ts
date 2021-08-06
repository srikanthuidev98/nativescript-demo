import { TypeProvider } from '@angular/core';
import { AppType } from '../../enums';

export type EnvironmentType = 'Dev' | 'Integration' | 'Release1' | 'Production';

export enum LoggingLevelEnum {
    Log = 'Log',
    Warn = 'Warn',
    Error = 'Error',
    Debug = 'Debug'
}

export interface AppConfig {
    appType: AppType;
    apiEndpoint: string;
    newApiEndpoint: string;
    careWhenEndpoint: string;
    azureAppService: string;
    loggingEnabled: boolean;
    loggingLevel: LoggingLevelEnum;
    storageServiceClass: TypeProvider;
    environment: EnvironmentType;
}
