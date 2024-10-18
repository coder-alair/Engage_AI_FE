import { logIn } from "../api/logIn";
import { useForm } from "react-hook-form";
import "../tailwind.css";
import SuccessToast from "../helpers/SucessToast";
import ErrorToast from "../helpers/ErrorToast";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import email from "../assets/icon.svg";
import logo from "../assets/Group.svg";
import lock from "../assets/lock.svg";
import { cleanLocalStorage } from "../helpers/helper";
import { MyContext } from "../App";


export const LoginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 12 characters long" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter",
    }),
});

export default function LogIn() {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });
  const { login, setLogin } = useContext(MyContext);
  const [toast, setToast] = useState(null);
  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await logIn(data.email, data.password);
      const { token, userData, message } = response;
      localStorage.setItem("token", token);
      setLogin(token)
      localStorage.setItem("userData", JSON.stringify(userData));
      if (userData.onboarded && userData.userType == "ADMIN") {
        if (userData.onboarded == 1) {
          navigate("/company-subscription");
        }
        if (userData.onboarded == 2) {
          navigate("/company-details");
        }
      } else {
        navigate("/recruit-ai");
      }

      setToast(
        <SuccessToast message={message || "user Loged In successfully"} />
      );








    } catch (error) {
      setBackendError(error.message || "Unexpected error occurred");
      setToast(
        <ErrorToast message={error.message || "unexpected error occured"} />
      );
    }
  };

  useEffect(() => {

    cleanLocalStorage();
    setLogin("")

  }, [])

  useEffect(() => {
    if (login) {
      navigate('/recruit-ai');
    }
  }, [login]);

  return (
    <div className="flex flex-col items-center px-8 pt-12 pb-5 text-xl font-medium text-purple-900 text-opacity-85 bg-white h-screen max-md:px-4">
      <div className="flex flex-col mt-1.5 w-full max-w-md">
        <img
          loading="lazy"
          src={logo}
          className="self-center max-w-full aspect-[3.33] w-[200px]"
        />
        <div className="self-center mt-16 text-3xl text-black leading-[40px] max-md:mt-8">
          Welcome Back
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-5">
          <div className="input-container">
            <div className="input-wrapper">
              <img
                loading="lazy"
                src={email}
                className="shrink-0 w-9 aspect-square"
              />
              <input
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                className="w-full border-none bg-transparent focus:outline-none"
              />
            </div>
          </div>
          {errors.email && (
            <p className="text-red-600  p-2 mt-1">{errors.email.message}</p>
          )}
          {/* ------------------------------------------------------------------- */}
          <div className="input-container ">
            <div className="input-wrapper w-full max-md:flex-wrap max-md:max-w-full">
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
                />
              </div>
            </div>
          </div>
          {errors.password && (
            <p className="text-red-600  p-2 mt-1">{errors.password.message}</p>
          )}

          {/* ----------------------------------------------------------------------------------------- */}
          <div className="self-end mt-2.5 text-lg leading-9 text-center">
            <Link to={'/resetrequest'}>Forgot Password?</Link>
          </div>
          {backendError && (
            <p className="text-red-600 p-2 mt-1 self-center">{backendError}</p>
          )}
          <button
            type="submit"
            className="flex justify-center items-center px-10 py-4 mt-5 text-xl text-white whitespace-nowrap bg-purple-900 rounded-3xl max-md:px-4 max-md:max-w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading ..." : "Log In"}
          </button>
        </form>
        {/* <div className="self-center mt-6 leading-9 text-center">
          Don’t have an account?{" "}
          <Link to="/signup">
            <span className="font-medium text-blue-500 cursor-pointer">
              Sign Up
            </span>
          </Link>
        </div> */}
      </div>
      {toast}
    </div>
  );
}
