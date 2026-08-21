import { getMessageFromError, getPromise } from "../../util/generalActions";
import { Button } from "../common/button";
import { CodeInput } from "../common/codeInput";
import { Tick } from "../common/tick";

export const Completed: React.FC<{ after: () => void }> = ({ after }) => {
  return (
    <div className="container">
      <div className="flex flex-col items-center">
      <div className="font-bold my-2">Now please verify your email :)</div>
        <Tick success="Congrats!"/>
        <div className="text-left  text-2xl font-bold  mt-8 flex flex-col mx-1">
          <span className="font-normal mt-2 rounded-md bg-gray-200 p-6">
            <ul className="list-disc mt-3 pl-10 text-lg">
              <li>Check your inbox for the confirmation code email</li>
              <li>
                If you can't see our email in your inbox, please check you junk
                mail
              </li>
              <li>
                If you dont receive the confirmation code email please{" "}
                <a href="/contact-us" className="underline App-link outline-none">
                    contact us!
                </a>
              </li>
            </ul>
          </span>
          <span></span>
        </div>
      </div>
    </div>
  );
};
