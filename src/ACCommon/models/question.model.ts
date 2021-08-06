import { QuestionType, DisplayType } from '../enums';

export interface Question {
    questionId: number;
    groupId: number;
    type: QuestionType;
    displayType: DisplayType;
    text: string;
    hint?: string;
    required?: boolean;
    dropDownList?: {Key: number, Value: string}[];
    answer?: string;        // Apex Only
    showError?: boolean;    // Apex Only
}

export interface AddionialQuestionsStateObject {
    questions: Question[];
    caregiverId: number;
}
