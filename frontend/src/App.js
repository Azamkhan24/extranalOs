import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Login } from "./Pages/Login";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "./store/userSlice";
import axios from "axios";

import LandingPage from "./Pages/LandingPage";
import SidebarMenu from "./Pages/SidebarMenu";
import Account from "./Pages/Account";
import AccountPage from "./Pages/AccountPage";
import EditAccount from "./Pages/AccountComp/EditAccount";
import ListAccount from "./Pages/AccountComp/ListAccount";
import ConfigurationPage from "./Pages/ConfigurationPage";
import GeneralConfigForm from "./Pages/GeneralConfigForm";
import AccountGroup from "./Pages/AccountGroup";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/users/getUser`, {
          withCredentials: true, // To include cookies with the request
        });

        if (response.data && response.data.user) {
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
  }, []);

  return (
    <>
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Home />}>
            <Route index element={<LandingPage />} />

            {/* <Route exact path="/sidemenu" element={<SidebarMenu />} /> */}
            <Route exact path="/account" element={<AccountPage />} />
            <Route path="/account/:group" element={<Account AddAccount={true} />} />

          {/* Route for listing accounts */}
          <Route path="/account/list" element={<Account List={true} />} />


          <Route path="/accountGroup" element={<AccountGroup />} />

 
            <Route exact path="/Voucher-configuration" element={<ConfigurationPage />} />
            <Route exact path="/general-configuration" element={<GeneralConfigForm />} />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
