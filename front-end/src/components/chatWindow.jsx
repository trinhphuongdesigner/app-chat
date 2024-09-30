import React from 'react';
import ChatHead from 'components/chatHead';
import MessageContainer from 'components/messageContainer';
import MessageForm from 'components/messageForm';

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
