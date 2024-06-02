import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid } from "@mui/material";
import { sampleChats } from "@/constants/sampleData";
import ChatList from "@/specific/ChatList";
import { useParams } from "react-router-dom";
import Profile from "@/specific/Profile";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("Delete Chat", _id, groupChat);
    };
    return (
      <div className="overflow-y-hidden">
        <Title />
        <Header />
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            <ChatList
              chats={sampleChats}
              chatId={chatId}
              newMessagesAlert={[{ chatId, count: 4 }]}
              handleDeleteChat={handleDeleteChat}
              onlineUsers={["1", "2", "3", "4"]}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "black",
            }}
          >
            <Profile />
          </Grid>
        </Grid>
      </div>
    );
  };
};

export default AppLayout;
