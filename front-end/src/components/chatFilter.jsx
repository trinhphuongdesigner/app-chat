import React from 'react';
import ChatList from 'components/chatList';

function ChatFilter() {
  return (
    <div className="sideNav2">
      <div className="chatFilterGroup">
        <div className="chatFilters">
          <h2>Chats</h2>
          <i className="fa-solid fa-filter" />
          <i className="fa-solid fa-user-plus" />
        </div>
        <div className="SearchInputHolder">
          <i className="fa-solid fa-magnifying-glass" />
          <input className="searchInput" placeholder="Search For Chat.." />
          <hr />
        </div>
      </div>

      <ChatList />
    </div>
  );
}

export default ChatFilter;
