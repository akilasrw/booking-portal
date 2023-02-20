import { ChatStatus } from "./chat-status.model";

export class MessageRm {
  sId?: string;
  auther?: string;
  body?: string;
  pathConversationSid?: string;
  chatStatus?: ChatStatus;
}
