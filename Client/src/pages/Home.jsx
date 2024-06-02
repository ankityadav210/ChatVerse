import AppLayout from "@/components/layout/AppLayout";
import React from "react";

const Home = () => {
  return (
    <div className="p-4 text-center text-3xl">Select a Friend to Chat</div>
  );
};

export default AppLayout()(Home);
