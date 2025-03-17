export interface ChatMessage {
  id: string;
  session_id: string;
  role: string;
  message: string;
  created_at: string;
  message_type: number;
  linked_tool_ids: string[];
}

export interface CreateChatMessageDTO {
  session_id: string;
  role: string;
  message: string;
}
