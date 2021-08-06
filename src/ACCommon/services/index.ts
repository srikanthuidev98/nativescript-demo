import { AuthService } from './data/auth.service';
import { HistoryService } from './data/history.service';
import { LanguageService } from './language.service';
import { ShiftService } from './data/shift.service';
import { ClientService } from './data/client.service';
import { CheckPermissionService } from './check-permission.service';
import { ProfileService } from './data/profile.service';
import { MultipartHandlerService } from './data/multipart-handler.service';
import { ApiHelperService } from './data/api-helper.service';
import { TimerService } from './timer.service';
import { ValidateService } from './validate.service';
import { FingerprintService } from './fingerprint.service';
import { LoggingService } from './logging.service';
import { ScheduleService } from './data/schedule.service';
import { MessageService } from './data/message.service';

export const SERVICES = [
    ApiHelperService,
    AuthService,
    HistoryService,
    ShiftService,
    ClientService,
    ScheduleService,
    MessageService,
    LanguageService,
    CheckPermissionService,
    ProfileService,
    MultipartHandlerService,
    TimerService,
    ValidateService,
    FingerprintService,
    LoggingService
];
