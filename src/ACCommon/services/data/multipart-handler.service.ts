import { Injectable } from '@angular/core';

import * as bgHttp from 'nativescript-background-http';
import { Observable, Subject } from 'rxjs';
import { ApiHelperService } from './api-helper.service';

@Injectable()
export class MultipartHandlerService {

    private events: { eventTitle: string, eventData: any }[] = [];
    private lastEvent = '';
    private counter = 0;
    private data: any;
    private finishedUploading = false;

    /**
     * Subscribe on this Subject (Observable) to get the response code and data (if any) from the HTTP call.
     */
    public response: Subject<{responseCode: number, data: any}> = new Subject();

    constructor(private apiHelper: ApiHelperService) {
        this.lastEvent = '';
    }

    /**
     * Upload multipart HTTP request.
     *
     * @param url - Full API URL
     * @param token - token
     * @param bgSessionName - Name of the HTTP session name
     * @param params - Params: The actual data that will be passed to the API
     * @param androidNotificationTitle - Notification title for Android after upload.
     */
    public multipartUpload(url: string, token: string, bgSessionName: string,
                            params: any, androidNotificationTitle: string = 'Sync complete') {

        const session = bgHttp.session(bgSessionName);
        const name = 'test';
        const description = `${name} (${++this.counter})`;
        const request = {
            url: url,
            method: 'POST',
            headers: {
                Authorization: this.apiHelper.getAuthHeaderAsString(token),
                'Content-Disposition': 'form-data; name=' + name + 'filename=' + name,
                'Content-Type': 'application/octet-stream'

            },
            description: description,
            androidAutoDeleteAfterUpload: false,
            androidNotificationTitle: androidNotificationTitle,
            androidAutoClearNotification: true
        };

        setTimeout(() => { // Timeout of 20 seconds. If the upload doesn't complete in 20 seconds. it will return a 408.
            if (!this.finishedUploading) {
                this.response.next({responseCode: 408, data: 'Multipart upload timed out'});
            }
        }, 20000);

        const task = session.multipartUpload(params, request);
        this.bindTask(task);
        return this.response;
    }

    /**
     * Bind the task to the events. This will create callbacks for every stage of the call.
     * (responsed, progress, complete, error)
     *
     * To get the response code and data from the response, please subscribe on MultipartHandlerService.response
     *
     * @param task - bgHttp.Task
     */
    private bindTask(task: bgHttp.Task): any {
        task.on('progress', this.onEvent.bind(this));
        task.on('error', this.onEvent.bind(this));
        task.on('responded', this.onEvent.bind(this));
        task.on('complete', this.onEvent.bind(this));
        this.lastEvent = '';
    }

    private onEvent(e): Observable<boolean> {
        if (this.lastEvent !== e.eventName) {
            // suppress all repeating progress events and only show the first one
            this.lastEvent = e.eventName;
        } else {
            return;
        }
        if ( e.eventName === 'complete') {
            this.finishedUploading = true;
            this.response.next({responseCode: e.responseCode, data: JSON.parse(this.data)});
        }

        if ( e.eventName === 'responded') {
            this.data = e.data;
        }

        if ( e.eventName === 'error') {
            console.log(`Multipart HTTP error.
                        ResponseCode: ${e.responseCode},
                        Response: ${e.response}`);
        }

        this.events.push({
            eventTitle: e.eventName + ' ' + e.object.description,
            eventData: JSON.stringify({
                error: e.error ? e.error.toString() : e.error,
                currentBytes: e.currentBytes,
                totalBytes: e.totalBytes,
                body: e.data,
                responseCode: e.responseCode
            })
        });
    }
}
