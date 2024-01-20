import { SearchUser } from '../components/SearchUser';
import { ListRooms } from '../components/ListRooms';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

let url = import.meta.env.VITE_BASE_URL;
export function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [roomid, setRoomid] = useState('');
  const [messages, setMessages] = useState([]);
  const [sentBack, setSentBack] = useState(0);
  const [socket, setSocket] = useState(null);
  const [activeRoom, setActiveRoom] = useState('');
  const [inputMessage, setInputMessage] = useState({
    message: '',
  });
  const listRooms = () => {
    axios
      .get(`${url}/rooms`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((result) => {
        setRooms(result.data.data);
        // console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMessages = () => {
    axios
      .get(`${url}/messages/${roomid}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((result) => {
        setMessages(result.data.data);
        setSentBack(result.data.send_to);
        // console.log(result.data.send_to);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendMessage = () => {
    axios
      .post(`${url}/send/${sentBack}`, inputMessage, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((result) => {
        console.log(result);
        // setTimeout(() => {
        //   getMessages();
        // }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (roomid !== '') {
      getMessages();
    }
  }, [roomid]);

  
  useEffect(() => {
    const newSocket = io(url);

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    // newSocket.on('list myrooms', (rms) => {
    //   setRooms((prevRooms) => [...prevRooms, rms]);
    // });

    newSocket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.removeAllListeners();
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    listRooms();
  }, []);
  return (
    <section className="container mx-auto h-screen w-full sm:w-1/2 bg-neutral-50">
      <SearchUser />
      <div className="grid grid-cols-12 w-full h-[620px] sm:h-[500px]">
        <div className="col-span-3 h-full">
          <div className="overflow-y-auto h-[620px] sm:h-[480px]">
            {rooms.map((item, index) => {
              const participant1 = item?.participants?.[0];
              const participant2 = item?.participants?.[1];

              return (
                <div
                  className={`p-3 border-b font-bold truncate cursor-pointer ${
                    activeRoom === item?.room_id ? 'bg-blue-200' : ''
                  }`}
                  onClick={() => {
                    setRoomid(item?.room_id);
                    setActiveRoom(item?.room_id);
                  }}
                  key={index}
                >
                  {participant1 === localStorage.getItem('username')
                    ? participant2
                    : participant1}
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-span-9 h-full bg-gray-100">
          <div className="overflow-y-auto h-[620px] sm:h-[480px] flex flex-col">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  parseInt(localStorage.getItem('id')) ===
                  parseInt(item?.sender_id)
                    ? 'bg-green-100 text-right self-end'
                    : 'bg-blue-100 text-left self-start'
                } mb-2`}
              >
                {item?.message}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <input
          type="text"
          className="p-3 w-full"
          placeholder="Input message"
          name="message"
          value={inputMessage.message}
          onChange={(e) =>
            setInputMessage({ ...inputMessage, message: e.target.value })
          }
        />
        <button
          className="p-3 bg-green-300 font-bold text-white"
          onClick={() => sendMessage()}
        >
          Send
        </button>
      </div>
    </section>
  );
}
