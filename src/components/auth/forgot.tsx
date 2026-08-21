import { useState } from "react";
import { FaLock } from "react-icons/fa";
import { publicGet } from "../../util/generalActions";
import { useDialog } from "../common/appDialog";
import { AppForm, FormItem } from "../common/appForm";
import { Button } from "../common/button";
import { Tick } from "../common/tick";
import { RegisterFrom } from "./registerDialog";
export const ForgotPasswordForm = () => {
  const [state, setState] = useState({
    sent: false,
    loading: false,
  });
  const {showDialog} = useDialog();
  const sendConfirmation = async (fields: { [key: string]: FormItem }) => {
    setState({ ...state, loading: true });
    await publicGet(`reset/password?email=${fields.username.value}`);
    setState({ ...state, sent: true, loading: false });
  };
  return (
    <section className="login-wrapper w-full">
      <div className="flex flex-row justify-center">
        <div className="p-6 rounded-sm text-black login-form  text-center mt-12 sm:w-96 w-80 ">
          <div className="flex flex-col text-black text-lg mb-6 content-center align-items-center items-center justify-center">
            <div className="p-4 border-2 border-solid rounded-full border-black w-24 mb-2">
              <FaLock size={60} />
            </div>
            Forgot your password?
          </div>

          {!state.sent ? (
            <div className="text-left">
              <AppForm
                names={[
                  {
                    mandatory: true,
                    type: "text",
                    label: "username or email * ",
                    name: "username",
                    value: "",
                    hardLabel:
                      "Enter your username or email and we'll send you a link to get back into your account.",
                  },
                ]}
                submit="Send reset password link"
                onSubmit={sendConfirmation}
                inline={false}
              />
              <div className="border-t border-solid border-gray-400 mt-6 pt-6">
                <Button
                  onClick={() => {
                    showDialog(
                      <RegisterFrom />,
                      "Register",
                      false
                    );
                  }}
                  className="App-link font-bold"
                >
                  Create a new account
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Tick
                width="300px"
                success="We have sent you a new password link, if your username is valid,you will receive it soon!"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
