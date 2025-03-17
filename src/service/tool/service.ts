import { AxiosInstance } from "axios";
import { CreateToolDTO, Tool } from "./interface";

export class ToolService {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  async readAllTools(): Promise<Tool[]> {
    const response = await this.instance.get("/tool");

    return response.data;
  }

  async createTool(data: CreateToolDTO): Promise<string> {
    const response = await this.instance.post("/tool", data);

    return response.data.tool_id;
  }
}
