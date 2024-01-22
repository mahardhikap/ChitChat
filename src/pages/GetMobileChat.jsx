import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate, useParams, Link } from 'react-router-dom';

let url = import.meta.env.VITE_BASE_URL;
export function GetMobileChat() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [sentBack, setSentBack] = useState(0);
  const [profile, setProfile] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState({
    message: '',
  });

  const getMessages = async () => {
    await axios
      .get(`${url}/messages/${id}`, {
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

  const getProfileRecipient = async () => {
    await axios
      .get(`${url}/user/${sentBack}`)
      .then((result) => {
        setProfile(result.data.data.username);
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

  useEffect(() => {
    if (id !== '') {
      getMessages();
    }
  }, [id]);

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
  }, [id]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    console.log('About to emit joinRoom event');
    if (socket) {
      socket.emit('joinRoom', id);
      console.log('joinRoom event emitted');
    }
  }, [socket, id]);

  useEffect(() => {
    if (sentBack) {
      getProfileRecipient();
    }
  }, [sentBack]);
  return (
    <section className="container mx-auto block w-11/12 sm:hidden">
      <div className="flex justify-center flex-col h-screen">
        <div className="p-2 bg-gray-50 font-bold text-blue-400 flex justify-between items-center">
          <div className="text-black">{profile}</div>
          <div>
            <Link to={-1}>back</Link>
          </div>
        </div>
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
        <div className="flex justify-center items-center">
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
    </section>
  );
}
