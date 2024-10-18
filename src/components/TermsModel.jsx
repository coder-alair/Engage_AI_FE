import { useState, useRef, useEffect } from "react";
import "../tailwind.css";
import { Api } from "../api";
import { marked } from "marked";
import { CMS } from "../helpers/helper";

const tempTerms = [
  "1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
  "2: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
  "3: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
  "4: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
  "5: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
  "6: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
  "7: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
  "8: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
  "9: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
  "10: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
  "11: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
  "12: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae urna a leo gravida ullamcorper. Donec euismod nibh et velit facilisis, nec consectetur eros tristique.",
];

function TermsModal({ isVisible, onClose, onAccept, handleCheckboxChange, isChecked }) {
  // const [isChecked, setIsChecked] = useState(false);
  const termsRef = useRef(null);
  // const [terms, setTerm] = useState(tempTerms || []);
  const [fetTerm, setFetchTerm] = useState("");

  const getTerms = () => {
    Api.getTerm(CMS.TERMS).then(res => {
      if (res?.data?.data) {
        setFetchTerm(res?.data?.data?.content);
      }
    })
  }

  useEffect(() => {
    getTerms()
  }, [])
  if (!isVisible) return null;

  // const handleCheckboxChange = (event) => {
  //   setIsChecked(event.target.checked);
  // };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
      <div className="bg-white p-10 rounded-lg shadow-lg w-2/3 max-w-4xl">
        <h2 className="text-2xl sm:text-4xl font-semibold mb-6 ">Terms and Conditions</h2>
        <div
          className="mb-6 max-h-96 overflow-y-auto border p-6 rounded text-lg"
          ref={termsRef}
        >
          {/* {terms.map((term, index) => (
            <div key={index} className="mb-4 text-sm sm:text-lg">
              <span>{term}</span>
            </div>
          ))} */}
          <div className="mb-4 text-sm sm:text-lg">
          <p
          className='text-sm md:text-md my-2 font-light'
          dangerouslySetInnerHTML={{
            __html: marked(fetTerm)
          }}
        ></p>
          </div>
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="acceptTerms"
              className="mr-2 accent-purple-600 h-4 w-4"
              checked={isChecked}
              disabled={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="acceptTerms" className="text-sm sm:text-lg font-medium">
              I have read and accept the terms and conditions
            </label>
          </div>
        </div>
        <div className="flex justify-around sm:justify-end -mt-4 sm:mt-0">
          <button
            onClick={onClose}
            className="mr-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
          {isChecked && (
            <button
              onClick={onAccept}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Accept
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TermsModal;
