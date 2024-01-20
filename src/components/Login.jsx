import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
let url = import.meta.env.VITE_BASE_URL;
export function Login() {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate()
  const handleLogin = () => {
    axios
      .post(`${url}/login`, userData)
      .then((response) => {
        localStorage.setItem('id', response.data.data.id);
        localStorage.setItem('username', response.data.data.username);
        localStorage.setItem('token', response.data.data.token);
        alert('Login berhasil!');
        navigate('/dashboard')
      })
      .catch((error) => {
        alert('Login gagal!')
        console.error('Login failed:', error);
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
        type="password"
        className="p-3 border-2 rounded-lg w-full"
        placeholder="password"
        name="password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
      />
      <button className="p-3 rounded-lg w-full bg-green-300 font-bold text-white" onClick={() => handleLogin()}>
        Login
      </button>
    </div>
  );
}
