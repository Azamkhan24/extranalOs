import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const AddAccount = () => {
  const [accounts, setAccounts] = useState([]); // Store fetched accounts
  const [formData, setFormData] = useState({
    group: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Error message for fetch failure
  const navigate = useNavigate(); // Used for navigation

  // Fetch accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://localhost:5004/api/account-group/get-all-group", {
          withCredentials: true,
        });
        setAccounts(response.data.data); // Assuming the accounts are in response.data.data
      } catch (error) {
        setErrorMessage("Error fetching account groups");
        console.error(error); // Log error for debugging
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.group) {
      setErrorMessage("Please select a group.");
      return;
    }
    // Navigate to the Account component and pass the selected group as a route parameter
    navigate(`/account/${formData.group}`);
  };

  return (
    <div className="flex justify-center items-start min-h-screen mt-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow-lg w-md flex-col flex flex-wrap p-5 gap-10"
      >
        <h1 className="text-2xl font-bold mb-4">Create Account Page</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Group</label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
          >
            <option value="">Select Group</option>
            {accounts.map((account) => (
              <option key={account._id} value={account.name}>
                {account.name}
              </option>
            ))}
          </select>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default AddAccount;
