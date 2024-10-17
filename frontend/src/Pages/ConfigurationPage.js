import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const voucherTypeOptions = {
  Sales: "S",
  Purchase: "P",
  "Sales Return": "SR",
  "Purchase Return": "PR",
  Payment: "PY",
  Receipt: "RE",
  Contra: "CO",
  "Material Issued": "MI",
  "Material Received": "MR",
};

export default function VoucherConfigForm() {
  const [formData, setFormData] = useState({
    voucherType: "",
    autoNumbering: false,
    withTax: false,
    separator: "/",
    numberOfParts: 1,
    voucherParts: [],
    resetNumbering: "Never",
    voucherNumber: "",
    year: "",
  });

  const [separatorDigits, setSeparatorDigits] = useState(1);
  const [yearType, setYearType] = useState("");
  const [selectedParts, setSelectedParts] = useState([]);
  const [voucherNo, setVoucherNo] = useState('');
  const [charCount, setCharCount] = useState(0); // For tracking character count

  const maxLength = 16;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleVoucherPartChange = (index, e) => {
    const { name, value } = e.target; // Destructure the event target

    // Update the parts of the voucher
    const updatedParts = formData.voucherParts.map((part, idx) =>
      idx === index ? { ...part, [name]: value } : part
    );

    // Update formData with the modified parts
    setFormData((prevData) => ({ ...prevData, voucherParts: updatedParts }));

    // Handle the case when 'partType' is changed
    if (name === 'partType') {
      const updatedSelectedParts = [...selectedParts];
      updatedSelectedParts[index] = value; // Update selected part type for this index
      setSelectedParts(updatedSelectedParts);
    }

    // Update character count based on the changes made to the voucher parts
    updateCharCount(updatedParts, formData.separator);
  };


  const partTypeOptions = ["Type", "Year", "Starting Number", "Abbreviation"];

  const handleYearChange = (e, index) => {
    const selectedYearType = e.target.value;
    setYearType(selectedYearType);

    const updatedParts = formData.voucherParts.map((part, idx) =>
      idx === index ? { ...part, value: selectedYearType } : part
    );

    setFormData((prevData) => ({
      ...prevData,
      year: selectedYearType,
      voucherParts: updatedParts,
    }));

    updateCharCount(updatedParts, formData.separator); // Update character count on year change
  };

  const handleVoucherTypeChange = (e) => {
    const selectedVoucherType = e.target.value;
    const updatedParts = formData.voucherParts.map(part =>
      part.partType === 'Type' ? { ...part, value: voucherTypeOptions[selectedVoucherType] } : part
    );
    setFormData((prevData) => ({
      ...prevData,
      voucherType: selectedVoucherType,
      voucherParts: updatedParts,
    }));

    updateCharCount(updatedParts, formData.separator); // Update character count on voucher type change
  };

  const handleGenerateVoucherNo = () => {
    const { voucherParts, separator } = formData;
    const voucherPartsValues = voucherParts.map(part => part.value);
    const generatedVoucherNo = voucherPartsValues.join(separator);

    if (generatedVoucherNo.length > maxLength) {
      Swal.fire('Error', 'Voucher number exceeds the maximum length of 16 characters.', 'error');
    } else {
      setVoucherNo(generatedVoucherNo);
    }
  };

  const updateCharCount = (voucherParts, separator) => {
    const totalLength = voucherParts
      .map(part => part.value.length)
      .reduce((sum, current) => sum + current, 0);

    // Count the number of separators between non-empty parts
    const nonEmptyPartsCount = voucherParts.filter(part => part.value !== '').length;
    const separatorCount = nonEmptyPartsCount > 1 ? nonEmptyPartsCount - 1 : 0;

    setCharCount(totalLength + separatorCount * separator.length); // Update the total character count including separators
  };

  const availableOptions = (index) => {
    return partTypeOptions.filter(option => !selectedParts.includes(option) || selectedParts[index] === option);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5004/api/voucher/create",
        formData,
        { withCredentials: true }
      );
      console.log("response", response.data);
      Swal.fire("Success", "Voucher configuration saved successfully", "success");
    } catch (error) {
      // Check if the error response exists and has a message
      const errorMessage = error.response
        ? error.response.data.message || error.message
        : "An unexpected error occurred."; // Fallback message if no response

      Swal.fire("Error", errorMessage, "error");
    }
  };

  useEffect(() => {
    const { voucherParts, separator } = formData;
  
    // Map over voucherParts to get the values and join them with the separator
    const voucherPartsValues = voucherParts.map(part => part.value);
    const generatedVoucherNo = voucherPartsValues.join(separator);
  
    // Check if the generated voucher number exceeds the maximum length (16 characters)
    if (generatedVoucherNo.length > maxLength) {
      setVoucherNo(''); // Clear voucher number if it exceeds the max length
      Swal.fire('Error', 'Voucher number exceeds the maximum length of 16 characters.', 'error');
    } else {
      setVoucherNo(generatedVoucherNo); // Dynamically update the voucher number
    }
  }, [formData.voucherParts, formData.separator]); // Run effect when voucherParts or separator changes
  
  // Separate useEffect to manage voucherParts based on autoNumbering and numberOfParts
  useEffect(() => {
    if (formData.autoNumbering) {
      // Use formData.numberOfParts to decide the number of voucher parts
      const numParts = formData.numberOfParts;
  
      // Create an array with the correct number of parts
      const newVoucherParts = Array.from({ length: numParts }, () => ({
        partType: "",
        value: "",
      }));
  
      // Update formData with the new voucherParts
      setFormData((prevData) => ({
        ...prevData,
        voucherParts: newVoucherParts,
      }));
    } else {
      // Clear voucherParts when autoNumbering is false
      setFormData((prevData) => ({
        ...prevData,
        voucherParts: [],
      }));
    }
  }, [formData.autoNumbering, formData.numberOfParts]); // Run effect when autoNumbering or numberOfParts changes
  




  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Voucher Configuration</h1>

      {/* Voucher Type Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Voucher Type</label>
        <select
          name="voucherType"
          value={formData.voucherType}
          onChange={handleVoucherTypeChange}
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
        >
          <option value="">Select Voucher Type</option>
          {Object.keys(voucherTypeOptions).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Auto Numbering & With Tax */}
      <div className="flex items-center gap-2 justify-between">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Auto Numbering</label>
          <input
            type="checkbox"
            name="autoNumbering"
            checked={formData.autoNumbering}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          Enable Auto Numbering
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">With Tax</label>
          <input
            type="checkbox"
            name="withTax"
            checked={formData.withTax}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          Apply With Tax
        </div>
      </div>

      {formData.autoNumbering ? (
        <div>
          {/* Separator */}
          <div className="flex items-center gap-2">
            <div className="mb-4 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">Separator</label>
              <select
                name="separator"
                value={formData.separator}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
                required
              >
                <option value="/">/</option>
                <option value="-">-</option>
              </select>
            </div>

            {/* No of Separators */}
            <div className="mb-4 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2">No of Separators</label>
              <input
                type="number"
                name="numberOfParts"
                value={formData.numberOfParts}  // Ensure this is correctly linked
                onChange={(e) => {
                  const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);

                  // Check if value is valid for both numberOfParts and separatorDigits
                  if (value === '' || (value >= 1 && value <= 4)) {
                    setFormData((prevData) => ({
                      ...prevData,
                      numberOfParts: value, // Update numberOfParts
                    }));
                    setSeparatorDigits(value); // Update separatorDigits as well
                  } else if (value > 4) {
                    Swal.fire('Error', 'You can enter only a maximum of 4 separators.', 'error');
                  }
                }}
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
                placeholder="Enter Number of Separators"
                required
              />
            </div>

          </div>

          {/* Voucher Parts */}
          <div>
            <label className="block mb-2 text-sm font-bold">Voucher Parts</label>
            {formData.voucherParts.slice(0, separatorDigits).map((part, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2 text-xs">
                {part.partType === "Year" ? (
                  <div className="w-1/3">
                    <select
                      name="yearType"
                      value={yearType}
                      onChange={(e) => handleYearChange(e, index)}
                      className="bg-slate-100 text-black w-full border border-gray-300 p-2 rounded-md focus:outline-none"
                    >
                      <option value="" >Select Year Type</option>
                      <option value="24-25">YY-YY</option>
                      <option value="2024-25">YYYY-YY</option>
                    </select>
                  </div>
                ) : (
                  <select
                    name="partType"
                    value={part.partType}
                    onChange={(e) => handleVoucherPartChange(index, e)}
                    required
                    className="w-1/3 border px-2 py-1 rounded-lg"
                  >
                    <option value="">Select Part Type</option>
                    {availableOptions(index).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                <input
                  type="text"
                  name="value"
                  placeholder="Value"
                  value={part.partType === "Year" ? yearType : part.value}
                  onChange={(e) => handleVoucherPartChange(index, e)}
                  required
                  readOnly={part.partType === "Year"}
                  className="w-2/3 border px-2 py-1 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        null
      )
      }

      {/* Reset Numbering */}
      <div className="flex items-center gap-2">
        <div className="mb-4 w-full">
          <label className="block text-gray-700 text-sm font-bold mb-2">Reset Numbering</label>
          <select
            name="resetNumbering"
            value={formData.resetNumbering}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
          >
            <option value="Never">Never</option>
            <option value="Daily">Daily</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      {formData.autoNumbering && (
        <>
          <div className="absolute top-20 right-20 bg-violet-400 text-white mb-4 p-6 text-lg">
            {/* Display Character Count */}
            Character Count: {charCount} / {maxLength}
            <p>{maxLength - charCount < 0 ? "Exceeds maximum length!" : `Remaining: ${maxLength - charCount}`}</p>
            <div className="mt-4 p-4 bg-gray-100 rounded text-black text-md">
              <div className='text-xs font-semibold text-black'>Generated Voucher Pattern: </div> {voucherNo}
            </div>
          </div>
        </>

      )}


      {/* Submit & Generate Buttons */}
      <div className="flex justify-between">
        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
          Save Configuration
        </button>
      </div>
    </form >
  );
}
