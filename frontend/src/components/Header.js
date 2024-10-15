import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

// Define nav items
const navItems = [
  { label: "ABOUT", hasDropdown: true },
  { label: "PRODUCTS", hasDropdown: true },
  { label: "SOLUTIONS", hasDropdown: true },
  { label: "PRICING", hasDropdown: true },
  { label: "RESOURCES", hasDropdown: true },
  { label: "SUPPORT", hasDropdown: true },
];

// NavItem component
function NavItem({ label, hasDropdown }) {
  return (
    <div className="flex gap-1 items-center text-xs text-white">
      <span className="text-xs font-semibold">{label}</span>
      {hasDropdown && (
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/65ae8b96c06175163303dd02d0e96c417ac82f668d4715ad53d1f5e635afdfb3?placeholderIfAbsent=true&apiKey=81a235f4136c4623b32cac0bf8e8b9ae"
          alt="Dropdown Icon"
          className="w-3"
        />
      )}
    </div>
  );
}

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setUserDetails(null)); // Clear the user details
    navigate("/login"); // Redirect to the login page
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-blue-500 shadow-md z-50">
      <div className="flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/531e10786394cc744ffa52bf69172cd52e8599084e5e950d9e0e6f9a4b07386c?placeholderIfAbsent=true&apiKey=81a235f4136c4623b32cac0bf8e8b9ae"
            alt="Company Logo"
            className="h-10 w-32 lg:w-48"
          />
        </Link>

        {/* Navigation for Desktop */}
        <nav className="flex space-x-6">
          {navItems.map((item, index) => (
            <NavItem key={index} label={item.label} hasDropdown={item.hasDropdown} />
          ))}
        </nav>

        {/* Login/Logout and Contact buttons for Desktop */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {user.role === "SuperAdmin" ? (
                <Link to="/superAdmin" className="text-white text-sm font-semibold mr-4 text-center">
                  Welcome, {user.name}
                  <br />
                  <span className="text-xs font-normal">&#123;{user.role}&#x7D;</span>
                </Link>
              ) : (
                <p className="text-center font-semibold text-white">
                  Welcome, {user.name}
                  {/* <br />
                  <span className="text-xs font-normal">&#123;{user.role}&#x7D;</span> */}
                </p>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white text-xs font-medium py-2 px-3 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="bg-blue-600 text-xs text-white font-medium py-2 px-3 rounded hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
          )}
          <Link to="/contact">
            <button className="bg-blue-700 text-xs text-white font-medium py-2 px-3 rounded hover:bg-blue-800 transition">
              Contact
            </button>
          </Link>
        </div>

        {/* Burger Menu Icon for Mobile */}
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="sm:hidden text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        className={`${isMenuOpen ? "block" : "hidden"} bg-blue-500 md:hidden text-white py-2 shadow-lg`}
      >
        <ul className="flex flex-col items-center text-xs space-y-3">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavItem label={item.label} hasDropdown={item.hasDropdown} />
            </li>
          ))}

          <div className="flex flex-col items-center justify-center mt-2">
            {user ? (
              <>
                <Link to="/superAdmin" className="text-white text-sm font-semibold cursor-pointer">
                  Welcome, {user.name}
                  <br />
                  {user.role}
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white text-xs font-medium py-1 px-3 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="bg-blue-600 text-xs text-white font-medium py-1 px-3 rounded hover:bg-blue-700 transition">
                  Login
                </button>
              </Link>
            )}
            <Link to="/contact">
              <button className="bg-blue-700 text-xs text-white font-medium py-1 px-3 rounded hover:bg-blue-800 transition">
                Contact
              </button>
            </Link>
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
