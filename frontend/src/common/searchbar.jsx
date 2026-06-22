import React, { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { ModalContext } from "../context/modalContext";

const Searchbar = () => {
  const { dark } = useContext(ModalContext);

  return (
    <div className="w-full max-w-md">
      <div
        className={`flex items-center gap-3 rounded-full border px-4 py-2 transition-all duration-200
          ${
            dark
              ? "bg-[#1f2937] border-gray-700"
              : "bg-white border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
          }`}
      >
        <CiSearch
          className={`text-2xl shrink-0 ${
            dark ? "text-gray-300" : "text-gray-400"
          }`}
        />

        <input
          type="text"
          placeholder="Search anything..."
          className={`w-full bg-transparent outline-none text-sm md:text-base
            ${
              dark
                ? "text-white placeholder:text-gray-400"
                : "text-gray-900 placeholder:text-gray-400"
            }`}
        />
      </div>
    </div>
  );
};

export default Searchbar;
