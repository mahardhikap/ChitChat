import axios from 'axios';
import React, { useState, useEffect } from 'react';
let url = import.meta.env.VITE_BASE_URL;
export function Register() {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });
  const handleRegister = () => {
    axios
      .post(`${url}/register`, userData)
      .then((response) => {
        alert('Registrasi berhasil, click halaman login!');
        console.log(response.data.message)
      })
      .catch((error) => {
        alert('Registrasi gagal, username sudah digunakan!')
        console.error('Register failed:', error);
      });
  };
  return (
    <div className="flex flex-col gap-2 w-full my-10">
      <input
        type="text"
        className="p-3 border-2 rounded-lg w-full"
        placeholder="username"
        name="username"
        value={userData.username}
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
      />
      <input
        type="text"
        className="p-3 border-2 rounded-lg w-full"
        placeholder="password"
        name="password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
      />
      <button className="p-3 rounded-lg w-full bg-green-300 font-bold text-white hover:bg-green-600" onClick={()=>handleRegister()}>
        Register
      </button>
    </div>
  );
}
