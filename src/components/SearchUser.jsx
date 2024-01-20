import React, { useState, useEffect } from 'react';
import axios from 'axios';
let url = import.meta.env.VITE_BASE_URL;
export function SearchUser() {
  const [inputSearch, setInputSearch] = useState('');
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
          alert(
            'Say hi ke teman berhasil! mungkin perlu reload untuk menampilkan.'
          );
          setTimeout(() => {
            window.location.reload();
          }, 3000);
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
        onClick={() => {
          handleSearchUsername();
        }}
      >
        Hi
      </button>
    </div>
  );
}
