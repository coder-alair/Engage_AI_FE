import React from 'react';
import Pensquare from '../../assets/pen-square.svg';
import logo from '../../assets/ai-button.svg';


const CustomInput = ({ text, handleClose, handleNextQuestions ,aiBox,handleNext, setText }) => {
    const handleText = (e) => {
        setText(e.target.value)
    }
    return (
        <div className='border relative border-1 rounded-3xl h-full w-full'>
            <div className="pointer-events-none  absolute left-10 top-4  z-10 ">
                <img
                    loading="lazy"
                    src={Pensquare}
                    className="max-w-full aspect-[3.33] "
                />
            </div>
            <div className="  absolute right-6 top-4  ">
                 <img
                    onClick={handleNext}
                    loading="lazy"
                     src={logo}
                     className="aspect-[3.33] h-10 w-10 cursor-pointer"
                 />
             </div>
            <textarea
                value={text}
                id="prompt"
                name="prompt"
                onChange={handleText}
                placeholder="Add Job Role"
                className={`placeholder:text-gray-600 h-full w-[100%] resize-none appearance-none break-all rounded-[2rem]  border-gray-300  py-2 px-24 pt-5 placeholder-[#000] placeholder:text-lg placeholder:font-[500] placeholder:tracking-wider focus:outline-none  sm:text-lg`}
            />

        </div>
    );
};

export default CustomInput;