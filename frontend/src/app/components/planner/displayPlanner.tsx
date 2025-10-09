"use client";

import { getPlanners, getAllPlanners, updatePlanner, deletePlanner } from "@/data/fetch_planners";
import { initialPlanner, IPlanner } from "@/interfaces/IPlanner";
import { ITask } from "@/interfaces/ITasks";
import { updateTask } from "@/data/fetch_tasks";
import React from "react";
import PlannerDetails from "./plannerDetails";

import MilestoneGoals from "./milestoneGoals";

interface DisplayPlannerProps {
    archived?: boolean;
}

export default function DisplayPlanner({ archived = false }: DisplayPlannerProps) {
    const [selectedPlanner, setSelectedPlanner] = React.useState<IPlanner | null>(null);
    const [planners, setPlanners] = React.useState<IPlanner[]>([]);

    const [editedPlanner, setEditedPlanner] = React.useState<IPlanner>(initialPlanner);
    const [currentGoalText, setCurrentGoalText] = React.useState("");
    const [editingGoalIndex, setEditingGoalIndex] = React.useState<number | null>(null);

    // Helper function to safely convert dates
    const safeConvertDate = (date: any): Date | undefined => {
        if (!date) return undefined;
        
        try {
            // Check if it's a Firebase Timestamp object
            if (date && typeof date === 'object' && typeof date.toDate === 'function') {
                return date.toDate();
            }
            
            // Check if it's already a Date object
            if (date instanceof Date) {
                return date;
            }
            
            // Try to convert string/number to Date
            const converted = new Date(date);
            return isNaN(converted.getTime()) ? undefined : converted;
        } catch (error) {
            console.error("Error converting date:", error, "Date value:", date);
            return undefined;
        }
    };

    // Helper function to sanitize planner dates
    const sanitizePlanner = (planner: any): IPlanner => {
        return {
            ...planner,
            date_start: safeConvertDate(planner.date_start) || new Date(),
            date_end: safeConvertDate(planner.date_end),
            date_done: safeConvertDate(planner.date_done)
        };
    };

    React.useEffect(() => {
        async function fetchData() {
            try {
                // Use getAllPlanners when we need both active and archived, getPlanners for active only
                const plannersFromDb = archived ? await getAllPlanners() : await getPlanners();
                console.log("Raw planners from DB:", plannersFromDb);
                
                // Sanitize all planners to ensure proper date handling
                const sanitizedPlanners = plannersFromDb.map(sanitizePlanner);
                console.log("Sanitized planners:", sanitizedPlanners);
                
                // Filter planners based on archived prop (only needed for archived since backend handles active filtering)
                const filteredPlanners = archived 
                    ? sanitizedPlanners.filter((planner: IPlanner) => isPlannerCompleted(planner))
                    : sanitizedPlanners; // For active planners, backend already filters
                
                console.log(archived ? "Archived planners:" : "Active planners:", filteredPlanners);
                setPlanners(filteredPlanners);
            } catch (error) {
                console.error("Error fetching planners:", error);
                setPlanners([]);
            }
        }
        fetchData();
    }, [archived]);

    React.useEffect(() => {
        if (selectedPlanner) {
            // Ensure the selected planner has properly converted dates
            const sanitizedPlanner = sanitizePlanner(selectedPlanner);
            setEditedPlanner(sanitizedPlanner);
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
        
        if (!selectedPlanner) return;
        
        const updatedPlanner = {
            ...selectedPlanner,
            goals: (selectedPlanner.goals || []).filter((goal) => goal.text !== goalText)
        };

        setEditedPlanner(updatedPlanner);

        // Save changes to database
        try {
            const success = await updatePlanner(updatedPlanner);
            if (success) {
                setSelectedPlanner(updatedPlanner);
                console.log("Goal deleted successfully");
                
                // Update the planners list as well
                setPlanners(prevPlanners => 
                    prevPlanners.map(p => p.id === updatedPlanner.id ? updatedPlanner : p)
                );
            } else {
                alert("Failed to delete goal");
            }
        } catch (error) {
            console.error("Error deleting goal:", error);
            alert("Error deleting goal");
        }
    };

    const handleEdit = (goalIndex: number) => {
        console.log("handleEdit called with goalIndex:", goalIndex);
        console.log("selectedPlanner:", selectedPlanner);
        console.log("isPlannerCompleted:", isPlannerCompleted(selectedPlanner));
        
        // Prevent editing if planner is completed
        if (isPlannerCompleted(selectedPlanner)) {
            alert("Cannot edit goals in a completed planner.");
            return;
        }
        
        const goalToEdit = (selectedPlanner?.goals || [])[goalIndex];
        console.log("goalToEdit:", goalToEdit);
        if (goalToEdit) {
            setCurrentGoalText(goalToEdit.text);
            setEditingGoalIndex(goalIndex);
            console.log("Set editing state - goalIndex:", goalIndex, "text:", goalToEdit.text);
        }
    }

    const handleSaveGoalEdit = async (goalIndex: number) => {
        // Prevent saving edits if planner is completed
        if (isPlannerCompleted(selectedPlanner)) {
            alert("Cannot save changes to a completed planner.");
            return;
        }
        
        if (currentGoalText.trim() && selectedPlanner) {
            const updatedPlanner = {
                ...selectedPlanner,
                goals: selectedPlanner.goals?.map((goal, index) =>
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
                    
                    // Update the planners list as well
                    setPlanners(prevPlanners => 
                        prevPlanners.map(p => p.id === updatedPlanner.id ? updatedPlanner : p)
                    );
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
        console.log("handleGoalAdded called with updatedPlanner:", updatedPlanner);
        console.log("selectedPlanner:", selectedPlanner);
        console.log("isPlannerCompleted:", isPlannerCompleted(selectedPlanner));
        
        // Prevent adding goals if planner is completed
        if (isPlannerCompleted(selectedPlanner)) {
            alert("Cannot add goals to a completed planner.");
            return;
        }
        
        try {
            console.log("Attempting to update planner in database...");
            const success = await updatePlanner(updatedPlanner);
            console.log("updatePlanner result:", success);
            
            if (success) {
                setSelectedPlanner(updatedPlanner);
                setEditedPlanner(updatedPlanner);
                console.log("Goal added successfully to state");
                
                // Update the planners list as well
                setPlanners(prevPlanners => 
                    prevPlanners.map(p => p.id === updatedPlanner.id ? updatedPlanner : p)
                );
                console.log("Updated planners list");
            } else {
                console.error("updatePlanner returned false");
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
        console.log("DisplayPlanner: handlePlannerUpdate called with:", updatedPlanner);
        console.log("DisplayPlanner: Current selected planner:", selectedPlanner);
        
        try {
            console.log("DisplayPlanner: Calling updatePlanner API...");
            const success = await updatePlanner(updatedPlanner);
            console.log("DisplayPlanner: updatePlanner API returned:", success);
            
            if (success) {
                setSelectedPlanner(updatedPlanner);
                setEditedPlanner(updatedPlanner);
                
                const updatedPlanners = planners.map(p => 
                    p.id === updatedPlanner.id ? updatedPlanner : p
                );
                setPlanners(updatedPlanners);
                
                console.log("DisplayPlanner: Planner updated successfully");
                console.log("DisplayPlanner: Updated planners list:", updatedPlanners);
            } else {
                console.error("DisplayPlanner: updatePlanner returned false");
                alert("Failed to update planner");
            }
        } catch (error) {
            console.error("DisplayPlanner: Error updating planner:", error);
            alert("Error updating planner");
        }
    }

    const handleTaskUpdate = async (updatedTasks: ITask[]) => {
        try {
            // Only update the planner with the new tasks - don't update individual tasks
            // since planner tasks are managed within the planner context only
            if (selectedPlanner) {
                const updatedPlanner = {
                    ...selectedPlanner,
                    tasks: updatedTasks
                };
                
                const success = await updatePlanner(updatedPlanner);
                if (success) {
                    setSelectedPlanner(updatedPlanner);
                    setEditedPlanner(updatedPlanner);
                    
                    const updatedPlanners = planners.map(p => 
                        p.id === updatedPlanner.id ? updatedPlanner : p
                    );
                    setPlanners(updatedPlanners);
                    
                    console.log("Tasks updated successfully in planner");
                } else {
                    console.error("Failed to update planner with new tasks");
                    alert("Error updating planner tasks");
                }
            }
        } catch (error) {
            console.error("Error updating planner tasks:", error);
            alert("Error updating planner tasks");
        }
    }

    return (
        <div>
            {/* Planner Selection Section */}
            <div className="row mb-5">
                <div className="col-12 text-center">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                 style={{width: '60px', height: '60px'}}>
                                <i className="bi bi-list-ul fs-4"></i>
                            </div>
                            <h3 className="card-title mb-3">
                                {archived ? "Select an Archived Planner" : "Select a Planner"}
                            </h3>
                            <p className="text-muted mb-3">
                                {archived 
                                    ? "Choose from your completed planners to view their details"
                                    : "Choose from your existing planners to view and manage"
                                }
                            </p>
                            {planners.length > 0 ? (
                                <select
                                    className="form-select form-select-lg mx-auto shadow-sm"
                                    value={selectedPlanner?.id ?? (planners[0]?.id ?? "")}
                                    onChange={(e) => {
                                        const planner = planners.find(p => p.id === e.target.value);
                                        setSelectedPlanner(planner ?? null);
                                    }}
                                    style={{
                                        width: selectedPlanner
                                            ? `calc(${selectedPlanner.title.length}ch + 60px)`
                                            : "auto",
                                        minWidth: "200px",
                                        maxWidth: "400px"
                                    }}
                                >
                                    {planners.map((planner) => (
                                        <option key={planner.id} value={planner.id}>
                                            {planner.title}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="text-center py-4">
                                    <i className={`bi ${archived ? 'bi-archive' : 'bi-journal-x'} display-4 text-muted mb-3`}></i>
                                    <h5 className="text-muted">
                                        {archived 
                                            ? "No Archived Planners Found" 
                                            : "No Active Planners Found"
                                        }
                                    </h5>
                                    <p className="text-muted mb-0">
                                        {archived 
                                            ? "You haven't completed any planners yet. Complete some planners to see them here!"
                                            : "Create your first planner to get started with goal tracking."
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {selectedPlanner &&
                <div className="container mt-4">
                    <PlannerDetails 
                        planner={selectedPlanner} 
                        onPlannerUpdate={handlePlannerUpdate}
                        onTaskUpdate={handleTaskUpdate}
                        editedPlanner={editedPlanner}
                        setEditedPlanner={setEditedPlanner}
                        onGoalAdded={handleGoalAdded}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleSaveGoalEdit={handleSaveGoalEdit}
                        editingGoalIndex={editingGoalIndex}
                        currentGoalText={currentGoalText}
                        setCurrentGoalText={setCurrentGoalText}
                        setEditingGoalIndex={setEditingGoalIndex}
                    />
                    
                    {/* Show read-only notice for completed planners */}
                    {isPlannerCompleted(selectedPlanner) && (
                        <div className={`alert ${archived ? 'alert-success' : 'alert-info'} mt-3`} role="alert">
                            <div className="d-flex align-items-center">
                                <i className={`bi ${archived ? 'bi-check-circle-fill' : 'bi-info-circle-fill'} me-2`}></i>
                                <strong>
                                    {archived 
                                        ? 'This planner has been completed! 🎉' 
                                        : 'This planner is completed and cannot be edited.'
                                    }
                                </strong>
                                <span className="ms-2">
                                    {archived 
                                        ? 'View your achievements and completed goals below.' 
                                        : 'All editing features are disabled for completed planners.'
                                    }
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {/* Show milestone goals (read-only for completed planners) */}
                    <MilestoneGoals
                        planner={selectedPlanner}
                        setEditedPlanner={setEditedPlanner}
                        onGoalAdded={handleGoalAdded}
                        readOnly={isPlannerCompleted(selectedPlanner)}
                    />
                    
                    <div className="mt-5 text-center">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4">
                                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                     style={{width: '60px', height: '60px'}}>
                                    <i className="bi bi-trash fs-4"></i>
                                </div>
                                <h4 className="card-title mb-3">Danger Zone</h4>
                                <p className="text-muted mb-3">
                                    Permanently delete this planner and all its goals. This action cannot be undone.
                                </p>
                                <button
                                    className="btn btn-danger btn-lg px-4"
                                    onClick={handleDeletePlanner}
                                    type="button"
                                >
                                    <i className="bi bi-trash me-2"></i>
                                    Delete Planner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}