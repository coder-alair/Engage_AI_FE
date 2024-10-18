import React from 'react'
import logo from "../../assets/Group.svg"
import "../../tailwind.css";
import { Link } from 'react-router-dom';


export default function ResetLinkSent() {
  return (
    <div className="flex flex-col items-center px-8 pt-12 pb-5 text-xl font-medium text-purple-900 text-opacity-85 bg-white h-screen max-md:px-4">
      <div className="flex flex-col mt-1.5 w-full max-w-md">
        <img
          loading="lazy"
          src={logo}
          className="self-center max-w-full aspect-[3.33] w-[200px] ml-4"
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a579f8ecb0e63ff7aed93cbaf4b5e37ba16151a1edcf7a57ac752a52bd5ae076?"
          className="mt-20 max-w-full aspect-square w-[110px] max-md:mt-10 self-center"
        />
        <div className="self-center mt-5 text-3xl text-black leading-[40px] max-md:mt-8">
          Reset link sent
        </div>
        <div className="self-center mt-5 text-lg text-gray-400 text-center">
          If this email exists in our system, we have sent you an
          email with the password reset details.
        </div>
        <Link
          to="/login"
          type="submit"
          className="flex justify-center items-center px-10 py-4 mt-7 text-xl text-white whitespace-nowrap bg-purple-900 rounded-3xl max-md:px-4 max-md:max-w-full"
        >
          Back to login
        </Link>
        <div className="flex gap-5 justify-between py-1.5 mt-52 max-w-full text-lg leading-5 text-purple-900 w-[271px] max-md:mt-10 self-center">
          <div>Terms of Use</div>
          <div>Privacy Policy</div>
        </div>
      </div>
    </div>
  )
}

