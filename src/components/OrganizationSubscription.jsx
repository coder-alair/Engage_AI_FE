import React, { useEffect, useRef, useState } from 'react';
import logo from "../assets/Group.svg";
import { useNavigate } from 'react-router-dom';
import { Api } from '../api';
import CommonInput from '../helpers/common/Input/CommonInput';
import Loader from '../helpers/common/Loader';
import { errorToast } from '../helpers/helper';


const OrganizationSubscription = () => {
    const navigate = useNavigate();
    const scrollerRef = useRef(null);
    const [slides, setSlide] = useState([]);
    const [value, setValue] = useState();
    const [loader, setLoader] = useState(false);

    const getPlanDetails = () => {
        setLoader(true);
        Api.getPlans().then((res) => {
            if (res.data.data) {
                setLoader(false);
                setSlide(pre => {
                    return res.data.data.map((item) => {
                        if (item.metadata.unavailableFeatures) {
                            const availableFeature = JSON.parse(item.metadata.unavailableFeatures);
                            return {
                                ...item,
                                featuresUnavail: [...availableFeature, `${item.metadata.resumes} No of resume uploads`],
                                featuresAvail: JSON.parse(item.metadata.availableFeatures),
                                subscriptionName: item.metadata.plan,
                                price: (item.unitAmount / 100),
                                mode: item.type === "one_time" ? "payment" : "subscription",
                                button: item.type === "one_time" ? "Checkout" : "Subscribe",
                            }
                        } else {
                            return [];
                        }
                    })
                })
            }
        })

    }

    const checkout = (item) => {
        if (!value) {
            errorToast('Please Enter number of users.')
            return;
        }
        const body = {
            successUrl: `${window.location.origin}/company-details`,
            cancelUrl: window.location.href,
            subscriptionName: item.subscriptionName,
            productId: item.id,
            mode: item.mode,
            quantity: value,
        }
        setLoader(true);
        Api.checkoutPlan(body).then((res) => {
            setLoader(false);
            if (res?.data?.data) {
                window.location = res.data.data.url;
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const scroll = (direction) => {
        const scroller = scrollerRef.current;
        const scrollAmount = 300;

        if (direction === 'left') {
            scroller.scrollLeft -= scrollAmount;
        } else {
            scroller.scrollLeft += scrollAmount;
        }
    };

    const handleSubscribe = (item) => {
        checkout(item);
        // putUserOnBoard();
        // navigate('/company-details')
    };

    // const putUserOnBoard = () => {
    //     let payload = {
    //         onboarded: 2
    //     }
    //     Api.putOnboard(payload).then((res) => {
    //         return;
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }

    useEffect(() => {
        getPlanDetails();
    }, [])

    return (
        <div className='w-screen relative h-screen overflow-y-auto hide-scrollbar'>
            <div className="w-full gap-[2rem] flex flex-col justify-center mx-auto mt-6 text-sm md:text-4xl font-medium text-black ">
                <img
                    loading="lazy"
                    src={logo}
                    className="mx-auto aspect-[3.33] w-[200px] "
                />
                <p className='mx-auto'>Choose a Subscription plan for your company</p>
            </div>
            <div className='flex mt-[3rem] mx-auto w-[30rem] flex-col gap-2'>
                <CommonInput
                    classNames={'py-4 px-4 pl-14 text-purple-800 placeholder:text-gray-600 placeholder:text-lg !text-lg rounded-xl'}
                    placeholder={'Enter number of employees'}
                    // svgFile={AccountSVG}
                    type='text'
                    name="employees"
                    label="Please enter no. of employees"
                    value={value}
                    onChange={(e) => {
                        const input_value = e.target.value.trim()
                        const numberRegex = /^[0-9]+$/;

                        // Log the result of the regex test

                        // Check if the input is a valid number and greater than 1
                        if (!numberRegex.test(input_value)) {
                            setValue("")

                            // If the input contains alphabets or special characters, return
                            return;
                        }
                        if (parseInt(input_value) < 1) {
                            setValue("")

                            // If the parsed integer is less than or equal to 1, return
                            return;
                        }

                        setValue(input_value)
                    }
                    }
                />
            </div>
            {loader && <Loader />}
            <div className="relative mt-[2rem] hidden md:flex w-full overflow-hidden">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-purple-700 text-white p-2 z-10"
                >
                    &lt;
                </button>
                <div ref={scrollerRef} className="flex overflow-x-auto scroll-smooth hide-scrollbar">
                    {slides.map((slide, index) => (
                        <div key={index} className="w-[28rem] flex-none p-4">
                            <div className="relative h-full overflow-hidden border rounded-xl px-6 flex flex-col gap-2">
                                <div className="p-6 w-full h-full flex flex-col  ">
                                    <div className="mt-[1.5rem] w-full h-full flex gap-10">
                                        <div className="w-full h-full flex flex-col justify-between gap-5">
                                            <div className="flex flex-col gap-2">
                                                <p className="w-fit mx-auto text-4xl font-medium bg-gradient-to-r from-orange-500 via-orange-600 to-purple-900 text-transparent bg-clip-text">
                                                    {slide.subscriptionName} plan
                                                </p>
                                                <p className="font-semibold text-2xl mx-auto text-purple-700 ">${slide.price} </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {slide.featuresAvail.map((temp, index) => {
                                                    return <p key={index} className='font-light text-lg text-purple-700 '>{temp}</p>
                                                })}
                                                {slide.featuresUnavail.map((temp, index) => {
                                                    return <p key={index} className='font-light text-lg text-green-700 '>{temp}</p>
                                                })}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleSubscribe(slide)}
                                                    className="px-10 mx-auto rounded-xl bg-purple-700 w-fit text-white font-medium py-2"
                                                >
                                                    {slide.button}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-purple-700 text-white p-2 z-10"
                >
                    &gt;
                </button>
            </div>




        </div>
    );
};

export default OrganizationSubscription;


// const newSlides = [
//     {
//         id: "price_1PgGHyRvkn3AxuOrGO0NuXtd",
//         object: "price",
//         active: true,
//         billingScheme: "per_unit",
//         created: 1721870174,
//         currency: "cad",
//         customUnitAmount: null,
//         livemode: false,
//         lookupKey: null,
//         metadata: {
//             availableFeatures: ["Priority email", "Google docs style editor", "Customized AI developed JD", "Detailed Comprehensive resume analysis"],
//             resumes: "25",
//             unavailableFeatures: ["Hiring Platform - Application Tracking System", "Advanced Analytics - coming soon"]
//         },
//         nickname: null,
//         product: "prod_QXKikDl9zD4u4r",
//         recurring: null,
//         taxBehavior: "exclusive",
//         tiersMode: null,
//         transformQuantity: null,
//         type: "one_time",
//         unitAmount: 25000,
//         unitAmountDecimal: "25000"
//     },
//     {
//         id: "price_1PgG3JRvkn3AxuOrxwhOUnF1",
//         object: "price",
//         active: true,
//         billingScheme: "per_unit",
//         created: 1721869265,
//         currency: "cad",
//         customUnitAmount: null,
//         livemode: false,
//         lookupKey: null,
//         metadata: {
//             availableFeatures: ["Priority email", "Google docs style editor", "Customized AI developed JD", "Detailed Comprehensive resume analysis"],
//             resumes: "80",
//             unavailableFeatures: ["Hiring Platform - Application Tracking System", "Advanced Analytics - coming soon"]
//         },
//         nickname: null,
//         product: "prod_QXKikDl9zD4u4r",
//         recurring: {
//             aggregateUsage: null,
//             interval: "month",
//             intervalCount: 6,
//             meter: null,
//             trialPeriodDays: null,
//             usageType: "licensed"
//         },
//         taxBehavior: "exclusive",
//         tiersMode: null,
//         transformQuantity: null,
//         type: "recurring",
//         unitAmount: 45000,
//         unitAmountDecimal: "45000"
//     },
//     {
//         id: "price_1PgG3JRvkn3AxuOr1Wda7NEG",
//         object: "price",
//         active: true,
//         billingScheme: "per_unit",
//         created: 1721869265,
//         currency: "cad",
//         customUnitAmount: null,
//         livemode: false,
//         lookupKey: null,
//         metadata: {
//             availableFeatures: ["Priority email", "Google docs style editor", "Customized AI developed JD", "Detailed Comprehensive resume analysis"],
//             resumes: "100",
//             unavailableFeatures: ["Hiring Platform - Application Tracking System", "Advanced Analytics - coming soon"]
//         },
//         nickname: null,
//         product: "prod_QXKikDl9zD4u4r",
//         recurring: {
//             aggregateUsage: null,
//             interval: "year",
//             intervalCount: 1,
//             meter: null,
//             trialPeriodDays: null,
//             usageType: "licensed"
//         },
//         taxBehavior: "exclusive",
//         tiersMode: null,
//         transformQuantity: null,
//         type: "recurring",
//         unitAmount: 85000,
//         unitAmountDecimal: "85000"
//     },
//     {
//         id: "price_1PgG3JRvkn3AxuOreXqhv5QI",
//         object: "price",
//         active: true,
//         billingScheme: "per_unit",
//         created: 1721869265,
//         currency: "cad",
//         customUnitAmount: null,
//         livemode: false,
//         lookupKey: null,
//         metadata: {
//             availableFeatures: ["Priority email", "Google docs style editor", "Customized AI developed JD", "Detailed Comprehensive resume analysis"],
//             resumes: "50",
//             unavailableFeatures: ["Hiring Platform - Application Tracking System", "Advanced Analytics - coming soon"]
//         },
//         nickname: null,
//         product: "prod_QXKikDl9zD4u4r",
//         recurring: {
//             aggregateUsage: null,
//             interval: "month",
//             intervalCount: 3,
//             meter: null,
//             trialPeriodDays: null,
//             usageType: "licensed"
//         },
//         taxBehavior: "exclusive",
//         tiersMode: null,
//         transformQuantity: null,
//         type: "recurring",
//         unitAmount: 25000,
//         unitAmountDecimal: "25000"
//     }
// ];

// const newPlanse = newSlides.map((item) => {
//     const availableFeature = item.metadata.unavailableFeatures;
//     return {
//         ...item,
//         featuresUnavail: [...availableFeature, `${item.metadata.resumes} No of resume uploads`],
//         featuresAvail: item.metadata.availableFeatures,
//         subscriptionName: item.metadata.planType,
//         price: (item.unitAmount / 100),
//         mode: item.type === "one_time" ? "payment" : "subscription",
//         button: item.type === "one_time" ? "Checkout" : "Subscribe",
//     }
// })


// const slides = [
//     {
//         "subscriptionType": "MONTHLY",
//         "featuresAvail": [
//             {
//                 "name": "Priority email",
//                 "access": true
//             },
//             {
//                 "name": "Google docs style editor",
//                 "access": true
//             },
//             {
//                 "name": "Access 12+ cases",
//                 "access": true
//             }
//         ],
//         "featuresUnavail": [
//             {
//                 "name": "Compose & command features",
//                 "access": false
//             }
//         ],
//         "price": "$99",
//         "subscriptionName": "Basic",
//         "resumesAvailablity": 74,
//     },
//     {
//         "subscriptionType": "MONTHLY",
//         "featuresAvail": [
//             {
//                 "name": "Priority email",
//                 "access": true
//             },
//             {
//                 "name": "Google docs style editor",
//                 "access": true
//             },
//             {
//                 "name": "Compose & command features",
//                 "access": true
//             },
//             {
//                 "name": "Access 12+ cases",
//                 "access": true
//             }
//         ],
//         "featuresUnavail": [

//         ],
//         "price": "$149",
//         "subscriptionName": "Standard",
//         "resumesAvailablity": 200,
//     },
//     {
//         "subscriptionType": "MONTHLY",
//         "featuresAvail": [
//             {
//                 "name": "Priority email",
//                 "access": true
//             },
//             {
//                 "name": "Google docs style editor",
//                 "access": true
//             }
//         ],
//         "featuresUnavail": [
//             {
//                 "name": "Compose & command features",
//                 "access": false
//             },
//             {
//                 "name": "Access 12+ cases",
//                 "access": true
//             }
//         ],
//         "price": "$489",
//         "subscriptionName": "Premium",
//         "resumesAvailablity": "Unlimited",
//     },
//     {
//         "subscriptionType": "MONTHLY",
//         "featuresAvail": [
//             {
//                 "name": "Priority email",
//                 "access": true
//             },
//             {
//                 "name": "Google docs style editor",
//                 "access": true
//             }
//         ],
//         "featuresUnavail": [
//             {
//                 "name": "Compose & command features",
//                 "access": false
//             },
//             {
//                 "name": "Access 12+ cases",
//                 "access": true
//             }
//         ],
//         "price": "Contact for price",
//         "subscriptionName": "Premium Plus",
//         "resumesAvailablity": 500,
//     },
//     {
//         "subscriptionType": "Trial",
//         "featuresAvail": [
//             {
//                 "name": "Priority email",
//                 "access": true
//             },
//             {
//                 "name": "Google docs style editor",
//                 "access": true
//             }
//         ],
//         "featuresUnavail": [
//             {
//                 "name": "Compose & command features",
//                 "access": false
//             },
//             {
//                 "name": "Access 12+ cases",
//                 "access": true
//             }
//         ],
//         "price": "Free",
//         "subscriptionName": "Trial",
//         "resumesAvailablity": 7,
//     },

// ];