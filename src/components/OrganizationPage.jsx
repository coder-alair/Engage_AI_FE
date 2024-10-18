import React, { useEffect, useState } from 'react';
import CommonInput from '../helpers/common/Input/CommonInput';
import logo from "../assets/Group.svg";
import { errorToast, getLocalStorageItem, successToast, validateEmail } from '../helpers/helper';
import { useNavigate } from 'react-router-dom';
import { Api } from '../api';


const OrganizationPage = () => {
    const [showData, setShowData] = useState(false);
    const [fields, setFields] = useState([]);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const user = getLocalStorageItem('userData') && JSON.parse(getLocalStorageItem('userData'));

    const [userData, setUserData] = useState({
        employees: ''
    });

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     if (name == 'employees') {
    //         const nameRegex = /^[A-Za-z\s]+$/;
    //         if (nameRegex.test(value.trim())) {
    //             return;
    //         }
    //         if (parseInt(value) < 1) {
    //             return;
    //         }
    //     }
    //     const updatedData = { ...userData, [name]: value };
    //     setUserData(updatedData);
    // };

    // const handleAddClick = (e) => {
    //     setShowData(!showData);
    //     // Initialize fields, with the first field prefilled
    //     const initialFields = Array.from({ length: userData.employees }, (_, index) =>
    //         index === 0 ? user.email : ''
    //     );
    //     // Initialize errors for each field
    //     const initialErrors = Array.from({ length: userData.employees }, () => '');
    //     setFields(initialFields);
    //     setErrors(initialErrors);
    // }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFields = [...fields];
        newFields[name] = value;
        setFields(newFields);
        const newErrors = [...errors];
        newErrors[name] = '';
        setErrors(newErrors);
    };

    const handleSave = (e) => {
        const newErrors = fields.map((field) => {
            if (field.trim() === '') {
                return 'Please enter an email.';
            } else if (!validateEmail(field)) {
                return 'Please enter a valid email address.';
            } else {
                return '';
            }
        });

        setErrors(newErrors);
        const allFieldsValid = newErrors.every((error) => error === '');

        if (allFieldsValid) {
            const newFields = fields.slice(1);

            let payload = {
                emails: newFields
            }

            Api.sendUserInvites(payload).then((res) => {
                if (res?.data?.meta?.code == 1) {
                    putUserOnBoard();
                    successToast(res?.data?.meta?.message);
                    navigate('/recruit-ai');
                } else {
                    errorToast(res?.data?.meta?.message);
                }

            }).catch(err => {
                console.log(err)
            })
        }
    }

    const putUserOnBoard = () => {
        let payload = {
            onboarded: null
        }
        Api.putOnboard(payload).then((res) => {
            return;
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        const userdata = getLocalStorageItem('userData');
        if (userdata) {
            Api.getCompayData(JSON.parse(userdata).companyId).then((res) => {
                if (res?.data?.data) {
                    const employee = res.data.data.companyUsers;
                    const initialFields = Array.from({ length: employee }, (_, index) =>
                        index === 0 ? user.email : ''
                    );

                    // Initialize errors for each field
                    const initialErrors = Array.from({ length: employee }, () => '');

                    setFields(initialFields);
                    setErrors(initialErrors);
                    setUserData({ employees: employee })
                }
                // setCompanyName(res?.data?.data?.companyName)
            }).catch(err => {
                console.log(err)
            })
        }
    }, [])



    return (
        <div className='w-screen relative h-screen overflow-y-auto hide-scrollbar'>
            <div className="w-full gap-[2rem] flex flex-col justify-center mx-auto mt-6 text-4xl font-medium text-black ">
                <img
                    loading="lazy"
                    src={logo}
                    className="mx-auto aspect-[3.33] w-[200px] "
                />
                <p className='mx-auto'>Invite your users</p>
            </div>

            <div className='flex mt-[3rem] mx-auto flex-row gap-2 justify-center'>
                No of User: {fields.length}
            </div>
            {/* <div className='flex mt-[3rem] mx-auto flex-row gap-2 justify-center'>
                <CommonInput
                    classNames={'py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                    placeholder={'Enter number of employees'}
                    // svgFile={AccountSVG}
                    type='text'
                    name="employees"
                    value={userData?.employees}
                    onChange={handleChange}
                />
            </div>
            <div className='flex mt-[3rem] mx-auto w-[30rem] flex-col gap-2'>
                <button
                    onClick={handleAddClick}
                    className='px-16 py-4 bg-purple-800 text-white rounded-[3rem]'
                >Add Users</button>
            </div> */}

            {
                <div className='flex my-[3rem] px-16 justify-evenly w-full flex-wrap gap-[2rem] '>
                    {fields.map((_, index) => (
                        <CommonInput
                            key={index}
                            classNames={'py-4 px-4 pl-14 w-[25rem] text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                            placeholder={`Enter email of employee ${index + 1} `}
                            // svgFile={AccountSVG}
                            type='text'
                            name={`${index}`}
                            label={`Employee ${index + 1}`}
                            isRequired
                            value={fields[index]}
                            disabled={index == 0}
                            onChange={handleInputChange}
                            error={errors[index]}
                        />
                    ))}
                </div>
            }

            {parseInt(userData.employees) > 0 &&
                <div className='flex my-[3rem] mx-auto w-[30rem] flex-col gap-2'>
                    <button
                        onClick={handleSave}
                        className='px-16 py-4 bg-purple-800 text-white rounded-[3rem]'
                    >Send invite to users</button>
                </div>
            }


        </div>
    );
};

export default OrganizationPage;