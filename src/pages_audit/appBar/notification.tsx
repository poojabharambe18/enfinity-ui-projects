import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  IconButton,
  Link,
  List,
  ListItemButton,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useQuery } from "react-query";
import { getNotificationData } from "./api";
import { queryClient } from "@acuteinfo/common-base";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import { deepPurple } from "@mui/material/colors";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import SelectRenderOnly from "@acuteinfo/common-base";

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "999px",
  padding: "0",
  color: "green",
  textTransform: "lowercase",
  backgroundColor: "rgba(135, 178, 146, 0.2)",
  "&:hover": {
    backgroundColor: "rgba(135, 178, 146, 0.6)",
  },
}));

const UnreadButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: "rgba(247, 193 ,187,0.4)",
  padding: "0",
  color: "rgb(244, 67, 54)",
  "&:hover": {
    backgroundColor: "rgba(247, 193, 187,0.7)",
  },
}));

const SpacedGridItem = styled(Grid)(({ theme }) => ({
  // marginTop: "15px",
  paddingLeft: "50px",
  gap: theme.spacing(),
  "& > *": {
    marginRight: theme.spacing(1.1),
  },
}));

export const Notification_App = () => {
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [notiFication, setNotiFication] = useState("All");

  const handleChange = (event) => {
    setNotiFication(event.target.value);
  };

  const { data, isLoading, refetch } = useQuery(["getNotificationData"], () =>
    getNotificationData()
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getNotificationData"]);
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl1(null);
  };
  const options = [
    { label: "All Notifications", value: "All" },
    { label: "New", value: "New" },
    { label: "Unread", value: "Read" },
  ];

  const getIcon = (icon) => {
    switch (icon) {
      case "AccountCircleIcon":
        return <AccountCircleIcon />;
      case "PersonIcon":
        return <PersonIcon />;
      case "TaskAltIcon":
        return <TaskAltIcon />;
      default:
        return null;
    }
  };

  const getTimeDifference = (timestamp) => {
    const currentTime = new Date().getTime(); // Get current time in milliseconds
    const notificationTime = new Date(timestamp).getTime(); // Get notification time in milliseconds
    const timeDifference = Math.abs(currentTime - notificationTime);
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    if (minutesDifference < 1) {
      return "Just now";
    } else if (minutesDifference < 60) {
      return `${minutesDifference} mins ago`;
    } else {
      const hoursDifference = Math.floor(minutesDifference / 60);
      if (hoursDifference < 24) {
        return `${hoursDifference} hours ago`;
      } else {
        const daysDifference = Math.floor(hoursDifference / 24);
        return `${daysDifference} days ago`;
      }
    }
  };

  const listitem = [
    {
      id: "1",
      title: "New Feature Added",
      message: "Explore our latest feature: Dark Mode!",
      type: "feature",
      link: "https://www.example.com/dark-mode",
      severity: "info",
      timestamp: "2024-04-16T08:30:00Z",
      icon: "AccountCircleIcon",
      read: true,
    },
    {
      id: "2",
      title: "Maintenance Notice",
      message: "Our website will be undergoing maintenance on April 18th.",
      type: "maintenance",
      severity: "warning",
      timestamp: "2024-04-16T09:45:00Z",
      icon: "PersonIcon",
      read: true,
    },
    {
      id: "3",
      title: "Critical Security Update",
      message: "Please update your password immediately.",
      type: "security",
      link: "https://www.example.com/password-update",
      severity: "error",
      timestamp: "2024-04-16T10:15:00Z",
      icon: "TaskAltIcon",
      read: true,
    },
    {
      id: "4",
      title: "Holiday Closure",
      message:
        "Our offices will be closed on April 19th in observance of the holiday.",
      type: "holiday",
      severity: "info",
      timestamp: "2024-04-16T11:00:00Z",
      icon: "AccountCircleIcon",
      read: true,
    },
    {
      id: "5",
      title: "Product Launch Event",
      message: "Join us for the launch of our new product line!",
      type: "event",
      link: "https://www.example.com/product-launch",
      severity: "info",
      timestamp: "2024-04-16T12:30:00Z",
      icon: "PersonIcon",
      read: false,
    },
    {
      id: "6",
      title: "Server Downtime",
      message: "Our servers will be down for maintenance tonight.",
      type: "maintenance",
      severity: "warning",
      timestamp: "2024-04-16T13:45:00Z",
      icon: "TaskAltIcon",
      read: true,
    },
    {
      id: "7",
      title: "Upcoming Webinar",
      message: "Register now for our upcoming webinar on AI in Healthcare!",
      type: "webinar",
      link: "https://www.example.com/ai-healthcare-webinar",
      severity: "info",
      timestamp: "2024-04-16T14:15:00Z",
      icon: "AccountCircleIcon",
      read: false,
    },
    {
      id: "8",
      title: "Payment Processing Delay",
      message:
        "We are experiencing a delay in processing payments. Please bear with us.",
      type: "payment",
      severity: "warning",
      timestamp: "2024-04-16T15:00:00Z",
      icon: "PersonIcon",
      read: true,
    },
    {
      id: "9",
      title: "New Blog Post",
      message: "Check out our latest blog post on tips for remote work!",
      type: "blog",
      link: "https://www.example.com/remote-work-tips",
      severity: "info",
      timestamp: "2024-04-16T16:30:00Z",
      icon: "TaskAltIcon",
      read: false,
    },
    {
      id: "10",
      title: "Product Recall",
      message:
        "Important: We are recalling a batch of our product due to safety concerns.",
      type: "recall",
      severity: "error",
      timestamp: "2024-04-16T17:15:00Z",
      icon: "AccountCircleIcon",
      read: true,
    },
    {
      id: "11",
      title: "Scheduled System Upgrade",
      message: "Our systems will undergo a scheduled upgrade this weekend.",
      type: "upgrade",
      severity: "info",
      timestamp: "2024-04-16T18:00:00Z",
      icon: "PersonIcon",
      read: false,
    },
    {
      id: "12",
      title: "Weather Advisory",
      message: "Severe weather warning: Expect heavy rain and strong winds.",
      type: "weather",
      severity: "warning",
      timestamp: "2024-04-16T19:30:00Z",
      icon: "TaskAltIcon",
      read: true,
    },
    {
      id: "13",
      title: "Feedback Survey",
      message: "We'd love to hear your feedback! Take our survey now.",
      type: "survey",
      link: "https://www.example.com/feedback-survey",
      severity: "info",
      timestamp: "2024-04-16T20:15:00Z",
      icon: "AccountCircleIcon",
      read: false,
    },
    {
      id: "14",
      title: "Network Outage",
      message: "We are experiencing a network outage affecting some services.",
      type: "outage",
      severity: "error",
      timestamp: "2024-04-16T21:00:00Z",
      icon: "PersonIcon",
      read: true,
    },
    {
      id: "15",
      title: "System Update Complete",
      message: "Our system update is complete. Thank you for your patience.",
      type: "update",
      severity: "info",
      timestamp: "2024-04-16T22:30:00Z",
      icon: "TaskAltIcon",
      read: true,
    },
  ];

  const filteredList = listitem.filter((item) => {
    if (notiFication === "All") return true;
    if (notiFication === "New") return !item.read;
    if (notiFication === "Read") return item.read;
    return true;
  });

  return (
    <>
      <Tooltip title="Notification" placement="bottom" arrow>
        <IconButton
          onClick={handleClick}
          sx={{
            backgroundColor: anchorEl1
              ? "var(--theme-color3)"
              : "rgba(235, 237, 238, 0.45)",
            borderRadius: "10px",
            height: "30px",
            width: "30px",
            "& svg": {
              display: "flex",
            },
            "&:hover": {
              background: "var(--theme-color2)",
              borderRadius: "10px",
              transition: "all 0.2s ease 0s",
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              "& svg": {
                height: "25px",
                width: "25px",
                transition: "all 0.2s ease 0s",
              },
            },
          }}
        >
          <NotificationsNoneIcon
            fontSize="small"
            sx={{
              color: anchorEl1 ? "var(--theme-color2)" : "var(--theme-color3)",
            }}
          />
        </IconButton>
      </Tooltip>

      <Popover
        anchorEl={anchorEl1}
        open={Boolean(anchorEl1)}
        onClose={handleClose}
        elevation={8}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { height: 500, "::-webkit-scrollbar": { display: "none" } },
        }} // Fixed height
      >
        <Box>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              background: "white",
              p: 2,
              pb: 0,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{ width: "200px" }}
                variant="subtitle1"
                noWrap
                fontWeight="bold"
              >
                All Notifications{" "}
              </Typography>
              <Link
                sx={{ color: "black", textDecoration: "underline" }}
                href="#"
                variant="body2"
              >
                Mark all as read
              </Link>
            </Box>
            <Box sx={{ p: 1 }}>
              {/* <SelectRenderOnly
                fullWidth
                touched={false}
                value={notiFication}
                handleChange={(e) => setNotiFication(e.target.value)}
                options={options}
              /> */}
            </Box>
          </Box>
          <Box sx={{ flex: "auto", overflowY: "auto", height: 500 }}>
            {filteredList.map((data, index) => (
              <List disablePadding key={index}>
                <ListItemButton
                  sx={{ padding: "0px", backgroundColor: "white" }}
                >
                  <Card
                    sx={{
                      maxWidth: "370px",
                      width: "100%",
                      background: "transparent",
                      padding: "0px",
                    }}
                  >
                    <CardContent sx={{ paddingBottom: "9px !important" }}>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid item>
                          <CardHeader
                            sx={{ padding: 0 }}
                            avatar={
                              <Avatar
                                sx={{ background: "var(--theme-color3)" }}
                              >
                                {getIcon(data.icon)}
                              </Avatar>
                            }
                            title={
                              <Typography
                                sx={{ width: "200px" }}
                                variant="subtitle1"
                                noWrap
                                fontWeight="bold"
                              >
                                {data.title}
                              </Typography>
                            }
                          />
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                          >
                            {getTimeDifference(data.timestamp)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Typography
                        sx={{ padding: "0px 0px 0px 50px" }}
                        variant="body2"
                        color="text.secondary"
                      >
                        {data.message}
                      </Typography>
                      <SpacedGridItem sx={{ marginTop: "10px" }}>
                        <StyledButton variant="outlined">New</StyledButton>
                        <UnreadButton variant="outlined">Unread</UnreadButton>
                      </SpacedGridItem>
                    </CardContent>
                  </Card>
                </ListItemButton>
              </List>
            ))}
          </Box>
          <Box
            sx={{
              flex: "none",
              position: "sticky",
              bottom: 0,
              zIndex: 1,
              p: 2,
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              background: "white",
              textAlign: "center",
            }}
          >
            <Link sx={{ color: "black" }} href="#" variant="body2">
              View All
            </Link>
          </Box>
        </Box>
      </Popover>
    </>
  );
};
