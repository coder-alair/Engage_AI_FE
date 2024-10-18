import React, { useEffect, useState } from 'react';
import PrimaryButton from '../../helpers/common/Buttons/PrimaryButton';
import CountrySVG from '../../assets/buildings.svg';
import GlobeSVG from '../../assets/globe-alt.svg';
import LocationSVG from '../../assets/location-pin.svg';
import CodeSVG from '../../assets/code.svg';
import CommonInput from '../../helpers/common/Input/CommonInput';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../api';
import { errorToast, successToast } from '../../helpers/helper';
import Loader from '../../helpers/common/Loader';
import { editAddressValidation } from '../../validations/updateAddressValidation';

const AddressEdit = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const [userData, setUserData] = useState({
        country: "",
        state: "",
        city: "",
        province: "",
        businessArea: "",
        postalCode: "",
        address: "",
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
                country: response?.company?.country || "",
                state: response?.company?.state || "",
                city: response?.company?.city || "",
                province: response?.company?.province || "",
                businessArea: response?.company?.businessArea || "",
                postalCode: response?.company?.postalCode || "",
                address: response?.company?.address1 || "",
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
        setUserData(updatedData);
    };

    const handleSubmit = () => {
        let payload = {
            country: userData.country,
            state: userData.state,
            city: userData.city,
            province: userData.province,
            businessArea: userData.businessArea,
            postalCode: userData.postalCode,
            address: userData.address,
        }
        const { errors, isValid } = editAddressValidation(payload);
        if (isValid) {
            setLoader(true);
            Api.updateAddressProfile(payload).then((res) => {
                if (res?.data?.meta?.code == 1) {
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
            <div className='w-full h-fit px-6 flex flex-col gap-2'>
                <div className='p-5 w-full h-full flex flex-col gap-2'>
                    <div className='mt-[1rem] w-full flex gap-10'>
                        <div className='w-full flex flex-col gap-5'>
                            <div className='flex flex-col gap-2'>
                                <CommonInput
                                    classNames={'py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                    placeholder={'Enter your country name'}
                                    svgFile={CountrySVG}
                                    label={"Country"}
                                    type='text'
                                    name="country"
                                    value={userData?.country}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <CommonInput
                                    classNames={'py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                    placeholder={'Enter your city name'}
                                    svgFile={CountrySVG}
                                    label={"City"}
                                    type='text'
                                    name="city"
                                    value={userData?.city}
                                    onChange={handleChange}

                                />
                            </div>

                            {/* <div className='flex flex-col gap-2'>
                                <CommonInput
                                    classNames={'py-4 px-14  text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                    placeholder={'Enter your state'}
                                    svgFile={GlobeSVG}
                                    type='text'
                                    name="state"
                                    value={userData?.state}
                                    onChange={handleChange}
                                />
                            </div> */}

                            <div className='flex flex-col gap-2'>
                                <CommonInput
                                    classNames={'py-4 px-14  text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                    placeholder={'Enter your address'}
                                    svgFile={LocationSVG}
                                    label={"Address"}
                                    type='text'
                                    name="address"
                                    value={userData?.address}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>
                        <div className='w-full flex flex-col gap-5'>
                            <div className='flex flex-col gap-2'>
                                <CommonInput
                                    classNames={'py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                    placeholder={'Enter your province / state'}
                                    svgFile={GlobeSVG}
                                    label={"Province / State"}
                                    type='text'
                                    name="province"
                                    value={userData?.province}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <CommonInput
                                    classNames={'py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                    placeholder={'Enter your business area'}
                                    svgFile={LocationSVG}
                                    label={"Business Area"}
                                    type='text'
                                    name="businessArea"
                                    value={userData?.businessArea}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <CommonInput
                                    classNames={'py-4 px-14  text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                                    placeholder={'Enter your postal code'}
                                    svgFile={CodeSVG}
                                    label={"Postal Code"}
                                    type='text'
                                    name="postalCode"
                                    value={userData?.postalCode}
                                    onChange={handleChange}
                                />
                            </div>


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
        </div>
    );
};

export default AddressEdit;