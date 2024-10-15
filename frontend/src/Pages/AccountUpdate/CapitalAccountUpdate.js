import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'; // Make sure to import SweetAlert
import { useNavigate } from "react-router-dom";


const CapitalAccountUpdate = ({accountData}) => {
    const id  = accountData;
    
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        group: "Capital Account",
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
        bank: {
            bank_name: "",
            accountNo: "",
            ifsc_code: "",
            swift_code: "",
            ad_code: "",
            upi_id: "",
        },
        email: "",
        contact_no: "",
        alternative_contact_no: "",
        contact_person: [
            { name: "", designation: "", mobile_no: "", email: "" } // Initial contact person
        ],
        pan: "",
        tan: "",
        cin: "",
        llpin: "",
        attachments: {
            canceled_cheque: null,
            others: null,
        },
        udyam_no: "",
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
        if (formData.contact_person.length < 10) { // Example limit
            setFormData((prevData) => ({
                ...prevData,
                contact_person: [
                    ...prevData.contact_person,
                    { name: "", designation: "", mobile_no: "", email: "" } // Initialize a new contact person
                ],
            }));
        } else {
            alert("Maximum contact persons reached.");
        }
    };




    const handleInternetBankingUserChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            bank: {
                ...prevState.bank,
                [name]: type === "checkbox" ? !prevState.bank[name] : value,
            },
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            attachments: { ...prevData.attachments, [name]: files[0] },
        }));
    };



    const deleteContactPerson = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            contact_person: prevData.contact_person.filter((_, i) => i !== index),
        }));
    };



    const fetchAccountById = async () => {
        try {
            const response = await axios.get(`http://localhost:5004/api/account/get-account-by-id/${id}`, { withCredentials: true });
            console.log("response",response); // Assuming the response contains the account object
            if (response.status === 200) {
                setFormData(response.data.account);
                setDisab(true);
            }
        } catch (error) {
            console.error("Error fetching account:", error.response?.data || error);
        }
    };



    useEffect(() => {
            fetchAccountById();

    }, []);



    const handleSubmit = async (e) => {

        console.log("from data",formData)
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
        <div className="flex justify-center items-start min-h-screen  ">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded shadow-lg  flex-col flex flex-wrap p-10 gap-10"
            >
                <h1>Capital Account</h1>
                <div className="">
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
                            value={formData.principalPlaceOfAddress.addr.pncd} // Accessing addr object
                            onChange={(e) => handleChange({
                                target: {
                                    name: 'principalPlaceOfAddress',
                                    value: {
                                        ...formData.principalPlaceOfAddress,
                                        addr: {
                                            ...formData.principalPlaceOfAddress.addr,
                                            pncd: e.target.value // Update pncd in addr
                                        }
                                    }
                                }
                            })}
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
                        <label className="block text-gray-700 text-sm font-bold mb-2">Contact Persons</label>
                        {formData.contact_person.map((person, index) => (
                            <div key={index} className="flex flex-wrap mb-2">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={person.name}
                                    onChange={(e) => handleArrayChange(e, index, "name", "contact_person")}
                                    className="mr-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Designation"
                                    value={person.designation}
                                    onChange={(e) => handleArrayChange(e, index, "designation", "contact_person")}
                                    className="mr-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Mobile No"
                                    value={person.mobile_no}
                                    onChange={(e) => handleArrayChange(e, index, "mobile_no", "contact_person")}
                                    className="mr-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Email"
                                    value={person.email}
                                    onChange={(e) => handleArrayChange(e, index, "email", "contact_person")}
                                    className="mr-2"
                                />
                                {/* Delete Button: Only show if it's not the first contact person */}
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => deleteContactPerson(index)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                    >
                                        Delete
                                    </button>
                                )}
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




                    <div>
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
                            <label className="block text-gray-700 text-sm font-bold mb-2">SWIFT Code</label>
                            <input
                                type="text"
                                name="swift_code"
                                value={formData.bank.swift_code}
                                onChange={handleInternetBankingUserChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">AD Code</label>
                            <input
                                type="text"
                                name="ad_code"
                                value={formData.bank.ad_code}
                                onChange={handleInternetBankingUserChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">UPI ID</label>
                            <input
                                type="text"
                                name="upi_id"
                                value={formData.bank.upi_id}
                                onChange={handleInternetBankingUserChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                    </div>
                    <hr />
                    <div>
                        <h1 className="text-lg py-5 font-semibold">Other details</h1>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">User Email</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">User Contact</label>
                            <input
                                type="text"
                                name="contact_no"
                                value={formData.contact_no}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Alt Contact</label>
                            <input
                                type="text"
                                name="alternative_contact_no"
                                value={formData.alternative_contact_no}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Udhyam No</label>
                            <input
                                type="text"
                                name="udyam_no"
                                value={formData.udyam_no}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                    </div>
                    <div>
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





                    </div>


                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Canceled Cheque</label>
                            <input
                                type="file"
                                name=" canceled_cheque"
                                onChange={handleFileChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Other Attachments</label>
                            <input
                                type="file"
                                name="others"
                                onChange={handleFileChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
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
                </div>
            </form>
        </div>
    );
};

export default CapitalAccountUpdate;
