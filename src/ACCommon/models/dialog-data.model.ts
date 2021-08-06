export interface DialogData {
    title: string;
    subTitle?: string;

    message: string;
    subMessage?: string;

    color: string;

    okButtonText?: string;
    cancelButtonText?: string;

    cannotCloseDialog?: boolean;
}

export type dialogCloseEvent = 'ok' | 'cancel' | 'close';
