import { AxiosInstance } from "axios";

import { ChatMessage, CreateChatMessageDTO } from "./interface";

export class ChatService {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  async getChatMesssageBySessionId(sessionId: string): Promise<ChatMessage[]> {
    const res = await this.instance.get(`/chat/message/${sessionId}`);

    return res.data;
  }

  async createChatMessage(chatMessage: CreateChatMessageDTO) {
    await this.instance.post(`/chat/message`, chatMessage);
  }
}
