import { ChatStatus } from "./chat-status.model";

export interface Message {
  sId: string;
  auther: string;
  body: string;
  pathConversationSid: string;
  pathSid: string;
  created: string;
  chatStatus: ChatStatus;
}
