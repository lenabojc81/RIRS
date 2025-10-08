import React from "react";
import { IGoal, IPlanner } from "@/interfaces/IPlanner";
import { SlClose, SlLock, SlPaperPlane, SlPencil, SlStar, SlTrash, SlCheck } from "react-icons/sl";
import { redirect, useRouter } from "next/navigation";
import { createPlanner, updatePlanner } from "@/data/fetch_planners";
import GoalListElement from "../elements/goalListElement";

interface PlannerDetailsProps {
    planner: IPlanner;
    onPlannerUpdate?: (updatedPlanner: IPlanner) => void;
}

export default function PlannerDetails({ planner, onPlannerUpdate }: PlannerDetailsProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedPlanner, setEditedPlanner] = React.useState<IPlanner>(planner);

    React.useEffect(() => {
        setEditedPlanner(planner);
    }, [planner]);

    const formatDateForInput = (date: Date | string | undefined): string => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    const handleSave = async () => {
        // Validate dates
        if (editedPlanner.date_end && editedPlanner.date_start) {
            const startDate = new Date(editedPlanner.date_start);
            const endDate = new Date(editedPlanner.date_end);
            
            if (endDate < startDate) {
                alert("End date cannot be earlier than start date.");
                return;
            }
        }

        if (onPlannerUpdate) {
            await onPlannerUpdate(editedPlanner);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedPlanner(planner);
        setIsEditing(false);
    };

    const handleMarkAsDone = async () => {
        const confirmed = window.confirm(
            "⚠️ Warning: Marking this planner as done will make it read-only.\n\n" +
            "You will no longer be able to:\n" +
            "• Edit planner dates or details\n" +
            "• Add new goals\n" +
            "• Edit or delete existing goals\n" +
            "• Modify milestone goals\n\n" +
            "You will still be able to view all content and browse through your goals.\n\n" +
            "Are you sure you want to mark this planner as completed?"
        );

        if (confirmed) {
            const updatedPlanner = {
                ...editedPlanner,
                date_done: new Date()
            };
            setEditedPlanner(updatedPlanner);
            if (onPlannerUpdate) {
                await onPlannerUpdate(updatedPlanner);
            }
        }
    };

    // Check if planner is completed
    const isPlannerCompleted = planner.date_done !== null && planner.date_done !== undefined;

    return (
        <div className="row mb-5">
            <div className="col-12">
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div className="bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                                 style={{width: '40px', height: '40px'}}>
                                <i className="bi bi-info-circle fs-5"></i>
                            </div>
                            <h4 className="card-title mb-0">Planner Details</h4>
                        </div>
                        {/* Only show edit button if planner is not completed */}
                        {!isPlannerCompleted && (
                            !isEditing ? (
                                <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() => setIsEditing(true)}
                                    type="button"
                                >
                                    <SlPencil className="me-1" />
                                    Edit
                                </button>
                            ) : (
                                <div className="btn-group">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={handleSave}
                                        type="button"
                                    >
                                        <SlCheck className="me-1" />
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-light btn-sm"
                                        onClick={handleCancel}
                                        type="button"
                                    >
                                        <SlClose className="me-1" />
                                        Cancel
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                    <div className="card-body p-4">
                        <div className="row g-4">
                            <div className="col-12">
                                <div className="card h-100 border-0 bg-light">
                                    <div className="card-body text-center p-4">
                                        <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                             style={{width: '50px', height: '50px'}}>
                                            <i className="bi bi-card-heading fs-5"></i>
                                        </div>
                                        <h5 className="card-title">Title</h5>
                                        <p className="card-text h6 text-primary">{planner.title}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-6">
                                <div className="card h-100 border-0 bg-light">
                                    <div className="card-body text-center p-4">
                                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                             style={{width: '50px', height: '50px'}}>
                                            <i className="bi bi-calendar-plus fs-5"></i>
                                        </div>
                                        <h5 className="card-title">Start Date</h5>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                className="form-control form-control-lg"
                                                value={formatDateForInput(editedPlanner.date_start)}
                                                onChange={(e) => setEditedPlanner({
                                                    ...editedPlanner,
                                                    date_start: new Date(e.target.value)
                                                })}
                                            />
                                        ) : (
                                            <p className="card-text h6 text-success">
                                                {planner.date_start ? new Date(planner.date_start).toLocaleDateString() : 'Not set'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-6">
                                <div className="card h-100 border-0 bg-light">
                                    <div className="card-body text-center p-4">
                                        <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                             style={{width: '50px', height: '50px'}}>
                                            <i className="bi bi-calendar-check fs-5"></i>
                                        </div>
                                        <h5 className="card-title">End Date</h5>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                className="form-control form-control-lg"
                                                value={formatDateForInput(editedPlanner.date_end)}
                                                onChange={(e) => setEditedPlanner({
                                                    ...editedPlanner,
                                                    date_end: e.target.value ? new Date(e.target.value) : undefined
                                                })}
                                            />
                                        ) : (
                                            <p className="card-text h6 text-warning">
                                                {planner.date_end ? new Date(planner.date_end).toLocaleDateString() : 'Not set'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-12">
                                <div className="card h-100 border-0 bg-light">
                                    <div className="card-body text-center p-4">
                                        <div className={`${planner.date_done ? 'bg-success' : 'bg-info'} text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} 
                                             style={{width: '50px', height: '50px'}}>
                                            <i className={`bi ${planner.date_done ? 'bi-check-circle' : 'bi-hourglass-split'} fs-5`}></i>
                                        </div>
                                        <h5 className="card-title">Status</h5>
                                        <div className="d-flex flex-column align-items-center gap-2">
                                            {planner.date_done ? (
                                                <span className="badge bg-success fs-6 px-3 py-2">
                                                    <SlCheck className="me-1" />
                                                    Completed on {new Date(planner.date_done).toLocaleDateString()}
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="badge bg-warning text-dark fs-6 px-3 py-2 mb-2">
                                                        <i className="bi bi-hourglass-split me-1"></i>
                                                        In Progress
                                                    </span>
                                                    {!isPlannerCompleted && (
                                                        <button
                                                            className="btn btn-success btn-lg"
                                                            onClick={handleMarkAsDone}
                                                            type="button"
                                                        >
                                                            <SlCheck className="me-2" />
                                                            Mark as Done
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}