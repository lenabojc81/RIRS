import { ITask } from "@/interfaces/ITasks";
import React from "react";
import TaskDetails from "../tasks/taskDetails";

interface TaskModalProps {
    task: ITask,
    setShowModal: (show: boolean) => void
}

export default function TaskModal({ task, setShowModal }: TaskModalProps) {
    return (
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
                        <TaskDetails task={task} />
                    </div>
                </div>
            </div>
        </div>
    )
}