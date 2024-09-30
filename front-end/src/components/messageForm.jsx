import React from 'react';

function MessageForm() {
  return (
    <form id="MessageForm">
      <input type="text" id="MessageInput" />
      <button className="Send" type="button" aria-label="search">
        <i className="fa-solid fa-paper-plane" />
      </button>
    </form>
  );
}

export default MessageForm;
