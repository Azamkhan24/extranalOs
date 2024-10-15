import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'; // Make sure to import SweetAlert
import { useNavigate } from "react-router-dom";



const UnsecuredLoanUpdate = ({ accountData }) => {

    const id = accountData;
    const navigate = useNavigate();



    const [formData, setFormData] = useState({
        group: "Unsecured Loan",
        name: "",
        alias: "",
        printName: "",
        opening_balance: { balance: 0.0, type_of_Account: "+" },
        constitutions_of_bussiness: "",
        principalPlaceOfAddress: {
            addr: {
                bnm: "",
                st: "",
                loc: "",
                bno: "",
                dst: "",
                lt: "",
                locality: "",
                pncd: "",
                landMark: "",
                stcd: "",
                geocodelvl: "",
                flno: "",
            }
        },
        contact_person: [{ name: "", designation: "", mobile_no: "", email: "" }],
        pan: "",
        tan: "",
        bank: {
            bank_name: "",
            accountNo: "",
            ifsc_code: "",
        },
        type_of_interest: "",
        interest_rate: "",
    });


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


    const handleArrayChange = (e, index, key, arrayName) => {
        const updatedArray = [...formData[arrayName]];
        updatedArray[index][key] = e.target.value;
        setFormData({ ...formData, [arrayName]: updatedArray });
    };

    const addContactPerson = () => {
        setFormData({
            ...formData,
            contact_person: [
                ...formData.contact_person,
                { name: "", designation: "", mobile_no: "", email: "" },
            ],
        });
    };





    const handleInternetBankingUserChange = (e) => {

        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            bank: {
                ...prevState.bank,
                [name]: value, // Use dynamic property to update bank_name
                internet_banking_user: e.target.checked, // Update the internet_banking_user field
            }
        }));
    };







    const fetchAccountById = async () => {
        try {
            const response = await axios.get(`http://localhost:5004/api/account/get-account-by-id/${id}`, { withCredentials: true });
            console.log("response", response); // Assuming the response contains the account object
            if (response.status === 200) {
                setFormData(response.data.account);
                setDisab(true);
            }
        } catch (error) {
            console.error("Error fetching account:", error.response?.data || error);
            setErrorMessage(error.response?.data?.message || "An error occurred while fetching the account.");
        }
    };



    useEffect(() => {
        fetchAccountById();

    }, []);



    const handleSubmit = async (e) => {

        console.log("from data", formData)
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
                // Update the accountData in the parent component
                setFormData(formData);
                navigate('/account/list')
            }
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: "Failed to update account: " + (err.response?.data?.message || err.message),
                icon: "error",
            });
        }
    };




    return (
        <div className="flex justify-center items-start min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded shadow-lg w-md flex-col flex flex-wrap p-10 gap-10"
            >
                <h1>Unsecured Loan</h1>
                <div className="">

                    {/* new account */}
                    <div>


                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Alias
                            </label>
                            <input
                                type="text"
                                name="alias"
                                value={formData.alias}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Print Name
                            </label>
                            <input
                                type="text"
                                name="printName"
                                value={formData?.printName}
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


                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Constitution of Business</label>
                            <select
                                name="constitutions_of_bussiness"
                                value={formData.constitutions_of_bussiness}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            >
                                <option value="">Select Constitution</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Proprietorship">Proprietorship</option>
                                <option value="Private Limited Company">Private Limited Company</option>
                                <option value="Hindu Undivided Family">Hindu Undivided Family</option>
                                <option value="Limited Liability Partnership">Limited Liability Partnership</option>
                                <option value="Public Limited Company">Public Limited Company</option>
                                <option value="BANKING COMPANY">Banking Company</option>
                            </select>
                        </div>

                        {formData.constitutions_of_bussiness === "Private Limited Company" ||
                            formData.constitutions_of_bussiness === "Public Limited Company" ||
                            formData.constitutions_of_bussiness === "BANKING COMPANY" ? (
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">CIN</label>
                                <input
                                    type="text"
                                    name="cin"
                                    value={formData.cin}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                />
                            </div>
                        ) : formData.constitutions_of_bussiness === "Limited Liability Partnership" ? (
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">LLPIN</label>
                                <input
                                    type="text"
                                    name="llpin"
                                    value={formData.llpin}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                />
                            </div>
                        ) : null}



                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>

                            <input
                                type="text"
                                name="bnm"
                                placeholder="Building Name"
                                value={formData.principalPlaceOfAddress.addr.bnm} // Accessing addr object
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'principalPlaceOfAddress',
                                        value: {
                                            ...formData.principalPlaceOfAddress,
                                            addr: {
                                                ...formData.principalPlaceOfAddress.addr,
                                                bnm: e.target.value // Update bnm in addr
                                            }
                                        }
                                    }
                                })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                            />

                            <input
                                type="text"
                                name="st"
                                placeholder="Street"
                                value={formData.principalPlaceOfAddress.addr.st} // Accessing addr object
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'principalPlaceOfAddress',
                                        value: {
                                            ...formData.principalPlaceOfAddress,
                                            addr: {
                                                ...formData.principalPlaceOfAddress.addr,
                                                st: e.target.value // Update st in addr
                                            }
                                        }
                                    }
                                })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                            />

                            <input
                                type="text"
                                name="loc"
                                placeholder="Location"
                                value={formData.principalPlaceOfAddress.addr.loc} // Accessing addr object
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'principalPlaceOfAddress',
                                        value: {
                                            ...formData.principalPlaceOfAddress,
                                            addr: {
                                                ...formData.principalPlaceOfAddress.addr,
                                                loc: e.target.value // Update loc in addr
                                            }
                                        }
                                    }
                                })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                            />

                            <input
                                type="text"
                                name="bno"
                                placeholder="Building Number"
                                value={formData.principalPlaceOfAddress.addr.bno} // Accessing addr object
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'principalPlaceOfAddress',
                                        value: {
                                            ...formData.principalPlaceOfAddress,
                                            addr: {
                                                ...formData.principalPlaceOfAddress.addr,
                                                bno: e.target.value // Update bno in addr
                                            }
                                        }
                                    }
                                })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                            />

                            <input
                                type="text"
                                name="dst"
                                placeholder="District"
                                value={formData.principalPlaceOfAddress.addr.dst} // Accessing addr object
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'principalPlaceOfAddress',
                                        value: {
                                            ...formData.principalPlaceOfAddress,
                                            addr: {
                                                ...formData.principalPlaceOfAddress.addr,
                                                dst: e.target.value // Update dst in addr
                                            }
                                        }
                                    }
                                })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                            />

                            <input
                                type="text"
                                name="locality"
                                placeholder="Locality"
                                value={formData.principalPlaceOfAddress.addr.locality} // Accessing addr object
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'principalPlaceOfAddress',
                                        value: {
                                            ...formData.principalPlaceOfAddress,
                                            addr: {
                                                ...formData.principalPlaceOfAddress.addr,
                                                locality: e.target.value // Update locality in addr
                                            }
                                        }
                                    }
                                })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                            />

                            <input
                                type="text"
                                name="pncd"
                                placeholder="Pincode"
                                value={formData.principalPlaceOfAddress.addr.pncd || ''} // Ensure controlled input
                                onChange={(e) => {
                                    const value = e.target.value;

                                    // Check if the value is a valid 6-digit number
                                    if (/^\d{0,6}$/.test(value)) { // Accept 0 to 6 digits
                                        handleChange({
                                            target: {
                                                name: 'principalPlaceOfAddress',
                                                value: {
                                                    ...formData.principalPlaceOfAddress,
                                                    addr: {
                                                        ...formData.principalPlaceOfAddress.addr,
                                                        pncd: value // Update pncd in addr
                                                    }
                                                }
                                            }
                                        });
                                    }
                                }}
                                maxLength={6} // Limit input to 6 characters
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                            />


                            <input
                                type="text"
                                name="landMark"
                                placeholder="Landmark"
                                value={formData.principalPlaceOfAddress.addr.landMark} // Accessing addr object
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'principalPlaceOfAddress',
                                        value: {
                                            ...formData.principalPlaceOfAddress,
                                            addr: {
                                                ...formData.principalPlaceOfAddress.addr,
                                                landMark: e.target.value // Update landMark in addr
                                            }
                                        }
                                    }
                                })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                            />

                            <input
                                type="text"
                                name="stcd"
                                placeholder="State"
                                value={formData.principalPlaceOfAddress.addr.stcd} // Accessing addr object
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'principalPlaceOfAddress',
                                        value: {
                                            ...formData.principalPlaceOfAddress,
                                            addr: {
                                                ...formData.principalPlaceOfAddress.addr,
                                                stcd: e.target.value // Update stcd in addr
                                            }
                                        }
                                    }
                                })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                            />


                            <input
                                type="text"
                                name="flno"
                                placeholder="Floor Number"
                                value={formData.principalPlaceOfAddress.addr.flno} // Accessing addr object
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'principalPlaceOfAddress',
                                        value: {
                                            ...formData.principalPlaceOfAddress,
                                            addr: {
                                                ...formData.principalPlaceOfAddress.addr,
                                                flno: e.target.value // Update flno in addr
                                            }
                                        }
                                    }
                                })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                            />
                        </div>


                    </div>
                    {/* Contact Persons */}
                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Contact Persons
                        </label>
                        {formData.contact_person.map((person, index) => (
                            <div key={index} className="flex flex-wrap">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={person.name}
                                    onChange={(e) =>
                                        handleArrayChange(e, index, "name", "contact_person")
                                    }
                                    className="mr-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Designation"
                                    value={person.designation}
                                    onChange={(e) =>
                                        handleArrayChange(e, index, "designation", "contact_person")
                                    }
                                    className="mr-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Mobile No"
                                    value={person.mobile_no}
                                    onChange={(e) =>
                                        handleArrayChange(e, index, "mobile_no", "contact_person")
                                    }
                                    className="mr-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Email"
                                    value={person.email}
                                    onChange={(e) =>
                                        handleArrayChange(e, index, "email", "contact_person")
                                    }
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

                    <div className="text-lg text-start w-full">Bank Details</div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Bank Name</label>
                        <input
                            type="text"
                            name="bank_name"
                            value={formData.bank.bank_name}
                            onChange={handleInternetBankingUserChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Account Number</label>
                        <input
                            type="text"
                            name="accountNo"
                            value={formData.bank.accountNo}
                            onChange={handleInternetBankingUserChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">IFSC Code</label>
                        <input
                            type="text"
                            name="ifsc_code"
                            value={formData.bank.ifsc_code}
                            onChange={handleInternetBankingUserChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            PAN
                        </label>
                        <input
                            type="text"
                            name="pan"
                            value={formData.pan}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            TAN
                        </label>
                        <input
                            type="text"
                            name="tan"
                            value={formData.tan}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Type of Interest
                        </label>
                        <input
                            type="text"
                            name="type_of_interest"
                            value={formData.type_of_interest}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Interest Rate
                        </label>
                        <input
                            type="number"
                            name="interest_rate"
                            value={formData.interest_rate}
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
                </div>

            </form>
        </div>
    );
};

export default UnsecuredLoanUpdate;