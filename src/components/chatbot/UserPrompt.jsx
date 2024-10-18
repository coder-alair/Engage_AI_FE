/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { debounce, useOutsideClick } from '../../helpers/helper.jsx';
import Pensquare from '../../assets/pen-square.svg';
import logo from '../../assets/ai-button.svg';
import services from "../../assets/gifs/services.gif";
import { pythonApi } from '../../api/pythonAPI.js';

const prequestion = [
    "Java Developer",
    "JavaScript Developer",
    "Python Developer",
    "React Developer",
    "NodeJS Developer"
];

const ReusableDropdownInput = (props) => {
    const { parentInputValue, setParentInputValue, handleNext, isDisabled, loader } = props;
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const onFocus = () => {
        if (!parentInputValue) {
            setDropdownOptions(prequestion);
        }
        setShowDropdown(true)
    }

    const getRole = async (value) => {
        await pythonApi.getRole({ keyword: value }).then((role) => {
            let response = role?.data?.data || [];
            setDropdownOptions(pre => response?.map(item => item.name));
        });
    };

    const debouncedQuery = useCallback(debounce((value) => getRole(value), 200), []); // make sure to debounce only once

    const handleInputChange = (event) => {
        const value = event.target.value;
        setParentInputValue(value);

        if (value) {
            debouncedQuery(value);
            // fetchDropdownOptions(value);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleOptionClick = (option) => {
        setParentInputValue(option); // Update the parent input value
        setShowDropdown(false);
    };

    useOutsideClick(dropdownRef, () => {
        setShowDropdown(false);
    })

    useEffect(() => {
        setFilteredOptions(dropdownOptions.filter(option =>
            option.toLowerCase().includes(parentInputValue.toLowerCase())
        ));
    }, [parentInputValue, dropdownOptions]);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <input
                type="text"
                value={parentInputValue}
                onChange={handleInputChange}
                onFocus={onFocus}
                onKeyDown={(e) => (e.key === "Enter") && parentInputValue.length > 0 && handleNext()}
                disabled={isDisabled}
                placeholder='Add job role'
                className="w-full rounded-3xl  border outline-none py-8 md:px-24 px-14  border-gray-300"
            />
            <div className="pointer-events-none  absolute left-3 md:left-10 top-7  z-10 ">
                <img
                    loading="lazy"
                    src={Pensquare}
                    className="max-w-full aspect-[3.33] "
                />
            </div>
            <div className="  absolute right-3  md:right-6  top-6  ">
                <img
                    onClick={handleNext}
                    loading="lazy"
                    src={loader ? services : logo}
                    className={`aspect-[3.33] h-10 w-10 ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                />
            </div>

            {showDropdown && !isDisabled && (
                <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto shadow-md z-10">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            onClick={() =>
                                handleOptionClick(option)
                            }
                            className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReusableDropdownInput;
