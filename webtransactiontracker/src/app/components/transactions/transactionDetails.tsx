import React from "react";
import { ITransaction } from "../../../interfaces/ITransactions";
import { SlTrash } from "react-icons/sl";
import { redirect } from "next/navigation";
import { baseURL } from "../../../../global";

interface TransactionDetailsProps {
    transaction: ITransaction;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {

    const handleDelete = async() => {
        try {
            const response = await fetch(`${baseURL}/transaction/deleteTransaction/${transaction._id}`, {
                method: 'Delete',
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error: Failed to save transaction.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            redirect('/');
        }
    };

    return (
        <div className="container mt-4">
            <h3>{transaction.name}</h3>
            <p><strong>Amount:</strong> €{transaction.amount.toFixed(2)}</p>
            <p><strong>Type:</strong> {transaction.expense ? "Expense" : "Income"}</p>
            <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
            <div className="row justify-content-center">
                <button
                    className="btn btn-link ms-auto text-danger"
                    onClick={() => handleDelete()}
                    aria-label="Delete Transaction"
                >
                    <SlTrash size={24} />
                </button>
            </div>
        </div>
    );
};

export default TransactionDetails;