import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub } from "react-icons/fa";
import { PiXLogoBold } from "react-icons/pi";
import axios from "axios";
import { toast } from "sonner";
import logo from "./../assets/logo.png";
const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const { email, password } = formData;

    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`,
        { ...formData, rememberMe },
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[url('/bg-image.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
          <h1 className="text-2xl font-bold text-gray-800">EmployeeHub</h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 text-sm">
            Sign in to access your employeeHub dashboard.
          </p>
        </div>
        {error && <p className="text-center text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="info@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                onChange={(e) => setRememberMe(e.target.checked)}
                checked={rememberMe}
                className="w-4 h-4 cursor-pointer accent-blue-600"
              />
              <span className="text-sm  text-gray-600">Remember Me</span>
            </label>

            <Link
              to="#"
              className="text-sm text-blue-600 hover:text-blue-700  font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-linear-to-r cursor-pointer from-blue-500 to-indigo-600 text-white font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              // to="/register"
              className="text-blue-600 cursor-pointer font-semibold hover:text-blue-700"
            >
              Sign Up
            </Link>
          </p>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 border-b border-gray-300"></div>
          <span className="text-sm text-gray-400 whitespace-nowrap">
            Continue with
          </span>
          <div className="flex-1 border-b border-gray-300"></div>
        </div>

        <div className="flex justify-center gap-4">
          <Link
            to="#"
            className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center  justify-center hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            <FaFacebookF size={18} />
          </Link>

          <Link
            to="#"
            className="w-12 h-12 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
          >
            <PiXLogoBold size={18} />
          </Link>

          <Link
            to="#"
            className="w-12 h-12 rounded-full bg-gray-100 text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-200"
          >
            <FaGithub size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
