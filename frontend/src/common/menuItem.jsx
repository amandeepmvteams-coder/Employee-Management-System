import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../context/modalContext";

const MenuItem = ({ icon, title, url, setOpenProfile }) => {
  const { dark } = useContext(ModalContext);
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (url) navigate(url);
    setOpenProfile(false);
  };

  return (
    <button
      onClick={handleNavigation}
      className={`flex w-full items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-all duration-200
        ${
          dark
            ? "text-gray-300 hover:bg-zinc-800 hover:text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{title}</span>
    </button>
  );
};

export default MenuItem;
