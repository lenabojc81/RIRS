"use client";

import React from "react";
import { ITask } from "../../../interfaces/ITasks";

interface PlannerTaskEditModalProps {
    task: ITask;
    onTaskEdited: (task: ITask) => void;
    onTaskDeleted?: (taskId: string) => void;
    onClose: () => void;
}

export default function PlannerTaskEditModal({ task, onTaskEdited, onTaskDeleted, onClose }: PlannerTaskEditModalProps) {
    const [taskData, setTaskData] = React.useState<ITask>({
        ...task
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

        // Update scheduled_date if date_end changed
        let updatedTask = { ...taskData };
        
        // If due date changed, update the scheduled date to match
        if (taskData.date_end) {
            const newScheduledDate = new Date(taskData.date_end).toISOString().split('T')[0];
            updatedTask.scheduled_date = newScheduledDate;
        }

        onTaskEdited(updatedTask);
    };

    const handleDelete = () => {
        const confirmed = window.confirm(
            `⚠️ Delete Task?\n\nAre you sure you want to permanently delete "${task.name}"?\n\nThis action cannot be undone.`
        );
        
        if (confirmed && task.id && onTaskDeleted) {
            onTaskDeleted(task.id);
        }
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
                            <i className="bi bi-pencil me-2"></i>
                            Edit Planner Task
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
                                    <small className="text-muted ms-2">(Changing this will move the task on the calendar)</small>
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

                            {/* Current Scheduled Date (read-only info) */}
                            {taskData.scheduled_date && (
                                <div className="mb-3">
                                    <label className="form-label">
                                        <strong>Currently Scheduled For</strong>
                                    </label>
                                    <div className="form-control-plaintext bg-light p-2 rounded">
                                        <i className="bi bi-calendar3 me-2"></i>
                                        {new Date(taskData.scheduled_date).toLocaleDateString()}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <div className="me-auto">
                            {onTaskDeleted && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                >
                                    <i className="bi bi-trash me-1"></i>
                                    Delete Task
                                </button>
                            )}
                        </div>
                        <div>
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSave}
                            >
                                <i className="bi bi-check-circle me-1"></i>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}