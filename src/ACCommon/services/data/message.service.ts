import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

import { Message, MessageRecipient, FileAttachment } from '../../../ACCommon/models';
import { ApiHelperService } from './api-helper.service';

@Injectable()
export class MessageService {

    constructor(private http: HttpClient, private apiHelper: ApiHelperService) { }

    apiGetMessageRecipients(token: string, caregiverId: number) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<MessageRecipient[]>(
            this.apiHelper.getMessageRecipientsUrl(caregiverId),
            { headers: this.apiHelper.getNewAuthHeader(token)});
    }

    apiGetMessageThreads(token: string, caregiverId: number) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<Message[]>(
            this.apiHelper.getMessageThreadsUrl(caregiverId),
            { headers: this.apiHelper.getNewAuthHeader(token)});
    }

    apiGetMessages(token: string, caregiverId: number, parentMessageId: number) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<Message[]>(
            this.apiHelper.getMessagesUrl(caregiverId, parentMessageId),
            { headers: this.apiHelper.getNewAuthHeader(token) });
    }

    apiPostNewThread(token: string, message: Message) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.post<Message[]>(
            this.apiHelper.postMessageUrl(), message,
            { headers: this.apiHelper.getNewAuthHeader(token) });
    }

    apiReply(token: string, message: Message) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.put<Message[]>(
            this.apiHelper.postMessageUrl(), message,
            { headers: this.apiHelper.getNewAuthHeader(token) });
    }

    apiDeleteThread(token: string, caregiverId: number, parentMessageId: number) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.delete<Message[]>(
            this.apiHelper.deleteMessagesUrl(caregiverId, parentMessageId),
            { headers: this.apiHelper.getNewAuthHeader(token) });
    }

    apiGetAttachment(token: string, caregiverId: number, parentMessageId: number, filename: string) {
        const check = this.apiHelper.verifyInternet();
        if (!check.result) {
            return throwError(check);
        }

        return this.http.get<FileAttachment>(
            this.apiHelper.getAttachmentUrl(caregiverId, parentMessageId, filename).replace(/ /g, '%20'),
            { headers: this.apiHelper.getNewAuthHeader(token) });
    }
}
