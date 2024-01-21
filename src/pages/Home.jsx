import React, { useEffect, useState } from 'react';
import { Login } from '../components/Login';
import { Register } from '../components/Register';
export function Home() {
  const [activeButton, setActiveButton] = useState(true);
  return (
    <section className="container mx-auto h-screen w-full flex items-center justify-center">
      <div className="w-11/12 sm:6/12 md:w-4/12 lg:4/12 shadow-md p-2">
        <p className="text-2xl text-center mb-5 font-medium">
          Welcome to{' '}
          <span className="text-green-300 font-extrabold">ChitChat!</span>
        </p>
        <div className="flex justify-center items-center flex-col">
          <div className="flex flex-row">
            <div>
              <div
                className={`p-1 ${
                  activeButton === true ? 'bg-green-600' : 'bg-green-300'
                } w-28 text-center font-bold text-white cursor-pointer`}
                onClick={() => setActiveButton(true)}
              >
                Login
              </div>
            </div>
            <div>
              <div
                className={`p-1 ${
                  activeButton === false ? 'bg-green-600' : 'bg-green-300'
                } w-28 text-center font-bold text-white cursor-pointer`}
                onClick={() => setActiveButton(false)}
              >
                Register
              </div>
            </div>
          </div>
          {activeButton === true ? <Login /> : <Register />}
        </div>
      </div>
      <div className="text-center absolute bottom-0 mb-2">
        <a href="https://project13.my.id" target="_blank">
          &copy;2024 Mahardhika
        </a>
      </div>
    </section>
  );
}
