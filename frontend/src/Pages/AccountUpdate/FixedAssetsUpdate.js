import React, { useEffect, useState } from 'react';
import axios from "axios";
import Swal from 'sweetalert2'; // Make sure to import SweetAlert
import { useNavigate } from 'react-router-dom';


const FixedAssetsUpdate = ({ accountData }) => {
    const id = accountData;
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        group: "Fixed Assets",
        name: "",
        alias: "",
        printName: "",
        opening_balance: { balance: 0.0, type_of_Account: "+" },
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
        attachments: {
            others: "",
        },
        method_of_depreciation: "",
        rate_of_depreciation: "",
    });

    const [error, setError] = useState(""); // State for error messages
    const [disab,setDisab] = useState(false);


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
    

    // Handle file upload
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            attachments: { ...prevData.attachments, [name]: files[0] },
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
           // setErrorMessage(error.response?.data?.message || "An error occurred while fetching the account.");
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
                <h1>Fixed Assets</h1>

                {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error message */}

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
                    <label className="block text-gray-700 text-sm font-bold mb-2">Method of Depreciation</label>
                    <input
                        type="text"
                        name="method_of_depreciation"
                        value={formData.method_of_depreciation}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Rate of Depreciation</label>
                    <input
                        type="number"
                        name="rate_of_depreciation"
                        value={formData.rate_of_depreciation}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                {/* Document Uploads */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Other Attachments</label>
                    <input
                        type="file"
                        name="others"
                        onChange={handleFileChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    />
                </div>

                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                    >
                        Update Account
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FixedAssetsUpdate;
