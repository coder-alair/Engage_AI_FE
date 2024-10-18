/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const MaxCharlimit = 100;
export const MaxCharlimitLongText = 1000;
export const getLocalStorageItem = (key) => localStorage.getItem(key);
export const setLocalStorageItem = (key, value) => localStorage.setItem(key, value);
export const removeLocalStorageItem = (key) => localStorage.removeItem(key);
export const cleanLocalStorage = () => localStorage.clear();
export const getJWTToken = () => 'Bearer ' + localStorage.getItem('token');
export const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const VITE_API_BASE_PYTHON_URL = import.meta.env.VITE_API_BASE_PYTHON_URL;
export const VITE_STRIPE_PRODUCT = import.meta.env.VITE_STRIPE_PRODUCT;
export const VITE_STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY;
export const CMS = {
  TERMS:"Terms",
  PRIVACY:"Privacy"
};




export const errorToast = (msg, toastId = '') =>
  toast.error(msg, {
    duration: 2500,
    id: toastId
  });

export const successToast = (msg, duration = 2000) =>
  toast.success(msg, {
    duration
  });

export const informativeToast = (msg, duration = 3000) =>
  toast.custom(
    (t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-2">
          <div className="flex items-start">
            <div className="self-center">
              <InformationCircleIcon className="w-[24px] text-purple-600" />
            </div>
            <div className="ml-3 self-center">
              <p className="mt-1 text-gray-500">{msg}</p>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration
    }
  );

export const useOutsideClick = (ref, callback) => {
  const handleClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => handleClick(e);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export const capitalizeFirstLetter = (string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isAdmin = () => {
  const userData = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));
  return userData?.userType === "ADMIN";
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export const logout = () => {
  cleanLocalStorage();
  const currentLocation = window.location.origin;
  const url = `${currentLocation}/login`
  window.open(url, "_self");
}

export const downloadUrl = (url) => {
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.download = true;
  link.click();
}