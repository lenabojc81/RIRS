import { initialTask, ITask } from "@/interfaces/ITasks";
import React from "react";
import TaskDetails from "../tasks/taskDetails";

interface TaskModalProps {
    setShowModal: (show: boolean) => void
}

export default function TaskCreateModal({ setShowModal }: TaskModalProps) {
    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create Task</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <TaskDetails task={initialTask} mode="create" />
                    </div>
                </div>
            </div>
        </div>
    )
}