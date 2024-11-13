import React from "react";
import { ITransaction } from "../../../interfaces/ITransactions";
import { SlTrash, SlPencil } from "react-icons/sl";
import { redirect } from "next/navigation";
import { baseURL } from "../../../../global";

interface TransactionDetailsProps {
    transaction: ITransaction;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedTransaction, setEditedTransaction] = React.useState<ITransaction>(transaction);

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

    const handleEdit = async() => {
        setIsEditing(true);
    };

    const handleSave = async() => {
        try {
            const response = await fetch(`${baseURL}/transaction/editTransaction/${transaction._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedTransaction),
            });

            if (response.ok) {
                setIsEditing(false);
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

    const handleChange = (field: string, value: any) => {
        setEditedTransaction((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <div className="container mt-4">
            <h3>{transaction.name}</h3>
            <p><strong>Amount:</strong> €{transaction.amount.toFixed(2)}</p>
            <p><strong>Type:</strong> {transaction.expense ? "Expense" : "Income"}</p>
            <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
            <div className="row justify-content-center">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editedTransaction.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="form-control mb-2"
                    />
                    <input
                        type="number"
                        value={editedTransaction.amount}
                        onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                        className="form-control mb-2"
                    />
                    <select
                        value={editedTransaction.expense ? "expense" : "income"}
                        onChange={(e) =>
                            handleChange("expense", e.target.value === "expense")
                        }
                        className="form-control mb-2"
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <button className="btn btn-success" onClick={handleSave}>
                        OK
                    </button>
                </>
            ) : (
                <>
                    <div className="col-4 d-flex justify-content-center ">
                        <button
                            className="btn btn-link text-secondary"
                            onClick={() => handleEdit()}
                            aria-label="Edit Transaction"
                        >
                            <SlPencil size={24} />
                        </button>
                    </div>
                    <div className="col-4 d-flex justify-content-center">
                        <button
                            className="btn btn-link text-danger"
                            onClick={() => handleDelete()}
                            aria-label="Delete Transaction"
                        >
                            <SlTrash size={24} />
                        </button>
                    </div>
                </>
                )}
            </div>
        </div>
    );
};

export default TransactionDetails;