import React from 'react';
import ChatFilter from 'components/chatFilter';
import ChatWindow from 'components/chatWindow';
import Navbar from 'components/navbar';

import './chatUI.scss';

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
