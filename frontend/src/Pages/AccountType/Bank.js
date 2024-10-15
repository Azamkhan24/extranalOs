import React, { useEffect, useState } from "react";
import axios from "axios";

const Bank = () => {
    const [formData, setFormData] = useState({
        group: "Bank Account",
        name: "",
        alias: "",
        printName: "",
        opening_balance: { balance: 0.0, type_of_Account: "" || "+" },
        registrationType: true,
        gstin: "",
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
        additionalPlaceOfAddress: [],
        bank: {
            bank_name: "",
            accountNo: "",
            ifsc_code: "",
            swift_code: "",
            ad_code: "",
            upi_id: "",
            internet_banking_user: false,
            internet_banking_user_name: "",
            internet_banking_user_login_password: "",
            internet_banking_user_transaction_password: "",
        },
        email: "",
        contact_no: "",
        alternative_contact_no: "",
        contact_person: [{ name: "", designation: "", mobile_no: "", email: "" }],
        pan: "",
        tan: "",
        cin: "",
        llpin: "",
        attachments: {
            canceled_cheque: null,
            gstin_certificate: null,
            others: null,
        },

    });

    const [gstDetails, setGstDetails] = useState(null);
    const [gstadd, setGstAdd] = useState(null);
    const [error, setError] = useState("");

    const [disab, setDisab] = useState(false);


    const [view, setView] = useState(false); // Initialize state for view

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
        setFormData((prevData) => ({
            ...prevData,
            contact_person: [...prevData.contact_person, { name: "", designation: "", mobile_no: "", email: "" }],
        }));
    };

    const addAdditionalAddress = () => {
        setFormData((prevData) => ({
            ...prevData,
            additionalPlaceOfAddress: [
                ...prevData.additionalPlaceOfAddress,
                { addr: { bnm: "", st: "", loc: "", bno: "", dst: "", lt: "", locality: "", pncd: "", landMark: "", stcd: "", flno: "" }, ntr: "" },
            ],
        }));
    };

    const handleRegistrationTypeChange = (e) => {
        setFormData({ ...formData, registrationType: e.target.value === "Yes" });
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

    const handleGstValidate = async () => {
        try {
            const response = await axios.post("/Os/api/gst/gst-details", { gstin: formData.gstin });

            if (response.data && response.data.userExist && response.data.userExist.length > 0) {
                const gstDetails = response.data.userExist[0];
                setGstDetails(gstDetails);
                setGstAdd(gstDetails.pradr.addr);
                setError("");
                handleCopyDetails();
            } else {
                setError("GSTIN not found or invalid.");
            }
        } catch (error) {
            console.error("Error fetching GST details:", error);
            setError("Invalid GSTIN or server error.");
            setGstDetails(null);
        }
    };



    const handleCopyDetails = () => {
        if (gstDetails) {
            setFormData((prevData) => ({
                ...prevData,
                printName: gstDetails?.tradeNam || gstDetails?.legalNam,
                principalPlaceOfAddress: {
                    addr: {
                        bnm: gstadd?.bnm || "",  // Building Name
                        st: gstadd?.st || "",    // Street
                        loc: gstadd?.loc || "",  // Location
                        bno: gstadd?.bno || "",  // Building Number
                        dst: gstadd?.dst || "",   // District
                        lt: gstadd?.lt || "",     // Locality Type
                        locality: gstadd?.locality || "", // Locality
                        pncd: gstadd?.pncd || "", // Pin Code
                        landMark: gstadd?.landMark || "", // Land Mark
                        stcd: gstadd?.stcd || "", // State
                        geocodelvl: gstadd?.geocodelvl || "", // Geo Code Level
                        flno: gstadd?.flno || "",  // Floor Number
                    }
                },
                pan: gstDetails?.gstin.substring(2, 12) || "",
                constitutions_of_bussiness: gstDetails?.ctb || "",
                additionalPlaceOfAddress: gstDetails.adadr.map(address => ({
                    addr: {
                        bnm: address.addr.bnm,
                        st: address.addr.st,
                        loc: address.addr.loc,
                        bno: address.addr.bno,
                        dst: address.addr.dst,
                        lt: address.addr.lt,
                        locality: address.addr.locality,
                        pncd: address.addr.pncd,
                        landMark: address.addr.landMark,
                        stcd: address.addr.stcd,
                        geocodelvl: address.addr.geocodelvl,
                        flno: address.addr.flno,
                    },
                    ntr: address.ntr,
                })),
            }));
            setDisab(true);
            setGstDetails(null);
        }
    };


    const deleteAdditionalAddress = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            additionalPlaceOfAddress: prevData.additionalPlaceOfAddress.filter((_, i) => i !== index),
        }));
    };


    const deleteContactPerson = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            contact_person: prevData.contact_person.filter((_, i) => i !== index),
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
                // Reset the form data to initial state
                setFormData({
                    group: "Bank Account",
                    name: "",
                    alias: "",
                    printName: "",
                    opening_balance: { balance: 0.0, type_of_Account: "+" },
                    registrationType: true,
                    gstin: "",
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
                    additionalPlaceOfAddress: [],
                    bank: {
                        bank_name: "",
                        accountNo: "",
                        ifsc_code: "",
                        swift_code: "",
                        ad_code: "",
                        upi_id: "",
                        internet_banking_user: false,
                        internet_banking_user_name: "",
                        internet_banking_user_login_password: "",
                        internet_banking_user_transaction_password: "",
                    },
                    email: "",
                    contact_no: "",
                    alternative_contact_no: "",
                    contact_person: [{ name: "", designation: "", mobile_no: "", email: "" }],
                    pan: "",
                    tan: "",
                    cin: "",
                    llpin: "",
                    attachments: {
                        canceled_cheque: null,
                        gstin_certificate: null,
                        others: null,
                    }
                });
            }
        } catch (error) {
            console.error("Error creating account:", error.response?.data || error);
            setError(error.response?.data?.message || "An error occurred while creating the account.");
        }
    };



    const HandlewView = async () => {
        setView(prevView => !prevView); // Toggle the view state
    };


    console.log(" formData.additionalPlaceOfAddress", formData.additionalPlaceOfAddress);

    return (
        <div className="flex justify-center items-start min-h-screen  ">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded shadow-lg  flex-col flex flex-wrap p-10 gap-10"
            >
                <h1>Bank</h1>
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
                            disabled={disab}
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

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Registered for GST?</label>
                        <div>
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    name="registrationType"
                                    value="Yes"
                                    checked={formData.registrationType === true}
                                    onChange={handleRegistrationTypeChange}
                                    className="mr-2"
                                />
                                Yes
                            </label>
                            <label>
                                <input
                                    disabled
                                    type="radio"
                                    name="registrationType"
                                    value="No"
                                    // checked={formData.registrationType === false}
                                    // onChange={(e) => {
                                    //     handleRegistrationTypeChange(e);
                                    //     handleclearGstDetails(e);
                                    // }}
                                    className="mr-2"
                                />
                                No
                            </label>

                        </div>
                    </div>
                    {formData.registrationType && (
                        <div className="mb-4 col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">GSTIN</label>
                            <div className="flex">
                                <input
                                    disabled={disab}
                                    type="text"
                                    name="gstin"
                                    value={formData.gstin}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                />
                                <button
                                    disabled={disab}
                                    type="button"
                                    onClick={handleGstValidate}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded"
                                >
                                    Validate
                                </button>
                            </div>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </div>
                    )}

                    {gstDetails && (
                        <div className="col-span-2 bg-gray-100 p-4 rounded mb-4">
                            <h2 className="text-lg font-bold mb-2">GST Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p><strong>Trade Name:</strong> {gstDetails.tradeNam || gstDetails.legalName}</p>
                                    <p><strong>PAN:</strong> {gstDetails?.gstin.substring(2, 12)}</p>
                                    <p><strong>Constitution of Business:</strong> {gstDetails?.ctb}</p>
                                    <p><strong>Principal Place of Address:</strong> {`${gstadd?.bno} ${gstadd?.st} ${gstadd?.locality} ${gstadd?.dst} ${gstadd?.stcd} ${gstadd?.pncd}`}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleCopyDetails}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-4 rounded"
                            >
                                Copy Details
                            </button>
                        </div>
                    )}

                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Principal Place of Address</label>

                        <input
                            disabled={disab}
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
                            disabled={disab}
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
                            disabled={disab}
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
                            disabled={disab}
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
                            disabled={disab}
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
                            disabled={disab}
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
                            disabled={disab}
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
                            disabled={disab}
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
                            disabled={disab}
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
                            disabled={disab}
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

                    <button type="button" className="bg-blue-500 text-white p-2 rounded-lg mb-4" onClick={HandlewView}>
                        {view ? "Hide Additional Address" : "Show Additional Address"}
                    </button>


                    {(view && formData.additionalPlaceOfAddress.length === 0) && (
                        <>
                            <div className="mb-4">No addtional address</div>
                        </>
                    )}


                    {(view && formData.additionalPlaceOfAddress.length > 0) && (
                        <div className="col-span-2 bg-gray-50 p-4 rounded mb-4">
                            <h3 className="text-lg font-semibold mb-2">Additional Address</h3>

                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                                onChange={(e) => {
                                    const selectedAddress = formData.additionalPlaceOfAddress[e.target.value];
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        // Store only the selected address in a single field
                                        additionalPlaceOfAddress: selectedAddress, // Assuming you'll add this field in formData
                                    }));
                                }}
                            >
                                <option value="">Select Additional Address</option>
                                {formData.additionalPlaceOfAddress.map((address, index) => (
                                    <option key={index} value={index}>
                                        {address.addr.bnm || 'N/A'}, {address.addr.st || 'N/A'}, {address.addr.loc || 'N/A'}
                                    </option>
                                ))}
                            </select>

                            {formData.additionalPlaceOfAddress.length === 0 && (
                                <p className="text-gray-500">No additional addresses available.</p>
                            )}
                        </div>
                    )}


                    {!formData.registrationType && (
                        <>
                            {formData.additionalPlaceOfAddress.map((address, index) => (
                                <div key={index} className="col-span-2 bg-gray-50 p-4 rounded mb-4">
                                    <h3 className="text-lg font-semibold mb-2">Additional Address {index + 1}</h3>

                                    <input
                                        type="text"
                                        placeholder="Building Name"
                                        value={address.addr.bnm} // Accessing addr object
                                        onChange={(e) => handleArrayChange(e, index, "bnm", "additionalPlaceOfAddress")}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Street"
                                        value={address.addr.st} // Accessing addr object
                                        onChange={(e) => handleArrayChange(e, index, "st", "additionalPlaceOfAddress")}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={address.addr.loc} // Accessing addr object
                                        onChange={(e) => handleArrayChange(e, index, "loc", "additionalPlaceOfAddress")}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Building Number"
                                        value={address.addr.bno} // Accessing addr object
                                        onChange={(e) => handleArrayChange(e, index, "bno", "additionalPlaceOfAddress")}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="District"
                                        value={address.addr.dst} // Accessing addr object
                                        onChange={(e) => handleArrayChange(e, index, "dst", "additionalPlaceOfAddress")}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Locality"
                                        value={address.addr.locality} // Accessing addr object
                                        onChange={(e) => handleArrayChange(e, index, "locality", "additionalPlaceOfAddress")}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        value={address.addr.pncd} // Accessing addr object
                                        onChange={(e) => handleArrayChange(e, index, "pncd", "additionalPlaceOfAddress")}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Landmark"
                                        value={address.addr.landMark} // Accessing addr object
                                        onChange={(e) => handleArrayChange(e, index, "landMark", "additionalPlaceOfAddress")}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={address.addr.stcd} // Accessing addr object
                                        onChange={(e) => handleArrayChange(e, index, "stcd", "additionalPlaceOfAddress")}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Floor Number"
                                        value={address.addr.flno} // Accessing addr object
                                        onChange={(e) => handleArrayChange(e, index, "flno", "additionalPlaceOfAddress")}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
                                    />

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => deleteAdditionalAddress(index)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded mt-2"
                                    >
                                        Delete Address
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addAdditionalAddress}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                            >
                                Add Additional Address
                            </button>
                        </>
                    )}








                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Constitution of Business</label>
                        <select
                            name="constitutions_of_bussiness"
                            value={formData.constitutions_of_bussiness}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            disabled={disab}
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
                                {/* Delete Button: Only show if there's more than one contact person */}
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

                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Internet Banking User
                            </label>
                            <input
                                type="checkbox"
                                name="internet_banking_user"
                                checked={formData.bank.internet_banking_user}
                                onChange={handleInternetBankingUserChange}
                                className="mr-2"
                            />
                            <span>Yes</span>
                        </div>

                        {formData.bank.internet_banking_user && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Internet Banking Username
                                    </label>
                                    <input
                                        type="text"
                                        name="internet_banking_user_name"
                                        value={formData.bank.internet_banking_user_name}
                                        onChange={handleInternetBankingUserChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Login Password</label>
                                    <input
                                        type="password"
                                        name="internet_banking_user_login_password"
                                        value={formData.bank.internet_banking_user_login_password}
                                        onChange={handleInternetBankingUserChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Transaction Password</label>
                                    <input
                                        type="password"
                                        name="internet_banking_user_transaction_password"
                                        value={formData.bank.internet_banking_user_transaction_password}
                                        onChange={handleInternetBankingUserChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                    />
                                </div>
                            </>
                        )}
                    </>


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
                                disabled={disab}
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
                            <label className="block text-gray-700 text-sm font-bold mb-2">Cancelled Cheque</label>
                            <input
                                type="file"
                                name="canceled_cheque"
                                onChange={handleFileChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">GSTIN Certificate</label>
                            <input
                                type="file"
                                name="gstin_certificate"
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

export default Bank;
