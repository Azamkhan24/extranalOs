import React, { useState } from "react";
import axios from "axios";

const SecuritiesAndDeposit = () => {
    const [formData, setFormData] = useState({
        group: "Securities & Deposit (Assets)",
        name: "",
        alias: "",
        printName: "",
        opening_balance: { balance: 0.0, type_of_Account: "+" },
        contact_person: [{ name: "", designation: "", mobile_no: "", email: "" }],
        pan: "",
        tan: "",
    });

    const [errorMessage, setErrorMessage] = useState(""); // State for error messages

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
    

    const handleArrayChange = (e, index, key) => {
        const updatedArray = [...formData.contact_person];
        updatedArray[index][key] = e.target.value;
        setFormData((prevData) => ({
            ...prevData,
            contact_person: updatedArray,
        }));
    };

    const addContactPerson = () => {
        setFormData((prevData) => ({
            ...prevData,
            contact_person: [
                ...prevData.contact_person,
                { name: "", designation: "", mobile_no: "", email: "" },
            ],
        }));
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
                    group: "Securities & Deposit (Assets)",
                    name: "",
                    alias: "",
                    printName: "",
                    opening_balance: { balance: 0.0, type_of_Account: "+" },
                    contact_person: [{ name: "", designation: "", mobile_no: "", email: "" }],
                    pan: "",
                    tan: "",
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
                <h1>Securities & Deposit</h1>

                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>} {/* Show error message if any */}

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

                {/* Contact Persons */}
                <div className="mb-4 col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Contact Persons</label>
                    {formData.contact_person.map((person, index) => (
                        <div key={index} className="flex flex-wrap mb-2">
                            <input
                                type="text"
                                placeholder="Name"
                                value={person.name}
                                onChange={(e) => handleArrayChange(e, index, "name")}
                                className="mr-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                            <input
                                type="text"
                                placeholder="Designation"
                                value={person.designation}
                                onChange={(e) => handleArrayChange(e, index, "designation")}
                                className="mr-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                            <input
                                type="text"
                                placeholder="Mobile No"
                                value={person.mobile_no}
                                onChange={(e) => handleArrayChange(e, index, "mobile_no")}
                                className="mr-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                            <input
                                type="text"
                                placeholder="Email"
                                value={person.email}
                                onChange={(e) => handleArrayChange(e, index, "email")}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addContactPerson}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
                    >
                        Add Contact Person
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">PAN</label>
                    <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">TAN</label>
                    <input
                        type="text"
                        name="tan"
                        value={formData.tan}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SecuritiesAndDeposit;
