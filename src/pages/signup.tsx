import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Completed } from "../components/auth/completeRegister";
import { AppForm, FormItem } from "../components/common/appForm";
import { AppSpinner } from "../components/common/appSpinner";
import { Tick } from "../components/common/tick";
import { post } from "../util/generalActions";

export const Register: React.FC = () => {
  const [complete, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const register = async (fields: { [key: string]: FormItem }) => {
    setLoading(true);
    setErrorMessage("");
    try {
      await post("/public/sign-up", {
        username: fields["username"].value,
        password: fields["password"].value,
        email: fields["email"].value,
        occupation: fields["occupation"].value
      });
      setLoading(false);
      navigate("/confirm");
    } catch (error: any) {
      setLoading(false);
      setErrorMessage(
        error.response
          ? error.response.data.errors[0]
          : "Something wrong happened while trying to sign you in"
      );
    }
  };
  return (
    <section className="mt-12 flex flex-col items-center">
      <div className="text-left w-72">
        <span className="main-text text-xs">
          By signing up below, <br></br>I acknowledge that I have read and agree
          to the <br />
          <a href="/terms" target="_blank">
            <span className="underline cursor-pointer App-link">
              Terms and Conditions
            </span>
          </a>{" "}
          and{" "}
          <a href="policy" target="_blank">
            <span className="underline cursor-pointer App-link">
              Privacy Policy
            </span>
          </a>
        </span>
      </div>
      <div className="flex flex-row md:justify-evenly">
        <div>
          <span className="text-red-600 font-xl">{errorMessage}</span>
          <AppForm
            names={[
              {
                mandatory: true,
                type: "email",
                label: "Enter email * ",
                name: "email",
                value: "",
              },
              {
                mandatory: true,
                type: "text",
                label: "Enter Username * ",
                name: "username",
                value: "",
              },
              {
                mandatory: true,
                type: "password",
                label: "Enter Password *",
                name: "password",
                value: "",
              },
              {
                mandatory: true,
                type: "password",
                label: "Confrim Password *",
                name: "cpassword",
                value: "",
              },
              {
                mandatory: false,
                type: "text",
                label: "Occupation",
                name: "occupation",
                value: "",
              },
            ]}
            submit="Create account"
            onSubmit={register}
            inline={false}
            submitClass="mt-2 mb-2  rounded-md py-1 font-bold text-black text-base outline-none w-72 secondary-bg"
            className="w-72"
            submitLoading={loading}
          />
          <div className="text-left">
            Already have an account?{" "}
            <Link to="/login" className="underline App-link bold">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
