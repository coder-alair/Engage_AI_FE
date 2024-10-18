/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import logo from '../../assets/ai-button.svg';
import services from "../../assets/gifs/services.gif";
import add from '../../assets/add.svg';

const Option = (props) => {
    const { question, handleNextQuestions, disable, disabledOption, title, handleAnswerClick, handleAddOptions, loader, icon } = props;
    const [customAnswer, setCustomAnswer] = useState('');
    const [showInput, setShowInput] = useState(false);

    const saveUserinput = () => {
        if (!customAnswer) return;
        const optionToUpdate = question?.option;
        const newOption = customAnswer;
        handleAddOptions(newOption, optionToUpdate)
        setCustomAnswer('');
        setShowInput(false);
    };

    const handleNextClick = () => {
        if (!disable) {
            handleNextQuestions(question.option)
        }
    };

    const toggleInput = () => {
        setShowInput(!showInput);
    };

    return (
        <div className='flex mb-[2rem] flex-col gap-3 w-full '>
            <div className='flex justify-between'>
                <p className='text-xl md:text-3xl'>{title}</p>

                <p className={`flex flex-row gap-1`}>
                    {icon}
                    <img
                        onClick={handleNextClick}
                        loading="lazy"
                        src={loader ? services : logo}
                        className={`${disable ? "cursor-not-allowed" : 'cursor-pointer'} aspect-[3.33] h-[2rem] w-[2rem]`}
                    />
                </p>

            </div>
            <div className='border p-6 rounded-3xl flex flex-col bg-purple-100 border-1 h-full w-full '>
                <div className='text-lg md:text-xl'>
                    {question.question}
                </div>
                <div className='my-3 border border-purple-200'>
                </div>


                <div className='flex flex-col gap-2'>
                    {question?.options?.map((option, index) =>
                        <div key={index} className='text-xl flex justify-between'>
                            <div className='text-sm md:text-lg cursor-pointer' onClick={() => disabledOption ? {} : handleAnswerClick(option, question.option)}>
                                {option}
                            </div>

                            <div
                                onClick={() => disabledOption ? {} : handleAnswerClick(option, question.option)}
                                // onClick={() => handleOptionClick(option)}
                                className={`text-sm md:text-xl p-1 rounded-full size-9 cursor-pointer ${(question?.answers?.includes(option)) ? 'bg-purple-900 border border-purple-900 text-white' : 'border border-black'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </div>
                        </div>
                    )}

                </div>


                <div className='text-xl relative my-[1rem]  flex justify-between'>
                    {!showInput && (
                        <div
                            onClick={toggleInput}
                            className="cursor-pointer absolute right-0 -top-2 z-10"
                        >
                            <img
                                loading="lazy"
                                src={add}
                                className="max-w-full aspect-[3.33]"
                                alt="Add icon"
                            />
                        </div>
                    )}

                    {showInput && (
                        <div className="relative w-full">
                            <input
                                value={customAnswer}
                                onChange={(e) => setCustomAnswer(e.target.value)}
                                onKeyDown={(e) => (e.key === "Enter") && saveUserinput()}
                                placeholder='Add your answer'
                                className='relative text-sm md:text-md py-2 pr-14 px-1 w-full rounded-lg outline-none transition-all duration-300'
                                style={{ transform: 'translateX(0)' }}
                            />
                            <div
                                onClick={() => saveUserinput()}
                                className=" cursor-pointer absolute right-2 top-1 z-10 "
                            >
                                <img
                                    loading="lazy"
                                    src={add}
                                    className="max-w-full aspect-[3.33]"
                                    alt="Add icon"
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default Option;