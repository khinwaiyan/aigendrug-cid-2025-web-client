import axios from "axios";
import { ChatService } from "./chat/service";
import { SessionService } from "./session/service";

export const useService = () => {
  const instance = axios.create({
    baseURL: import.meta.env.PROD
      ? "https://api-aigendrug-cid-2025.luidium.com/v1"
      : "http://localhost:8080/v1",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // using respose interceptor to mock delay
  // instance.interceptors.response.use(
  //   (response) => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(response);
  //       }, 1000);
  //     });
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  return {
    sessionService: new SessionService(instance),
    chatService: new ChatService(instance),
  };
};
