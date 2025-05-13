import { AxiosInstance } from "axios";
import { CreateToolDTO, Tool, ToolInteractionElement } from "./interface";
import { Result, wrapPromise } from "../service-wrapper";

export class ToolService {
  private instance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  async getAllTools(): Promise<Result<Tool[]>> {
    return wrapPromise(this.instance.get("/tool").then((res) => res.data));
  }

  async getTool(id: string): Promise<Result<Tool>> {
    return wrapPromise(
      this.instance.get(`/tool/${id}`).then((res) => res.data)
    );
  }

  async createTool(data: CreateToolDTO): Promise<Result<Tool>> {
    return wrapPromise(
      this.instance.post("/tool", data).then((res) => res.data)
    );
  }

  async deleteTool(id: string): Promise<Result<void>> {
    return wrapPromise(this.instance.delete(`/tool/${id}`).then(() => {}));
  }

  async runTool(
    id: string,
    request: ToolInteractionElement[]
  ): Promise<Result<string>> {
    return wrapPromise(
      this.instance
        .post(`/tool/send_request/${id}`, request)
        .then((res) => res.data)
    );
  }
}
