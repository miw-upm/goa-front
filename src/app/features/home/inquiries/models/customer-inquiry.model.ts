import {InquiryState} from './inquiry-state.enum';
import {InquiryCategory} from './inquiry-category.enum';

export interface CustomerInquiry {
    id?: string;
    registrationDate?: string;
    customerMobile?: string;
    subject: string;
    description: string;
    category: InquiryCategory;
    state?: InquiryState;
    reply?: string;
    repliedByMobile?: string;
    replyDate?: string;
}