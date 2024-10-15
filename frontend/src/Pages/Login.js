import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import lineImg from "../assets/line-4.svg";
import googlepng from "../assets/google.png";
import applePng from "../assets/apple.png";
import MircoSoftPng from "../assets/microsoft.png";
import vectorSvg from "../assets/vector.svg";
import lineImg3 from "../assets/line-3.svg";
import layer7 from "../assets/layer-7.png";
import loginimg from "../assets/login-vector.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";  // Import icons from react-icons

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/users/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      // Adjusted response handling based on the provided structure
      if (response.data && response.data.response) {
        const userDetails = {
          orgDbName: response.data.response.orgDbName,
          token: response.data.response.token,
        };

        // Dispatch user details to Redux store
        dispatch(setUserDetails(userDetails));
        navigate("/");

      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row w-full text-white h-full">
      {/* Left part of the page */}
      <div className="w-full lg:w-1/2 bg-blue-500 flex items-center justify-center lg:justify-end">
        <div className="w-full h-full sm:h-screen bg-blue-100 flex items-center justify-center lg:justify-end">
          <div className="w-full sm:w-[591px] h-[100vh] sm:h-[85vh] sm:py-10 bg-variable-collection-white rounded-2xl lg:rounded-[100px_0px_0px_100px]">
            <div className="flex flex-col items-center justify-center h-full p-4">
              <Link to="/">
                <img
                  className="w-[160px] h-[120px] sm:w-[120px] sm:h-[90px] mb-3"
                  alt="Logo"
                  src={logo}
                />
              </Link>
              <div className="text-dark font-bold text-4xl text-center tracking-tight mb-1">
                Welcome Back
              </div>
              <div className="text-bright-blue font-bold text-2xl text-center tracking-tight mb-4">
                Sign In
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 mb-4 font-semibold">{error}</div>
              )}

              <div className="flex  w-full sm:w-[195px] h-[57px] items-center justify-center gap-3 mb-2">
                <img
                  className="w-16 h-full sm:w-[60.91px] sm:h-[60.91px]"
                  alt="Google"
                  src={googlepng}
                />
                <img
                  className="w-16 h-full sm:w-[60.91px] sm:h-[60.91px]"
                  alt="Apple"
                  src={applePng}
                />
                <img
                  className="w-16 h-full sm:w-[60.91px] sm:h-[60.91px]"
                  alt="Microsoft"
                  src={MircoSoftPng}
                />
              </div>

              {/* Input Fields */}
              <form
                onSubmit={handleLogin}
                className="flex flex-col w-full sm:px-20 space-y-4"
              >
                <div className="flex items-center gap-3 px-4 py-2 w-full bg-blue-100 rounded-xl">
                  <img className="w-4 h-4" alt="Vector" src={vectorSvg} />
                  <img
                    className="w-px h-5 object-cover"
                    alt="Line"
                    src={lineImg3}
                  />
                  <input
                    type="email"
                    className="flex-1 text-dark text-md bg-blue-100 border-none focus:outline-none placeholder-dark font-semibold"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Field with Eye Icon from react-icons */}
                <div className="flex items-center gap-3 px-4 py-2 w-full bg-blue-100 rounded-xl relative">
                  <img className="w-4 h-4" alt="Layer" src={layer7} />
                  <img
                    className="w-px h-5 object-cover"
                    alt="Line"
                    src={lineImg3}
                  />
                  <input
                    type={passwordVisible ? "text" : "password"} // Toggle input type
                    className="flex-1 text-dark text-md bg-blue-100 border-none focus:outline-none placeholder-dark font-semibold"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {/* Eye Icon to toggle password visibility */}
                  <div
                    className="absolute right-3 cursor-pointer w-6 h-6 flex items-center justify-center"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash className="text-blue-400" /> : <FaEye className="text-blue-400" />}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="flex flex-col sm:flex-row justify-between items-center w-full  mt-4">
                  <label className="flex items-center gap-2 text-nowrap text-bright-blue text-xs sm:text-sm">
                    <input type="checkbox" className="form-checkbox" />
                    Keep me logged in
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-bright-blue text-nowrap text-xs sm:text-sm"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <div className="w-full items-center flex justify-center">
                  <button
                    type="submit"
                    className="w-[130px] h-[44px] py-1 bg-dark rounded-md mt-2 flex items-center justify-center"
                    disabled={loading}
                  >
                    <span className="text-variable-collection-white text-lg font-bold">
                      {loading ? "Signing In..." : "Sign In"}
                    </span>
                  </button>
                </div>
              </form>

              <div className="border w-[30vw] mt-2"></div>

              {/* Contact Us */}
              <div className="flex justify-center gap-5 mt-4 items-center w-full sm:px-20 ">
                <p className="text-variable-collection-grey text-xs font-semibold">
                  Don’t have an account yet?
                </p>
                <Link to="/contact">
                  <span className="text-dark text-xs font-semibold">
                    Contact Us
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right part of the page */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-blue-900 items-center justify-start">
        <div className="w-full sm:w-[591px] h-full sm:h-[85vh] bg-boxes flex items-start justify-start p-8 rounded-none sm:rounded-[0px_100px_100px_0px]">
          <div className="w-full sm:w-[591px] md:w-[691px] h-full bg-boxes rounded-none sm:rounded-[0px_100px_100px_0px] flex flex-col items-center justify-center">
            <img
              className="w-full h-full sm:h-[561px] object-contain"
              alt="Login vector"
              src={loginimg}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
