import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import { AppForm, FormItem } from "../components/common/appForm";
import { useAuth } from "../providers/auth";
import { useForm } from "react-hook-form";
import { Button } from "../components/common/button";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passowrd, setPassword] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const loginSubmit = async (data: any) => {
    setLoading(true);
    try {
      await login({
        username: data["email"],
        password: data["password"],
      });
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      setErrorMessage(
        error.response?.data?.errors
          ? error.response.data.errors[0]
          : "Invalid username or password"
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
      password: "",
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
              Sign In
            </span>
            <div className="mt-4 green">Welcome back! </div>
            <div className="font-bold green mt-1" style={{ fontSize: 17 }}>
              Login to your LIME account to continue the process
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
              <div className="flex flex-col w-full items-center relative">
                <input
                  type={passowrd}
                  style={{ width: 417, height: 48 }}
                  className={`border-solid  bg-main border-2 rounded-md p-2 text-sm outline-none  border-main bg-green text-black w-full login-input pl-10`}
                  placeholder="Password"
                  {...register("password", {
                    required: true,
                  })}
                />
                <img src="/Light.png" className="absolute left-2 top-3" />
                <img
                  src="/Dark.svg"
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() =>
                    setPassword((prev) =>
                      prev == "password" ? "text" : "password"
                    )
                  }
                />
                {errors.password && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    invalid Password
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
                  Sign In
                </Button>
              </div>
            </form>
            <span className="flex flex-col">
              <Link to="/forgot-password" className="mt-4">
                <span
                  className=" cursor-pointer   green"
                  style={{ fontSize: 17 }}
                >
                  Forget your password?
                </span>
              </Link>
            </span>
          </div>
        </div>
        <div className=" md:w-1/2  w-full p-10 flex flex-col justify-start items-center">
          <div
            style={{ fontWeight: 900, fontSize: 35, letterSpacing: 2 }}
            className="green mt-20"
          >
            Welcome back to
          </div>
          <div
            style={{ fontWeight: 900, fontSize: 35, letterSpacing: 3 }}
            className="green"
          >
            LIME
          </div>
          <div className="green my-6 text-16" style={{ maxWidth: 470 }}>
            We are lorem ipsum team dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </div>
      </div>
    </section>
  );
};
