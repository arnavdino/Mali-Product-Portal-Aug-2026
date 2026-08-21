import About1 from "./imgs/about-us-3.jpg";
import About2 from "./imgs/about-us-2.jpg";
import About3 from "./imgs/about-us-1.jpg";

export const AboutUs = () => {
  return (
    <>
      <div className="lg:flex hidden flex-col w-full text-black text-2xl">
        <div className="relative w-full h-96 mb-16">
          <img src={About1} className="w-96 h-96 absolute" />
          <span className="absolute  ml-96 pl-4 w-96 pt-8">
            Sometimes, life puts us in a situation where we have to be eating
            alone, and that makes some of us unhappy.
          </span>
        </div>
        <div className="relative w-full h-96 ">
          <img src={About2} className="w-96 h-96 absolute right-0" />
          <span className="absolute right-96 pr-4 w-96 pt-8">
            But life also brings us some opportunities, like Veat Meat, to bring
            us all together. Now you don't have to worry about eating alone
            anymore, because with Veat Meet you can eat and get to meet someone
            that will keep you company while eating
          </span>
        </div>
        <div className="relative w-full h-96 mb-24">
          <img src={About3} className="w-96 h-96 absolute left-0" />
          <span className="absolute left-96 pl-4 w-72 pt-8">
            Of course, some of us just enjoy eating alone, so you do you :){" "}
          </span>
        </div>
      </div>
      <div className="lg:hidden flex flex-col w-full text-black lg:text-lg text-sm mx-2 items-center">
        <span className="md:w-96 w-72 p-4">
          Sometimes, life puts us in a situation where we have to be eating
          alone, and that makes some of us unhappy.
        </span>
        <img src={About1} className="md:w-96 w-72  md:h-96 h-72" />
        <span className="md:w-96 w-72  p-4">
            But life also brings us some opportunities, like Veat Meat, to bring
            us all together. Now you don't have to worry about eating alone
            anymore, because with Veat Meet you can eat and get to meet someone
            that will keep you company while eating
          </span>
          <img src={About2} className="md:w-96 w-72  md:h-96 h-72" />
          <span className="md:w-96 w-72  p-4">
            Of course, some of us just enjoy eating alone, so you do you :){" "}
          </span>
          <img src={About3} className="md:w-96 w-72  md:h-96 h-72" />
          
      </div>
    </>
  );
};
