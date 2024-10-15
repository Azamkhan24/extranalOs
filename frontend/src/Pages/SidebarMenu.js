import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SidebarMenu = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user); // Access the user from Redux state

  useEffect(() => {
    // If there's no token, redirect to login page
    if (!user) {
      navigate('/');
    }
  }, []);

  const [openAccount, setOpenAccount] = useState(false);
  const [openAccountGroup, setOpenAccountGroup] = useState(false);

  const handleAccountClick = () => {
    setOpenAccount(!openAccount);
  };

  const handleAccountGroupClick = () => {
    setOpenAccountGroup(!openAccountGroup);
  };

  return (
    
    <div className=" gap-10 bg-gray-100 p-4 rounded-lg shadow-lg flex mt-24">
      {/* Account Section */}
      <div className="mb-4 cursor-pointer" onClick={handleAccountClick}>
        <div className="flex justify-between items-center text-xs font-semibold bg-gray-300 p-2 rounded-md">
          Account <span>{openAccount ? '-' : '+'}</span>
        </div>
        {openAccount && (
          <div className="pl-4 mt-2">
            <div className="py-2 text-center text-xs hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate('/account/add')}>Add</div>
            <div className="py-2 text-center text-xs hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate('/account/modify')}>Modify</div>
            <div className="py-2 text-center text-xs hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate('/account/list')}>List</div>
          </div>
        )}
      </div>

      {/* Account Group Section */}
      <div className="cursor-pointer" onClick={handleAccountGroupClick}>
        <div className="flex justify-between items-center text-xs font-semibold bg-gray-300 p-2 rounded-md">
          Account Group <span>{openAccountGroup ? '-' : '+'}</span>
        </div>
        {openAccountGroup && (
          <div className="pl-4 mt-2">
            <div className="py-2 text-xs text-center hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate('/account-group/add')}>Add</div>
            <div className="py-2 text-xs text-center hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate('/account-group/modify')}>Modify</div>
            <div className="py-2 text-xs text-center hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => navigate('/account-group/list')}>List</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarMenu;
