import React, { useEffect } from 'react';
import Header from '../components/Header';
import MainNavbar from '../components/MainNavbar';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import axios from 'axios';

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user); // Access the user from Redux store

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users/getUser`, {
          withCredentials: true, // To include cookies with the request
        });

        if (response.data && response.data.user) {
          // console.log("response at user side", response.data.user);
          // Update redux store with user details
          dispatch(setUserDetails({
            id: response.data.user._id, // Changed to _id based on your response
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
            userType: response.data.user.userType, // Added userType if needed
            phoneNo: response.data.user.phoneNo, // Added phoneNo if needed
            orgDbName: response.data.user.accountDatabase, // Use accountDatabase for orgDbName
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error.response?.data?.message || error.message);
      }
    };

    fetchUserDetails();
  }, []); // Include dispatch in the dependency array

  // console.log("user Home",user);

  return (
    <>
      {user ? (
        <div>
          <MainNavbar />
        </div>
      ) : (
        <div>
          <Header />
        </div>
      )}

      <div>
        <Outlet />
      </div>
    </>
  );
}
