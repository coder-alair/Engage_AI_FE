import { useForm } from "react-hook-form";
import "../../tailwind.css";
import SuccessToast from "../../helpers/SucessToast";
import ErrorToast from "../../helpers/ErrorToast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from 'react-router-dom';
import email from "../../assets/icon.svg";
import logo from "../../assets/Group.svg";
import { resetRequest } from "../../api/resetRequest";

export const ResetRequestSchema = z.object({
  email: z.string().email({ message: "Enter a registered email" }),
});

export default function ResetRequest() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ResetRequestSchema),
  });
  const [toast, setToast] = useState(null);
  const [backendError, setBackendError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await resetRequest(data.email);
      const { message } = response;

      setToast(
        <SuccessToast
          message={message || "A reset link is sent to the registered email"}
        />
      );

      navigate("/resetlink");
    } catch (error) {
      setBackendError(error.message || "Unexpected error occurred");
      setToast(
        <ErrorToast message={error.message || "unexpected error occured"} />
      );
    }
  };

  return (
    <div className="flex flex-col items-center px-8 pt-12 pb-5 text-xl font-medium text-purple-900 text-opacity-85 bg-white h-screen max-md:px-4">
      <div className="flex flex-col mt-1.5 w-full max-w-md">
        <img
          loading="lazy"
          src={logo}
          className="self-center max-w-full aspect-[3.33] w-[200px] ml-4"
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/63c141024f2b25d8b15a76cb947c505eb6fcdb29c9132959b0b1ed1fe4090e68?"
          className="mt-20 max-w-full aspect-square w-[110px] max-md:mt-10 self-center"
        />
        <div className="self-center mt-5 text-3xl text-black leading-[40px] max-md:mt-8">
          Reset your password
        </div>
        <div className="self-center mt-5 text-lg text-gray-400 text-center">
          Enter your email address and we will send you instructions to reset your password.
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-4">
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
            <p className="text-red-600 p-2 mt-1">{errors.email.message}</p>
          )}
          {backendError && (
            <p className="text-red-600 p-2 mt-1 self-center">{backendError}</p>
          )}
          <button
            type="submit"
            className="flex justify-center items-center px-10 py-4 mt-7 text-xl text-white whitespace-nowrap bg-purple-900 rounded-3xl max-md:px-4 max-md:max-w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading ..." : "Continue"}
          </button>
        </form>
        <div className="self-center mt-4 leading-9 text-center">
          <Link to={'/'}><span>Back to Engage AI Web</span></Link>
        </div>
        <div className="flex gap-5 justify-between py-1.5 mt-52 max-w-full text-lg leading-5 text-purple-900 w-[271px] max-md:mt-10 self-center">
          <div>Terms of Use</div>
          <div>Privacy Policy</div>
        </div>
      </div>
      {toast}
    </div>
  );
}
