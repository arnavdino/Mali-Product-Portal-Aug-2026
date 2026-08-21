import React, { useState } from "react";
import { getMessageFromError, post } from "../../util/generalActions";
import { useDialog } from "../common/appDialog";
import { AppForm, FormItem } from "../common/appForm";
import { Button } from "../common/button";
import { Completed } from "./completeRegister";
import { LoginForm } from "./loginDialog";
import logo from "./logo-rounded.png"

export const RegisterFrom: React.FC<{title?:string}> = ({title}) => {
  const [loading, setLoading] = useState(false);
  const { showDialog } = useDialog();
  const [errorMessage, setErrorMessage] = useState("");
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
      showDialog(
        <Completed
          after={() => {
            showDialog(<LoginForm />, "Login", false);
          }}
        />,
        "Confirm Registration",
        false
      );
    } catch (error: any) {
      setLoading(false);
      setErrorMessage(
        getMessageFromError(error)
      );
    }
  };
  return (
    <section className=" flex flex-col items-center sm:w-600 w-auto sm:items-start">
      {title&&<div className="font-bold">{title}</div>}
      <div>
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
      <div className="flex flex-row md:justify-between nice-font w-full">
        <div className="flex flex-col items-start">
          <span className="text-red-600 font-xl">{errorMessage}</span>
          <AppForm
            names={[
              {
                mandatory: true,
                type: "email",
                label: "Enter Email * ",
                name: "email",
                value: "",
                submitOnEnter: true
              },
              {
                mandatory: true,
                type: "text",
                label: "Enter Username * ",
                name: "username",
                value: "",
                submitOnEnter: true
              },
              {
                mandatory: true,
                type: "password",
                label: "Enter Password *",
                name: "password",
                value: "",
                submitOnEnter: true
              },
              {
                mandatory: true,
                type: "password",
                label: "Confrim Password *",
                name: "cpassword",
                value: "",
                submitOnEnter: true
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
          <span>          Already have an account?
          <Button
            onClick={() => {
              showDialog(<LoginForm />, "Login", false);
            }}
            className="App-link  ml-2 underline"
          >
            Log In
          </Button>
          </span>

        </div>
        <div className="sm:flex hidden mr-10 flex-col items-end">
          <img className="w-36 h-36" src={logo}/>
        </div>
      </div>
    </section>
  );
};
