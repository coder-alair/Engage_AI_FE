import * as React from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { MaxCharlimit } from '../../helper.jsx';
import EyeSlash from '../../../assets/close-eye.svg';
import Eye from '../../../assets/open-eye.svg';

const CommonInput = (props) => {
  const {
    id,
    name,
    value,
    label,
    error,
    type,
    onChange,
    disabled,
    isRequired,
    isIcon,
    autoComplete,
    placeholder,
    classNames,
    svgFile,
    isLengthValidate,
    ...prop
  } = props;
  const [showEyeIcon, setShowEyeIcon] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {isRequired && !disabled && <span className="text-red-400">&#42;</span>}
        {isLengthValidate && !disabled && (
          <span className="mt-1 float-right text-xs text-red-400">
            {value.length <= MaxCharlimit
              ? MaxCharlimit - value.length + ' Characters Left'
              : 'Out Of Character Limit 100'}
          </span>
        )}
      </label>
      <div className="relative">
        <div className=" relative mt-1">
          <input
            id={id}
            name={name}
            value={value}
            type={showEyeIcon ? 'text' : type}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={`block w-full rounded-3xl appearance-none border border-gray-300 ${classNames ? classNames : 'px-3 py-2'
              } placeholder-gray-400  focus:border-purple-700 focus:outline-none focus:ring-purple-700 sm:text-sm`}
            {...prop}
          />
        </div>
        {svgFile &&
          <img
            loading="lazy"
            src={svgFile}
            className={`aspect-[3.33] cursor-pointer absolute w-[25px] h-[25px] text-purple-700 top-1/2 transform -translate-y-1/2 ${classNames ? 'left-[20px]' : 'left-[15px]'}`}
          />
        }
        {isIcon &&
          (showEyeIcon ? (
            <img
              loading="lazy"
              src={EyeSlash}
              onClick={() => setShowEyeIcon(false)}
              className={`aspect-[3.33] cursor-pointer absolute w-[25px] h-[25px] text-purple-700 top-1/2 transform -translate-y-1/2 ${classNames ? 'right-[13px]' : 'right-[10px]'}`}
            />
          ) : (
            <img
              loading="lazy"
              src={Eye}
              onClick={() => setShowEyeIcon(true)}
              className={`aspect-[3.33] cursor-pointer absolute w-[25px] h-[25px] text-purple-700 top-1/2 transform -translate-y-1/2 ${classNames ? 'right-[13px]' : 'right-[10px]'}`}
            />
          ))}
      </div>
      {isRequired && <span className="error text-xs text-red-400">{error}</span>}
    </div>
  );
};

export default CommonInput;
