import { Link, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { User } from "../providers/auth";
import { useForm } from "react-hook-form";
import { Button } from "../components/common/button";
import { get, post } from "../util/generalActions";
import { useDialog } from "../components/common/appDialog";
import VerificationInput from "react-verification-input";

export const Activate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passowrd, setPassword] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");
  const [profile, setProfile] = useState<User>();

  const { showDialog, closeDialog } = useDialog();
  const { id } = useParams();
  const loginSubmit = async (data: any) => {
    // if (loading){
    //     return;
    // }
    setLoading(true);
    post(
      `/admin/user/${id}/verify`,
      {
        email: data.email,
        fname: data.fname,
        lname: data.fname,
        phone: data.phone,
        password: data.password,
      },
      ""
    )
      .then((res) => {
        setLoading(false);
        setErrorMessage("");
        get(`/auth/code?email=${data.email}`, "");
        showDialog(<CodeValidator data={data} />, "", false);
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage(
          error.response?.data?.errors
            ? error.response.data.errors[0]
            : "Please try again later"
        );
      });
  };

  const CodeValidator: React.FC<{ data: any }> = ({ data }) => {
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    return (
      <div
        style={{ width: 500, height: 300 }}
        className="bg-main flex flex-col items-center green"
      >
        {" "}
        <span className="text-red-600 font-xl">{errorMessage}</span>
        <span className="" style={{ fontSize: 24, fontFamily: "Nunito" }}>
          Please verify your phone
        </span>
        <div className="my-4 text-white mb-8">
          We have sent a 4-digit code to{" "}
          <span className="green" style={{ letterSpacing: 3 }}>
            {data.phone}
          </span>{" "}
          for verification
        </div>
        <VerificationInput
          onChange={(code) => setCode(code)}
          length={6}
          classNames={{
            character:
              "rounded-xl border-green bg-main h-14 w-14 shrink-0  outline-none green nunito",
            container: "w-auto",
          }}
        />
        <div className=" mt-8 flex flex-row w-full">
          <div className="w-1/2 px-2">
            <Button
              className=" rounded-3xl bg-green text-black font-bold text-20 flex felx-row justify-center w-full nunito items-center"
              style={{ height: 40 }}
              loading={loading}
              onClick={() => {
                setLoading(true);
                post("/auth/email/verify", { email: data.email, code }, "")
                  .then((res) => {
                    closeDialog();
                    navigate("/");
                  })
                  .catch((e) => {
                    setErrorMessage("Invalid Code");
                    setLoading(false);
                  });
              }}
            >
              Activate
            </Button>
          </div>{" "}
          <div className="w-1/2 px-2">
            <Button
              className=" rounded-3xl bg-white text-black font-bold text-20 flex felx-row justify-center w-full nunito items-center"
              style={{ height: 40 }}
              onClick={() => {
                setErrorMessage("");
                closeDialog();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
        <div
          style={{ fontSize: 25 }}
          className="green font-bold nunito mt-4"
          onClick={() => get(`/auth/code?email=${data.email}`, "")}
        >
          Send Again
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (id) {
      get<{ data: User }>(`/admin/user/${id}/verify`, "ds")
        .then((res) => setProfile(res.data))
        .catch((e) => navigate("/"));
    }
  }, []);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      fname: "",
      lname: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        email: profile.email,
        fname: profile.fname,
        lname: profile.lname,
        phone: profile.phone,
      });
    }
  }, [profile]);
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
            className="justify-start p-4 border border-green rounded-2xl w-2/3 flex flex-col items-center mb-10"
            style={{ maxHeight: 630, width: 570 }}
          >
            <span className="text-red-600 font-xl">{errorMessage}</span>
            <span
              className="green font-bold "
              style={{ fontSize: 27, letterSpacing: 2 }}
            >
              Activate
            </span>
            <div className="mt-4 green">Welcome </div>
            <div className="font-bold green mt-1" style={{ fontSize: 17 }}>
              Activate your LIME account to continue the process
            </div>
            <form onSubmit={handleSubmit(loginSubmit)} className="mt-4">
              <div className="flex flex-col mb-4 w-full items-center relative">
                <input
                  style={{ width: 417, height: 48 }}
                  className={`border-solid  border-2 rounded-md p-2 text-sm outline-none border-main bg-green text-black login-input pl-10`}
                  readOnly={true}
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

              <div className="flex flex-col mb-4 w-full items-center relative">
                <input
                  style={{ width: 417, height: 48 }}
                  className={`border-solid  border-2 rounded-md p-2 text-sm outline-none border-main bg-green text-black login-input pl-10`}
                  placeholder="First Name"
                  {...register("fname", {
                    required: true,
                  })}
                />
                <img src="/user.png" className="absolute left-2 top-3" />
                {errors.fname && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    invalid First Name
                  </span>
                )}
              </div>
              <div className="flex flex-col mb-4 w-full items-center relative">
                <input
                  style={{ width: 417, height: 48 }}
                  className={`border-solid  border-2 rounded-md p-2 text-sm outline-none border-main bg-green text-black login-input pl-10`}
                  placeholder="Last Name"
                  {...register("lname", {
                    required: true,
                  })}
                />
                <img src="/user.png" className="absolute left-2 top-3" />
                {errors.lname && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    invalid Last Name
                  </span>
                )}
              </div>
              <div className="flex flex-col mb-4 w-full items-center relative">
                <input
                  style={{ width: 417, height: 48 }}
                  className={`border-solid  border-2 rounded-md p-2 text-sm outline-none border-main bg-green text-black login-input pl-10`}
                  placeholder="Phone number"
                  {...register("phone", {
                    required: true,
                  })}
                />
                <img src="/sms.png" className="absolute left-2 top-3" />
                {errors.phone && (
                  <span className="text-sm text-red-700 ml-3 my-2">
                    invalid Phone number
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
                  className="rounded-3xl bg-green font-bold text-20 outline-none"
                  style={{ width: 310, height: 48 }}
                >
                  {" "}
                  Next
                </Button>
              </div>
            </form>
            <span className="flex flex-col">
              <Link to="/" className="mt-4">
                <span
                  className=" cursor-pointer   green"
                  style={{ fontSize: 17 }}
                >
                  Already Have an account? <b>Sign in</b>
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
