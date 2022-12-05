import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext({
  selectedChat: "",
  setSelectedChat: () => {},
  user: "",
  setUser: () => {},
  chats: "",
  setChats: () => {},
  notification: [],
  setNotification: () => {},
});

// export const ChatState = () => {
//   return useContext(ChatContext);
// };

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const value = {
    selectedChat,
    setSelectedChat,
    user,
    setUser,
    notification,
    setNotification,
    chats,
    setChats,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
