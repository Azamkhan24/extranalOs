import React, { useEffect, useState } from "react";
import axios from "axios";
import SundryDebtor from '../AccountType/SundryDebtor';
import Bank from "../AccountType/Bank";
import CapitalAccount from "../AccountType/CapitalAccount";
import CashInHand from "../AccountType/CashInHand";
import CurrentAssets from "../AccountType/CurrentAssets";
import CurrentLiabilities from "../AccountType/CurrentLiabilities";
import DutiesAndTaxes from "../AccountType/DutiesAndTaxes";
import ExpensesDirect from "../AccountType/ExpensesDirect";
import ExpensesIndirect from "../AccountType/ExpensesIndirect";
import IncomeIndirect from "../AccountType/IncomeIndirect";
import FixedAssets from "../AccountType/FixedAssets";
import Investments from "../AccountType/Investments";
import LoanAndAdvance from "../AccountType/LoanAndAdvance";
import LoanLiability from "../AccountType/LoanLiability";
import ProvisonsExpenses from "../AccountType/ProvisonsExpenses";
import SecuredLoan from "../AccountType/SecuredLoan";
import UnsecuredLoan from "../AccountType/UnsecuredLoan";
import SecuritiesAndDeposite from "../AccountType/SecuritiesAndDeposite";
import StockInHand from "../AccountType/StockInHand";
import SuspenseAccount from "../AccountType/SuspenseAccount";
import Sale from "../AccountType/Sale";
import SundryCreditor from "../AccountType/SundryCreditor";
import Surplus from "../AccountType/Surplus";
import BankOdAccount from "../AccountType/BankOdAccount";
import Purchase from "../AccountType/Purchase";

const AddAccount = () => {
  const [accounts, setAccounts] = useState([]); // Store fetched accounts
  const [formData, setFormData] = useState({
    group: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Error message for fetch failure

  // Fetch accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://localhost:5004/api/account-group/get-all-group", {
          withCredentials: true,
        });
        setAccounts(response.data.data); // Assuming the accounts are in response.data.data
      } catch (error) {
        setErrorMessage("Error fetching account groups");
        console.error(error); // Log error for debugging
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const renderComponentByGroup = () => {
    switch (formData.group) {
      case "Sundry Debtors":
        return <SundryDebtor />;
        
      case "Sundry Creditors":
        return <SundryCreditor />;

      case "Bank Account":
        return <Bank />;

      case "Bank O/D Account":
        return <BankOdAccount />;

      case "Capital Account":
        return <CapitalAccount />;

      case "Cash-in-hand":
        return <CashInHand />;

      case "Current Assets":
        return <CurrentAssets />;

      case "Current Liabilities":
        return <CurrentLiabilities />;

      case "Loans & Advances (liabilities)":
        return <LoanAndAdvance />;

      case "Duties & Taxes":
        return <DutiesAndTaxes />;

      case "Expenses (direct)":
        return <ExpensesDirect />;

      case "Expenses (Indirect)":
        return <ExpensesIndirect />;

      case "Income (indirect)":
        return <IncomeIndirect />;

      case "Fixed Assets":
        return <FixedAssets />;

      case "Investments":
        return <Investments />;

      case "Loan Liability":
        return <LoanLiability />;

      case "Expenses Payable":
        return <ProvisonsExpenses />;

      case "Secured Loan":
        return <SecuredLoan />;

      case "Unsecured Loan":
        return <UnsecuredLoan />;

      case "Other Current Assets":
        return <SecuritiesAndDeposite />;

      case "Suspense Account":
        return <SuspenseAccount />;

      case "Sales":
        return <Sale />;

      case "Surplus":
        return <Surplus/>;

      case "Purchase":
        return <Purchase/>;

      case "Stock-in-hand":
        return <StockInHand/>;

      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.group) {
      setErrorMessage("Please select a group.");
      return;
    }
    console.log(formData, "formdata");
    // Further processing to submit form data
  };



  console.log(formData.group,"formData.group")

  return (
    <div className="flex justify-center items-start min-h-screen mt-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow-lg w-md flex-col flex flex-wrap p-5 gap-10"
      >
        <h1 className="text-2xl font-bold mb-4">Create New Account</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Group</label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none"
          >
            <option value="">Select Group</option>
            {accounts.map((account) => (
              <option key={account._id} value={account.name}>
                {account.name}
              </option>
            ))}
          </select>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>
        {/* Render the component based on selected group */}
        {renderComponentByGroup()}
      </form>
    </div>
  );
};

export default AddAccount;
