import React, { useEffect } from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid } from "@mui/material";
import { sampleChats } from "@/constants/sampleData";
import ChatList from "@/specific/ChatList";
import { useParams } from "react-router-dom";
import Profile from "@/specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import toast from "react-hot-toast";
import { useErrors } from "../../hooks/hook";
import { useSelector } from "react-redux";
import { getSocket } from "../../socket";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    const { data, isLoading, isError, error } = useMyChatsQuery("");
    const { user } = useSelector((state) => state.auth);
    useErrors([{ isError, error }]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("Delete Chat", _id, groupChat);
    };
    const socket = getSocket();
    console.log(socket.id);
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
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
              />
            )}
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
            <Profile user={user} />
          </Grid>
        </Grid>
      </div>
    );
  };
};

export default AppLayout;
