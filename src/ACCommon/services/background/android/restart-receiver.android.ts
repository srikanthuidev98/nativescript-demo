import { ContinuousService_CLASSNAME } from './continuous-service.android';
import { BackgroundService } from '../background.service';


export const RestartReceiver_CLASSNAME = 'com.assuricare.RestartReceiver';


@JavaProxy('com.assuricare.RestartReceiver')
export class RestartReceiver extends android.content.BroadcastReceiver {
    onReceive(context: android.content.Context, intent: android.content.Intent): void {
        if (BackgroundService.killProcess) {
            console.log('Process is killed');
            BackgroundService.killProcess = false;
        } else {
            console.log('Process restarted.');
            const serviceIntent = new android.content.Intent();
            serviceIntent.setClassName(context, ContinuousService_CLASSNAME);
            context.startService(serviceIntent);
        }
    }
}
