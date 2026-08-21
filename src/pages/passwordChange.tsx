import { useEffect, useState } from "react";
import { Link, useParams,useNavigate } from "react-router-dom";
import { AppForm, FormItem } from "../components/common/appForm";
import { AppSpinner } from "../components/common/appSpinner";
import { Cross } from "../components/common/cross";
import { Header } from "../components/header";
import { put } from "../util/generalActions";


export const PasswordChange: React.FC = () => {
  const [state, setState] = useState({ message: "", loading: false });
  const navigate = useNavigate();
  let {token} = useParams();
  const submitChange = async (fields: { [key: string]: FormItem }) => {
    var path = "/public/password/change";

    setState({ message: "", loading: true });
    try {
      await put(
        path + "?token=" + token ,
        {password:fields.password.value},
        token as string
      );
      navigate("/login");
    } catch (error) {
      setState({ loading: false, message: "Invalid reset password link!" });
    }
  };

  return (
    <section className="login-wrapper w-full">
        <Header/>
    <div className="flex flex-row justify-center">
        <div className="p-12 rounded-sm text-black login-form  text-center mt-12 w-full mx-2 md:w-96">
        <div className="text-center text-black text-lg ">Reset your password</div>  
          {state.message === "" ? (
            <AppForm
              names={[
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
              ]}
              submit="Reset Password"
              onSubmit={submitChange}
              submitLoading={state.loading}
              inline={false}
              submitClass="mt-2 mb-2  rounded-md py-1 font-bold text-black text-base outline-none w-72 secondary-bg"
            />
          ) : state.message !== "SUCCESS" && (
            <div className="pt-3 ">
              <span className="text-red-600">Invalid Reset Password link!</span>
              <div className="mt-8 text-center"><Link to="/forgot-password">
                <span className="cursor-pointer py-3 rounded-md button-bg px-3 text-white font-bold outline-none">
                  Send Reset Password Again
                </span>
              </Link>
              </div>
            </div>
          ) }
        </div>
      </div>
    </section>
  );
}
