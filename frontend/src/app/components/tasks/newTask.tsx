"use client";

import React, { useState } from "react";
import { ITask, initialTask } from "../../../interfaces/ITasks";
import { baseURL } from "../../../../global";
import { redirect } from "next/navigation";

export default function newTask() {
    const [task, setTask] = useState<ITask>(initialTask);

    const handleTaskType = (isExpense: boolean) => {
        setTask({ ...task, expense: isExpense, date: new Date() });
    };

    const saveTask = async () => {
        let saved = false;
        if (!task.name.trim()) {
            alert('Validation Error: Please enter the name of the task.');
            return;
        }
        if (!task.amount || task.amount <= 0) {
            alert('Validation Error: Please enter a valid amount greater than 0.');
            return;
        }
        try {
            const response = await fetch(`${baseURL}/task/newTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (response.ok) {
                setTask(initialTask);
                saved = true;
            } else {
                alert('Error: Failed to save task.');
            }
        } catch (error) {
            alert('Error: An error occurred while saving the task.');
            console.error(error);
        }

        if (saved) {
            redirect('/');
        }
    };

    return (
        <div className="container p-4 mt-5 border rounded" style={{ maxWidth: "500px" }}>
            <h4 className="mb-4">New Task</h4>
            
            <div className="mb-3">
                <label className="form-label">Name of Task</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter the name of task"
                    value={task.name}
                    onChange={(e) => setTask({ ...task, name: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Enter the amount"
                    value={task.amount}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*\.?\d*$/.test(value)) {
                            setTask({ ...task, amount: Number(value) });
                        }
                    }}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Type of Task</label>
                <div className="d-flex">
                    <button
                        type="button"
                        className={`btn me-2 ${!task.expense ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handleTaskType(false)}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        className={`btn ${task.expense ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handleTaskType(true)}
                    >
                        Expense
                    </button>
                </div>
            </div>

            <button onClick={saveTask} className="btn btn-success w-100">
                Save Task
            </button>
        </div>
    );
}
