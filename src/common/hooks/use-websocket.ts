import { useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  CreateChatMessageDTO,
} from "../../service/chat/interface";

export default function useWebSocket(
  sessionID: string,
  onMessageReceived: (message: ChatMessage) => void
) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionID) return;

    // WebSocket 연결
    const ws = new WebSocket(
      import.meta.env.PROD
        ? `wss://api-aigendrug-cid-2025.luidium.com/v1/chat/session/ws?sessionID=${sessionID}`
        : `ws://localhost:8080/v1/chat/session/ws?sessionID=${sessionID}`
    );
    socketRef.current = ws;

    ws.onopen = () => {
      console.log(`Connected to WebSocket session: ${sessionID}`);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.status === "finished") {
        setIsWaiting(false);
      }

      onMessageReceived(message);
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [sessionID]);

  const sendMessage = (messageContent: CreateChatMessageDTO) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message = {
        session_id: sessionID,
        role: messageContent.role,
        message: messageContent.message,
        message_type: 0,
        linked_tool_ids: [],
      };

      socketRef.current.send(JSON.stringify(message));

      setIsWaiting(true);
    }
  };

  return { sendMessage, isConnected, isWaiting };
}
