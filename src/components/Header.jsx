import React, { useContext, useEffect, useState } from 'react';
import logo from "../assets/Group.svg"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MyContext } from '../App';
import { getLocalStorageItem } from '../helpers/helper';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentActive, setCurrentActive] = useState('recruit-ai');
    const [authorize, setAuthorize] = useState(false);
    const { login, setLogin } = useContext(MyContext);
    const [userData, setUserData] = useState({})

    useEffect(() => {
        if (getLocalStorageItem('userData')) {
            const user = JSON.parse(getLocalStorageItem('userData'));
            setUserData(user)
        }
        const handleStorageChange = (event) => {
            if (event.type === 'storage') {
                if (getLocalStorageItem('userData')) {
                    const user = JSON.parse(getLocalStorageItem('userData'));
                    setUserData(user)
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };


    }, [])

    useEffect(() => {
        let path = location.pathname;
        setCurrentActive(path);
    }, [location.pathname]);

    useEffect(() => {
        if (login) {
            setAuthorize(true);
        } else {
            setAuthorize(false);
        }
    }, [login]);

    const handleLogout = () => {
        setLogin("");
        localStorage.clear();
        navigate('/login');
    }

    return (
        <div className='h-full md:px-6 mt-1 md:pt-4 flex items-center justify-between'>
            <div className='flex pl-2 md:px-0 '>
                <img
                    loading="lazy"
                    src={logo}
                    className="self-center max-w-full aspect-[3.33] w-[150px] md:w-[200px]"
                />
            </div>
            {authorize &&
                <>
                    <div className='hidden sm:flex'>
                        <ul className='flex gap-x-10 text-xl '>
                            <li onClick={() => navigate('/recruit-ai')} className={`cursor-pointer ${location.pathname.includes('/recruit-ai') ? 'text-purple-900 font-semibold  transition-all' : 'text-gray-600'}`}>Recruit AI</li>
                            <li onClick={() => navigate('/profile')} className={`cursor-pointer ${location.pathname.includes('/profile') ? 'text-purple-900 font-semibold' : 'text-gray-600'}`}>Profile</li>
                        </ul>
                    </div>
                    <div className="sm:hidden flex w-full  h-[3rem] bg-purple-800 fixed bottom-0 z-40 rounded-tr-2xl rounded-tl-2xl shadow-neumorphism">
                        <div className="w-full flex  relative ">
                            <nav className=" h-full w-full flex gap-5 justify-evenly relative mb-[15px]">
                                <a
                                    className={`bg-purple-800 text-white rounded-xl p-1 h-fit flex-col my-3 font-semibold flex gap-2 items-center transition-all duration-500`}
                                    // key={index}
                                    href={"/recruit-ai"}
                                >
                                    {/* <div className=" scale-110 aspect-square "></div> */}
                                    <div className='flex gap-x-2 items-center'>
                                        <svg fill="#fff" width="18px" height="18px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <path className="clr-i-outline clr-i-outline-path-1" d="M18.1,11c-3.9,0-7,3.1-7,7s3.1,7,7,7c3.9,0,7-3.1,7-7S22,11,18.1,11z M18.1,23c-2.8,0-5-2.2-5-5s2.2-5,5-5c2.8,0,5,2.2,5,5S20.9,23,18.1,23z"></path><path className="clr-i-outline clr-i-outline-path-2" d="M32.8,14.7L30,13.8l-0.6-1.5l1.4-2.6c0.3-0.6,0.2-1.4-0.3-1.9l-2.4-2.4c-0.5-0.5-1.3-0.6-1.9-0.3l-2.6,1.4l-1.5-0.6l-0.9-2.8C21,2.5,20.4,2,19.7,2h-3.4c-0.7,0-1.3,0.5-1.4,1.2L14,6c-0.6,0.1-1.1,0.3-1.6,0.6L9.8,5.2C9.2,4.9,8.4,5,7.9,5.5L5.5,7.9C5,8.4,4.9,9.2,5.2,9.8l1.3,2.5c-0.2,0.5-0.4,1.1-0.6,1.6l-2.8,0.9C2.5,15,2,15.6,2,16.3v3.4c0,0.7,0.5,1.3,1.2,1.5L6,22.1l0.6,1.5l-1.4,2.6c-0.3,0.6-0.2,1.4,0.3,1.9l2.4,2.4c0.5,0.5,1.3,0.6,1.9,0.3l2.6-1.4l1.5,0.6l0.9,2.9c0.2,0.6,0.8,1.1,1.5,1.1h3.4c0.7,0,1.3-0.5,1.5-1.1l0.9-2.9l1.5-0.6l2.6,1.4c0.6,0.3,1.4,0.2,1.9-0.3l2.4-2.4c0.5-0.5,0.6-1.3,0.3-1.9l-1.4-2.6l0.6-1.5l2.9-0.9c0.6-0.2,1.1-0.8,1.1-1.5v-3.4C34,15.6,33.5,14.9,32.8,14.7z M32,19.4l-3.6,1.1L28.3,21c-0.3,0.7-0.6,1.4-0.9,2.1l-0.3,0.5l1.8,3.3l-2,2l-3.3-1.8l-0.5,0.3c-0.7,0.4-1.4,0.7-2.1,0.9l-0.5,0.1L19.4,32h-2.8l-1.1-3.6L15,28.3c-0.7-0.3-1.4-0.6-2.1-0.9l-0.5-0.3l-3.3,1.8l-2-2l1.8-3.3l-0.3-0.5c-0.4-0.7-0.7-1.4-0.9-2.1l-0.1-0.5L4,19.4v-2.8l3.4-1l0.2-0.5c0.2-0.8,0.5-1.5,0.9-2.2l0.3-0.5L7.1,9.1l2-2l3.2,1.8l0.5-0.3c0.7-0.4,1.4-0.7,2.2-0.9l0.5-0.2L16.6,4h2.8l1.1,3.5L21,7.7c0.7,0.2,1.4,0.5,2.1,0.9l0.5,0.3l3.3-1.8l2,2l-1.8,3.3l0.3,0.5c0.4,0.7,0.7,1.4,0.9,2.1l0.1,0.5l3.6,1.1V19.4z"></path>
                                            <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
                                        </svg>
                                        <div>Recruit AI</div> </div>
                                </a>
                                <a
                                    className={`bg-purple-800 text-white rounded-xl p-1 h-fit flex-col my-3 font-semibold flex gap-2 items-center transition-all duration-500`}
                                    // key={index}
                                    href={"/profile"}
                                >

                                    <div className='flex gap-x-2 items-center'>
                                        <svg width="16px" height="16px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                <g id="Dribbble-Light-Preview" transform="translate(-420.000000, -2159.000000)" fill="#fff">
                                                    <g id="icons" transform="translate(56.000000, 160.000000)">
                                                        <path d="M374,2009 C371.794,2009 370,2007.206 370,2005 C370,2002.794 371.794,2001 374,2001 C376.206,2001 378,2002.794 378,2005 C378,2007.206 376.206,2009 374,2009 M377.758,2009.673 C379.124,2008.574 380,2006.89 380,2005 C380,2001.686 377.314,1999 374,1999 C370.686,1999 368,2001.686 368,2005 C368,2006.89 368.876,2008.574 370.242,2009.673 C366.583,2011.048 364,2014.445 364,2019 L366,2019 C366,2014 369.589,2011 374,2011 C378.411,2011 382,2014 382,2019 L384,2019 C384,2014.445 381.417,2011.048 377.758,2009.673" id="profile-[#1335]">
                                                        </path>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                        <div>Profile</div>
                                    </div>
                                </a>
                            </nav>
                        </div>




                        {/* <div className="w-full flex items-center justify-center">
                     <Image
                       alt=""
                       src="/assets/img/mainLogo.png"
                       className="invert"
                       width={120}
                       height={120}
                     />
                   </div>
                   <div className=" flex-grow flex flex-col justify-between">
                     <div className="flex flex-col gap-2  mt-4">
                       {sidebar?.map((item, index) => {
                         return (
                         
                           <Link
                             className={`${item.route === pathname
                                 ? "bg-primary-dark text-white"
                                 : "hover:bg-primary-light"
                               }  rounded-xl p-2 font-semibold flex gap-x-2 items-center transition-all duration-500`}
                             key={index}
                             href={item.route}
                           >
                             <div className=" scale-110 aspect-square ">{item.icon}</div>
                             <div>{item.label}</div>
                           </Link>
                         );
                       })}
                     </div>
                     <div>
                       <Image
                         src={welcomeImg}
                         className="w-full aspect-square"
                         width={"100%"}
                         height={"100%"}
                       />
                     </div>
             
                     <div className="p-2 text-lg font-semibold text-primary-dark cursor-pointer w-full items-center gap-2 flex justify-center">
                       <FaPowerOff />
                       <div 
                        onClick={() => {
                         handleLogout();
                       }}
                       >Log out</div>
                     </div>
                   </div> */}
                    </div>
                </>
            }

            {authorize ?
                <div className='gap-x-1 flex flex-row'>
                    <p className='px-3 flex gap-2 md:gap-0 py-2 md:text-xl text-lg font-medium w-fit bg-gradient-to-r from-orange-500 via-orange-600 to-purple-900 text-transparent bg-clip-text'>Hi, {userData.firstName}
                        <button onClick={handleLogout} className='rounded-2xl flex md:hidden border border-3 px-2 py-1 text-md font-medium  text-white bg-purple-900'>
                            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g id="Iconly/Curved/Logout">
                                    <g id="Logout">
                                        <path id="Stroke 1" d="M21.791 12.1208H9.75" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path id="Stroke 3" d="M18.8643 9.20483L21.7923 12.1208L18.8643 15.0368" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path id="Stroke 4" d="M16.3597 7.63C16.0297 4.05 14.6897 2.75 9.35974 2.75C2.25874 2.75 2.25874 5.06 2.25874 12C2.25874 18.94 2.25874 21.25 9.35974 21.25C14.6897 21.25 16.0297 19.95 16.3597 16.37" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </g>
                            </svg>

                        </button>
                    </p>
                    <button onClick={handleLogout} className='rounded-2xl hidden md:flex border border-3 px-6 py-2 text-md font-medium  text-white bg-purple-900'>Logout</button>
                </div>
                :
                <div className='hidden md:flex gap-x-3'>
                    <button onClick={() => navigate('/login')} className='rounded-2xl border border-3 text-md text-orange-400 font-medium border-orange-400 px-8 py-2'>Log In</button>
                    <button onClick={() => navigate('/signup')} className='rounded-2xl border border-3 px-6 py-2 text-md font-medium  text-white bg-purple-900'>Sign Up</button>
                </div>
            }
        </div>
    );
};

export default Header;