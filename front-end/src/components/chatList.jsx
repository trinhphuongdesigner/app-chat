import React from "react";

const list = [
  {
    avatar: "imgs/Asset 1.svg",
    groupName: "David Johnson",
    groupDescrp: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    avatar: "imgs/Asset 1.svg",
    groupName: "David Johnson",
    groupDescrp: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    avatar: "imgs/Asset 1.svg",
    groupName: "David Johnson",
    groupDescrp: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    avatar: "imgs/Asset 1.svg",
    groupName: "David Johnson",
    groupDescrp: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    avatar: "imgs/Asset 1.svg",
    groupName: "David Johnson",
    groupDescrp: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    avatar: "imgs/Asset 1.svg",
    groupName: "David Johnson",
    groupDescrp: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    avatar: "imgs/Asset 1.svg",
    groupName: "David Johnson",
    groupDescrp: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    avatar: "imgs/Asset 1.svg",
    groupName: "David Johnson",
    groupDescrp: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    avatar: "imgs/Asset 1.svg",
    groupName: "David Johnson",
    groupDescrp: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    avatar: "imgs/Asset 1.svg",
    groupName: "David Johnson",
    groupDescrp: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    avatar: "imgs/Asset 1.svg",
    groupName: "David Johnson",
    groupDescrp: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
];

function ChatList() {
  return list.map((group) => (
    <li className="group">
      <div className="avatar">
        <img src={group.avatar} alt="" />
      </div>

      <p className="GroupName">{group.groupName}</p>

      <p className="GroupDescrp">{group.groupDescrp}</p>
    </li>
  ));
}

export default ChatList;
