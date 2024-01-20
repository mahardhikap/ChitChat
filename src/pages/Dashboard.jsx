import { SearchUser } from '../components/SearchUser';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

let url = import.meta.env.VITE_BASE_URL;
export function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [roomid, setRoomid] = useState('');
  const [messages, setMessages] = useState([]);
  const [sentBack, setSentBack] = useState(0);
  const [socket, setSocket] = useState(null);
  const [activeRoom, setActiveRoom] = useState('');
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();
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
        console.log(result.data.data);
        setSentBack(result.data.send_to);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendMessage = async () => {
    try {
      if (inputMessage.message !== '') {
        axios.post(
          `${url}/send/${sentBack}`,
          inputMessage,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
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

    // newSocket.on('list myrooms', (rms) => {
    //   setRooms((prevRooms) => [...prevRooms, rms]);
    // });

    newSocket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.removeAllListeners();
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    listRooms();
  }, []);
  return (
    <section className="container mx-auto h-screen w-11/12 sm:w-8/12 flex justify-center items-center">
      <div className="flex-grow">
        <div className="my-2">
          Login as, {localStorage.getItem('username')}{' '}
          <span
            className="font-bold cursor-pointer text-red-500"
            onClick={() => handleLogout()}
          >
            [ logout ]
          </span>{' '}
        </div>
        <SearchUser />
        <div className="grid grid-cols-12 w-full bg-blue-50">
          <div className="col-span-3 h-full">
            <div className="overflow-y-auto h-[500px] sm:h-[400px]">
              {rooms.map((item, index) => {
                const participant1 = item?.participants?.[0];
                const participant2 = item?.participants?.[1];

                return (
                  <div
                    className={`p-2 mx-2 border-b font-bold truncate cursor-pointer ${
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
                    {/* <div className='text-right text-xs truncate font-normal'>{new Date(item?.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div> */}
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
              })}
            </div>
          </div>
          <div className="col-span-9 h-full bg-gray-100">
            <div
              className="overflow-y-auto h-[500px] sm:h-[400px] flex flex-col overflow-wrap-break-word"
              ref={messagesContainerRef}
            >
              {messages.map((item, index) => (
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
                  <div className='text-right text-xs truncate font-thin'>
                    {new Date(item?.created_at).toLocaleString('id-ID', {
                      timeZone: 'Asia/Jakarta',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </div>
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
      </div>
    </section>
  );
}
