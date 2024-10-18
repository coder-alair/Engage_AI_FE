import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SecondaryButton({ btnText, btnType }) {
  const navigate = useNavigate();
  return (
    <>
      <button
        type={btnType}
        className="rounded-3xl border border-purple-700 py-2 sm:py-3 px-10 text-sm font-medium shadow-sm focus:outline-none  text-purple-700 "
        onClick={() => navigate(-1)}
      >
        {btnText}
      </button>
    </>
  );
}
