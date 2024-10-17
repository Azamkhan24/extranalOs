import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Accountgrps = () => {
  const [formData, setFormData] = useState({
    name: '',
    primary: false,
    Nature_Of_Group: '',
    Under: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [availableGroups, setAvailableGroups] = useState([]); // Store groups for "Under" field
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch available groups for "Under" field
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5004/api/account-group/get-all-group', {
          withCredentials: true,
        });
        setAvailableGroups(response.data.data || []); // Populate groups for the "Under" field
      } catch (error) {
        setErrorMessage('Error fetching available groups');
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    fetchGroups();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Frontend validation for conditional fields
    if (formData.primary && !formData.Nature_Of_Group) {
      setErrorMessage("Please select the 'Nature of Group' when 'Primary Group' is checked.");
      return;
    }

    if (!formData.primary && !formData.Under) {
      setErrorMessage("Please select the 'Under' field when 'Primary Group' is not checked.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        primary: formData.primary,
        ...(formData.primary ? { Nature_Of_Group: formData.Nature_Of_Group } : { Under: formData.Under }),
      };

      const response = await axios.post('http://localhost:5004/api/account-group/create-group', payload, {
        withCredentials: true,
      });

      setSuccessMessage('Account created successfully!');
      setFormData({
        name: '',
        primary: false,
        Nature_Of_Group: '',
        Under: '',
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Error creating account';
      setErrorMessage(message);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Groups</h2>
      {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}
      
      {loading ? (
        <p className="text-gray-500 text-center">Loading available groups...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter Group name"
              required
            />
          </div>

          {/* Primary Group Checkbox */}
          <div>
            <label className="block text-gray-700 font-medium">Primary Group</label>
            <input
              type="checkbox"
              name="primary"
              checked={formData.primary}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span>Is this a primary group?</span>
          </div>

          {/* Nature of Group (if Primary Group is selected) */}
          {formData.primary && (
            <div>
              <label className="block text-gray-700 font-medium">Nature of Group</label>
              <select
                name="Nature_Of_Group"
                value={formData.Nature_Of_Group}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Nature</option>
                <option value="Liabilities">Liabilities</option>
                <option value="Assets">Assets</option>
                <option value="Income">Income</option>
                <option value="Expenses">Expenses</option>
              </select>
            </div>
          )}

          {/* Under Field (if Primary Group is not selected) */}
          {!formData.primary && (
            <div>
              <label className="block text-gray-700 font-medium">Under</label>
              <select
                name="Under"
                value={formData.Under}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select Group</option>
                {availableGroups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Create Group
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Accountgrps;
