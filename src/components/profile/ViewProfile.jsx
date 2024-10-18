import React from 'react';
import ProfilePhoto from '../../assets/jpgs/profile.jpg';
import Pensquare from '../../assets/pen-square.svg';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../../helpers/helper';

const ViewProfile = ({ userData }) => {
    const navigate = useNavigate();
    return (
        <div className='mt-[2rem] md:mt-[5rem] w-full flex flex-wrap lg:flex-nowrap gap-5'>
            {userData &&
                <>
                    <div className='w-full h-fit border rounded-xl px-6 flex flex-col gap-2'>
                        <div className='p-5 w-full h-full flex justify-between items-center gap-5'>
                            <p className='w-fit text-xl font-medium bg-gradient-to-r from-orange-500 via-orange-600 to-purple-900 text-transparent bg-clip-text'>
                                Personal Information
                            </p>
                            <div className='flex gap-2'>
                                <img
                                    loading="lazy"
                                    src={Pensquare}
                                    onClick={() => navigate('/profile/edit?type=1')}
                                    className="p-2 border min-h-14 min-w-14 rounded-xl cursor-pointer "
                                />
                            </div>
                        </div>
                        <div className='p-5 w-full h-full flex flex-col gap-2'>
                            <div className='flex-wrap sm:flex-nowrap justify-center sm:justify-normal flex gap-5'>
                                <div className='h-[4rem] md:h-[6rem] w-[4rem] md:w-[6rem] rounded-full overflow-hidden flex'>
                                    <img
                                        loading="lazy"
                                        src={ProfilePhoto}
                                        className="w-full object-cover cursor-pointer aspect-[3.33] "
                                    />
                                </div>
                                <div className='flex flex-col justify-center gap-2'>
                                    <p className='font-bold text-sm md:text-xl'>{userData?.firstName} {userData?.lastName} </p>
                                    <p className='font-medium text-sm md:text-xl text-gray-600'>{userData?.email}</p>
                                </div>
                            </div>
                            <div className='mt-[1rem] w-full flex gap-10'>
                                <div className='w-full flex flex-col gap-5'>
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-sm md:text-lg font-semibold'>First Name:</p>
                                        <p className='text-sm md:text-lg font-light text-gray-600'>{userData?.firstName}</p>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <p className='text-sm md:text-lg font-semibold'>Company Name:</p>
                                        <p className='text-sm md:text-lg font-light text-gray-600'>{userData?.company?.companyName}</p>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <p className='text-sm md:text-lg font-semibold'>Password:</p>
                                        <p className='text-sm md:text-lg font-light text-gray-600'>*************</p>
                                    </div>

                                </div>
                                <div className='w-full flex flex-col gap-5'>
                                    <div className='flex flex-col gap-2'>
                                        <p className='text-sm md:text-lg font-semibold'>Last Name:</p>
                                        <p className='text-sm md:text-lg font-light text-gray-600'>{userData?.lastName}</p>
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <p className='text-sm md:text-lg font-semibold'>Email Address:</p>
                                        <p className='text-sm md:text-lg font-light text-gray-600'>{userData.email}</p>
                                    </div>

                                </div>
                            </div>

                            {isAdmin() &&
                                <>
                                    <div className='mt-5 flex flex-col gap-2'>
                                        <p className='text-sm md:text-lg font-semibold'>Company Bio:</p>
                                        <p className='text-sm md:text-lg font-light text-gray-600'>
                                            {userData?.company?.bio}
                                        </p>
                                        <div className='border ' />
                                    </div>

                                    {/* <div className='mt-5 flex flex-col gap-2'>
                                        <p className='font-semibold'>Challenges you want to solve:</p>
                                        <p className='font-light text-gray-600'>
                                            {userData?.company?.challenges}
                                        </p>
                                        <div className='border ' />
                                    </div> */}
                                </>
                            }

                        </div>
                    </div>
                    {isAdmin() &&
                        <div className='w-full h-fit border rounded-xl px-6 flex flex-col gap-2'>
                            <div className='p-5 w-full h-full flex justify-between items-center gap-5'>
                                <p className='w-fit text-xl font-medium bg-gradient-to-r from-orange-500 via-orange-600 to-purple-900 text-transparent bg-clip-text'>
                                    Address
                                </p>
                                <div className=' flex gap-2'>
                                    <img
                                        loading="lazy"
                                        src={Pensquare}
                                        onClick={() => navigate('/profile/edit?type=2')}
                                        className="p-2 border h-14 w-14 rounded-xl cursor-pointer aspect-[3.33] "
                                    />
                                </div>
                            </div>
                            <div className='p-5 w-full h-full flex flex-col gap-2'>
                                <div className='mt-[1rem] w-full flex gap-10'>
                                    <div className='w-full flex flex-col gap-5'>
                                        <div className='flex flex-col gap-2'>
                                            <p className='text-sm md:text-lg font-semibold'>Country:</p>
                                            <p className='text-sm md:text-lg font-light text-gray-600'>{userData?.company?.country}</p>
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <p className='text-sm md:text-lg font-semibold'>City:</p>
                                            <p className='text-sm md:text-lg font-light text-gray-600'>{userData?.company?.city}</p>
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <p className='text-sm md:text-lg font-semibold'>Postal Code:</p>
                                            <p className='text-sm md:text-lg font-light text-gray-600'>{userData?.company?.postalCode}</p>
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <p className='text-sm md:text-lg font-semibold'>Address:</p>
                                            <p className='text-sm md:text-lg font-light text-gray-600'>{userData?.company?.address1}</p>
                                        </div>


                                    </div>
                                    <div className='w-full flex flex-col gap-5'>
                                        {/* <div className='flex flex-col gap-2'>
                                            <p className='font-semibold'>State:</p>
                                            <p className='font-light text-gray-600'>{userData?.company?.state}</p>
                                        </div> */}

                                        <div className='flex flex-col gap-2'>
                                            <p className='text-sm md:text-lg font-semibold'>Province / State:</p>
                                            <p className='text-sm md:text-lg font-light text-gray-600'>{userData?.company?.province}</p>
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            <p className='text-sm md:text-lg font-semibold'>Business Area:</p>
                                            <p className='text-sm md:text-lg font-light text-gray-600'>{userData?.company?.businessArea}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </>


            }

        </div>
    );
};

export default ViewProfile;