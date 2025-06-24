import {
  Box,
  TextField,
  Typography,
  IconButton,
  Container,
  Popover,
  Avatar,
  keyframes,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { MessageList } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { WebSocketContext } from "./socketContext";
import { AuthContext } from "pages_audit/auth";
import UserList from "./userList";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

export const Chat = ({ setAnchorEl, anchorEl }) => {
  const [inputValue, setInputValue] = useState("");
  const [activeChat, setActiveChat] = useState<any>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socket: any = useContext(WebSocketContext);
  const { authState } = useContext(AuthContext);
  const typingTimeoutRef = useRef<any>(null);
  const messageListRef = useRef(null);
  const inputMessageRef = useRef(null);
  const emojiPickerRef = useRef<any>(null);

  const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

  const handleEmojiClick = (emojiData) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };
  const isOnline = useMemo(
    () => socket.userOnline(activeChat?.value),
    [activeChat?.value]
  );

  const handleSend = () => {
    if (!inputValue.trim()) return;

    socket.sendMessageData(
      JSON.stringify({
        USER_MSG: inputValue.trim(),
        RECEIVER_NAME: activeChat?.value,
        ENTERED_BY: authState?.user?.id,
        ENTERED_DATE: authState?.workingDate,
        _isNewRow: true,
        TYPING_STATUS: "SEND",
      })
    );
    setShowEmojiPicker(false);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    socket.showTyping(
      JSON.stringify({
        ENTERED_BY: authState?.user?.id,
        TYPING_STATUS: "TYPING",
        RECEIVER_NAME: activeChat?.value,
        USER_MSG: value.trim(),
      })
    );

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.stopTyping(
        JSON.stringify({
          ENTERED_BY: authState?.user?.id,
          RECEIVER_NAME: activeChat?.value,
          USER_MSG: value.trim(),
        })
      );
    }, 2500);
  };

  const formatChatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today, ${time}`;
    if (isYesterday) return `Yesterday, ${time}`;
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    const hideStuff = () => {
      const el = document.querySelector(".epr_-kg0voo");
      if (el) (el as HTMLElement).style.display = "none";
    };

    if (showEmojiPicker) {
      // Attach outside click listener
      document.addEventListener("mousedown", handleClickOutside);

      // Periodically hide unwanted UI
      const interval = setInterval(hideStuff, 100);
      setTimeout(() => clearInterval(interval), 1000);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <Popover
      open={anchorEl}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        style: {
          maxWidth: "800px",
          width: "800px",
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          height: "60vh",
          padding: "0px !important",
        }}
      >
        <Box
          sx={{
            width: "35%",
            minWidth: "250px",
            maxWidth: "350px",
            boxShadow: 3,
          }}
        >
          <UserList
            setActiveChat={setActiveChat}
            activeChat={activeChat}
            inputMessageRef={inputMessageRef}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            bgcolor: "#f9f9f9",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 2,
              boxShadow: 3,
              minHeight: "73px",
              background: "var(--theme-color2)",
              color: "var(--theme-color3)",
              flexDirection: "column",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Typography variant="h6">
              {activeChat?.DESCRIPTION || "Select a user to start chatting"}
            </Typography>
            {activeChat?.value && isOnline && (
              <Typography variant="subtitle2" sx={{ color: "green" }}>
                Online
              </Typography>
            )}
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1 }}>
            <MessageList
              referance={messageListRef}
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={activeChat?.value ? socket?.messagesData : []}
            />
          </Box>
          {showEmojiPicker && (
            <Box
              ref={emojiPickerRef}
              sx={{
                position: "absolute",
                bottom: "64px",
                right: "12px",
                zIndex: 10,
              }}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                height={"48vh"}
                width={"29vw"}
              />
            </Box>
          )}

          <Box sx={{ position: "relative" }}>
            {/* Typing Indicator */}
            <Box
              sx={{
                position: "absolute",
                bottom: "75px",
                left: "25%",
                transform:
                  socket?.typing?.isTyping && activeChat?.value
                    ? "translateX(-50%) translateY(0px)" // Showed
                    : "translateX(-50%) translateY(30px)", // Hidden (niche)
                opacity: socket?.typing?.isTyping ? 1 : 0,
                backgroundColor: "#f5f5f5",
                borderRadius: "20px",
                px: 2,
                py: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                transition: "all 0.5s ease-in-out", // smooth transition
                pointerEvents: "none", // avoid click
                display: "flex",
                // alignContent :  'center'
              }}
            >
              <Avatar sx={{ width: 24, height: 24, marginRight: 1 }} />
              {/* Typing Text */}
              <Typography
                variant="body1"
                color="textSecondary"
                // sx={{ marginRight: 1 }}
              >
                {`${activeChat?.DESCRIPTION} is Typing`}
              </Typography>
              {/* Bouncing Dots */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Dot bounce={bounce} />
                <Dot bounce={bounce} delay="0.2s" />
                <Dot bounce={bounce} delay="0.4s" />
              </Box>
            </Box>

            {/* Input Box */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "var(--theme-color2)",
                padding: "4px",
                borderRadius: "10px",
                m: 1.5,
                boxShadow:
                  "rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px",
              }}
            >
              <IconButton
                size="medium"
                sx={{
                  color: "var(--theme-color3)",
                  boxShadow:
                    "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
                }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <EmojiEmotionsIcon />
              </IconButton>

              <TextField
                fullWidth
                inputRef={inputMessageRef}
                placeholder="Type a message..."
                value={inputValue}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                sx={{
                  mx: 1,
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    paddingRight: "8px",
                  },
                  "& fieldset": { border: "none" },
                }}
                InputProps={{
                  sx: {
                    padding: "0px !important",
                    fontSize: "20px !important",
                    letterSpacing: "1px !important",
                  },
                }}
              />

              <IconButton
                color="primary"
                onClick={handleSend}
                size="medium"
                sx={{
                  backgroundColor: "var(--theme-color3)",
                  boxShadow:
                    "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
                  "&:hover": {
                    backgroundColor: "var(--theme-color3)",
                  },
                  color: "#fff",
                  // p: 1,
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Popover>
  );
};
const Dot = ({ bounce, delay = "0s" }) => (
  <Box
    sx={{
      width: "8px",
      height: "8px",
      backgroundColor: "gray",
      borderRadius: "50%",
      margin: "0 4px",
      animation: `${bounce} 1.4s infinite both`,
      animationDelay: delay,
    }}
  />
);
