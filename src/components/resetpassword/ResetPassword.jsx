import { useForm } from "react-hook-form";
import "../../tailwind.css";
import SuccessToast from "../../helpers/SucessToast";
import ErrorToast from "../../helpers/ErrorToast";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "../../assets/Group.svg"; 
import lock from "../../assets/lock.svg"
import { resetPassword } from "../../api/resetPassword";

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter",
    }),
  confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters long" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const [toast, setToast] = useState(null);
  const [backendError, setBackendError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await resetPassword(data.password,token);
      const { message } = response;

      setToast(
        <SuccessToast
          message={message}
        />
      );
      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 2000);
    } catch (error) {
      setBackendError(
        error.message || "Unexpected error occurred"
      );
      setToast(
        <ErrorToast message={error.message || "Unexpected error occurred"} />
      );
      setIsLoading(false);
    } 
  };

  return (
    <div className="flex flex-col items-center px-8 pt-12 pb-5 text-xl font-medium text-purple-900 text-opacity-85 bg-white h-screen max-md:px-4">
      <div className="flex flex-col mt-1.5 w-full max-w-md">
        <img
          loading="lazy"
          src={logo}
          className="self-center max-w-full aspect-[3.33] w-[200px]"
        />
        <div className="self-center mt-16 text-3xl text-black leading-[40px] max-md:mt-8">
          Reset your password
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-5">
          <div className="input-container mt-4">
            <div className="input-wrapper">
              <img
                loading="lazy"
                src={lock}
                className="shrink-0 w-9 aspect-square"
              />
              <input
                type="password"
                placeholder="Enter new password"
                {...register("password")}
                className="w-full border-none bg-transparent focus:outline-none"
              />
            </div>
          </div>
          {errors.password && (
            <p className="text-red-600 p-2 mt-1">{errors.password.message}</p>
          )}
          <div className="input-container mt-4">
            <div className="input-wrapper">
              <img
                loading="lazy"
                src={lock}
                className="shrink-0 w-9 aspect-square"
              />
              <input
                type="password"
                placeholder="Confirm password"
                {...register("confirmPassword")}
                className="w-full border-none bg-transparent focus:outline-none"
              />
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 p-2 mt-1">{errors.confirmPassword.message}</p>
          )}
          {backendError && (
            <p className="text-red-600 p-2 mt-1 self-center">{backendError}</p>
          )}
          <button
            type="submit"
            className="flex justify-center items-center px-10 py-4 mt-5 text-xl text-white whitespace-nowrap bg-purple-900 rounded-3xl max-md:px-4 max-md:max-w-full"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "Loading ..." : "Submit"}
          </button>
        </form>
      </div>
      {toast}
    </div>
  );
}
