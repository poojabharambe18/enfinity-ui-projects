import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "react-query";
import { Box, CircularProgress, MenuItem, TextField } from "@mui/material";
import { WebSocketContext } from "./socketContext";
import { userListData } from "../api";
import { AuthContext } from "pages_audit/auth";
import userLogo from "assets/images/userlogo.png";
import { ChatList } from "react-chat-elements";
import "./style.css";
import _ from "lodash";

const SEARCH_DEBOUNCE_MS = 200;

const UserList = ({ setActiveChat, inputMessageRef, activeChat }: any) => {
  const [filterData, setFilterData] = useState<any[]>([]);
  const socket: any = useContext(WebSocketContext);
  const { authState } = useContext(AuthContext);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { data: userList, isLoading } = useQuery("userListData", userListData);

  useEffect(() => {
    if (userList) {
      setFilterData(userList);
    }
  }, [userList]);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleSearch = useMemo(
    () =>
      _.debounce((inputValue: string) => {
        const lowercasedValue = inputValue.toLowerCase();
        setFilterData(
          userList?.filter((user: any) =>
            user.label?.toLowerCase().includes(lowercasedValue)
          ) || []
        );
      }, SEARCH_DEBOUNCE_MS),
    [userList]
  );

  const formatChatListData = () => {
    return [...filterData]
      .sort((a, b) => {
        const getDate = (user: any) =>
          new Date(
            socket?.unReadMsgCount?.find(
              (x: any) => x.ENTERED_BY === user.value
            )?.ENTERED_DATE || 0
          ).getTime();
        return getDate(b) - getDate(a);
      })
      .map((item, index) => {
        const unreadInfo = socket?.unReadMsgCount?.find(
          (x: any) => x.ENTERED_BY === item.value
        );
        return {
          ...item,
          id: index,
          avatar: userLogo,
          alt: "No image found",
          title: item.DESCRIPTION,
          subtitle: item.value,
          date: new Date(unreadInfo?.ENTERED_DATE),
          unread: Number(unreadInfo?.USER_MSG_COUNT),
          className: activeChat?.value === item.value ? "chat-selected" : "",
        };
      });
  };

  const handleUserClick = (data: any) => {
    socket.client.publish({
      destination: "/app/chat.history",
      body: JSON.stringify({ RECEIVER_NAME: data?.value }),
    });
    socket.client.publish({
      destination: "/app/chat.openChatBox",
      body: JSON.stringify({
        RECEIVER_NAME: data?.value,
        ENTERED_BY: authState?.user?.id,
      }),
    });
    socket.client.publish({
      destination: "/app/chat.markAsRead",
      body: JSON.stringify({
        RECEIVER_NAME: data?.value,
        ENTERED_BY: authState?.user?.id,
      }),
    });
    setActiveChat(data);
    inputMessageRef.current?.focus();
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 1,
          backgroundColor: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 1,
          boxShadow: 3,
        }}
      >
        <TextField
          type="search"
          inputRef={searchInputRef}
          variant="standard"
          placeholder="Search User..."
          onChange={(e) => handleSearch(e.target.value)}
          fullWidth
          sx={{
            "& .MuiInputBase-input": { height: "48px" },
            "& .MuiInput-underline:before, & .MuiInput-underline:after, & .MuiInput-underline:hover:not(.Mui-disabled):before":
              {
                borderBottom: "none",
              },
          }}
          InputProps={{
            sx: {
              // padding: "0px !important",
              fontSize: "20px !important",
              letterSpacing: "1px !important",
            },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, overflowX: "hidden" }}>
        {isLoading ? (
          <Box sx={{ justifyContent: "center", display: "flex" }}>
            <CircularProgress color="secondary" size="30px" />
          </Box>
        ) : filterData.length ? (
          <ChatList
            className="chat-list"
            id="main-chat-list"
            lazyLoadingImage="https://via.placeholder.com/150"
            dataSource={formatChatListData()}
            onClick={handleUserClick}
          />
        ) : (
          <MenuItem disabled>No users found</MenuItem>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(UserList);
