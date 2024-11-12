"use client";

import React, { useEffect, useState } from "react";
import { ITransaction } from "../../interfaces/ITransactions";
import { SlArrowDownCircle, SlArrowUpCircle } from "react-icons/sl";
import { baseURL } from "../../../global";

export default function TransactionsScreen() {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${baseURL}/transaction/getTransactions`);
            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const renderTransaction = (transaction: ITransaction) => (
        <div key={transaction._id} className="d-flex align-items-center p-3 mb-3 border rounded bg-light">
            <div className="me-3">
                {transaction.expense ? (
                    <SlArrowDownCircle size={40} className="text-danger" />
                ) : (
                    <SlArrowUpCircle size={40} className="text-success" />
                )}
            </div>
            <div className="transactionDetails flex-grow-1">
                <p className="transactionName mb-1 fw-bold">{transaction.name}</p>
                <p className="transactionAmount mb-0 text-muted">€{transaction.amount.toFixed(2)}</p>
            </div>
            <p className="transactionDate text-muted ms-3">{new Date(transaction.date).toLocaleDateString()}</p>
        </div>
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            <div className="listContainer">
                {currentTransactions.map((transaction) => renderTransaction(transaction))}
            </div>

            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
