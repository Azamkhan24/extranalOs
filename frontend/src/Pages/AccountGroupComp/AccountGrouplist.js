import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AccountGrouplist = () => {
  const [accounts, setAccounts] = useState([]); // Store the list of original accounts
  const [filteredAccounts, setFilteredAccounts] = useState([]); // Store the filtered list of accounts
  const [searchTerm, setSearchTerm] = useState(""); // Store the search term
  const [errorMessage, setErrorMessage] = useState(""); // Store any error messages

  // Fetch accounts on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5004/api/account-group/get-all-group',  // Corrected the URL
          {
            withCredentials: true, // Ensure that cookies (like dbConnection) are included if needed
          }
        );

        // Extract the actual accounts from the response data
        const fetchedAccounts = response.data.data;
        setAccounts(fetchedAccounts); // Store the original accounts
        setFilteredAccounts(fetchedAccounts); // Initialize filteredAccounts with the full account list
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message); // Display specific error from the server
        } else {
          setErrorMessage('Error fetching accounts');
        }
      }
    };
    fetchAccounts();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);

    if (value === "") {
      setFilteredAccounts(accounts); // Show full list if search term is empty
    } else {
      const filtered = accounts.filter((account) =>
        account.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAccounts(filtered);
    }
  };

  // Delete account by name
  const deleteAccount = async (name) => {
    try {
      const response = await axios({
        method: "delete",
        url: `/Os/api/account-group/group-delete`,
        data: { name }, // Send the name in the request body
        withCredentials: true, // Ensure cookies like dbConnection are sent
      });

      if (response.status === 200 || response.status === 204) {
        const updatedAccounts = accounts.filter(
          (account) => account.name !== name
        );
        setAccounts(updatedAccounts); // Update the original accounts list
        setFilteredAccounts(updatedAccounts); // Update the filtered list as well
        setErrorMessage(""); // Clear any existing error messages on success
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Display error returned from the server
      } else {
        setErrorMessage("Error deleting account");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Groups List</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4 w-full p-2 border border-gray-300 rounded-lg"
        />

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Account Name
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Under
                </th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <tr key={account.name} className="border-t">
                    <Link to="/show-field">
                      <td className="px-4 py-2">{account.name}</td>
                    </Link>
                    <td className="px-4 py-2">{account.Under || ""}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deleteAccount(account.name)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountGrouplist;