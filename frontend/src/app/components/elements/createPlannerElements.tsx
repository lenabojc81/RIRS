import React from "react";
import { IGoal, IPlanner } from "@/interfaces/IPlanner";
import { SlClose, SlLock, SlPaperPlane, SlPencil, SlStar, SlTrash } from "react-icons/sl";
import { redirect, useRouter } from "next/navigation";
import { createPlanner, updatePlanner } from "@/data/fetch_planners";
import AddGoalBtnInput from "./addGoalBtnInput";
import GoalListElement from "./goalListElement";

interface CreatePlannerElementsProps {
    planner: IPlanner;
}

export default function CreatePlannerElements({ planner }: CreatePlannerElementsProps) {
    const [editedPlanner, setEditedPlanner] = React.useState<IPlanner>(planner);
    const [currentGoalText, setCurrentGoalText] = React.useState("");
    const [editingGoalIndex, setEditingGoalIndex] = React.useState<number | null>(null);

    const handleChange = (field: string, value: any) => {
        setEditedPlanner((prev) => ({
            ...prev,
            [field]: field.includes("date") ? new Date(value) : value,
        }))
    }

    const handleDelete = (goalText: string) => {
        setEditedPlanner((prev) => ({
            ...prev,
            goals: (prev.goals || []).filter((goal) => goal.text !== goalText)
        }));
    };

    const handleEdit = (goalIndex: number) => {
        const goalToEdit = (editedPlanner.goals || [])[goalIndex];
        if (goalToEdit) {
            setCurrentGoalText(goalToEdit.text);
            setEditingGoalIndex(goalIndex);
        }
    }

    const handleSaveGoalEdit = (goalIndex: number) => {
        if (currentGoalText.trim()) {
            setEditedPlanner((prev) => ({
                ...prev,
                goals: prev.goals?.map((goal, index) =>
                    index === goalIndex ? { ...goal, text: currentGoalText.trim() } : goal
                ) || []
            }));
            setEditingGoalIndex(null);
            setCurrentGoalText("");
        }
    }

    const handleCreatePlanner = async () => {
        const ok = await createPlanner(editedPlanner);

        if (ok) {
            window.location.reload();
        }
        redirect('/planners');
    }

    return (
        <div className="container mt-4">
            {/* title */}
            <div className="mb-3">
                <strong>Title</strong>
                <input
                    type="text"
                    value={editedPlanner.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="form-control mb-2"
                />
            </div>


            <div className="row" >
                {/* start date */}
                <div className="mb-3 col">
                    <strong>Start Date</strong>
                    <input
                        type="date"
                        value={
                            editedPlanner.date_start
                                ? typeof editedPlanner.date_start === "string"
                                    ? editedPlanner.date_start
                                    : editedPlanner.date_start.toISOString().split("T")[0]
                                : ""
                        }
                        onChange={(e) => handleChange("date_start", e.target.value)}
                        className="form-control mb-2"
                    />
                </div>

                {/* end date */}
                <div className="mb-3 col">
                    <strong>End Date</strong>
                    <input
                        type="date"
                        value={
                            editedPlanner.date_end
                                ? typeof editedPlanner.date_end === "string"
                                    ? editedPlanner.date_end
                                    : editedPlanner.date_end.toISOString().split("T")[0]
                                : ""
                        }
                        onChange={(e) => handleChange("date_end", e.target.value)}
                        className="form-control mb-2"
                    />
                </div>
            </div>

            {/* main goals */}
            <div className="mb-3">
                <p><strong>Main Goals</strong></p>
                <AddGoalBtnInput
                    mode="create"
                    planner={editedPlanner}
                    category="main"
                    setEditedPlanner={setEditedPlanner}
                />
            </div>

            {/* goals list */}
            {editedPlanner.goals && editedPlanner.goals.length > 0 && (
                <GoalListElement
                    goals={editedPlanner.goals}
                    category="main"
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleSaveGoalEdit={handleSaveGoalEdit}
                    editingGoalIndex={editingGoalIndex}
                    currentGoalText={currentGoalText}
                    setCurrentGoalText={setCurrentGoalText}
                    setEditingGoalIndex={setEditingGoalIndex}
                />
            )}

            {/* save button */}
            <div className="d-flex justify-content-center">
                <button className="btn btn-lg btn-success" onClick={handleCreatePlanner}>
                    Save Planner
                </button>
            </div>
        </div>
    )
}