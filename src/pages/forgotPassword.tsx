import { Link, useNavigate } from "react-router-dom";

import { Button } from "../components/common/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { get } from "../util/generalActions";
export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loginSubmit = async (data: any) => {
    setLoading(true);
    try {
      await get(`/auth/code?email=${data.email}`, "");
      navigate("/reset-password");
    } catch (error: any) {
      setLoading(false);
      setErrorMessage(
        error.response?.data?.errors
          ? error.response.data.errors[0]
          : "Invalid username "
      );
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });
  return (
    <section className=" text-left ml-2 mt-12 overflow-auto h-screen style-1">
      <img
        src="/lime.svg"
        style={{ height: 100, width: 70 }}
        className="ml-10"
      />
      <div className="flex md:flex-row flex-col ">
        <div className=" md:w-1/2  w-full p-10 flex flex-row justify-center">
          <div
            className="justify-start p-4 border border-green rounded-2xl w-2/3 flex flex-col items-center pb-24"
            style={{ maxHeight: 630, width: 570 }}
          >
            <span className="text-red-600 font-xl">{errorMessage}</span>
            <span
              className="green font-bold "
              style={{ fontSize: 27, letterSpacing: 2 }}
            >
              Forgot Password?
            </span>
            <div className="mt-12 green mt-1" style={{ fontSize: 17 }}>
              Enter your email and we will send you a reset password link
            </div>
            <form onSubmit={handleSubmit(loginSubmit)} className="mt-4">
              <div className="flex flex-col mb-4 w-full items-center relative">
                <input
                  style={{ width: 417, height: 48 }}
                  className={`border-solid  border-2 rounded-md p-2 text-sm outline-none border-main bg-green text-black login-input pl-10`}
                  placeholder="Email"
                  {...register("email", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                />
                <img src="/sms.png" className="absolute left-2 top-3" />
                {errors.email && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    invalid email format
                  </span>
                )}
              </div>

              <div className=" flex flex-row justify-center mt-10">
                <Button
                  loading={loading}
                  type="submit"
                  className="rounded-3xl bg-green font-bold text-20"
                  style={{ width: 310, height: 48 }}
                >
                  {" "}
                  Send Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
