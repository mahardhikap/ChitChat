import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const App = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const socket = io('http://localhost:3001');

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/messages/all', {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInUzZXJuYW1lIjoibWFoYXJkaGlrYSIsImlhdCI6MTcwNTQ3MjIwMX0.sHEWMjEkoF_Am8CJSzqJI3Pf-1ZtvT6U6e3DDNb0PMw',
          },
        });
  
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching all messages:', error);
      }
    };
  
    // Fetch all messages when the component mounts
    fetchAllMessages();
  
    // Listen for real-time updates in rooms and selected room
    if (socket) {
      socket.on('updateRooms', (updatedRooms) => {
        setRooms(updatedRooms);
      });
  
      socket.on('updateMessages', (room_id, updatedMessages) => {
        if (room_id === selectedRoom) {
          setMessages(updatedMessages);
        }
      });
  
      socket.on('chat history', (history) => {
        setMessages(history);
      });
  
      socket.on('chat message', (newMessage) => {
        if (newMessage.room_id === selectedRoom) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });
  
      return () => {
        socket.disconnect();
      };
    }
  }, [socket, selectedRoom]);

  const listRooms = async () => {
    try {
      const response = await axios.get('http://localhost:3001/chatrooms', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFoYXJkaGlrYSIsImlhdCI6MTcwNTQ3MjIwMX0.sHEWMjEkoF_Am8CJSzqJI3Pf-1ZtvT6U6e3DDNb0PMw', // Ganti dengan token yang valid
        },
      });
      setRooms(response.data.chatrooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const selectRoom = async (room_id) => {
    try {
      // Panggil endpoint untuk mendapatkan pesan dari room tertentu
      const response = await axios.get(
        `http://localhost:3001/chatroom/${room_id}`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibWFoYXJkaGlrYSIsImlhdCI6MTcwNTQ3MjIwMX0.sHEWMjEkoF_Am8CJSzqJI3Pf-1ZtvT6U6e3DDNb0PMw',
          },
        }
      );

      // Update state pesan
      setMessages(response.data.messages);

      // Set room yang dipilih
      setSelectedRoom(room_id);

      // Emit 'join room' event
      socket.emit('join room', room_id);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    // Panggil fungsi listRooms untuk mendapatkan daftar ruangan saat komponen pertama kali dimuat
    listRooms();
  }, []);

  const sendMessage = async (message) => {
    try {
      // Send the message to the server
      await axios.post(
        `http://localhost:3001/send-message/2`,
        {
          message,
        },
        {
          headers: {
            Authorization: 'Bearer <token>',
          },
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendMessage = (message) => {
    // Update the local state and send the message
    setMessages((prevMessages) => [...prevMessages, message]);
    sendMessage(message.message);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <h1 className="text-lg font-bold mb-4">Room List</h1>
        <ul>
          {rooms?.map((room) => (
            <li
              key={room.room_id}
              onClick={() => selectRoom(room.room_id)}
              className={`cursor-pointer hover:bg-gray-300 p-2 ${
                selectedRoom === room.room_id ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {room.sender_username} - {room.recipient_username}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 p-4">
        <div className="border border-gray-300 p-4 h-64 overflow-y-auto">
          {/* Tampilkan pesan-pesan atau konten yang sesuai dengan room yang dipilih */}
          {messages?.map((message, index) => (
            <div key={index} className="mb-2">
              <strong className="text-blue-500">
                {message.sender_username}:
              </strong>{' '}
              {message.message}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Type your message..."
              className="border border-gray-300 p-2 w-3/4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const message = e.target.value.trim();
                  if (message) {
                    handleSendMessage({
                      message,
                    });
                    e.target.value = '';
                  }
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('.border-gray-300');
                const message = input.value.trim();
                if (message) {
                  handleSendMessage({
                    message,
                  });
                  input.value = '';
                }
              }}
              className="ml-2 p-2 bg-blue-500 text-white"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;