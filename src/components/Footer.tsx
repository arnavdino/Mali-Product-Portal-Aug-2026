export const Footer = () => {
  return (
    <div className=" h-14 absolute bottom-0 left-0 right-0 text-black footer-font text-xs">
      <div className="flex flex-row justify-center  text-gray-500 ">
        <a href="/contact-us" className="mx-2 cursor-pointer">
          Contact Us
        </a>
        <a href="/login" className="mx-2 cursor-pointer">
          Log In
        </a>
        <a href="/sign-up" className="sm:mx-4 mx-2 cursor-pointer">
          Sign Up
        </a>
      </div>
      <div className="flex flex-row justify-center  text-gray-500 mt-2">
        <a href="/terms" className="sm:mx-4 mx-2 cursor-pointer">
          Terms-and-conditions
        </a>
        <a href="/policy" className="sm:mx-4 mx-2 cursor-pointer">
          Private Policy
        </a>
        <a href="/contact-us" className="sm:mx-4 mx-2 cursor-pointer">
          Donatios
        </a>
      </div>
    </div>
  );
};
