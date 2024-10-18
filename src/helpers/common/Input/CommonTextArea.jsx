import React from 'react';
import { MaxCharlimitLongText } from '../../helper';

const CommonTextArea = ({
    id,
    name,
    value,
    label,
    error,
    onChange,
    disabled,
    isRequired,
    autoComplete,
    placeholder,
    classNames,
    svgFile,
    isLengthValidate
}) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} {isRequired && !disabled && <span className="text-red-400">&#42;</span>}
                {isLengthValidate && !disabled && (
                    <span className="mt-1 float-right text-xs text-red-400">
                        {value.length <= MaxCharlimitLongText
                            ? MaxCharlimitLongText - value.length + ' Characters Left'
                            : 'Out Of Character Limit 1000'}
                    </span>
                )}
            </label>
            <div className="relative">
                <div className=" relative mt-1">
                    <textarea
                        id={id}
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        className={`block w-full rounded-3xl resize-none appearance-none border border-gray-300 ${classNames ? classNames : 'px-3 py-2'
                            } placeholder-gray-400  focus:border-purple-700 focus:outline-none focus:ring-purple-700 sm:text-sm`}
                    />
                </div>
                {svgFile &&
                    <img
                        loading="lazy"
                        src={svgFile}
                        className={`aspect-[3.33] cursor-pointer absolute w-[25px] h-[25px] text-purple-700 top-[2rem] transform -translate-y-1/2 ${classNames ? 'left-[20px]' : 'left-[15px]'}`}
                    />
                }
            </div>
            {isRequired && <span className="error text-xs text-red-400">{error}</span>}
        </div>
    );
};

export default CommonTextArea;