import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import ProfileHeader from './ProfileHeader';
import Text from '../../helpers/Text';
import PersonalEdit from './PersonalEdit';
import { useLocation } from 'react-router-dom';
import AddressEdit from './AddressEdit';
import { isAdmin } from '../../helpers/helper';

const ProfileEdit = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");


    return (
        <div className='w-screen relative h-screen overflow-y-auto hide-scrollbar'>
            <div className='w-full h-[8rem] '>
                <Header />
            </div>
            <ProfileHeader />

            {type == '1' ?
                <div className='w-full'>
                    <div className='w-full my-[3rem] flex font-semibold justify-center text-[2.5rem] mx-auto'>
                        <Text text={'Personal Information'} />
                    </div>
                    <div className='my-[2rem] w-full px-8'>
                        <PersonalEdit />
                    </div>
                </div>
                : (type == '2' && isAdmin()) ?
                    <div className='w-full'>
                        <div className='w-full my-[3rem] flex font-semibold justify-center text-[2.5rem] mx-auto'>
                            <Text text={'Address Information'} />
                        </div>
                        <div className='my-[2rem] w-full px-8'>
                            <AddressEdit />
                        </div>
                    </div>
                    :
                    <div className='w-full'>
                        <div className='w-full my-[3rem] flex font-semibold justify-center text-[2.5rem] mx-auto'>
                            <Text text={'Personal Information'} />
                        </div>
                        <div className='my-[2rem] w-full px-8'>
                            <PersonalEdit />
                        </div>
                    </div>

            }

            <div className='w-full'>
                <Footer />
            </div>
        </div>
    );
};

export default ProfileEdit;