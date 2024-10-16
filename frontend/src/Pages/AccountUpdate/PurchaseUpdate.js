import React, { useEffect, useState } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const PurchaseUpdate = ({ accountData }) => {
    const id = accountData;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        group: "Purchase",
        name: "",
        alias: "",
        printName: "",
        opening_balance: { balance: "", type_of_Account: "+" }, // Change balance to an empty string
    });

    const [errorMessage, setErrorMessage] = useState(""); // Error message for fetch failure
    const [loading, setLoading] = useState(true); // Add a loading state if needed

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Update nested opening_balance fields
        if (name === 'opening_balance') {
            setFormData((prevData) => ({
                ...prevData,
                opening_balance: {
                    ...prevData.opening_balance,
                    balance: value, // Store balance as a string
                }
            }));
        } else if (name === 'opening_balance_type') {
            setFormData((prevData) => ({
                ...prevData,
                opening_balance: {
                    ...prevData.opening_balance,
                    type_of_Account: value, // Update account type
                }
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // Fetch account by ID and populate form data
    const fetchAccountById = async () => {
        try {
            const response = await axios.get(`http://localhost:5004/api/account/get-account-by-id/${id}`, { withCredentials: true });
            if (response.status === 200 && response.data.account) {
                setFormData({
                    ...response.data.account,
                    opening_balance: response.data.account.opening_balance || { balance: "", type_of_Account: "+" },
                });
                setLoading(false); // Set loading to false when data is fetched
            }
        } catch (error) {
            console.error("Error fetching account:", error.response?.data || error);
            setErrorMessage(error.response?.data?.message || "An error occurred while fetching the account.");
            setLoading(false);
        }
    };

    // Fetch account data on component mount
    useEffect(() => {
        fetchAccountById();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await axios.patch(`http://localhost:5004/api/account/modify/${id}`, formData, {
                withCredentials: true // Include credentials in the request
            });
            if (response.status === 200) {
                Swal.fire({
                    title: "Success!",
                    text: "Account updated successfully.",
                    icon: "success",
                });
                navigate('/account/list');
            }
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: "Failed to update account: " + (err.response?.data?.message || err.message),
                icon: "error",
            });
        }
    };

    // Show a loading state while fetching account data
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center items-start min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded shadow-lg w-md flex-col flex flex-wrap p-10 gap-10"
            >
                <h1>Purchase</h1>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData?.name || ""}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Alias</label>
                    <input
                        type="text"
                        name="alias"
                        value={formData?.alias || ""}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Print Name</label>
                    <input
                        type="text"
                        name="printName"
                        value={formData?.printName || ""}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Opening Balance</label>

                    <div className="flex items-center mb-4">
                        <select
                            name="opening_balance_type"
                            value={formData?.opening_balance?.type_of_Account || '+'}
                            onChange={handleChange}
                            className="border rounded py-2 px-3 text-lg"
                        >
                            <option value="+">+</option>
                            <option value="-">-</option>
                        </select>
                        <input
                            type="text" // Change to text to handle balance as string
                            name="opening_balance"
                            value={formData?.opening_balance?.balance || ""} // Ensure balance is treated as a string
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mr-2"
                            placeholder="Enter amount"
                            required
                        />
                    </div>
                </div>

                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                    >
                        Update Account
                    </button>
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </form>
        </div>
    );
};

export default PurchaseUpdate;
