import { Toasty, ToastDuration } from 'nativescript-toasty';

export class Toast {

    show(text: string) {
        new Toasty({
            text: text,
            backgroundColor: '#593c81',
            textColor: '#ffffff',
            duration: ToastDuration.LONG
        }).show();
    }
}
