"use client";

import React from "react";
import { ITask } from "../../../interfaces/ITasks";

interface TaskActionModalProps {
    task: ITask;
    onPermanentDelete: (taskId: string) => void;
    onRemoveFromDate: (taskId: string) => void;
    onCancel: () => void;
}

export default function TaskActionModal({ task, onPermanentDelete, onRemoveFromDate, onCancel }: TaskActionModalProps) {
    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="bi bi-question-circle me-2 text-warning"></i>
                            What would you like to do?
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onCancel}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="text-center mb-4">
                            <h6 className="mb-3">
                                <strong>"{task.name}"</strong>
                            </h6>
                            <p className="text-muted">
                                Choose what you'd like to do with this task:
                            </p>
                        </div>

                        <div className="d-grid gap-3">
                            {/* Permanently Delete */}
                            <div className="card border-danger">
                                <div className="card-body text-center py-3">
                                    <div className="mb-2">
                                        <i className="bi bi-trash text-danger" style={{ fontSize: '2rem' }}></i>
                                    </div>
                                    <h6 className="card-title text-danger mb-2">Permanently Delete</h6>
                                    <p className="card-text small text-muted mb-3">
                                        Remove this task completely from the planner. This action cannot be undone.
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => task.id && onPermanentDelete(task.id)}
                                    >
                                        <i className="bi bi-trash me-1"></i>
                                        Delete Forever
                                    </button>
                                </div>
                            </div>

                            {/* Remove from Date */}
                            <div className="card border-warning">
                                <div className="card-body text-center py-3">
                                    <div className="mb-2">
                                        <i className="bi bi-calendar-x text-warning" style={{ fontSize: '2rem' }}></i>
                                    </div>
                                    <h6 className="card-title text-warning mb-2">Remove All Dates</h6>
                                    <p className="card-text small text-muted mb-3">
                                        Clear all dates from this task and move it to today's unscheduled tasks for later planning.
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-warning"
                                        onClick={() => task.id && onRemoveFromDate(task.id)}
                                    >
                                        <i className="bi bi-calendar-x me-1"></i>
                                        Remove All Dates
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCancel}
                        >
                            <i className="bi bi-x-circle me-1"></i>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}