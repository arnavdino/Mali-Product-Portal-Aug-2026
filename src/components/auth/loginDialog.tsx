import React, { useState } from "react";
import { useDialog } from "../common/appDialog";
import { AppForm, FormItem } from "../common/appForm";
import { useAuth } from "../../providers/auth";
import { Button } from "../common/button";
import { ForgotPasswordForm } from "./forgot";
import { RegisterFrom } from "./registerDialog";
import logo from "./logo-rounded.png"
export const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { closeDialog, showDialog } = useDialog();
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const loginSubmit = async (fields: { [key: string]: FormItem }) => {
    setLoading(true);
    try {
      await login({
        username: fields["username"].value,
        password: fields["pass"].value,
      });
      closeDialog();
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
    <section className="flex flex-col items-center sm:w-600 w-auto sm:items-start">
      <div>Please Log In Below</div>
      <div className="flex flex-row justify-between nice-font w-full">
        <div>
          <span className="text-red-600 font-xl">{errorMessage}</span>
          <AppForm
            names={[
              {
                mandatory: true,
                type: "text",
                label: "Enter Username or Email *",
                name: "username",
                value: "",
              },
              {
                mandatory: true,
                type: "password",
                label: "Enter Password *",
                name: "pass",
                value: "",
                submitOnEnter: true,
              },
            ]}
            submit="Log In"
            onSubmit={loginSubmit}
            submitLoading={loading}
            inline={false}
            submitClass="mt-2 mb-2  rounded-md py-1 font-bold text-black text-base outline-none w-72 secondary-bg"
            className="w-72 mb-3"
          />
          Don't have an account?{" "}
          <Button
            className="App-link  ml-1 underline"
            onClick={() => {
              showDialog(<RegisterFrom />, "Sign up", false);
            }}
          >
            sign up
          </Button>
          <br />
          <Button
            className="App-link underline"
            onClick={() => {
              showDialog(<ForgotPasswordForm />, "Forgot Password", false);
            }}
          >
            Forgot password?
          </Button>
        </div>
        <div className="sm:flex hidden mr-10 flex-col items-end">
          <img className="w-36 h-36" src={logo}/>
          
        </div>
      </div>
    </section>
  );
};
