/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AccountGroupModify = () => {
  const [accounts, setAccounts] = useState([]); // Store the list of accounts
  const [formData, setFormData] = useState({
    previous_name: '', // The current name of the selected account
    name: '', // The new name to update to
  });
  const [selectedAccount, setSelectedAccount] = useState(''); // Store the selected account
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Use for navigation

  // Fetch the list of accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:5004/api/account-group/get-all-group', {
          withCredentials: true, // Ensure that cookies (like dbConnection) are sent
        });
        setAccounts(response.data.data); // Set the account list
      } catch (error) {
        if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Error fetching accounts');
        }
      }
    };
    fetchAccounts();
  }, []);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle account selection from the dropdown
  const handleAccountSelection = (e) => {
    const selectedName = e.target.value;
    setSelectedAccount(selectedName);

    // Find the selected account and set it in formData
    const account = accounts.find((acc) => acc.name === selectedName);
    if (account) {
      setFormData({
        previous_name: account.name, // Set the previous name to the selected account's name
        name: account.name, // Initially set the new name as the same
      });
    }
  };

  // Handle form submission for updating the account
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Send the update request to the backend
      const response = await axios.patch('/Os/api/account-group/group-update', formData, {
        withCredentials: true, // Ensure cookies are sent
      });

      setSuccessMessage('Account updated successfully!');
      setTimeout(() => {
        navigate('/list'); // Redirect to the list page after successful update
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Error updating account');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Modify Group</h2>

        {/* Display error and success messages */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        {/* Select Account to Modify */}
        <div>
          <label className="block text-gray-700 mb-2">Select Group to Modify</label>
          <select
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={selectedAccount}
            onChange={handleAccountSelection}
          >
            <option value="">Select Group</option>
            {accounts.map((account) => (
              <option key={account.name} value={account.name}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Previous Name</label>
            <input
              type="text"
              name="previous_name"
              value={formData.previous_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              disabled // Disable the previous name field
            />
          </div>

          <div>
            <label className="block text-gray-700">New Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Update Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountGroupModify;