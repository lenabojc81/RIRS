"use client";

import React, { useEffect, useState } from "react";
import { ITask } from "../../../interfaces/ITasks";
import { SlArrowUpCircle, SlInfo, SlCheck } from "react-icons/sl";
import { fetchTasks, updateTask } from "../../../data/fetch_tasks";
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

    const handleToggleTaskStatus = async (task: ITask) => {
        let updatedTask: any;
        
        if (task.date_done) {
            // Task is completed, reopen it
            updatedTask = {
                ...task,
                date_done: null as any // Set to null to clear the field
            };
        } else {
            // Task is not completed, mark as done
            updatedTask = {
                ...task,
                date_done: new Date()
            };
        }

        const success = await updateTask(updatedTask as ITask);
        if (success) {
            // Update the local tasks state to reflect the change immediately
            setTasks(prevTasks => 
                prevTasks.map(t => 
                    t.id === task.id 
                        ? { ...t, date_done: updatedTask.date_done === null ? undefined : updatedTask.date_done }
                        : t
                )
            );
        }
    };

    return (
        <div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                {currentTasks.map((task, idx) => (
                    <div key={task.id ?? `task-${idx}`} className="col">
                        <div className={`card shadow-sm h-100 ${task.date_done ? 'border-success' : ''}`}>
                            <div className={`card-body d-flex align-items-center ${task.date_done ? 'bg-success bg-opacity-10' : ''}`}>
                                <div className="me-3">
                                    <button
                                        className="btn btn-link p-0"
                                        onClick={() => handleToggleTaskStatus(task)}
                                        aria-label={task.date_done ? "Mark as undone" : "Mark as done"}
                                        title={task.date_done ? "Click to reopen task" : "Click to mark as complete"}
                                    >
                                        {task.date_done ? (
                                            <SlCheck size={40} className="text-success" />
                                        ) : (
                                            <SlArrowUpCircle size={40} className="text-success" />
                                        )}
                                    </button>
                                </div>
                                <div className="transactionDetails flex-grow-1">
                                    <h6 className={`card-title mb-1 ${task.date_done ? 'text-decoration-line-through text-muted' : ''}`}>
                                        {task.name}
                                    </h6>
                                    <p className="card-text mb-0 text-muted small">{task.label}</p>
                                    {/* {task.date_done && (
                                        <p className="mb-0 text-success small">
                                            <strong>Completed:</strong> {new Date(task.date_done).toLocaleDateString()}
                                        </p>
                                    )} */}
                                </div>
                                <div className="d-flex flex-column align-items-end">
                                    <small className="text-muted mb-1">
                                        {new Date(task.date_start).toLocaleDateString()}
                                    </small>
                                    <button
                                        className="btn btn-outline-info btn-sm"
                                        onClick={() => handleInfoClick(task)}
                                        aria-label="View Details"
                                    >
                                        <SlInfo size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Card */}
            {totalPages > 1 && (
                <div className="card shadow-sm mt-4">
                    <div className="card-body">
                        <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-center mb-0">
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
                    </div>
                </div>
            )}

            {showModal && selectedTask && (
                <TaskViewModal task={selectedTask} setShowModal={setShowModal} mode="view" />
            )}
        </div>
    );
}
