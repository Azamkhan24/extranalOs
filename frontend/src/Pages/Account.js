import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SundryDebtor from './AccountType/SundryDebtor';
import SundryCreditor from './AccountType/SundryCreditor';
import Bank from './AccountType/Bank';
import BankOdAccount from './AccountType/BankOdAccount';
import CapitalAccount from './AccountType/CapitalAccount';
import CashInHand from './AccountType/CashInHand';
import CurrentAssets from './AccountType/CurrentAssets';
import CurrentLiabilities from './AccountType/CurrentLiabilities';
import LoanAndAdvance from './AccountType/LoanAndAdvance';
import DutiesAndTaxes from './AccountType/DutiesAndTaxes';
import ExpensesDirect from './AccountType/ExpensesDirect';
import ExpensesIndirect from './AccountType/ExpensesIndirect';
import IncomeIndirect from './AccountType/IncomeIndirect';
import FixedAssets from './AccountType/FixedAssets';
import Investments from './AccountType/Investments';
import LoanLiability from './AccountType/LoanLiability';
import ProvisonsExpenses from './AccountType/ProvisonsExpenses';
import SecuredLoan from './AccountType/SecuredLoan';
import UnsecuredLoan from './AccountType/UnsecuredLoan';
import SecuritiesAndDeposite from './AccountType/SecuritiesAndDeposite';
import SuspenseAccount from './AccountType/SuspenseAccount';
import Sale from './AccountType/Sale';
import Surplus from './AccountType/Surplus';
import Purchase from './AccountType/Purchase';
import StockInHand from './AccountType/StockInHand';
import ListAccount from './AccountComp/ListAccount';
import axios from "axios";


// For update components
import SundryDebtorUpdate from './AccountUpdate/SundryDebtorUpdate';
import SundryCreditorUpdate from './AccountUpdate/SundryCreditorUpdate';
import BankUpdate from './AccountUpdate/BankUpdate';
import BankOdAccountUpdate from './AccountUpdate/BankOdAccountUpdate';
import CapitalAccountUpdate from './AccountUpdate/CapitalAccountUpdate';
import CashInHandUpdate from './AccountUpdate/CashInHandUpdate';
import CurrentAssetsUpdate from './AccountUpdate/CurrentAssetsUpdate';
import CurrentLiabilitiesUpdate from './AccountUpdate/CurrentLiabilitiesUpdate';
import LoanAndAdvanceUpdate from './AccountUpdate/LoanAndAdvanceUpdate';
import DutiesAndTaxesUpdate from './AccountUpdate/DutiesAndTaxesUpdate';
import ExpensesDirectUpdate from './AccountUpdate/ExpensesDirectUpdate';
import ExpensesIndirectUpdate from './AccountUpdate/ExpensesIndirectUpdate';
import IncomeIndirectUpdate from './AccountUpdate/IncomeIndirectUpdate';
import FixedAssetsUpdate from './AccountUpdate/FixedAssetsUpdate';
import InvestmentsUpdate from './AccountUpdate/InvestmentsUpdate';
import LoanLiabilityUpdate from './AccountUpdate/LoanLiabilityUpdate';
import ProvisonsExpensesUpdate from './AccountUpdate/ProvisonsExpensesUpdate';
import SecuredLoanUpdate from './AccountUpdate/SecuredLoanUpdate';
import UnsecuredLoanUpdate from './AccountUpdate/UnsecuredLoanUpdate';
import SecuritiesAndDepositeUpdate from './AccountUpdate/SecuritiesAndDepositeUpdate';
import SuspenseAccountUpdate from './AccountUpdate/SuspenseAccountUpdate';
import SaleUpdate from './AccountUpdate/SaleUpdate';
import SurplusUpdate from './AccountUpdate/SurplusUpdate';
import PurchaseUpdate from './AccountUpdate/PurchaseUpdate';
import StockInHandUpdate from './AccountUpdate/StockInHandUpdate';

const options = ['Add Account', 'List', 'Modify'];

export default function Account({ AddAccount, List, Modify }) {
  const [selectedOption, setSelectedOption] = useState('Add Account');
  const { group } = useParams();
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState(''); // For Modify dropdown

  // Fetch account data on component mount
  const fetchAccountData = async () => {
    try {
      const response = await axios.get('http://localhost:5004/api/account/get-all-accounts', {
        withCredentials: true, // Include credentials in the request
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
    // Set the selected option based on props passed
    if (AddAccount) {
      setSelectedOption('Add Account');
    } else if (List) {
      setSelectedOption('List');
    } else if (Modify) {
      setSelectedOption('Modify');
    }

    setSelectedAccountId(null);
  }, [AddAccount, List, Modify, setSelectedOption]);



  // Function to render the appropriate component based on the group for adding an account
  const renderComponentByGroup = (group) => {
    switch (group) {
      case "Sundry Debtors":
        return <SundryDebtor accountData={accountData} setAccountData={setAccountData} />;
      case "Sundry Creditors":
        return <SundryCreditor accountData={accountData} setAccountData={setAccountData} />;
      case "Bank Account":
        return <Bank accountData={accountData} setAccountData={setAccountData} />;
      case "Bank O/D Account":
        return <BankOdAccount accountData={accountData} setAccountData={setAccountData} />;
      case "Capital Account":
        return <CapitalAccount accountData={accountData} setAccountData={setAccountData} />;
      case "Cash-in-hand":
        return <CashInHand accountData={accountData} setAccountData={setAccountData} />;
      case "Current Assets":
        return <CurrentAssets accountData={accountData} setAccountData={setAccountData} />;
      case "Current Liabilities":
        return <CurrentLiabilities accountData={accountData} setAccountData={setAccountData} />;
      case "Loans & Advances (liabilities)":
        return <LoanAndAdvance accountData={accountData} setAccountData={setAccountData} />;
      case "Duties & Taxes":
        return <DutiesAndTaxes accountData={accountData} setAccountData={setAccountData} />;
      case "Expenses (direct)":
        return <ExpensesDirect accountData={accountData} setAccountData={setAccountData} />;
      case "Expenses (Indirect)":
        return <ExpensesIndirect accountData={accountData} setAccountData={setAccountData} />;
      case "Income (indirect)":
        return <IncomeIndirect accountData={accountData} setAccountData={setAccountData} />;
      case "Fixed Assets":
        return <FixedAssets accountData={accountData} setAccountData={setAccountData} />;
      case "Investments":
        return <Investments accountData={accountData} setAccountData={setAccountData} />;
      case "Loan Liability":
        return <LoanLiability accountData={accountData} setAccountData={setAccountData} />;
      case "Expenses Payable":
        return <ProvisonsExpenses accountData={accountData} setAccountData={setAccountData} />;
      case "Secured Loan":
        return <SecuredLoan accountData={accountData} setAccountData={setAccountData} />;
      case "Unsecured Loan":
        return <UnsecuredLoan accountData={accountData} setAccountData={setAccountData} />;
      case "Other Current Assets":
        return <SecuritiesAndDeposite accountData={accountData} setAccountData={setAccountData} />;
      case "Suspense Account":
        return <SuspenseAccount accountData={accountData} setAccountData={setAccountData} />;
      case "Sales":
        return <Sale accountData={accountData} setAccountData={setAccountData} />;
      case "Surplus":
        return <Surplus accountData={accountData} setAccountData={setAccountData} />;
      case "Purchase":
        return <Purchase accountData={accountData} setAccountData={setAccountData} />;
      case "Stock-in-hand":
        return <StockInHand accountData={accountData} setAccountData={setAccountData} />;
      default:
        return <div>Group component not found</div>;
    }
  };

  // Function to render the appropriate component based on the group for updating an account
  const renderComponentByGroupUpdate = (group) => {
    switch (group) {
      case "Sundry Debtors":
        return <SundryDebtorUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Sundry Creditors":
        return <SundryCreditorUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Bank Account":
        return <BankUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Bank O/D Account":
        return <BankOdAccountUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Capital Account":
        return <CapitalAccountUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Cash-in-hand":
        return <CashInHandUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Current Assets":
        return <CurrentAssetsUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Current Liabilities":
        return <CurrentLiabilitiesUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Loans & Advances (liabilities)":
        return <LoanAndAdvanceUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Duties & Taxes":
        return <DutiesAndTaxesUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Expenses (direct)":
        return <ExpensesDirectUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Expenses (Indirect)":
        return <ExpensesIndirectUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Income (indirect)":
        return <IncomeIndirectUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Fixed Assets":
        return <FixedAssetsUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Investments":
        return <InvestmentsUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Loan Liability":
        return <LoanLiabilityUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Expenses Payable":
        return <ProvisonsExpensesUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Secured Loan":
        return <SecuredLoanUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Unsecured Loan":
        return <UnsecuredLoanUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Other Current Assets":
        return <SecuritiesAndDepositeUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Suspense Account":
        return <SuspenseAccountUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Sales":
        return <SaleUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Surplus":
        return <SurplusUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Purchase":
        return <PurchaseUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      case "Stock-in-hand":
        return <StockInHandUpdate accountData={selectedAccountId} setAccountData={setAccounts} />;
      default:
        return <div>Group component not found</div>;
    }
  };



  // Handle selecting an account to modify
  const handleAccountSelect = (e) => {
    const selectedId = e.target.value;
    console.log("id", selectedId);
    setSelectedAccountId(selectedId);
    const selectedAccount = accounts.find((acc) => acc._id === selectedId);

    // Now you can access the group like this:
    const selectedGroup = selectedAccount?.group;

    console.log("account name", selectedGroup);
    setAccountData(selectedGroup);
  };


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
            {selectedOption === 'Add Account' && !group && <>
              <div className='text-3xl font-semibold text-center'>Select Group first</div></>}

            {/* Add Account Section */}
            {selectedOption === 'Add Account' && group && (
              <>
                <h2 className="text-2xl font-bold mb-4">Create {group}</h2>
                {renderComponentByGroup(group)}
                <button
                  onClick={() => navigate('/account')}
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
                {/* Dropdown for selecting an account to modify */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Select Account to Modify:</label>
                  <select
                    value={selectedAccountId}
                    onChange={handleAccountSelect}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account?._id} value={account?._id}>
                        {account?.group}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Render the modify component based on the selected account group */}
                {selectedAccountId && renderComponentByGroupUpdate(accountData)}

                <button
                  onClick={() => navigate('/account')}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mt-4 rounded"
                >
                  Back to Accounts
                </button>
              </>
            )}

            {/* List Account Section */}
            {selectedOption === 'List' && (
              <>
                <ListAccount />
                <button
                  onClick={() => navigate('/account')}
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
