import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function GeneralConfigForm() {
    const [formData, setFormData] = useState({
        accountConfig: {
            multipleAccountAliases: false,
        },
        inventoryConfig: {
            qtyDecimalPlace: 2,
            discountDecimalPlace: 2,
            maintainMultipleItemAlias: false,
            stockValuationMethod: 'Weighted Average',
            maintainStock: true,
        },
        isLocked: false,
    });

    // Handle changes in the form
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Check for nested objects and handle state updates accordingly
        if (name.includes('.')) {
            const keys = name.split('.');
            setFormData((prevData) => ({
                ...prevData,
                [keys[0]]: {
                    ...prevData[keys[0]],
                    [keys[1]]: type === 'checkbox' ? checked : value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    // Handle submission of the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:5004/api/config/create',
                formData,
                { withCredentials: true }
            );
            console.log('response', response.data);
            Swal.fire('Success', 'Configuration saved successfully!', 'success');
        } catch (error) {
            const errorMessage = error.response
                ? error.response.data.message || error.message
                : 'An unexpected error occurred.';
            Swal.fire('Error', errorMessage, 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6">General Configuration</h1>

            {/* Account Configuration */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Account Configuration</h2>
                <label className="block text-gray-700 mb-2">
                    <input
                        type="checkbox"
                        name="accountConfig.multipleAccountAliases"
                        checked={formData.accountConfig.multipleAccountAliases}
                        onChange={handleChange}
                        className="mr-2 leading-tight"
                    />
                    Enable Multiple Account Aliases
                </label>


                <label className="block text-gray-700 mb-2">
                    <input
                        type="checkbox"
                        name="inventoryConfig.maintainMultipleItemAlias"
                        checked={formData.inventoryConfig.maintainMultipleItemAlias}
                        onChange={handleChange}
                        className="mr-2 leading-tight"
                    />
                    Maintain Multiple Item Alias
                </label>

                <label className="block text-gray-700 mb-2">
                    <input
                        type="checkbox"
                        name="inventoryConfig.maintainStock"
                        checked={formData.inventoryConfig.maintainStock}
                        onChange={handleChange}
                        className="mr-2 leading-tight"
                    />
                    Maintain Stock
                </label>

            </div>

            {/* Inventory Configuration */}
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Inventory Configuration</h2>
                <div className='flex items-center gap-2 justify-between'>
                    <div className='w-full'>
                        <label className="block text-gray-700 mb-2">Quantity Decimal Place:</label>
                        <input
                            type="number"
                            name="inventoryConfig.qtyDecimalPlace"
                            value={formData.inventoryConfig.qtyDecimalPlace}
                            onChange={handleChange}
                            min="0"
                            max="2"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none w-full"
                        />
                    </div>

                    <div className='w-full'>
                        <label className="block text-gray-700 mb-2">Discount Decimal Place:</label>
                        <input
                            type="number"
                            name="inventoryConfig.discountDecimalPlace"
                            value={formData.inventoryConfig.discountDecimalPlace}
                            onChange={handleChange}
                            min="0"
                            max="2"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none w-full"
                        />
                    </div>
                </div>
            </div>

            <div className='mb-4'>
                <label className="block text-gray-700 mb-2">Stock Valuation Method:</label>
                <select
                    name="inventoryConfig.stockValuationMethod"
                    value={formData.inventoryConfig.stockValuationMethod}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none w-full"
                >
                    <option value="FIFO">FIFO</option>
                    <option value="LIFO">LIFO</option>
                    <option value="Last Purchase">Last Purchase</option>
                    <option value="Last Qty In">Last Qty In</option>
                    <option value="Last Sale">Last Sale</option>
                    <option value="Self Evaluation">Self Evaluation</option>
                    <option value="Weighted Average">Weighted Average</option>
                    <option value="Avg. Price (Qty. In)">Avg. Price (Qty. In)</option>
                    <option value="Avg. Price (Invoice)">Avg. Price (Invoice)</option>
                </select>
            </div>


            <button
                type="submit"
                className="bg-green-500 text-white font-bold py-2 px-4 rounded"
            >
                Submit
            </button>
        </form>
    );
}
