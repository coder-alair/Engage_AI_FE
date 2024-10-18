import React from 'react';
import ProfilePic from '../../assets/pngs/profile_dummy.png';
import Text from '../../helpers/Text';


const ProfileHeader = () => {
    return (
        <div className='h-full flex'>
            <div className='text-2xl sm:text-5xl px-8 w-full flex flex-col justify-start md:justify-center items-start'>
                <p className=' text-2xl sm:text-5xl font-medium'>
                    <span className='bg-gradient-to-r from-orange-500  to-purple-900 text-transparent bg-clip-text'> Manage </span>
                    <span className='text-black'> Your</span>
                    <span className='text-black'> Professional Profile with </span>
                    <span className='bg-gradient-to-r from-purple-900  to-orange-500 text-transparent bg-clip-text'> Us. </span>
                </p>
                <p className=' text-lg md:text-2xl text-gray-700 font-medium'>
                    <span>Here you can check your profile details and update your profile details.</span>
                    <span> You can also check your subscription plans and last 30 days history.</span>
                </p>
                <span className='text-sm sm:text-2xl font-medium text-purple-800'> Learn More.</span>
            </div>
            <div className='h-full w-full md:flex hidden'>
                <img
                    loading="lazy"
                    src={ProfilePic}
                    className="w-full cursor-pointer aspect-[3.33] "
                />
            </div>
        </div>
    );
};

export default ProfileHeader;