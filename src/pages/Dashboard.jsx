import { SearchUser } from '../components/SearchUser';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { MobileChat } from './MobileChat';

let url = import.meta.env.VITE_BASE_URL;
export function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [roomid, setRoomid] = useState('');
  const [messages, setMessages] = useState([]);
  const [sentBack, setSentBack] = useState(0);
  const [socket, setSocket] = useState(null);
  const [activeRoom, setActiveRoom] = useState('');
  const [activeHidden, setActiveHidden] = useState(true);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState({
    message: '',
  });
  const listRooms = async () => {
    await axios
      .get(`${url}/rooms`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((result) => {
        setRooms(result.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getMessages = async () => {
    await axios
      .get(`${url}/messages/${roomid}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((result) => {
        setMessages(result.data.data);
        // console.log(result.data.data);
        setSentBack(result.data.send_to);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendMessage = async () => {
    try {
      if (inputMessage.message !== '') {
        await axios.post(`${url}/send/${sentBack}`, inputMessage, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // if (socket && roomid) {
        //   // socket.emit('chat message', inputMessage, roomid);
        //   socket.emit('chat message', inputMessage, roomid);
        //   // getMessages();
        // }
        // setMessages((prevMessages) => [...prevMessages, inputMessage]);
        setInputMessage({ message: '' });
      } else {
        alert('Message harus diisi!');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengirim pesan!');
      console.error('Ada error saat mengirim pesan', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/home');
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
  }, [roomid]);

  const handleJoinRoom = (roomId) => {
    setRoomid(roomId);
    setActiveRoom(roomId);
    // Mengirim peristiwa 'joinRoom' ke server
  };

  useEffect(() => {
    // Scroll to the bottom when messages change
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    listRooms();
  }, []);

  useEffect(() => {
    if (roomid) {
      socket.emit('joinRoom', roomid);
    }
  }, [socket]);
  return (
    <section className="container mx-auto h-screen w-11/12 sm:w-8/12 flex justify-center items-center">
      <MobileChat />
      <div className="flex-grow hidden sm:block">
        <div className="grid grid-cols-12 w-full bg-gray-50 shadow-md">
          <div className="my-2 col-span-12 p-2">
            Login as,{' '}
            <span className="font-bold truncate">
              {localStorage.getItem('username')}
            </span>{' '}
            <span
              className="font-bold cursor-pointer text-red-700 hover:text-red-500"
              onClick={() => handleLogout()}
            >
              [ logout ]
            </span>{' '}
          </div>
          <div className="col-span-4 h-full">
            <SearchUser />
            <div className="overflow-y-auto h-[545px] sm:h-[445px]">
              {rooms.length !== 0 ? (
                rooms.map((item, index) => {
                  const participant1 = item?.participants?.[0];
                  const participant2 = item?.participants?.[1];

                  return (
                    <div
                      className={`p-2 border-b font-bold truncate cursor-pointer ${
                        activeRoom === item?.room_id ? 'bg-blue-300' : ''
                      }`}
                      onClick={() => {
                        handleJoinRoom(item?.room_id);
                        setActiveHidden(false);
                      }}
                      key={index}
                    >
                      {participant1 === localStorage.getItem('username')
                        ? participant2
                        : participant1}
                      <div className="flex justify-between">
                        <div className="text-left text-xs truncate font-normal w-1/2">
                          {item.last_message}
                        </div>
                        <div className="text-right text-xs truncate font-thin">
                          {new Date(item?.created_at).toLocaleString('id-ID', {
                            timeZone: 'Asia/Jakarta',
                            hour: 'numeric',
                            minute: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex justify-center items-center h-full words-break p-2">
                  Daftar kontak kosong, tambahkan teman dahulu lewat kotak
                  pencarian di atas
                </div>
              )}
            </div>
          </div>
          <div className="col-span-8 h-full bg-gray-100">
            <div
              className="overflow-y-auto h-[545px] sm:h-[445px] flex flex-col overflow-wrap-break-word"
              ref={messagesContainerRef}
            >
              {messages?.map((item, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg ${
                    parseInt(localStorage.getItem('id')) ===
                    parseInt(item?.sender_id)
                      ? 'bg-green-100 text-right self-end break-words max-w-40 sm:max-w-96'
                      : 'bg-blue-100 text-left self-start break-words max-w-40 sm:max-w-96'
                  } mb-2`}
                >
                  {item?.message}
                  {/* //fix this later */}
                  <div className="text-right text-xs truncate font-thin">
                    {item?.created_at &&
                      new Date(item?.created_at).toLocaleString('id-ID', {
                        timeZone: 'Asia/Jakarta',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                  </div>
                </div>
              ))}
            </div>
            <div
              className={`flex justify-center items-center ${
                activeHidden === true ? 'hidden' : ''
              }`}
            >
              <input
                type="text"
                className="p-3 w-9/12 truncate"
                placeholder="Input message"
                name="message"
                value={inputMessage.message}
                onChange={(e) =>
                  setInputMessage({ ...inputMessage, message: e.target.value })
                }
              />
              <button
                className="p-3 bg-green-300 font-bold text-white w-3/12 truncate"
                onClick={() => sendMessage()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
