import React from 'react'
import logo from "../../../assets/Group.svg"
import "../../../tailwind.css";
import { Link } from 'react-router-dom';


export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center px-8 pt-12 pb-5 text-xl font-medium text-purple-900 text-opacity-85 bg-white h-screen max-md:px-4">
      <div className="flex flex-col mt-1.5 w-full max-w-md">
        <img
          loading="lazy"
          src={logo}
          className="self-center max-w-full aspect-[3.33] w-[200px] ml-4"
        />
        <div className="self-center mt-5 text-3xl text-black leading-[40px] max-md:mt-8 text-center">
        Sorry, this page isn't available.
        </div>
        <div className="self-center mt-5 text-lg text-gray-400 text-center">
        The link you followed may be broken, or the page may have been removed. Go back to <span className='text-purple-600'><Link to={'/'}>Engage AI</Link></span>
        </div>
      </div>
    </div>
  )
}

