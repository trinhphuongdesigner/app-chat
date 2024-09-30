import React from 'react';

function ChatHead() {
  return (
    <div className="ChatHead">
      <li className="group">
        <div className="avatar">
          <img src="imgs/Asset 1.svg" alt="" />
        </div>
        <p className="GroupName">David Johnson</p>
      </li>
      <div className="callGroup">
        <i className="fa-solid fa-phone" />
        <i className="fa-solid fa-video" />
      </div>
    </div>
  );
}

export default ChatHead;
