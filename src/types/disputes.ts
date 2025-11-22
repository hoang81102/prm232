export interface DisputeSchema {
  disputeId: number;
  title: string;
  status: string;
  createdAt: string;
  raisedByUserId: number;
  messages: Message[];
}

export interface Message {
  senderUserId: number;
  content: string;
  sentAt: string;
}
export interface SendMessagePayload {
  content: string;
}
