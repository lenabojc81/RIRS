import { IPlanner } from "@/interfaces/IPlanner";
import React from "react";
import CreatePlannerElements from "../elements/createPlannerElements";

interface PlannerModalProps {
    planner: IPlanner;
    mode: string;
    setShowModal: (show: boolean) => void
}

export default function PlannerViewModal({ planner, setShowModal, mode }: PlannerModalProps) {
    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        {mode === "create" ?
                            <h5 className="modal-title">Create Planner</h5>
                            : 
                            <h5 className="modal-title">View Planner</h5>
                        }
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <CreatePlannerElements planner={planner} />
                    </div>
                </div>
            </div>
        </div>
    )
}