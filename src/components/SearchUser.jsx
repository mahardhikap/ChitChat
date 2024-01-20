import React, { useState, useEffect } from 'react';
import axios from 'axios';
let url = import.meta.env.VITE_BASE_URL;
export function SearchUser() {
  const [inputSearch, setInputSearch] = useState('');
  const firstMessage = {
    message:'Hi!'
  }
  const handleSearchUsername = () => {
    axios.get(`${url}/username/${inputSearch}`).then((result) => {
        console.log(result.data.data.username)
        axios.post(`${url}/send/${result.data.data.id}`, firstMessage, {headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }})
        setInputSearch('')
    }).catch((err) => {
        console.log(err)
    });
  };

  return (
    <div className="flex justify-center items-center flex-row">
      <input
        type="text"
        placeholder="search username"
        className="p-3 w-full"
        name="search"
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
      />
      <button
        className="p-3 bg-green-300 font-bold text-white"
        onClick={() => handleSearchUsername()}
      >
        Hi
      </button>
    </div>
  );
}
