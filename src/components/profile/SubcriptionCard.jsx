import moment from 'moment';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { isAdmin } from '../../helpers/helper';

const SubcriptionCard = ({ userData }) => {
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [featuresAvailableData, setFeaturesAvailableData] = useState([]);
    const [featuresUnavailableData, setUnavailableData] = useState([]);

    function daysUntilExpiry(expiryDateString) {
        const expiryDate = new Date(expiryDateString);
        const currentDate = new Date();

        // Calculate the difference in milliseconds
        const differenceMs = expiryDate - currentDate;

        // Convert milliseconds to days
        const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

        return differenceDays;
    }

    useLayoutEffect(() => {
        if (userData) {
            if (userData?.userSubscription && userData?.userSubscription.length) {
                setSubscriptionData(userData?.userSubscription[0]);
                if (userData?.userSubscription[0]?.subscription) {
                    const feature = userData?.userSubscription[0]?.subscription?.featuresAvail;
                    const unanvail = userData?.userSubscription[0]?.subscription?.featuresUnavail;
                    setFeaturesAvailableData(typeof feature === 'string' ? JSON.parse(feature) : feature);
                    setUnavailableData(typeof unanvail === 'string' ? JSON.parse(unanvail) : unanvail);
                }

            }
        }
    }, [userData])


    return (
        <div className='mt-[5rem] w-full h-full flex gap-5 flex-wrap md:flex-nowrap'>
            <div className='w-[45rem] h-full relative overflow-hidden border rounded-xl px-6 flex flex-col gap-2'>
                <div className='bg-purple-800 absolute right-0 rounded-bl-xl font-medium text-white px-4 py-2'>
                    Expires on :  {subscriptionData?.expiryDate && moment(subscriptionData?.expiryDate).format('MMM Do YY')}
                </div>

                <div className='p-6 w-full h-max flex flex-col gap-2'>
                    <div className='mt-[2.5rem] w-full flex gap-10'>
                        <div className='w-full  flex flex-col justify-between  gap-5'>
                            <div className='flex flex-col gap-2'>
                                <p className='w-fit mx-auto text-3xl font-medium bg-gradient-to-r from-orange-500 via-orange-600 to-purple-900 text-transparent bg-clip-text'>{subscriptionData?.subscription?.subscriptionName} plan</p>
                                <p className='font-semibold text-2xl  mx-auto text-purple-700 '>{isAdmin() && subscriptionData?.subscription?.price}</p>
                            </div>

                            <div className='flex flex-col gap-2'>
                                {featuresAvailableData && featuresAvailableData.length > 0 && featuresAvailableData?.map((i, index) => {
                                    return <p key={index} className='font-light text-lg text-purple-700 '>{typeof i === "string" ? i : i.name}</p>
                                })}
                                {featuresUnavailableData && featuresUnavailableData.length > 0 && featuresUnavailableData?.map((i, index) => {
                                    return <p key={index} className='font-light text-lg text-green-700 '>{typeof i === "string" ? i : i.name}</p>
                                })}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <button disabled className='px-10 mx-auto rounded-xl bg-purple-700 w-fit text-white font-medium py-2'>Subscribed</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-full border rounded-xl px-6 flex flex-col gap-2'>
                <div className=' rounded-bl-xl  px-4 py-2'>
                </div>

                <div className='p-6 w-full h-full flex flex-col gap-2'>
                    <div className='mt-[1rem] h-full w-full flex gap-10'>
                        <div className='w-full h-full flex flex-col justify-between gap-5'>
                            <div className='flex justify-between gap-2 flex-wrap lg:flex-nowrap'>
                                <p className='w-fit text-left text-xl sm:text-3xl font-medium bg-gradient-to-r from-orange-500 via-orange-600 to-purple-900 text-transparent bg-clip-text'>{subscriptionData?.subscription?.subscriptionName} plan</p>
                                <p className='w-fit text-left text-md sm:text-xl font-medium bg-gradient-to-r from-orange-500 via-orange-600 to-purple-900 text-transparent bg-clip-text'>Usage : {subscriptionData?.resumesUsed}/{subscriptionData?.subscription?.resumesAvailablity}</p>
                            </div>

                            <div className='flex flex-col gap-2'>

                                <p className='font-light text-lg text-purple-700 '>Total Allowed Uploads : {subscriptionData?.subscription?.resumesAvailablity}</p>
                                <p className='font-light text-lg text-purple-700 '>Remaining Uploads : {subscriptionData?.subscription?.resumesAvailablity - subscriptionData?.resumesUsed}</p>

                                <p className='font-light text-lg text-purple-700 '>Plan Duration : {subscriptionData?.subscription?.subscriptionType == 'MONTHLY' ? '30 days' : subscriptionData?.subscription?.subscriptionType == 'ANNUAL' ? '365 days' : 'Trial Period'} </p>
                                <p className='font-light text-lg text-purple-700 '>Days left for expiry : {daysUntilExpiry(new Date(subscriptionData?.expiryDate))} days </p>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='font-light text-sm text-gray-700 '>In {subscriptionData?.subscription?.subscriptionName} subscription you can avail Priority email & chat support, Access 12+ cases, Generate 1000 Ai words,Google docs style editor etc.</p>
                                <div className='w-full border'>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SubcriptionCard;