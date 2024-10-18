import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import ProfileHeader from './ProfileHeader';
import Text from '../../helpers/Text';
import ViewProfile from './ViewProfile';
import SubcriptionCard from './SubcriptionCard';
import LastResponses from './LastResponses';
import { Api } from '../../api';
import Loader from '../../helpers/common/Loader';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        getUserProfile();
    }, [])

    const getUserProfile = () => {
        setLoader(true);
        Api.getUserProfile().then((res) => {
            setUserData(res?.data?.data);
            setLoader(false);

        }).catch(err => {
            setLoader(false);
            errorToast(err);
        })
    }

    return (
        <div className='w-screen relative h-screen overflow-y-auto hide-scrollbar'>
            {loader && <Loader />}
            <div className='w-full h-[8rem]'>
                <Header />
            </div>
            <div className='w-full h-[15rem] sm:h-full'>
            <ProfileHeader />
            </div>
            
            <div className='w-full my-[1rem] md:my-[3rem] flex font-semibold justify-center text-[2rem] md:text-[2.5rem] mx-auto'>
                <Text text={'My Profile'} />
            </div>
            <div className='my-[2rem] w-full px-8'>
                <ViewProfile userData={userData} />
            </div>
            {/* <div className='w-full my-[3rem] flex font-semibold justify-center text-[2.5rem] mx-auto'>
                <Text text={'Plan you avail'} />
            </div>
            <div className='my-[2rem] w-full px-8'>
                <SubcriptionCard userData={userData} />
            </div> */}
           

            <div className='my-[2rem]  w-full px-8'>
                <LastResponses action={true} />
            </div>

            <div className='w-full'>
                <Footer />
            </div>
        </div>
    );
};

export default Profile;