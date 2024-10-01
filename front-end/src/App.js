/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import Toast from 'components/Toast';
import AppRouter from 'router';
import socketIOClient from 'socket.io-client';

function App() {
  const [mess, setMess] = useState([]);
  const [message, setMessage] = useState('');
  const [id, setId] = useState();

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(process.env.REACT_APP_HOST_URL);

    socketRef.current.on('getId', (data) => {
      setId(data);
    }); // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.

    socketRef.current.on('sendDataServer', (dataGot) => {
      setMess((oldMsgs) => [...oldMsgs, dataGot.data]);
    }); // mỗi khi có tin nhắn thì mess sẽ được render thêm

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message !== null) {
      const msg = {
        content: message,
        id,
      };

      socketRef.current.emit('sendDataClient', msg);

      /* Khi emit('sendDataClient') bên phía server sẽ nhận được sự kiện có tên 'sendDataClient' và handle như câu lệnh trong file index.js
            socket.on("sendDataClient", function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
              socketIo.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
            })
      */
      setMessage('');
    }
  };

  const renderMess = mess.map((m, index) => (
    <div
      // key={index}
      className={`${m.id === id ? 'your-message' : 'other-people'} chat-item`}
    >
      {m.content}
    </div>
  ));

  return (
    <>
      <Toast />
      <AppRouter />

      {/* <div className="box-chat">
        <div className="box-chat_message">{renderMess}</div>

        <div className="send-box">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn ..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div> */}
    </>
  );
}

export default App;
