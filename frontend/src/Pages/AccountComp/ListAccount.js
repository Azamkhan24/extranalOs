import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import SundryDebtorUpdate from '../AccountUpdate/SundryDebtorUpdate';
import SundryCreditorUpdate from '../AccountUpdate/SundryCreditorUpdate';
import BankUpdate from '../AccountUpdate/BankUpdate';
import BankOdAccountUpdate from '../AccountUpdate/BankOdAccountUpdate';
import CapitalAccountUpdate from '../AccountUpdate/CapitalAccountUpdate';
import CashInHandUpdate from '../AccountUpdate/CashInHandUpdate';
import CurrentAssetsUpdate from '../AccountUpdate/CurrentAssetsUpdate';
import CurrentLiabilitiesUpdate from '../AccountUpdate/CurrentLiabilitiesUpdate';
import LoanAndAdvanceUpdate from '../AccountUpdate/LoanAndAdvanceUpdate';
import DutiesAndTaxesUpdate from '../AccountUpdate/DutiesAndTaxesUpdate';
import ExpensesDirectUpdate from '../AccountUpdate/ExpensesDirectUpdate';
import ExpensesIndirectUpdate from '../AccountUpdate/ExpensesIndirectUpdate';
import IncomeIndirectUpdate from '../AccountUpdate/IncomeIndirectUpdate';
import FixedAssetsUpdate from '../AccountUpdate/FixedAssetsUpdate';
import InvestmentsUpdate from '../AccountUpdate/InvestmentsUpdate';
import LoanLiabilityUpdate from '../AccountUpdate/LoanLiabilityUpdate';
import ProvisonsExpensesUpdate from '../AccountUpdate/ProvisonsExpensesUpdate';
import SecuredLoanUpdate from '../AccountUpdate/SecuredLoanUpdate';
import UnsecuredLoanUpdate from '../AccountUpdate/UnsecuredLoanUpdate';
import SecuritiesAndDepositeUpdate from '../AccountUpdate/SecuritiesAndDepositeUpdate';
import SuspenseAccountUpdate from '../AccountUpdate/SuspenseAccountUpdate';
import SaleUpdate from '../AccountUpdate/SaleUpdate';
import SurplusUpdate from '../AccountUpdate/SurplusUpdate';
import PurchaseUpdate from '../AccountUpdate/PurchaseUpdate';
import StockInHandUpdate from '../AccountUpdate/StockInHandUpdate';
import { useNavigate } from 'react-router-dom';

const ListAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const renderComponentByGroup = (group, accountId) => {
    switch (group) {
      case "Sundry Debtors":
        return <SundryDebtorUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Sundry Creditors":
        return <SundryCreditorUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Bank Account":
        return <BankUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Bank O/D Account":
        return <BankOdAccountUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Capital Account":
        return <CapitalAccountUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Cash-in-hand":
        return <CashInHandUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Current Assets":
        return <CurrentAssetsUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Current Liabilities":
        return <CurrentLiabilitiesUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Loans & Advances (liabilities)":
        return <LoanAndAdvanceUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Duties & Taxes":
        return <DutiesAndTaxesUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Expenses (direct)":
        return <ExpensesDirectUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Expenses (Indirect)":
        return <ExpensesIndirectUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Income (indirect)":
        return <IncomeIndirectUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Fixed Assets":
        return <FixedAssetsUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Investments":
        return <InvestmentsUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Loan Liability":
        return <LoanLiabilityUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Expenses Payable":
        return <ProvisonsExpensesUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Secured Loan":
        return <SecuredLoanUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Unsecured Loan":
        return <UnsecuredLoanUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Other Current Assets":
        return <SecuritiesAndDepositeUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Suspense Account":
        return <SuspenseAccountUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Sales":
        return <SaleUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Surplus":
        return <SurplusUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Purchase":
        return <PurchaseUpdate accountData={accountId} setAccountData={setAccounts} />;
      case "Stock-in-hand":
        return <StockInHandUpdate accountData={accountId} setAccountData={setAccounts} />;
      default:
        return <div>Group component not found</div>;
    }
  };

  const deleteAccount = async (id) => {
    // Show confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:5004/api/account/delete-account/${id}`, {
            withCredentials: true // Include credentials in the request
          });

          if (response.status === 200) {
            // Update accounts list after deletion
            setAccounts((prevAccounts) => prevAccounts.filter(account => account._id !== id));
            // Show success message
            Swal.fire({
              title: "Deleted!",
              text: "Your account has been deleted.",
              icon: "success",
            });
            fetchAccountData(); // Refresh the accounts list
          } else {
            setError("No account data found.");
          }
        } catch (err) {
          setError("Error deleting account: " + (err.response?.data?.message || err.message));
        }
      }
    });
  };

  const fetchAccountData = async () => {
    try {
      const response = await axios.get("http://localhost:5004/api/account/get-all-accounts", {
        withCredentials: true // Include credentials in the request
      });
      if (response.data && response.data.accounts) {
        setAccounts(response.data.accounts);
      } else {
        setError("No account data found.");
      }
      setLoading(false);
    } catch (err) {
      setError("Error fetching account data: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <>
      <div className='z-50 sticky top-0 left-0 bg-red-500 text-white text-lg font-semibold px-10 py-3 rounded'>Total no of accounts: {accounts.length}</div>
      <div className="container mx-auto mt-10">
        {accounts.length > 0 ? <AccountTable accounts={accounts} deleteAccount={deleteAccount} renderComponentByGroup={renderComponentByGroup} /> : <div>No account data found.</div>}
      </div>
    </>
  );
};

// AccountTable component defined within the same file
const AccountTable = ({ accounts, deleteAccount, renderComponentByGroup }) => {
  const navigate = useNavigate();

  const handleEditAccount = (accountId) => {
    // Navigate to the edit page for the selected account
    navigate(`/edit-account/${accountId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Account Details</h2>
      {accounts.map((account) => (
        <div key={account._id} className="bg-white border border-gray-300 rounded shadow p-4">
          <h3 className="text-xl font-semibold">Account ID: {account._id}</h3>
          <table className="min-w-full mt-2">
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Group</td>
                <td className="border border-gray-300 px-4 py-2">{account.group || 'N/A'}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Name</td>
                <td className="border border-gray-300 px-4 py-2">{account.name || 'N/A'}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Alias</td>
                <td className="border border-gray-300 px-4 py-2">{account.alias || 'N/A'}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-medium">Print Name</td>
                <td className="border border-gray-300 px-4 py-2">{account.printName || 'N/A'}</td>
              </tr>
              {/* Render more fields as needed */}
            </tbody>
          </table>

          <button
            onClick={() => deleteAccount(account._id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-4 rounded"
          >
            Delete Account
          </button>

          <button
            onClick={() => handleEditAccount(account._id)} // Use account._id here
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded ml-2"
          >
            View Account
          </button>
        </div>
      ))}
    </div>
  );
};

export default ListAccount;
