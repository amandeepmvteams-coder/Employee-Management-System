import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ModalContext } from "../context/modalContext";

const Analytics = () => {
  const {dark}=useContext(ModalContext)
  return (
    <div className="w-full min-h-screen flex justify-center items-start px-4 sm:px-6 md:px-10 lg:px-20 xl:px-30 py-6 md:py-10">
      <div className="flex flex-col w-full max-w-7xl gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className={`${dark?"text-white":"text-black"} text-xl sm:text-2xl font-bold`}>Analytics</h1>

            <div className="flex flex-wrap text-sm font-semibold gap-1">
              <Link to="/" className="text-blue-500 hover:text-blue-600">
                Dashboard
              </Link>
              <p className="text-gray-400">/ Analytics</p>
            </div>
          </div>
        </div>

        <div className="flex justify-start items-center w-full"></div>
      </div>
    </div>
  );
};

export default Analytics;
