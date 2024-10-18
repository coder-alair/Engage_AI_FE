import  { useEffect, useState } from 'react';

function SuccessToast({ message }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    visible && (
      <div className="fixed top-5 right-5 z-50">
        <div className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white border border-green-400 rounded-lg shadow-lg animate-slideInRight dark:text-gray-400 dark:bg-gray-800" role="alert">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
          </div>
          <div className="ml-3 text-sm font-normal">{message}</div>
        </div>
      </div>
    )
  );
}

export default SuccessToast;
