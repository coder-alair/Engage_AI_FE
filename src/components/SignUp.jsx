import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import "../tailwind.css";
import { signUp } from "../api/signUp";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SuccessToast from "../helpers/SucessToast";
import TermsModal from "./TermsModel";
import ErrorToast from "../helpers/ErrorToast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Icon from "../assets/icon.svg";
import logo from "../assets/Group.svg";
import lock from "../assets/lock.svg";
import buildings from "../assets/buildings.svg";
import code from "../assets/code.svg";
import location from "../assets/location-pin.svg";
import globe from "../assets/globe-alt.svg";
import pensquare from "../assets/pen-square.svg";
import starIcon from "../assets/star.webp";
import person from "../assets/person-icon.svg"
import { Api } from "../api";
import { jwtDecode } from 'jwt-decode';
import { MyContext } from "../App";
import { cleanLocalStorage, errorToast } from "../helpers/helper";

export const signUpSchema = z
  .object({
    email: z.string().optional(),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(18, { message: "Password must be no more than 18 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/^[\x00-\x7F]+$/, {
        message: "Password must not contain any Unicode characters",
      })
      .regex(/^\S*$/, { message: "Password must not contain any spaces" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
    companyName: z.string().min(1, { message: "Company name is required" }),
    address1: z.string().min(1, { message: "Company address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    province: z.string().min(1, { message: "Province / State is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    industry: z.string().min(1, { message: "Industry is required" }),
    bio: z.string().min(1, { message: "Write a short bio about your company" }),
    jobTitle: z.string().min(1, { message: "Job title is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password and confirm password didnt match",
    path: ["confirmPassword"],
  });

export const signUpUserSchema = z
  .object({
    email: z.string().optional(),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(18, { message: "Password must be no more than 18 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/\d/, { message: "Password must contain at least one number" })
      .regex(/^[\x00-\x7F]+$/, {
        message: "Password must not contain any Unicode characters",
      })
      .regex(/^\S*$/, { message: "Password must not contain any spaces" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
    companyName: z.string().min(1, { message: "Company name is required" }).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password and confirm password didnt match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const company = new URLSearchParams(window.location.search).get('invitation');
  const companyAdmin = new URLSearchParams(window.location.search).get('token');

  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [amount, setAmount] = useState(0);
  const [resumesCapacity, setResumesCapacity] = useState(0);
  const [expiryDate, setExpiryDate] = useState('');
  const [userEmails, setUserEmails] = useState([]);
  const [currency, setCurrency] = useState('');

  const [form, setForm] = useState({
    email: '',
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    address1: "",
    city: "",
    province: "",
    country: "",
    postalCode: "",
    industry: "",
    bio: "",
    jobTitle: "",
    role: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm({
    resolver: zodResolver(!company ? signUpSchema : signUpUserSchema),
  });

  const [toast, setToast] = useState(null);
  const [backendError, setBackendError] = useState("");
  const { login, setLogin } = useContext(MyContext);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (!isTermsAccepted) {
      let msg = "Please accept the terms and conditions.";
      setBackendError("Please Accept terms and conditions before signing in");
      setToast(<ErrorToast message={msg} />);
      return;
    }
    try {
      data = {
        ...data,
        role: !company ? "ADMIN" : "USER",
        companyId: !company ? null : companyId,
        paid: companyAdmin ? true : false
      }

      if (company || companyAdmin) {
        data = {
          ...data,
          email: userEmail,
          userEmails:userEmails,
          expiryDate,
          amount,
          currency,
          resumesCapacity
        }
      }

      const response = await signUp(data);
      const { message } = response;
      setToast(<SuccessToast message={message} />);
      navigate("/verification", {
        state: message,
        replace: true
      });
    } catch (error) {
      setBackendError(error.message || "Unexpected error occurred");
      setToast(<ErrorToast message={error.message} />);
    }
  };

  const handleOpenTerms = () => {
    setIsTermsModalVisible(true);
  };

  const handleCloseTerms = () => {
    setIsTermsModalVisible(false);
  };

  const handleAcceptTerms = () => {
    setIsTermsAccepted(true);
    setIsTermsModalVisible(false);
  };

  useEffect(() => {
    if (login && !company) {
      navigate('/recruit-ai');
    }
  }, [login]);

  useEffect(() => {
    if (company || companyAdmin) {
      const details = jwtDecode(company || companyAdmin);
      const currentTime = Date.now() / 1000;

      if (details.exp && details.exp < currentTime) {
        setToast(
          <ErrorToast message={"Invitation Expired."} />
        );
        cleanLocalStorage();
        setTimeout(() => {
          navigate('/login')
        }, 2000)
        setLogin("");
      } else {
        setCompanyId(details?.companyId);
        setUserEmail(details?.email);
        setUserEmails(details?.userEmails);
        setAmount(details?.amount);
        setExpiryDate(details?.expiryDate);
        setResumesCapacity(details?.resumesCapacity);
        setCurrency(details?.currency);
      }
    }else{
      navigate('/')
    }
  }, []);

  useEffect(() => {
    if (companyId) {
      Api.getCompayData(companyId).then((res) => {
        setCompanyName(res?.data?.data?.companyName)
      }).catch(err => {
        console.log(err)
      })
    }
  }, [companyId])

  return (
    <div className="flex flex-col items-center px-16 pt-20 pb-7 text-2xl bg-white  max-md:px-5">
      <div className="flex flex-col max-w-full w-[635px]">
        <img
          loading="lazy"
          src={logo}
          className="self-center max-w-full aspect-[3.33] w-[239px] "
        />
        <div className="self-center mt-14 text-4xl font-medium text-black leading-[60px] max-md:mt-10">
          Create an {company ? '' : 'Organization'}  Account
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full text-purple-900 text-opacity-80 font-medium text-xl"
        >

          <div className="input-container ">
            <div className="input-wrapper  relative ">
              <img
                loading="lazy"
                src={Icon}
                className="shrink-0 w-9 aspect-square"
              />

              <input
                type="email"
                defaultValue={userEmail}
                disabled={company ? true : false}
                placeholder="Enter your email address"
                {...register("email")}
                className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
              />
              <img
                loading="lazy"
                src={starIcon}
                className="absolute right-3 w-3 h-3 mt-[0.6rem]"
              />
            </div>
          </div>

          {errors.email && (
            <p className="text-red-600  p-2 mt-1">{errors.email.message}</p>
          )}


          {/* --------------------------------------------------------------------------------- */}

          <div className="input-container ">
            <div className="input-wrapper relative w-full max-md:flex-wrap max-md:max-w-full">
              <div className="flex gap-5 justify-between w-full">
                <img
                  loading="lazy"
                  src={lock}
                  className="shrink-0 w-9 aspect-square"
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    onBlur: () => trigger("password"),
                  })}
                  className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
                  autoComplete="new-password"
                />
                <img
                  loading="lazy"
                  src={starIcon}
                  className="absolute right-3 w-3 h-3 mt-[0.6rem]"
                />
              </div>
            </div>
          </div>
          <p className="flex items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-700 ml-[1rem]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 -mt-px "
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              ></path>
            </svg>
            Use at least 8 characters, one Uppercase,one Lowercase,one number
          </p>

          {errors.password && (
            <p className="text-red-600  p-2 mt-1">{errors.password.message}</p>
          )}
          {/* ------------------------------------------------------------- */}
          <div className="input-container ">
            <div className="input-wrapper relative w-full max-md:flex-wrap max-md:max-w-full">
              <div className="flex gap-5 justify-between w-full">
                <img
                  loading="lazy"
                  src={lock}
                  className="shrink-0 w-9 aspect-square"
                />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    onBlur: () => trigger("confirmPassword"),
                  })}
                  className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
                  autoComplete="new-password"
                />

              </div>
            </div>
          </div>

          {errors.confirmPassword && (
            <p className="text-red-600 p-2 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}

          {/* ------------------------------------------------------------------------------ */}
          <div className="flex gap-5 justify-between mt-5 text-center-value whitespace-nowrap leading-[152%] max-md:flex-wrap max-md:max-w-full">
            <div className=" w-full input-container ">
              <div className="input-wrapper relative">
                <img
                  loading="lazy"
                  src={person}
                  className="shrink-0 w-10 aspect-square icon-gradient"
                />
                <input
                  type="text"
                  placeholder="FirstName"
                  {...register("firstName")}
                  className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
                />
                <img
                  loading="lazy"
                  src={starIcon}
                  className="absolute right-3 w-3 h-3 mt-[0.6rem]"
                />
              </div>
            </div>

            <div className="input-container  w-full">
              <div className="input-wrapper relative">
                <img
                  loading="lazy"
                  src={person}
                  className="shrink-0 w-10 aspect-square icon-gradient"
                />
                <input
                  type="text"
                  placeholder="LastName"
                  {...register("lastName")}
                  className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
                />
                <img
                  loading="lazy"
                  src={starIcon}
                  className="absolute right-3 w-3 h-3 mt-[0.6rem]"
                />
              </div>
            </div>
          </div>

          {errors.firstName && (
            <p className="text-red-600  p-2 mt-1">{errors.firstName.message}</p>
          )}
          {errors.lastName && (
            <p className="text-red-600 p-2 mt-1">{errors.lastName.message}</p>
          )}
          {/* -----------Company Data----------------------------------------------------------------- */}



          <div className="input-container ">
            <div className="input-wrapper relative">
              <img
                loading="lazy"
                src={buildings}
                className="shrink-0 w-9 aspect-square"
              />
              <input
                type="text"
                defaultValue={companyName}
                disabled={company ? true : false}
                placeholder="Enter your company name"
                {...register("companyName")}
                className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
              />
              <img
                loading="lazy"
                src={starIcon}
                className="absolute right-3 w-3 h-3 mt-[0.6rem]"
              />
            </div>
          </div>

          {errors.companyName && (
            <p className="text-red-600  p-2 mt-1">
              {errors.companyName.message}
            </p>
          )}

          {!company &&
            <>
              {/* --------------------------------------------------------------- */}
              <div className="input-container ">
                <div className="input-wrapper relative">
                  <img
                    loading="lazy"
                    src={location}
                    className="shrink-0 w-9 aspect-square"
                  />
                  <input
                    type="text"
                    placeholder="Address of your company"
                    {...register("address1")}
                    className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
                  />
                  <img
                    loading="lazy"
                    src={starIcon}
                    className="absolute right-3 w-3 h-3 mt-[0.6rem]"
                  />
                </div>
              </div>
              {errors.address1 && (
                <p className="text-red-600  p-2 mt-1">{errors.address1.message}</p>
              )}
              {/* --------------------------------------------------------------------------------------------------------- */}
              <div className="input-container ">
                <div className="input-wrapper relative">
                  <img
                    loading="lazy"
                    src={location}
                    className="shrink-0 w-9 aspect-square"
                  />
                  <input
                    type="text"
                    placeholder="City of your company"
                    {...register("city")}
                    className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
                  />
                  <img
                    loading="lazy"
                    src={starIcon}
                    className="absolute right-3 w-3 h-3 mt-[0.6rem]"
                  />
                </div>
              </div>
              {errors.city && (
                <p className="text-red-600  p-2 mt-1">{errors.city.message}</p>
              )}
              {/* ---------------------------------------------------------------------------------------------------------------- */}
              <div className="flex gap-5 justify-between mt-5 text-center-value whitespace-nowrap leading-[152%] max-md:flex-wrap max-md:max-w-full">
                <div className="input-container w-full ">
                  <div className="input-wrapper relative">
                    <img
                      loading="lazy"
                      src={globe}
                      className="shrink-0 w-9 aspect-square"
                    />
                    <input
                      type="text"
                      placeholder="State / Province"
                      {...register("province")}
                      className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
                    />
                    <img
                      loading="lazy"
                      src={starIcon}
                      className="absolute right-3 w-3 h-3 mt-[0.6rem]"
                    />
                  </div>
                </div>
                <div className="input-container w-full ">
                  <div className="input-wrapper relative">
                    <img
                      loading="lazy"
                      src={globe}
                      className="shrink-0 w-9 aspect-square"
                      alt="Globe"
                    />

                    <select
                      {...register("country")}
                      className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl "
                    >
                      <option value="">Select Country</option>
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                      <option value="India">India</option>
                    </select>
                    <div className="ml-[0.4rem]">
                      <img
                        loading="lazy"
                        src={starIcon}
                        className="absolute right-3 w-3 h-3 mt-[0.6rem]"
                      />
                    </div>

                  </div>

                </div>
              </div>
              {errors.state && (
                <p className="text-red-600  p-2 mt-1">{errors.state.message}</p>
              )}
              {errors.country && (
                <p className="text-red-600  p-2 mt-1">{errors.country.message}</p>
              )}
              {/* ------------------------------------------------------------ */}

              <div className="input-container ">
                <div className="input-wrapper relative">
                  <img
                    loading="lazy"
                    src={code}
                    className="shrink-0 w-9 aspect-square"
                  />
                  <input
                    type="text"
                    placeholder=" Postalcode of company"
                    {...register("postalCode")}
                    className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
                  />
                  <img
                    loading="lazy"
                    src={starIcon}
                    className="absolute right-3 w-3 h-3 mt-[0.6rem]"
                  />
                </div>
              </div>
              {errors.postalCode && (
                <p className="text-red-600  p-2 mt-1">
                  {errors.postalCode.message}
                </p>
              )}

              {/* ------------------------------------------------------------------------------------------------------------ */}
              <div className="input-container ">
                <div className="input-wrapper relative">
                  <img
                    loading="lazy"
                    src={buildings}
                    className="shrink-0 w-9 aspect-square"
                  />
                  <input
                    type="text"
                    placeholder="Industry of company "
                    {...register("industry")}
                    className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
                  />
                  <img
                    loading="lazy"
                    src={starIcon}
                    className="absolute right-3 w-3 h-3 mt-[0.6rem]"
                  />
                </div>
              </div>
              {errors.industry && (
                <p className="text-red-600  p-2 mt-1">{errors.industry.message}</p>
              )}
              {/* --------------------------------------------------------------- */}
              <div className="input-container ">
                <div className="input-wrapper relative">
                  <img
                    loading="lazy"
                    src={pensquare}
                    className="shrink-0 w-9 aspect-square"
                  />
                  <input
                    type="text"
                    placeholder="Your jobtitle in company"
                    {...register("jobTitle")}
                    className="w-full border-none bg-transparent focus:outline-none text-[1.1rem] md:text-xl"
                  />
                  <img
                    loading="lazy"
                    src={starIcon}
                    className="absolute right-3 w-3 h-3 mt-[0.6rem]"
                  />
                </div>
              </div>
              {errors.jobTitle && (
                <p className="text-red-600  p-2 mt-1">{errors.jobTitle.message}</p>
              )}

              {/* -------------------------------------------------------------------------------------------- */}
              <div className="input-container  h-full">
                <div className="input-wrapper relative mb-16 max-md:mb-10 w-full h-full flex items-start">
                  <img
                    loading="lazy"
                    src={pensquare}
                    className="shrink-0 w-9 aspect-square mr-2"
                  />
                  <textarea
                    placeholder="Write short bio about company"
                    {...register("bio")}
                    className="w-full h-full border-none bg-transparent focus:outline-none resize-none text-[1.1rem] md:text-xl"
                  />
                  <img
                    loading="lazy"
                    src={starIcon}
                    className="absolute right-3 w-3 h-3 mt-[0.6rem]"
                  />
                </div>
              </div>
              {errors.bio && (
                <p className="text-red-600  p-2 mt-1">{errors.bio.message}</p>
              )}

              {/* ------------------------------------------------------------- */}

            </>
          }

          <div className="flex items-center mt-4">
            <label htmlFor="terms">
              Read and agree to the{" "}
              <button
                type="button"
                onClick={handleOpenTerms}
                className="text-blue-500 underline cursor-pointer "
              >
                Terms and Conditions
              </button>
            </label>
          </div>
          {backendError && (
            <p className="text-red-600 p-2 mt-1 self-center">{backendError}</p>
          )}
          <button
            type="submit"
            // onClick={handleSubmitForm}
            className={`w-full bg-purple-600 mt-5 mb-10 text-center text-xl text-white py-4 border-none rounded-xl cursor-pointer ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading ...." : "Submit"}

            {/* Submit */}
          </button>
        </form>

        <div className="text-center-value">
          Already have an account?{" "}
          <Link to="/login">
            <span className="font-medium  text-blue-500">Sign In</span>
          </Link>
        </div>
        {/* <div className="link-container">
          <div>Terms of Use</div>
          <div>Privacy Policy</div>
        </div> */}
      </div>
      {toast}
      <TermsModal
        isVisible={isTermsModalVisible}
        onClose={handleCloseTerms}
        onAccept={handleAcceptTerms}
        handleCheckboxChange={handleCheckboxChange}
        isChecked={isChecked}
      />
    </div>
  );
}
