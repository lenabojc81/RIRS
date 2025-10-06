"use client";

import React, { useEffect, useState } from "react";
import { ITask } from "../../../interfaces/ITasks";
import { SlArrowUpCircle, SlInfo } from "react-icons/sl";
import { fetchTasks } from "../../../data/fetch_tasks";
import TaskViewModal from "../modals/taskViewModal";

export default function TaskList() {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        (async () => {
            const data = await fetchTasks();
            setTasks(data as ITask[]);
        })();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(tasks.length / itemsPerPage);

    const handleInfoClick = (task: ITask) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedTask(null);
    };

    return (
        <div className="container">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3">
                {currentTasks.map((task, idx) => (
                    <div key={task.id ?? `task-${idx}`} className="col">
                        <div className="d-flex align-items-center p-3 border rounded bg-light">
                            <div className="me-3">
                                <SlArrowUpCircle size={40} className="text-success" />
                            </div>
                            <div className="transactionDetails flex-grow-1">
                                <p className="transactionName mb-1 fw-bold">{task.name}</p>
                                <p className="transactionAmount mb-0 text-muted">{task.label}</p>
                            </div>
                            <p className="transactionDate text-muted ms-3 mb-0">
                                {new Date(task.date_start).toLocaleDateString()}
                            </p>
                            <button
                                className="btn btn-link ms-auto text-info"
                                onClick={() => handleInfoClick(task)}
                                aria-label="View Details"
                            >
                                <SlInfo size={24} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    <li key="prev" className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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
                            key={`page-${index + 1}`}
                            className={`page-item ${currentPage === index + 1 ? "active" : ""
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
                    <li key="next" className={`page-item ${currentPage === totalPages ? "disabled" : ""
                        }`}>
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
                <TaskViewModal task={selectedTask} setShowModal={setShowModal} />
            )}
        </div>
    );
}
