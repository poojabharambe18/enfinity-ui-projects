import React, { createContext, useState, useEffect, useContext } from "react";
import { Client } from "@stomp/stompjs";
import { AuthContext } from "pages_audit/auth";

export const WebSocketContext: any = createContext<any>({
  client: null,
  sendMessageData: () => {},
  showTyping: () => {},
  messagesData: [],
  typing: {},
  unReadMsgCount: [],
});

const WebSocketProvider = ({ children }) => {
  const { authState } = useContext(AuthContext);
  const [client, setClient] = useState<Client | null>(null);
  const [messagesData, setMessagesData] = useState<any[]>([]);
  const [unReadMsgCount, setUnReadMsgCount] = useState<any>([]);
  const [onlineUserList, setOnlineUserList] = useState<any[]>([]);
  const [userStatus, setUserStatus] = useState<any>({
    isOnline: false,
    userStatusData: {},
  });
  const [typing, setTping] = useState<any>({
    isTyping: false,
    typingData: {},
  });

  const userId = authState?.user?.id;
  const url = `ws://10.55.6.43:8082/ws?username=${userId}`;
  const destination = `/user/queue/messages`; // 🔁 adjust according to your broker setup
  const destination2 = `/topic/online-users`; // 🔁 adjust according to your broker setup
  const totalMsgCount = unReadMsgCount?.reduce((sum, user) => {
    return sum + parseInt(user.USER_MSG_COUNT || "0");
  }, 0);

  useEffect(() => {
    if (!userId) return;

    const stompClient: any = new Client({
      brokerURL: url,
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP-debug: " + str),
    });

    stompClient.onConnect = (frame) => {
      console.log("<<<✅ STOMP Connected:", frame);

      stompClient.subscribe(destination2, (message) => {
        const receivedData = JSON.parse(message.body);
        console.log("<<<000🎫 Received00:", receivedData);

        if (receivedData?.eventType === "ONLINE_USERS") {
          setOnlineUserList(receivedData?.RESPONSE);
        }
      });

      stompClient.subscribe(destination, (message) => {
        const receivedData = JSON.parse(message.body);
        console.log("<<<🎫 Received:", receivedData);

        if (receivedData.eventType === "USER_STATUS") {
          setUserStatus({
            isOnline: receivedData?.is_online,
            userStatusData: receivedData,
          });
        }

        if (receivedData.eventType === "UNREAD") {
          setUnReadMsgCount(receivedData?.RESPONSE);
        }
        if (receivedData.eventType === "TYPING") {
          setTping((old) => ({
            isTyping: true,
            typingData: receivedData,
          }));
        } else {
          setTping((old) => ({
            isTyping: false,
            typingData: receivedData,
          }));
        }
        if (
          receivedData?.eventType === "CHAT" ||
          receivedData?.eventType === "HISTORY"
        ) {
          let msgData = receivedData?.RESPONSE?.map((data) => {
            return {
              position:
                authState?.user?.id === data?.ENTERED_BY ? "right" : "left",
              type: "text",
              text: data?.USER_MSG,
              date: data?.ENTERED_DATE,
              status:
                data?.READ_FLAG !== "Y"
                  ? "sent"
                  : data?.READ_FLAG === "Y"
                  ? "read"
                  : "",
              // options: "waiting", "sent", "received", "read"
            };
          });
          setMessagesData(msgData || []);
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("<<<❌ STOMP Error:", frame.headers["message"], frame.body);
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      console.log("<<<🛑 Cleaning up STOMP...");
      stompClient.deactivate({ USER_ID: authState?.user?.id });
    };
  }, [userId]);

  const userOnline = (activeUser) => {
    if (Array.isArray(onlineUserList) && onlineUserList?.length) {
      let onlineUser = onlineUserList.some(
        (item) => item?.USERNAME === activeUser
      );
      return onlineUser;
    }
  };

  const showTyping = (user) => {
    if (client && client.connected && user) {
      client.publish({
        destination: "/app/chat.typing",
        body: user,
      });
    } else {
      console.warn("<<<⚠️ Client not connected. Message not sent.");
    }
  };
  const stopTyping = (user) => {
    if (client && client.connected && user) {
      client.publish({
        destination: "/app/chat.stopTyping",
        body: user,
      });
    } else {
      console.warn("<<<⚠️ Client not connected. Message not sent.");
    }
  };

  const sendMessageData = (message: string) => {
    if (client && client.connected) {
      client.publish({
        destination: "/app/chat.send",
        body: message,
      });
      console.log("<<<📤 Sent:", message);
    } else {
      console.warn("<<<⚠️ Client not connected. Message not sent.");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        client,
        sendMessageData,
        messagesData,
        showTyping,
        typing,
        stopTyping,
        unReadMsgCount,
        totalMsgCount,
        userStatus,
        userOnline,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
