import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Make sure to import SweetAlert
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
    const navigate = useNavigate(); // Corrected typo from 'nevigate' to 'navigate'

    const renderComponentByGroup = (group, accountData) => {
        switch (group) {
            case "Sundry Debtors":
                return <SundryDebtorUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Sundry Creditors":
                return <SundryCreditorUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Bank Account":
                return <BankUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Bank O/D Account":
                return <BankOdAccountUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Capital Account":
                return <CapitalAccountUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Cash-in-hand":
                return <CashInHandUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Current Assets":
                return <CurrentAssetsUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Current Liabilities":
                return <CurrentLiabilitiesUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Loans & Advances (liabilities)":
                return <LoanAndAdvanceUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Duties & Taxes":
                return <DutiesAndTaxesUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Expenses (direct)":
                return <ExpensesDirectUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Expenses (Indirect)":
                return <ExpensesIndirectUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Income (indirect)":
                return <IncomeIndirectUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Fixed Assets":
                return <FixedAssetsUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Investments":
                return <InvestmentsUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Loan Liability":
                return <LoanLiabilityUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Expenses Payable":
                return <ProvisonsExpensesUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Secured Loan":
                return <SecuredLoanUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Unsecured Loan":
                return <UnsecuredLoanUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Other Current Assets":
                return <SecuritiesAndDepositeUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Suspense Account":
                return <SuspenseAccountUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Sales":
                return <SaleUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Surplus":
                return <SurplusUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Purchase":
                return <PurchaseUpdate accountData={accountData} setAccountData={setAccounts} />;
            case "Stock-in-hand":
                return <StockInHandUpdate accountData={accountData} setAccountData={setAccounts} />;
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
    const navigate = useNavigate(); // Correctly initialize useNavigate

    const handleEditAccount = (account) => {
        // Navigate to the edit page for the selected account
        navigate(`/edit-account/${account._id}`);
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
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">Registration Type</td>
                                <td className="border border-gray-300 px-4 py-2">{account.registrationType ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">GSTIN</td>
                                <td className="border border-gray-300 px-4 py-2">{account.gstin || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">Constitution of Business</td>
                                <td className="border border-gray-300 px-4 py-2">{account.constitutions_of_bussiness || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">Email</td>
                                <td className="border border-gray-300 px-4 py-2">{account.email || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">Contact No</td>
                                <td className="border border-gray-300 px-4 py-2">{account.contact_no || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">Opening Balance</td>
                                <td className="border border-gray-300 px-4 py-2">{account.opening_balance.balance} ({account.opening_balance.type_of_Account})</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">Principal Place of Address</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {account.principalPlaceOfAddress?.addr ? `${account.principalPlaceOfAddress.addr.bnm || 'N/A'}, ${account.principalPlaceOfAddress.addr.st || 'N/A'}, ${account.principalPlaceOfAddress.addr.loc || 'N/A'}, ${account.principalPlaceOfAddress.addr.bno || 'N/A'}, ${account.principalPlaceOfAddress.addr.dst || 'N/A'}, ${account.principalPlaceOfAddress.addr.locality || 'N/A'}, ${account.principalPlaceOfAddress.addr.pncd || 'N/A'}, ${account.principalPlaceOfAddress.addr.landMark || 'N/A'}, ${account.principalPlaceOfAddress.addr.stcd || 'N/A'}, ${account.principalPlaceOfAddress.addr.geocodelvl || 'N/A'}, ${account.principalPlaceOfAddress.addr.flno || 'N/A'}` : 'N/A'}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">Contact Persons</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {account.contact_person.length > 0 ? (
                                        account.contact_person.map((person, idx) => (
                                            <div key={idx}>
                                                Contact Person {idx + 1} ID: {person._id}
                                            </div>
                                        ))
                                    ) : 'N/A'}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">Bank Info</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    Internet Banking User: {account.bank?.internet_banking_user ? "Yes" : "No"}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">CIN</td>
                                <td className="border border-gray-300 px-4 py-2">{account.cin || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">PAN</td>
                                <td className="border border-gray-300 px-4 py-2">{account.pan || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">TAN</td>
                                <td className="border border-gray-300 px-4 py-2">{account.tan || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">Udyam No</td>
                                <td className="border border-gray-300 px-4 py-2">{account.udyam_no || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">IEC</td>
                                <td className="border border-gray-300 px-4 py-2">{account.iec || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 font-medium">LLPIN</td>
                                <td className="border border-gray-300 px-4 py-2">{account.llpin || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button
                        onClick={() => deleteAccount(account._id)} // Call delete function on button click
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-4 rounded"
                    >
                        Delete Account
                    </button>

                    <button
                        onClick={() => handleEditAccount(account)} // Call edit function on button click
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded ml-2"
                    >
                        Edit Account
                    </button>
                </div>
            ))} {/* Close map and div */}
        </div>
    );
};

export default ListAccount;
