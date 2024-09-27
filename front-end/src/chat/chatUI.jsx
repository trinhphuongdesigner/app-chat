import React from "react";
import "./chatUI.css";
import Navbar from "../components/navbar";
import ChatFilter from "../components/chatFilter";
import ChatWindow from "../components/chatWindow";

function ChatUI() {
  return (
    <main>
      <Navbar />
      <ChatFilter />
      <ChatWindow />
    </main>
  );
}

export default ChatUI;
