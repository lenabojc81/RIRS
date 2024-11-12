import React from "react";
import { ITransaction } from "../../../interfaces/ITransactions";

interface TransactionDetailsProps {
    transaction: ITransaction;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
    return (
        <div className="container mt-4">
            <h3>{transaction.name}</h3>
            <p><strong>Amount:</strong> €{transaction.amount.toFixed(2)}</p>
            <p><strong>Type:</strong> {transaction.expense ? "Expense" : "Income"}</p>
            <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
        </div>
    );
};

export default TransactionDetails;