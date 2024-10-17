import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import AccountGroupModify from './AccountGroupComp/AccountGroupModify';
import AccountGrouplist from './AccountGroupComp/AccountGrouplist'; 
import Accountgrps from './AccountGroupComp/Accountgrps'; 
const options = ['Add Group', 'List', 'Modify'];

export default function AccountGroup({ AddAccount, List, Modify }) {
  const [selectedOption, setSelectedOption] = useState('Add Group');
  const { group } = useParams();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch account data on component mount
  const fetchAccountData = async () => {
    try {
      const response = await axios.get('http://localhost:5004/api/account/get-all-accounts', {
        withCredentials: true,
      });
      if (response.data && response.data.accounts) {
        setAccounts(response.data.accounts);
      } else {
        setError('No account data found.');
      }
      setLoading(false);
    } catch (err) {
      setError('Error fetching account data: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
    if (AddAccount) {
      setSelectedOption('Add Group');
    } else if (List) {
      setSelectedOption('List');
    } else if (Modify) {
      setSelectedOption('Modify');
    }
  }, [AddAccount, List, Modify]);

  // Render based on selected option
  return (
    <div className='w-full flex items-center justify-center p-10'>
      <div className='w-[70vw]'>
        <div className='w-full'>
          <div className='flex w-full justify-around text-lg bg-neutral-100 p-1 items-center'>
            {options.map((option) => (
              <div
                key={option}
                onClick={() => setSelectedOption(option)}
                className={`cursor-pointer p-2 rounded-lg ${selectedOption === option ? 'bg-blue-800 text-white' : 'text-black'} w-52 text-center`}
              >
                {option}
              </div>
            ))}
          </div>

          <div className="container mx-auto mt-10">
            {/* Add Account Section */}
            {selectedOption === 'Add Group' && (
              <>
                <h2 className="text-2xl font-bold mb-4">Create {group}</h2>
                <Accountgrps />
                <button
                  onClick={()=>{setSelectedOption('Add Group')}}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mt-4 rounded"
                >
                  Back to Accounts
                </button>
              </>
            )}

            {/* Modify Account Section */}
            {selectedOption === 'Modify' && (
              <>
                <h2 className="text-2xl font-bold mb-4">Modify Account</h2>
                <AccountGroupModify />
                <button
                  onClick={()=>{setSelectedOption('Add Group')}}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mt-4 rounded"
                >
                  Back to Accounts
                </button>
              </>
            )}

            {/* List Account Section */}
            {selectedOption === 'List' && (
              <>
                <AccountGrouplist />
                <button
                  onClick={()=>{setSelectedOption('Add Group')}}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mt-4 rounded"
                >
                  Back to Accounts
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
