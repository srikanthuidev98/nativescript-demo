import { MessageRecipient } from './message-recipient.model';
import { AttachmentType } from '../enums';

export interface Message {
    ltcUniqueCaregiverId: string;
    cwUniqueCaregiverId: string;
    cwMessageId: number;
    cwParentMessageId: number;
    wasRead: boolean;
    isRecipient: boolean;
    timestamp: Date;
    updatedWhen: Date;
    sentBy: string;
    content: string;
    unreadMessageCount: number;
    recipients: MessageRecipient[];
    filename?: string;
    fileType?: AttachmentType;
    file?: string; // Only used for sending a file.

    loadingAttachment?: boolean;
    attachmentSource?: any; // This is the soruce of the attachment to be shown.
}

export interface FileAttachment {
    filename: string;
    file: string;
    fileType: AttachmentType;
}
