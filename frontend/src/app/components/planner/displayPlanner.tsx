"use client";

import { getPlanners, updatePlanner, deletePlanner } from "@/data/fetch_planners";
import { initialPlanner, IPlanner } from "@/interfaces/IPlanner";
import React from "react";
import PlannerDetails from "./plannerDetails";
import GoalListElement from "../elements/goalListElement";
import AddGoalBtnInput from "../elements/addGoalBtnInput";
import MilestoneGoals from "./milestoneGoals";

export default function DisplayPlanner() {
    const [selectedPlanner, setSelectedPlanner] = React.useState<IPlanner | null>(null);
    const [planners, setPlanners] = React.useState<IPlanner[]>([]);

    const [editedPlanner, setEditedPlanner] = React.useState<IPlanner>(initialPlanner);
    const [currentGoalText, setCurrentGoalText] = React.useState("");
    const [editingGoalIndex, setEditingGoalIndex] = React.useState<number | null>(null);

    React.useEffect(() => {
        async function fetchData() {
            const plannersFromDb = await getPlanners();
            setPlanners(plannersFromDb);
        }
        fetchData();
    }, []);

    React.useEffect(() => {
        if (selectedPlanner) {
            setEditedPlanner(selectedPlanner);
        }
    }, [selectedPlanner]);

    React.useEffect(() => {
        if (planners.length > 0 && !selectedPlanner) {
            setSelectedPlanner(planners[0]);
        }
    }, [planners, selectedPlanner]);

    // Helper function to check if planner is completed
    const isPlannerCompleted = (planner: IPlanner | null): boolean => {
        return planner?.date_done !== null && planner?.date_done !== undefined;
    };

    const handleDelete = async (goalText: string) => {
        // Prevent deletion if planner is completed
        if (isPlannerCompleted(selectedPlanner)) {
            alert("Cannot delete goals from a completed planner.");
            return;
        }
        const updatedPlanner = {
            ...editedPlanner,
            goals: (editedPlanner.goals || []).filter((goal) => goal.text !== goalText)
        };

        setEditedPlanner(updatedPlanner);

        // Save changes to database
        try {
            const success = await updatePlanner(updatedPlanner);
            if (success) {
                setSelectedPlanner(updatedPlanner);
                console.log("Goal deleted successfully");
            } else {
                alert("Failed to delete goal");
            }
        } catch (error) {
            console.error("Error deleting goal:", error);
            alert("Error deleting goal");
        }
    };

    const handleEdit = (goalIndex: number) => {
        // Prevent editing if planner is completed
        if (isPlannerCompleted(selectedPlanner)) {
            alert("Cannot edit goals in a completed planner.");
            return;
        }
        
        const goalToEdit = (editedPlanner.goals || [])[goalIndex];
        if (goalToEdit) {
            setCurrentGoalText(goalToEdit.text);
            setEditingGoalIndex(goalIndex);
        }
    }

    const handleSaveGoalEdit = async (goalIndex: number) => {
        // Prevent saving edits if planner is completed
        if (isPlannerCompleted(selectedPlanner)) {
            alert("Cannot save changes to a completed planner.");
            return;
        }
        
        if (currentGoalText.trim()) {
            const updatedPlanner = {
                ...editedPlanner,
                goals: editedPlanner.goals?.map((goal, index) =>
                    index === goalIndex ? { ...goal, text: currentGoalText.trim() } : goal
                ) || []
            };

            setEditedPlanner(updatedPlanner);
            setEditingGoalIndex(null);
            setCurrentGoalText("");

            try {
                const success = await updatePlanner(updatedPlanner);
                if (success) {
                    setSelectedPlanner(updatedPlanner);
                    console.log("Goal updated successfully");
                } else {
                    alert("Failed to save goal changes");
                }
            } catch (error) {
                console.error("Error saving goal:", error);
                alert("Error saving goal changes");
            }
        }
    }

    const handleGoalAdded = async (updatedPlanner: IPlanner) => {
        // Prevent adding goals if planner is completed
        if (isPlannerCompleted(selectedPlanner)) {
            alert("Cannot add goals to a completed planner.");
            return;
        }
        
        try {
            const success = await updatePlanner(updatedPlanner);
            if (success) {
                setSelectedPlanner(updatedPlanner);
                console.log("Goal added successfully");
            } else {
                alert("Failed to save new goal");
            }
        } catch (error) {
            console.error("Error saving new goal:", error);
            alert("Error saving new goal");
        }
    }

    const handleDeletePlanner = async () => {
        if (!selectedPlanner || !selectedPlanner.id) return;

        const confirmed = window.confirm(`Are you sure you want to delete the planner "${selectedPlanner.title}"? This action cannot be undone.`);
        
        if (confirmed) {
            try {
                const success = await deletePlanner(selectedPlanner.id);
                if (success) {
                    // Remove the deleted planner from the list
                    const updatedPlanners = planners.filter(p => p.id !== selectedPlanner.id);
                    setPlanners(updatedPlanners);
                    
                    // Set the selected planner to the first available planner or null
                    setSelectedPlanner(updatedPlanners.length > 0 ? updatedPlanners[0] : null);
                    
                    console.log("Planner deleted successfully");
                } else {
                    alert("Failed to delete planner");
                }
            } catch (error) {
                console.error("Error deleting planner:", error);
                alert("Error deleting planner");
            }
        }
    }

    const handlePlannerUpdate = async (updatedPlanner: IPlanner) => {
        try {
            const success = await updatePlanner(updatedPlanner);
            if (success) {
                setSelectedPlanner(updatedPlanner);
                setEditedPlanner(updatedPlanner);
                
                const updatedPlanners = planners.map(p => 
                    p.id === updatedPlanner.id ? updatedPlanner : p
                );
                setPlanners(updatedPlanners);
                
                console.log("Planner updated successfully");
            } else {
                alert("Failed to update planner");
            }
        } catch (error) {
            console.error("Error updating planner:", error);
            alert("Error updating planner");
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center">
                <div className="mb-3 text-center">
                    <label className="form-label fw-bold"><h2>Select a Planner</h2></label>
                    <select
                        className="form-select"
                        value={selectedPlanner?.id ?? (planners[0]?.id ?? "")}
                        onChange={(e) => {
                            const planner = planners.find(p => p.id === e.target.value);
                            setSelectedPlanner(planner ?? null);
                        }}
                        style={{
                            width: selectedPlanner
                                ? `calc(${selectedPlanner.title.length}ch + 15px)`
                                : "auto",
                            minWidth: "120px",
                        }}
                    >
                        {planners.map((planner) => (
                            <option key={planner.id} value={planner.id}>
                                {planner.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {selectedPlanner &&
                <div className="container mt-4">
                    <PlannerDetails 
                        planner={selectedPlanner} 
                        onPlannerUpdate={handlePlannerUpdate}
                    />
                    
                    {/* Show read-only notice for completed planners */}
                    {isPlannerCompleted(selectedPlanner) && (
                        <div className="alert alert-info mt-3" role="alert">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-info-circle-fill me-2"></i>
                                <strong>This planner is completed and cannot be edited.</strong>
                                <span className="ms-2">All editing features are disabled for completed planners.</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Only show editing components if planner is not completed */}
                    {!isPlannerCompleted(selectedPlanner) && (
                        <AddGoalBtnInput
                            mode="edit"
                            planner={editedPlanner}
                            category="main"
                            setEditedPlanner={setEditedPlanner}
                            onGoalAdded={handleGoalAdded}
                        />
                    )}
                    
                    <GoalListElement
                        goals={editedPlanner.goals || []}
                        category="main"
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleSaveGoalEdit={handleSaveGoalEdit}
                        editingGoalIndex={editingGoalIndex}
                        currentGoalText={currentGoalText}
                        setCurrentGoalText={setCurrentGoalText}
                        setEditingGoalIndex={setEditingGoalIndex}
                        readOnly={isPlannerCompleted(selectedPlanner)}
                    />
                    
                    {/* Show milestone goals (read-only for completed planners) */}
                    <MilestoneGoals
                        planner={selectedPlanner}
                        setEditedPlanner={setEditedPlanner}
                        onGoalAdded={handleGoalAdded}
                        readOnly={isPlannerCompleted(selectedPlanner)}
                    />
                    
                    <div className="mt-4 d-flex justify-content-center">
                        <button
                            className="btn btn-danger btn-lg"
                            onClick={handleDeletePlanner}
                            type="button"
                        >
                            Delete Planner
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}