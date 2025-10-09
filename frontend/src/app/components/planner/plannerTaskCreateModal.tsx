"use client";

import React from "react";
import { ITask } from "../../../interfaces/ITasks";
import { initialTask } from "../../../interfaces/ITasks";

interface PlannerTaskCreateModalProps {
    scheduledDate: string;
    onTaskCreated: (task: ITask) => void;
    onClose: () => void;
}

export default function PlannerTaskCreateModal({ scheduledDate, onTaskCreated, onClose }: PlannerTaskCreateModalProps) {
    const [taskData, setTaskData] = React.useState<ITask>({
        ...initialTask,
        scheduled_date: scheduledDate,
        date_end: new Date(scheduledDate) // Set due date to the scheduled date by default
    });

    const handleChange = (field: keyof ITask, value: any) => {
        setTaskData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = () => {
        // Validate required fields
        if (!taskData.name.trim()) {
            alert("Task name is required.");
            return;
        }

        // Create the task with all the data
        const newTask: ITask = {
            ...taskData,
            date_start: new Date(),
            scheduled_date: scheduledDate
        };

        onTaskCreated(newTask);
    };

    const formatDateForInput = (date: Date | undefined): string => {
        if (!date) return "";
        try {
            const d = new Date(date);
            if (isNaN(d.getTime())) return "";
            return d.toISOString().split('T')[0];
        } catch (error) {
            return "";
        }
    };

    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-plus-circle me-2"></i>
                            Create Task for {new Date(scheduledDate).toLocaleDateString()}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            {/* Task Name */}
                            <div className="mb-3">
                                <label htmlFor="taskName" className="form-label">
                                    <strong>Task Name *</strong>
                                </label>
                                <input
                                    type="text"
                                    id="taskName"
                                    className="form-control"
                                    value={taskData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Enter task name"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <label htmlFor="taskDescription" className="form-label">
                                    <strong>Description</strong>
                                </label>
                                <textarea
                                    id="taskDescription"
                                    className="form-control"
                                    rows={3}
                                    value={taskData.description || ""}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    placeholder="Enter task description (optional)"
                                />
                            </div>

                            {/* Due Date */}
                            <div className="mb-3">
                                <label htmlFor="taskDueDate" className="form-label">
                                    <strong>Due Date</strong>
                                </label>
                                <input
                                    type="date"
                                    id="taskDueDate"
                                    className="form-control"
                                    value={formatDateForInput(taskData.date_end)}
                                    onChange={(e) => {
                                        const newDate = e.target.value ? new Date(e.target.value) : undefined;
                                        handleChange("date_end", newDate);
                                    }}
                                />
                            </div>

                            {/* Priority */}
                            <div className="mb-3">
                                <label htmlFor="taskPriority" className="form-label">
                                    <strong>Priority</strong>
                                </label>
                                <select
                                    id="taskPriority"
                                    className="form-select"
                                    value={taskData.priority || 3}
                                    onChange={(e) => handleChange("priority", parseInt(e.target.value))}
                                >
                                    <option value={1}>🔴 Critical (1) - Highest Priority</option>
                                    <option value={2}>🟠 High (2) - High Priority</option>
                                    <option value={3}>🟡 Medium (3) - Medium Priority</option>
                                    <option value={4}>🟢 Low (4) - Low Priority</option>
                                    <option value={5}>🔵 Very Low (5) - Lowest Priority</option>
                                </select>
                            </div>

                            {/* Estimated Time */}
                            <div className="mb-3">
                                <label htmlFor="taskEstimatedTime" className="form-label">
                                    <strong>Estimated Time (hours)</strong>
                                </label>
                                <input
                                    type="number"
                                    id="taskEstimatedTime"
                                    className="form-control"
                                    min="0"
                                    step="0.5"
                                    value={taskData.estimated_time || ""}
                                    onChange={(e) => {
                                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                        handleChange("estimated_time", value);
                                    }}
                                    placeholder="Enter estimated hours"
                                />
                            </div>

                        </form>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleSave}
                        >
                            <i className="bi bi-check-circle me-1"></i>
                            Create Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}