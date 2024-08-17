/**
 * Login page
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { images } from "../constants/images";

const Login = () => {
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //function to handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://${process.env.REACT_APP_IP_ADDRESS}:3000/login`,
        {
          email,
          password,
        }
      );

      if (response.data) {
        if (response.data.newUser.userType === "Admin") {
          const token = response.data.token;
          localStorage.setItem("token", token);

          toast.success(response.data.message);
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to Login, Please check your credentials and try again"
      );
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b4dad] ">
      <ToastContainer />
      <div className="flex flex-col items-center">
        <form
          className="bg-white p-8 rounded-lg shadow-2xl w-96 border-4 border-[#bfcddb] transform hover:scale-105 transition-transform duration-300 space-y-6"
          onSubmit={handleLogin}
        >
          <div>
            <img
              src={images.image3}
              alt="Logo"
              className="w-32 h-32 mx-auto mb-6"
            />
            <h2 className="mt-10 text-center font-serif  text-2xl font-bold leading-9 tracking-tight text-[#0b4dad]">
              Sign in to your account
            </h2>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-600 font-serif" htmlFor="username">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded">
              <div className="px-3 py-2 bg-gray-100 rounded-l">
                <FontAwesomeIcon icon={faUser} className="text-gray-500" />
              </div>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border-l border-gray-300 rounded-r focus:outline-none"
                placeholder="Enter your Email"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <label className="block mb-1 text-gray-600 font-serif" htmlFor="password">
                Password
              </label>
            </div>
            <div className="flex items-center border border-gray-300 rounded">
              <div className="px-3 py-2 bg-gray-100 rounded-l">
                <FontAwesomeIcon icon={faLock} className="text-gray-500" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border-l border-gray-300 rounded-r focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded ${isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#0b4dad] hover:bg-blue-300"
              } text-white font-semibold transition duration-300`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
