"use client";

import React, { useState } from "react";
import { ITransaction, initialTransaction } from "../../../interfaces/ITransactions";
import { baseURL } from "../../../../global";
import { redirect } from "next/navigation";

export default function NewTransaction() {
    const [transaction, setTransaction] = useState<ITransaction>(initialTransaction);

    const handleTransactionType = (isExpense: boolean) => {
        setTransaction({ ...transaction, expense: isExpense, date: new Date() });
    };

    const saveTransaction = async () => {
        let saved = false;
        if (!transaction.name.trim()) {
            alert('Validation Error: Please enter the name of the transaction.');
            return;
        }
        if (!transaction.amount || transaction.amount <= 0) {
            alert('Validation Error: Please enter a valid amount greater than 0.');
            return;
        }
        try {
            const response = await fetch(`${baseURL}/transaction/newTransaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });

            if (response.ok) {
                setTransaction(initialTransaction);
                saved = true;
            } else {
                alert('Error: Failed to save transaction.');
            }
        } catch (error) {
            alert('Error: An error occurred while saving the transaction.');
            console.error(error);
        }

        if (saved) {
            redirect('/');
        }
    };

    return (
        <div className="container p-4 mt-5 border rounded" style={{ maxWidth: "500px" }}>
            <h4 className="mb-4">New Transaction</h4>
            
            <div className="mb-3">
                <label className="form-label">Name of Transaction</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter the name of transaction"
                    value={transaction.name}
                    onChange={(e) => setTransaction({ ...transaction, name: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Enter the amount"
                    value={transaction.amount}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                            setTransaction({ ...transaction, amount: Number(value) });
                        }
                    }}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Type of Transaction</label>
                <div className="d-flex">
                    <button
                        type="button"
                        className={`btn me-2 ${!transaction.expense ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handleTransactionType(false)}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        className={`btn ${transaction.expense ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handleTransactionType(true)}
                    >
                        Expense
                    </button>
                </div>
            </div>

            <button onClick={saveTransaction} className="btn btn-success w-100">
                Save Transaction
            </button>
        </div>
    );
}
