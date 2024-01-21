import React, { useState, useEffect } from 'react';
import axios from 'axios';
let url = import.meta.env.VITE_BASE_URL;
export function SearchUser() {
  const [inputSearch, setInputSearch] = useState('');
  const [refresh, setRefresh] = useState(false)
  const firstMessage = {
    message: 'Hi!',
  };

  const handleSearchUsername = async () => {
    try {
      if (localStorage.getItem('username') !== inputSearch) {
        const response = await axios.get(`${url}/username/${inputSearch}`);
        console.log(response.data.data.username);

        await axios.post(`${url}/send/${response.data.data.id}`, firstMessage, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Reload halaman jika pemrosesan berhasil
        if (response) {
          setRefresh(true)
        }
      } else {
        alert('Anda tidak bisa menambahkan diri anda sendiri ke message');
      }
    } catch (error) {
      alert('username tidak ada!');
      console.log(error);
    } finally {
      setInputSearch('');
    }
  };

  useEffect(()=>{
    if(refresh === true){
      window.location.reload()
    }
  },[refresh])

  return (
    <div className="flex justify-center items-center flex-row">
      <input
        type="text"
        placeholder="search username"
        className="p-3 w-9/12 truncate"
        name="search"
        value={inputSearch}
        onChange={(e) => setInputSearch(e.target.value)}
      />
      <button
        className="p-3 bg-green-300 font-bold text-white w-3/12 truncate"
        onClick={() => {
          handleSearchUsername();
        }}
      >
        Hi
      </button>
    </div>
  );
}
