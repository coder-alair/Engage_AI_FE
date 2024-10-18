import React, { useEffect, useState } from 'react';
import AccountSVG from '../../assets/account.svg';
import LockSVG from '../../assets/lock.svg';
import EmailSVG from '../../assets/icon.svg';
import CompanySVG from '../../assets/buildings.svg';
import PencilPic from '../../assets/pen-square.svg';
import { useNavigate } from 'react-router-dom';
import CommonInput from '../../helpers/common/Input/CommonInput';
import CommonTextArea from '../../helpers/common/Input/CommonTextArea';
import PrimaryButton from '../../helpers/common/Buttons/PrimaryButton.jsx';
import { Api } from '../../api/index.js';
import { errorToast, getLocalStorageItem, isAdmin, MaxCharlimit, MaxCharlimitLongText, setLocalStorageItem, successToast } from '../../helpers/helper.jsx';
import Loader from '../../helpers/common/Loader.jsx';
import SuccessToast from '../../helpers/SucessToast.jsx';
import ErrorToast from '../../helpers/ErrorToast.jsx';
import { editPersonalValidation } from '../../validations/updateProfileValidations.js';

const PersonalEdit = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        bio: "",
        challenges: "",
        role: ""
    });
    const [loader, setLoader] = useState(false)
    useEffect(() => {
        getUserProfile();
    }, [])

    const getUserProfile = () => {
        setLoader(true);
        Api.getUserProfile().then((res) => {
            let response = res?.data?.data;
            setUserData({
                ...userData,
                email: response?.email,
                firstName: response?.firstName || '',
                lastName: response?.lastName || '',
                companyName: response?.company?.companyName || '',
                bio: response?.company?.bio || '',
                challenges: response?.company?.challenges || '',
                role: response?.role || 'ADMIN'
            });
            setLoader(false);
        }).catch(err => {
            setLoader(false);
            errorToast(err);
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...userData, [name]: value };
        if (
            !(name === 'firstName' && value.length > MaxCharlimit) &&
            !(name === 'email' && value.length > MaxCharlimitLongText)
        ) {
            setUserData(updatedData);
        }
    };

    const handleSubmit = () => {
        let payload = {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            password: userData.password,
            companyName: userData.companyName,
            bio: userData.bio,
            challenges: userData.challenges,
        }
        const { errors, isValid } = editPersonalValidation({ ...payload, confirmPassword: userData.confirmPassword });
        if (isValid) {
            setLoader(true);
            Api.updatePersonalProfile(payload).then((res) => {
                if (res?.data?.meta?.code == 1) {
                    const user = JSON.parse(getLocalStorageItem('userData'));
                    user.firstName = userData.firstName;
                    setLocalStorageItem('userData', JSON.stringify(user));
                    successToast(res?.data?.meta?.message || "Updated Successfully")
                    setLoader(false);
                    navigate(-1);
                } else {
                    setLoader(false);
                }
            }).catch(err => {
                setLoader(false);
            })
        } else {
            if (errors.length) {
                errorToast(errors[0]);
            }
        }
    }

    return (
        <div className='w-full flex gap-5'>
            {loader && <Loader />}
            {userData &&
                <div className='w-full h-fit px-6 flex flex-col gap-2'>
                    <div className='p-5 w-full h-full flex flex-col gap-2'>
                        <div className='mt-[1rem] w-full flex gap-10'>
                            <div className='w-full flex flex-col gap-5'>
                                <div className='flex flex-col gap-2'>
                                    <CommonInput
                                        classNames={'py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                        placeholder={'Enter your first name'}
                                        svgFile={AccountSVG}
                                        label={"First Name"}
                                        type='text'
                                        name="firstName"
                                        value={userData?.firstName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <CommonInput
                                        classNames={'py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                        placeholder={'Enter your last name'}
                                        svgFile={AccountSVG}
                                        label={"Last Name"}
                                        type='text'
                                        name="lastName"
                                        value={userData?.lastName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <CommonInput
                                        classNames={'py-4 px-14  text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                        placeholder={'Enter your password'}
                                        svgFile={LockSVG}
                                        isIcon={true}
                                        label={"Password"}
                                        type='password'
                                        name="password"
                                        value={userData?.password}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <CommonInput
                                        classNames={'py-4 px-14  text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                        placeholder={'Re-enter your password'}
                                        svgFile={LockSVG}
                                        isIcon={true}
                                        label={"Confirm Password"}
                                        type='password'
                                        name="confirmPassword"
                                        value={userData?.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>

                            </div>
                            <div className='w-full flex flex-col gap-5'>
                                <div className='flex flex-col gap-2'>
                                    <CommonInput
                                        classNames={'py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                        placeholder={'Enter your company name'}
                                        svgFile={CompanySVG}
                                        label={"Company Name"}
                                        type='text'
                                        name='companyName'
                                        value={userData?.companyName}
                                        onChange={handleChange}
                                        disabled={userData?.role == "USER"}
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <CommonInput
                                        classNames={'py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                        placeholder={'Enter your email address'}
                                        svgFile={EmailSVG}
                                        label={"Email Address"}
                                        type='text'
                                        name='email'
                                        value={userData?.email}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>

                                {isAdmin() &&
                                    <div className='flex flex-col gap-2'>
                                        <CommonTextArea
                                            classNames={'min-h-[15rem] py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                            placeholder={'Write short bio about company'}
                                            svgFile={PencilPic}
                                            label={"Company Bio"}
                                            name='bio'
                                            value={userData?.bio}
                                            onChange={handleChange}
                                        />
                                    </div>
                                }

                                {/* {isAdmin() &&
                                    <div className='flex flex-col gap-2'>
                                        <CommonTextArea
                                            classNames={'min-h-[12rem] py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                            placeholder={'What challenges you are trying to solve with this tool'}
                                            svgFile={PencilPic}
                                            name='challenges'
                                            value={userData?.challenges}
                                            onChange={handleChange}
                                        />
                                    </div>
                                } */}


                            </div>
                        </div>

                        <div className='mt-[2rem] mx-auto '>
                            <PrimaryButton
                                btnText='Save Changes'
                                btnType='submit'
                                disabled={false}
                                classNames={'px-[8rem] !py-3 rounded-xl '}
                                onClick={handleSubmit}
                            />
                        </div>

                    </div>
                </div>
            }

        </div>
    );
};

export default PersonalEdit;