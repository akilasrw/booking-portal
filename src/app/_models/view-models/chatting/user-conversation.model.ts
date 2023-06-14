import { Message } from "./message.model";

export interface UserConversation {
  chatServiceSid?: string;
  conversationSid?: string;
  participantSid?: string;
  participantUserSid?: string;
  conversationCreatedBy?: string;
  conversationDateCreated?: string;
  userId?: string;
  messages?:  Message[];
  isRead?: boolean;
}
