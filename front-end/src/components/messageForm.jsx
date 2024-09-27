import React from "react";

function MessageForm() {
  return (
    <form id="MessageForm">
      <input type="text" id="MessageInput" />
      <button className="Send">
        <i className="fa-solid fa-paper-plane"></i>
      </button>
    </form>
  );
}

export default MessageForm;
