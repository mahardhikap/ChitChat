import { SearchUser } from '../components/SearchUser';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
let url = import.meta.env.VITE_BASE_URL;
export function MobileChat() {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState('');
  const navigate = useNavigate();
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
  const handleJoinRoom = (roomId) => {
    setActiveRoom(roomId);
    navigate(`/mobile/${roomId}`);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate('/home');
  };
  useEffect(() => {
    listRooms();
  }, []);
  return (
    <section className="container mx-auto block w-11/12 sm:hidden">
      <div className="flex justify-center flex-col h-screen">
      <div className="p-2 bg-gray-50">
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
      <SearchUser />
        <div className="overflow-y-auto w-full h-[545px] sm:h-[445px] bg-gray-50">
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
              Daftar kontak kosong, tambahkan teman dahulu lewat kotak pencarian
              di atas
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
