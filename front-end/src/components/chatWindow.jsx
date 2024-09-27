import React from "react";
import ChatHead from "./chatHead";
import MessageContainer from "./messageContainer";
import MessageForm from "./messageForm";

function ChatWindow() {
  return (
    <section className="Chat">
      <ChatHead />
      <MessageContainer />
      <MessageForm />
    </section>
  );
}

export default ChatWindow;
