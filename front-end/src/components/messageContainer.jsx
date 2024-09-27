import React from "react";

const list = [
  {
    messageContent: "Hello!",
    time: "3:21 PM",
    isRead: true,
    isMySender: true,
  },
  {
    messageContent: "How are You!",
    time: "3:22 PM",
    isRead: true,
    isMySender: true,
  },
  {
    messageContent: "I'm Fine!",
    time: "3:30 PM",
    isRead: true,
  },
  {
    messageContent: "How are You!",
    time: "3:32 PM",
    isRead: true,
  },
  {
    messageContent: "I'm also Fine!",
    time: "3:36 PM",
    isRead: true,
    isMySender: true,
  },
  {
    messageContent: "Send Me the Pics!",
    time: "3:38 PM",
    isRead: true,
    isMySender: true,
  },
  {
    messageContent: "Sorry for the Delay!",
    time: "8:38 AM",
    isRead: true,
  },
  {
    messageContent: "Here are Pics!",
    time: "8:42 AM",
    isRead: true,
  },
  {
    messageContent: "Hello!",
    time: "3:21 PM",
    isRead: true,
    isMySender: true,
  },
  {
    messageContent: "How are You!",
    time: "3:22 PM",
    isRead: true,
    isMySender: true,
  },
  {
    messageContent: "I'm Fine!",
    time: "3:30 PM",
    isRead: true,
  },
  {
    messageContent: "How are You!",
    time: "3:32 PM",
    isRead: true,
  },
  {
    messageContent: "I'm also Fine!",
    time: "3:36 PM",
    isRead: true,
    isMySender: true,
  },
  {
    messageContent: "Send Me the Pics!",
    time: "3:38 PM",
    isRead: true,
    isMySender: true,
  },
  {
    messageContent: "Sorry for the Delay!",
    time: "8:38 AM",
    isRead: true,
  },
  {
    messageContent: "Here are Pics!",
    time: "8:42 AM",
    isRead: true,
  },
];

function MessageContainer() {
  return (
    <div className="MessageContainer">
      <div className="messageSeperator">Yesterday</div>

      {list.map((mess) => (
        <div className={`message ${mess.isMySender ? "me" : "you"}`}>
          <p className="messageContent">{mess.messageContent}</p>

          <div className="messageDetails">
            <div className="messageTime">{mess.time}</div>

            {mess.isRead && <i className="fa-solid fa-check" />}
          </div>
        </div>
      ))}

      <div className="messageSeperator">Today</div>
    </div>
  );
}

export default MessageContainer;
