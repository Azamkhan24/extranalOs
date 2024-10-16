import React, { useState } from 'react';
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

export default function ConfigurationPage() {
  const partTypeOptions = ["Type", "Number", "Abbreviation"];

  const [separatorDigits, setSeparatorDigits] = useState(0);

  const [formData, setFormData] = useState({
    voucherNumber: '',
    voucherType: '',
    year: '',
    separator: '/',
    voucherParts: [
      { partType: 'Type', value: '' },
      { partType: 'Number', value: '' },
      { partType: 'Abbreviation', value: '' }
    ],
  });

  const [yearType, setYearType] = useState('24-25');
  const [voucherNo, setVoucherNo] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'voucherNumber' && value.length > 4) {
      Swal.fire('Error', 'Voucher number cannot exceed 4 digits.', 'error');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVoucherTypeChange = (e) => {
    const selectedVoucherType = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      voucherType: selectedVoucherType,
      voucherParts: prevData.voucherParts.map(part =>
        part.partType === 'Type' ? { ...part, value: voucherTypeOptions[selectedVoucherType] } : part
      ),
    }));
  };

  const handleYearTypeChange = (e) => {
    const selectedYearType = e.target.value;
    setYearType(selectedYearType);
    setFormData((prevData) => ({
      ...prevData,
      year: '',
    }));
  };

  const handleVoucherPartChange = (index, e) => {
    const { name, value } = e.target;
    const updatedParts = formData.voucherParts.map((part, idx) =>
      idx === index ? { ...part, [name]: value } : part
    );
    setFormData((prevData) => ({ ...prevData, voucherParts: updatedParts }));
  };

  const handleGenerateVoucherNo = () => {
    const {voucherNumber, year, separator, voucherParts } = formData;

    if (!voucherNumber || !year || voucherParts.length < separatorDigits) {
      Swal.fire('Error', 'Please fill out all the required fields.', 'error');
      return;
    }

    const voucherPartsValues = voucherParts.slice(0, separatorDigits).map(part => part.value);
    const generatedVoucherNo = [...voucherPartsValues, voucherNumber].join(separator);

    if (generatedVoucherNo.length > 16) {
      Swal.fire('Error', 'Voucher number exceeds the maximum length of 16 characters.', 'error');
    } else {
      setVoucherNo(generatedVoucherNo);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Generate Voucher Number</h2>

      <form>
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

        {/* Separator Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">No of Separators</label>
          <input
            type="number"
            name="separatorDigits"
            value={separatorDigits}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (value <= 3) {
                setSeparatorDigits(value);
              }
            }}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
            placeholder="Enter Number of Separators"
            required
          />
        </div>

        {/* Voucher Parts */}
        <div>
          <label className="block mb-2 text-sm font-bold">Voucher Parts</label>
          {formData.voucherParts.slice(0, separatorDigits).map((part, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <select
                name="partType"
                value={part.partType}
                onChange={(e) => handleVoucherPartChange(index, e)}
                required
                className="w-1/3 border px-2 py-1 rounded-lg"
              >
                {partTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="value"
                placeholder="Value"
                value={part.value}
                onChange={(e) => handleVoucherPartChange(index, e)}
                required
                className="w-2/3 border px-2 py-1 rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Year Type and Year Input */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="mb-4 w-1/3">
            <select
              name="yearType"
              value={yearType}
              onChange={handleYearTypeChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
            >
              <option value="24-25">YY-YY</option>
              <option value="2024-25">YYYY-YY</option>
            </select>
          </div>

          <div className='w-2/3'>
            {yearType === '24-25' && (
              <div className="mb-4">
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length > 2) {
                      value = value.slice(0, 2) + '-' + value.slice(2, 4);
                    }
                    if (value.length <= 5) {
                      setFormData({ ...formData, year: value });
                    }
                  }}
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
                  placeholder="Enter Year (e.g., 24-25)"
                  maxLength={5}
                  required
                />
              </div>
            )}

            {yearType === '2024-25' && (
              <div className="mb-4">
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length > 4) {
                      value = value.slice(0, 4) + '-' + value.slice(4, 6);
                    }
                    if (value.length <= 7) {
                      setFormData({ ...formData, year: value });
                    }
                  }}
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
                  placeholder="Enter Year (e.g., 2024-25)"
                  maxLength={7}
                  required
                />
              </div>
            )}
          </div>
        </div>

        {/* Voucher Number Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Voucher Number (max 4 digits)</label>
          <input
            type="number"
            name="voucherNumber"
            value={formData.voucherNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
            placeholder="Enter Voucher Number"
            required
          />
        </div>

        {/* Separator Dropdown */}
        <div className="mb-4">
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

        <button
          type="button"
          onClick={handleGenerateVoucherNo}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Generate Voucher No
        </button>
      </form>

      {/* Display Generated Voucher Number */}
      {voucherNo && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <strong>Generated Voucher Number: </strong> {voucherNo}
        </div>
      )}
    </div>
  );
}
