import React from 'react';
import logo from "../assets/Group.svg"
import success from "../assets/success.svg"
import { useNavigate } from 'react-router-dom';

const AccountVerified = () => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center px-4 py-8 font-medium bg-white min-h-screen">
        <div className="flex flex-col items-center w-full max-w-md">
          <img
            loading="lazy"
            src={logo}
            className="max-w-full w-[200px] aspect-[3.33]"
          />
          <img
            loading="lazy"
            src={success}
            className="self-stretch mt-6 w-full aspect-[1.41]"
          />
          <div className="mt-6 text-3xl bg-clip-text text-transparent bg-gradient-to-r from-purple-700  to-yellow-500 leading-tight">
            Congratulations
          </div>
          <div className="mt-4 text-xl leading-8 text-center text-black text-opacity-60">
            Your account verified successfully. Login
            <br />
            using your email.
          </div>
          <div className="mt-4 text-xl leading-8 text-center text-black text-opacity-60">
            <button
            onClick={()=>navigate('/login')}
             className='px-6 py-2 text-white text-xl bg-purple-800 rounded-xl'>Go to login</button>
          </div>
          
        </div>
      </div>
    );
};

export default AccountVerified;