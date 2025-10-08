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
        <div className="container mt-4">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0">Planner Details</h4>
                    {/* Only show edit button if planner is not completed */}
                    {!isPlannerCompleted && (
                        !isEditing ? (
                            <button
                                className="btn btn-outline-primary btn-sm"
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
                                    className="btn btn-secondary btn-sm"
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
                <div className="card-body">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <label className="form-label"><strong>Title:</strong></label>
                            <p className="mb-0">{planner.title}</p>
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label"><strong>Start Date:</strong></label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formatDateForInput(editedPlanner.date_start)}
                                    onChange={(e) => setEditedPlanner({
                                        ...editedPlanner,
                                        date_start: new Date(e.target.value)
                                    })}
                                />
                            ) : (
                                <p className="mb-0">
                                    {planner.date_start ? new Date(planner.date_start).toLocaleDateString() : 'Not set'}
                                </p>
                            )}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label"><strong>End Date:</strong></label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formatDateForInput(editedPlanner.date_end)}
                                    onChange={(e) => setEditedPlanner({
                                        ...editedPlanner,
                                        date_end: e.target.value ? new Date(e.target.value) : undefined
                                    })}
                                />
                            ) : (
                                <p className="mb-0">
                                    {planner.date_end ? new Date(planner.date_end).toLocaleDateString() : 'Not set'}
                                </p>
                            )}
                        </div>
                        
                        <div className="col-12 mb-3">
                            <label className="form-label"><strong>Status:</strong></label>
                            <div className="d-flex align-items-center">
                                {planner.date_done ? (
                                    <span className="badge bg-success fs-6">
                                        <SlCheck className="me-1" />
                                        Completed on {new Date(planner.date_done).toLocaleDateString()}
                                    </span>
                                ) : (
                                    <>
                                        <span className="badge bg-warning text-dark fs-6 me-3">
                                            In Progress
                                        </span>
                                        {!isPlannerCompleted && (
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={handleMarkAsDone}
                                                type="button"
                                            >
                                                <SlCheck className="me-1" />
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
    )
}