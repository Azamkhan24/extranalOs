import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function MainNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user?.user);


  const [selectedOption, setSelectedOption] = useState("Master");
  const [selectedOptionConfig, setSelectedOptionConfig] = useState("Configuration");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    navigate(event.target.value); // Correctly calling the navigate function
};

  const handleChangeConfig = (event) => {
    setSelectedOptionConfig(event.target.value);
    navigate(event.target.value); // Correctly calling the navigate function
};



  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/users/logout`,
        { withCredentials: true }
      );
      dispatch(setUserDetails(null)); // Clear the user details
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error during logout:", error.response?.data?.message || error.message);
    }
  };

  return (
    <header className="flex px-4 z-10 bg-violet-50 w-full py-4">
      <div className="flex justify-center items-center">
        <Link to='/'>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/843c1a6537f4c6cb99a1860165d0b496ed55d0b76f14918e3ad16250cdaf78ce?placeholderIfAbsent=true&apiKey=81a235f4136c4623b32cac0bf8e8b9ae"
            className="w-12"
            alt="Logo"
          />
        </Link>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex justify-center items-center">
          <SearchBar />
          <div className="flex flex-1 justify-end absolute right-0 lg:right-4">
            <UserIcons user={user} handleLogout={handleLogout} />
          </div>
        </div>
        <div className="w-full flex">
          <nav className="flex flex-wrap items-center w-full text-[10px] lg:text-xs font-semibold leading-3 pl-5 text-center text-violet-950 justify-center">
            <div className="flex gap-3 lg:gap-7">
              <div>
                  <select
                    value={selectedOption}
                    onChange={handleChange}
                    className="gap-1 hover:border-none self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer"
                  >
                    <option value="Master" disabled>
                      Master
                    </option>
                    <option to="/account"> Account</option>
                    <option value="/account-group">Account Group</option>
                    <option value="/item">Item</option>
                    <option value="/item-group">Item Group</option>
                  </select>
              </div>

              <div>
                  <select
                    value={selectedOptionConfig}
                    onChange={handleChangeConfig}
                    className="gap-1 hover:border-none self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer"
                  >
                    <option value="Master" disabled>
                      Configuration
                    </option>
                    <option value="/general-configuration">General Configuration</option>
                    <option value="/account-group">Account Group</option>
                    <option value="/item">Item</option>
                    <option value="/item-group">Item Group</option>
                  </select>
              </div>

              <div className="gap-1 self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer" >
                option
              </div>
              <div className="gap-1 self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer" >
                option
              </div>
              <div className="gap-1 self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer" >
                option
              </div>
              <div className="gap-1 self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer" >
                option
              </div>
              <div className="gap-1 self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer" >
                option
              </div>
              <div className="gap-1 self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer" >
                option
              </div>
              <div className="gap-1 self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer" >
                option
              </div>
              <div className="gap-1 self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer" >
                option
              </div>
              <div className="gap-1 self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer" >
                option
              </div>
              <div className="gap-1 self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer" >
                option
              </div>
              <div className="gap-1 self-stretch shadow-lg p-2 my-auto bg-blue-100 rounded-lg cursor-pointer" >
                option
              </div>

            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

function SearchBar() {
  return (
    <div className="flex text-md gap-2 items-center w-1/3 p-1 m-1 bg-blue-300 rounded-lg">
      <div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/662e8bb4b9116824a1bc61959dadde0c295ce1953c5a48dc474599734cdef213?placeholderIfAbsent=true&apiKey=81a235f4136c4623b32cac0bf8e8b9ae"
          className="object-contain shrink-0 my-auto w-[20px] h-[20px]"
          alt=""
        />
      </div>
      <div className="w-full text-white">
        <input
          type="search"
          placeholder="Search"
          className="bg-transparent shrink-0 w-full placeholder:text-white placeholder:text-center rounded-lg outline-none"
        />
      </div>
    </div>
  );
}

function UserIcons({ user, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* Icons */}
      <div className="flex flex-wrap shrink p-2 items-center justify-center gap-2 lg:gap-5">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/f77842ee0f288243e66f741f4296e3e2d74de860f1e07b7e5da2a8e94c15ac43?placeholderIfAbsent=true&apiKey=81a235f4136c4623b32cac0bf8e8b9ae"
          className="object-contain w-[26px] h-[30px] shadow-sm"
          alt="User icon "
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c304e775ba208186b07246994392e1e404d750969286b9d8c054c5fe1860fa7?placeholderIfAbsent=true&apiKey=81a235f4136c4623b32cac0bf8e8b9ae"
          className="object-contain w-[29px] h-[30px] shadow-sm"
          alt="User icon 2"
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/4c49d7923e2a2a415540cb29de40eb1d2ae262e1341133cb698474fb4546f827?placeholderIfAbsent=true&apiKey=81a235f4136c4623b32cac0bf8e8b9ae"
          className="object-contain w-[34px] h-[30px] shadow-sm"
          alt="User icon 3"
        />
        {/* Clickable DS button */}
        <div
          className="self-stretch my-auto bg-blue-300 rounded-full w-[38px] h-[38px] text-xs p-2 flex items-center justify-center shadow-sm cursor-pointer"
          onClick={toggleDropdown}
        >
          DS
        </div>
      </div>

      {/* Dropdown content - visible when clicked */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
          <div className="px-4 py-2 text-gray-900 font-bold border-b">
            {user?.name || "Guest"}
          </div>
          <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
            Profile
          </div>
          <div
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
}

export default MainNavbar;
