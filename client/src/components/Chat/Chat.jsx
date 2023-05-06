import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { io } from "socket.io-client";

const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { search } = useLocation();
  const ENDPOINT = "localhost:5700";
  const socket = io(ENDPOINT);

  useEffect(() => {
    const { name, room } = Object.fromEntries(new URLSearchParams(search));
    setName(name);
    setRoom(room);
  }, [socket, search]);

  socket.emit("join", { name, room }, () => {});

  useEffect(() => {
    socket.on("message", (message) => {
      return setMessages([...messages, message]);
    });
  }, [messages, socket]);
  // fromServer = "Vinay Dev";
  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", { message }, () => {
        setMessage("");
      });
    }
  };
  console.log(message, messages);
  return (
    <div>
      <h1>Chat</h1>
      <input
        value={message}
        type="text"
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
