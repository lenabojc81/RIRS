import { ITask } from "@/interfaces/ITasks";
import React from "react";
import TaskDetails from "../tasks/taskDetails";

interface TaskModalProps {
    task: ITask,
    mode: string,
    setShowModal: (show: boolean) => void
}

export default function TaskViewModal({ task, setShowModal, mode }: TaskModalProps) {
    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {mode === "edit" && <h5 className="modal-title">Edit Task</h5>}
                        {mode === "view" && <h5 className="modal-title">View Task</h5>}
                        {mode === "create" && <h5 className="modal-title">Create Task</h5>}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <TaskDetails task={task} mode={mode} />
                    </div>
                </div>
            </div>
        </div>
    )
}