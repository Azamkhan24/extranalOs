import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const EditAccount = () => {
    const { id } = useParams(); // Get the account ID from the URL
    const navigate = useNavigate();
    const [accountData, setAccountData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch the account data when the component mounts
    useEffect(() => {
        const fetchAccountById = async () => {
            try {
                const response = await axios.get(`http://localhost:5004/api/account/get-account-by-id/${id}`, { withCredentials: true });
                if (response.status === 200) {
                    setAccountData(response?.data?.account); // Assuming the response contains the account object
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching account:", error.response?.data || error);
                setError(error.response?.data?.message || "An error occurred while fetching the account.");
                setLoading(false);
            }
        };

        fetchAccountById();
    }, [id]);

    // Function to render the appropriate component based on the group
    const renderComponentByGroup = (group) => {
        switch (group) {
            case "Sundry Debtors":
                return <SundryDebtorUpdate accountData={id} setAccountData={setAccountData} />;
            case "Sundry Creditors":
                return <SundryCreditorUpdate accountData={id} setAccountData={setAccountData} />;
            case "Bank Account":
                return <BankUpdate accountData={id} setAccountData={setAccountData} />;
            case "Bank O/D Account":
                return <BankOdAccountUpdate accountData={id} setAccountData={setAccountData} />;
            case "Capital Account":
                return <CapitalAccountUpdate accountData={id} setAccountData={setAccountData} />;
            case "Cash-in-hand":
                return <CashInHandUpdate accountData={id} setAccountData={setAccountData} />;
            case "Current Assets":
                return <CurrentAssetsUpdate accountData={id} setAccountData={setAccountData} />;
            case "Current Liabilities":
                return <CurrentLiabilitiesUpdate accountData={id} setAccountData={setAccountData} />;
            case "Loans & Advances (liabilities)":
                return <LoanAndAdvanceUpdate accountData={id} setAccountData={setAccountData} />;
            case "Duties & Taxes":
                return <DutiesAndTaxesUpdate accountData={id} setAccountData={setAccountData} />;
            case "Expenses (direct)":
                return <ExpensesDirectUpdate accountData={id} setAccountData={setAccountData} />;
            case "Expenses (Indirect)":
                return <ExpensesIndirectUpdate accountData={id} setAccountData={setAccountData} />;
            case "Income (indirect)":
                return <IncomeIndirectUpdate accountData={id} setAccountData={setAccountData} />;
            case "Fixed Assets":
                return <FixedAssetsUpdate accountData={id} setAccountData={setAccountData} />;
            case "Investments":
                return <InvestmentsUpdate accountData={id} setAccountData={setAccountData} />;
            case "Loan Liability":
                return <LoanLiabilityUpdate accountData={id} setAccountData={setAccountData} />;
            case "Expenses Payable":
                return <ProvisonsExpensesUpdate accountData={id} setAccountData={setAccountData} />;
            case "Secured Loan":
                return <SecuredLoanUpdate accountData={id} setAccountData={setAccountData} />;
            case "Unsecured Loan":
                return <UnsecuredLoanUpdate accountData={id} setAccountData={setAccountData} />;
            case "Other Current Assets":
                return <SecuritiesAndDepositeUpdate accountData={id} setAccountData={setAccountData} />;
            case "Suspense Account":
                return <SuspenseAccountUpdate accountData={id} setAccountData={setAccountData} />;
            case "Sales":
                return <SaleUpdate accountData={id} setAccountData={setAccountData} />;
            case "Surplus":
                return <SurplusUpdate accountData={id} setAccountData={setAccountData} />;
            case "Purchase":
                return <PurchaseUpdate accountData={id} setAccountData={setAccountData} />;
            case "Stock-in-hand":
                return <StockInHandUpdate accountData={id} setAccountData={setAccountData} />;
            default:
                return <div>Group component not found</div>;
        }
    };


    // Handle loading state
    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    // Handle error state
    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    // Render the account editing interface
    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Edit Account</h2>
            {renderComponentByGroup(accountData.group)} {/* Render component based on group */}
            {/* You can add a button to save changes and navigate back, etc. */}
            <button
                onClick={() => navigate('/account')} // Navigate back to the account list
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mt-4 rounded"
            >
                Back to Accounts
            </button>
        </div>
    );
};

export default EditAccount;
