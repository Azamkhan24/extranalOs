import React, { useState } from "react";
import axios from "axios";

const Sale = () => {
    const [formData, setFormData] = useState({
        group: "Surplus",
        name: "",
        alias: "",
        printName: "",
        opening_balance: { balance: 0.0, type_of_Account: "+" },
    });

    const [errorMessage, setErrorMessage] = useState(""); // Error message for fetch failure

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target; // Destructure necessary properties
    
        // Check if the input is for opening_balance
        if (name === 'opening_balance') {
            setFormData((prevData) => ({
                ...prevData,
                opening_balance: {
                    ...prevData.opening_balance,
                    balance: value // Update balance
                }
            }));
        } 
        // Check if the input is for opening_balance_type
        else if (name === 'opening_balance_type') {
            setFormData((prevData) => ({
                ...prevData,
                opening_balance: {
                    ...prevData.opening_balance,
                    type_of_Account: value // Update account type
                }
            }));
        } 
        // Handle other inputs
        else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === "checkbox" ? checked : value // Handle checkbox if needed
            }));
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData, "formdata");
        try {
            const response = await axios.post("http://localhost:5004/api/account/create-account", formData, {
                withCredentials: true,
            });

            if (response.status === 200) {
                console.log("Account created successfully:", response.data);
                // Reset form after successful submission
                setFormData({
                    group: "Sale",
                    name: "",
                    alias: "",
                    printName: "",
                    opening_balance: { balance: 0.0, type_of_Account: "+" },
                });
                setErrorMessage(""); // Reset error if any
            }
        } catch (error) {
            console.error("Error creating account:", error.response?.data || error);
            setErrorMessage(error.response?.data?.message || "An error occurred while creating the account.");
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded shadow-lg w-md flex-col flex flex-wrap p-10 gap-10"
            >
                <h1>Sale</h1>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Alias</label>
                    <input
                        type="text"
                        name="alias"
                        value={formData.alias}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Print Name</label>
                    <input
                        type="text"
                        name="printName"
                        value={formData.printName}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Opening Balance</label>

                        <div className="flex items-center mb-4">
                            <select
                                name="opening_balance_type"
                                value={formData.opening_balance.type_of_Account || '+'} // Default to '+' if not set
                                onChange={handleChange}
                                className="border rounded py-2 px-3 text-lg"
                            >
                                <option value="+">+</option>
                                <option value="-">-</option>
                            </select>
                            <input
                                type="number"
                                name="opening_balance"
                                value={formData.opening_balance.balance || ''} // Ensure it's controlled
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mr-2" // Added margin to the right for spacing
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
                        Create Account
                    </button>
                </div>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Show error message if any */}
            </form>
        </div>
    );
};

export default Sale;
