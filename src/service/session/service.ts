import { AxiosInstance } from "axios";

import { Session } from "./interface";

export class SessionService {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  async getAllSessions(): Promise<Session[]> {
    const response = await this.instance.get("/session");
    return response.data;
  }

  async createSession(session_name: string): Promise<Session> {
    const response = await this.instance.post(`/session/${session_name}`);

    return response.data;
  }

  async deleteSession(session_id: string): Promise<void> {
    await this.instance.delete(`/session/${session_id}`);
  }
}
