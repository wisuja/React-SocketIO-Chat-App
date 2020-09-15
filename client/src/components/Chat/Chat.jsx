import React, { useState, useEffect } from 'react';
import queryString from "query-string";
import io from "socket.io-client";

import { Infobar, Input, Messages, TextContainer } from '..';

import './Chat.css';

let socket;

function Chat({ location }) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const ENDPOINT = 'https://reactsocketio-chatapp.herokuapp.com';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, (error) => {
      console.log(error)
    });

    return () => {
      socket.emit('disconnect');

      socket.off();
    }
  }, [ENDPOINT, location.search])

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    })
  }, [messages]);

  useEffect(() => {
    socket.on('room_data', ({ room, users }) => {
      setUsers(users);
    })
  }, [users]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message)
      socket.emit('send_message', message, () => {
        setMessage('');
      })
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <Infobar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users} />
    </div>
  )
}

export default Chat
