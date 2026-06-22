import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ModalContext } from "../context/modalContext";

const Help = () => {
  const { dark } = useContext(ModalContext);
  return (
    <div className="w-full min-h-screen flex justify-center items-start px-4 sm:px-6 md:px-10 lg:px-20 xl:px-30 py-6 md:py-10">
      <div className="flex flex-col w-full max-w-7xl gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1
              className={`${dark ? "text-white" : "text-black"} transition-colors duration-200 text-xl sm:text-2xl font-bold`}
            >
              FAQ
            </h1>

            <div className="flex flex-wrap text-sm font-semibold gap-1">
              <Link to="/" className="text-blue-500 hover:text-blue-600">
                Dashboard
              </Link>
              <p
                className={`${dark ? "text-white" : "text-gray-400"} transition-colors duration-200 `}
              >
                / FAQ
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center bg-[url('/faq.png')] bg-center bg-cover rounded-xl h-62.5 w-full">
          <h1 className="text-2xl font-semibold text-white">
            Have a question? We’re ready to help?
          </h1>
          <p className="text-white">
            Or choose a section to find what you need in seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Help;
