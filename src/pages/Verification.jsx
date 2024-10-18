import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Group.svg"
import success from "../assets/success.svg"
import { useEffect, useState } from "react";

export default function Verification() {
  const location = useLocation();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (location.state) {
      setMessage(location.state);
    }
  }, [location])

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
          {message &&
            message}
        </div>
        <Link to="/login">
          <span className="font-medium text-xl leading-8 text-blue-500">Login</span>
        </Link>
      </div>
    </div>
  );
}

