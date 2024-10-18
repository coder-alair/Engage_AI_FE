import React from 'react';

export default function PrimaryButton({ btnText, btnType, disabled, classNames, ...rest }) {
  return (
    <>
      <button
        {...rest}
        type={btnType}
        disabled={disabled}
        className={`${disabled
          ? 'bg-gray-300'
          : 'border border-transparent bg-purple-700'
          } rounded-3xl py-2 sm:py-3 px-10 text-sm font-medium
          ${classNames ? classNames : 'px-3 py-2'
          } text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2`}
      >
        {btnText}
      </button>
    </>
  );
}

