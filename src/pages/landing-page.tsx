import { LoginForm } from "../components/auth/loginDialog";
import { RegisterFrom } from "../components/auth/registerDialog";
import { useDialog } from "../components/common/appDialog";
import { Button } from "../components/common/button";
import land from "./landing-page.png";

export const LandingPage = () => {
  const { showDialog } = useDialog();
  return (
    <div className="flex flex-col  content-center items-center main-bg landing">
      <div className="text-white my-2 text-2xl md:w-1/3 w-full px-1">
        Answer ohter polls to get credits. User your credits to create polls and get feedback
      </div>
   
      <img src={land} className="w-1/3 mb-3"/>
      <div className="text-white my-2 text-2xl w-5/6 border-t-4 border-solid mx-2 pt-8">
        <div className="font-bold mb-6 text-3xl">How it works</div>{" "}
        <div className="flex sm:flex-row flex-col justify-center items-center">
          <div className="text-white my-2 text-2xl w-72">
            Sign up and get 4 initial credits
          </div>
          <div className="text-white my-2 text-2xl w-72">
            Create polls using your credits.
          </div>
          <div className="text-white my-2 text-2xl w-72">
            Answer polls, One at a time on a first come first show basis, to get
            more credits, so you can create polls.
          </div>
        </div>
      </div>
      <div className="text-white my-2 text-2xl w-5/6 border-t-4 border-solid mx-2 pt-8 flex flex-col items-center">
        <div className="font-bold mb-6 text-3xl">Why Polls Only</div>{" "}
        <div className="text-white my-2 text-2xl md:w-1/2 w-full text-center ">
          1. Polls are a greate way to get a frictionless feedback for your ideas
          and features from others.
        </div>
        <div className="text-white my-2 text-2xl md:w-1/2 w-full sm:text-center">
          2. People are incetivised to answer polls and give feedbacks, because
          they also want feedbacks.
        </div>
        <div className="text-white my-2 text-2xl md:w-1/2 w-full sm:text-center">
          3. Showing one poll at a time is a way to remove distraction and give
          every poll priority.
        </div>
        <div className="flex sm:flex-row flex-col justify-center my-3 items-center">
        <div className="sm:mr-4 mr-0">
          <Button
            formButton={true}
            onClick={() => showDialog(<LoginForm />, "Login", false)}
          >
            Login
          </Button>
        </div>
        <Button
          formButton={true}
          onClick={() => showDialog(<RegisterFrom />, "Login", false)}
        >
          Sign up
        </Button>
      </div>
      </div>
    </div>
  );
};
