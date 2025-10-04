"use client";

import React, { useEffect, useState } from "react";
import { ITask } from "../../../interfaces/ITasks";
import { SlArrowDownCircle, SlArrowUpCircle, SlInfo } from "react-icons/sl";
import { baseURL } from "../../../../global";
import TaskDetails from "./taskDetails";

export default function TaskList() {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${baseURL}/task/getTasks`);
            if (response.ok) {
                const data = await response.json();
                setTasks(data.reverse());
            }
        } catch (error) {
            console.error(error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(tasks.length / itemsPerPage);

    const handleInfoClick = (task: ITask) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const renderTask = (task: ITask) => (
        <div
            key={task._id}
            className="d-flex align-items-center p-3 mb-3 border rounded bg-light"
        >
            <div className="me-3">
                {task.expense ? (
                    <SlArrowDownCircle size={40} className="text-danger" />
                ) : (
                    <SlArrowUpCircle size={40} className="text-success" />
                )}
            </div>
            <div className="transactionDetails flex-grow-1">
                <p className="transactionName mb-1 fw-bold">{task.name}</p>
                <p className="transactionAmount mb-0 text-muted">€{task.amount.toFixed(2)}</p>
            </div>
            <p className="transactionDate text-muted ms-3" style={{marginBottom:0}}>
                {new Date(task.date).toLocaleDateString()}
            </p>

            <button
                className="btn btn-link ms-auto text-info"
                onClick={() => handleInfoClick(task)}
                aria-label="View Details"
            >
                <SlInfo size={24} />
            </button>
        </div>
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedTask(null);
    };

    return (
        <div className="container">
            <div className="listContainer">
                {currentTasks.map((task) => renderTask(task))}
            </div>

            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            aria-label="Previous"
                        >
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li
                            key={index + 1}
                            className={`page-item ${
                                currentPage === index + 1 ? "active" : ""
                            }`}
                        >
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li
                        className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                        }`}
                    >
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            aria-label="Next"
                        >
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>

            {showModal && selectedTask && (
                <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Task Details</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <TaskDetails task={selectedTask} />
                            </div>
                            {/* <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
