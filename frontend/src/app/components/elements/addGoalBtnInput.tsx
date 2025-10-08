import { IGoal, IPlanner } from "@/interfaces/IPlanner";
import React from "react";
import { createPlanner, updatePlanner } from "@/data/fetch_planners";


interface addGoalBtnInputProps {
    planner: IPlanner;
    mode: string;
    category: string;
    start_date?: Date;
    end_date?: Date;
    setEditedPlanner: (planner: IPlanner) => void;
    onGoalAdded?: (updatedPlanner: IPlanner) => void;
};

export default function addGoalBtnInput({ mode, planner, category, start_date, end_date, setEditedPlanner, onGoalAdded }: addGoalBtnInputProps) {
    const [showAddGoalBtn, setShowAddGoalBtn] = React.useState<boolean>(true);
    const [currentGoalText, setCurrentGoalText] = React.useState<string>("");

    const getGoalCountByCategory = () => {
        if (!planner.goals) return 0;

        const goalsByCategory = planner.goals?.filter(goal => goal.category === category);
        let count;
        if (category !== "main") {
            if (start_date && end_date) {
                count = goalsByCategory?.filter(goal => {
                    const goalStart = new Date(goal.date_start);
                    const goalEnd = goal.date_end ? new Date(goal.date_end) : goalStart;

                    goalStart.setHours(0, 0, 0, 0);
                    goalEnd.setHours(0, 0, 0, 0);
                    const periodStart = new Date(start_date);
                    const periodEnd = new Date(end_date);
                    periodStart.setHours(0, 0, 0, 0);
                    periodEnd.setHours(0, 0, 0, 0);

                    return goalStart.getTime() === periodStart.getTime() &&
                        goalEnd.getTime() === periodEnd.getTime();
                }).length;
            } else {
                count = goalsByCategory?.filter(goal => {
                    const goalStart = new Date(goal.date_start).getTime();
                    const goalEnd = goal.date_end ? new Date(goal.date_end).getTime() : null;
                    const plannerStart = new Date(planner.date_start).getTime();
                    const plannerEnd = planner.date_end ? new Date(planner.date_end).getTime() : null;

                    return goalStart === plannerStart && goalEnd === plannerEnd;
                }).length;
            }
        } else {
            count = goalsByCategory?.length;
        }

        return count;
    };

    const handleToggleGoal = async (save: boolean) => {
        if (save && currentGoalText.trim()) {
            if (getGoalCountByCategory() >= 7) {
                alert("You can only add up to 7 goals maximum.");
                return;
            }

            let start, end;
            if (category === "main") {
                start = planner.date_start;
                end = planner.date_end;
            } else if (start_date && end_date) {
                start = start_date;
                end = end_date;
            } else {
                alert("Please provide start and end dates for this goal category.");
                return;
            }
            const newGoal: IGoal = {
                text: currentGoalText.trim(),
                date_done: undefined,
                category: category,
                evaluation: undefined,
                date_start: start,
                date_end: end
            }

            const updatedPlanner = {
                ...planner,
                goals: [...(planner.goals || []), newGoal]
            };

            setEditedPlanner(updatedPlanner);
            setCurrentGoalText("");

            if (mode === "edit" && onGoalAdded) {
                onGoalAdded(updatedPlanner);
            }
        }

        setCurrentGoalText("");
        setShowAddGoalBtn(!showAddGoalBtn);
    };

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        <div className="text-center">
                            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                 style={{width: '50px', height: '50px'}}>
                                <i className="bi bi-plus-lg fs-5"></i>
                            </div>
                            <h5 className="card-title">Add New Goal</h5>
                            <p className="text-muted mb-3">Add goals for {category} category</p>
                            
                            {showAddGoalBtn ? (
                                <button
                                    className="btn btn-success btn-lg px-4"
                                    onClick={() => { handleToggleGoal(false) }}
                                    disabled={getGoalCountByCategory() >= 7}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add Goal {getGoalCountByCategory() >= 7 ? "(Max 7)" : `(${getGoalCountByCategory()}/7)`}
                                </button>
                            ) : (
                                <div className="d-flex flex-column align-items-center gap-3">
                                    <div className="w-100" style={{maxWidth: '400px'}}>
                                        <input
                                            type="text"
                                            value={currentGoalText}
                                            onChange={(e) => setCurrentGoalText(e.target.value)}
                                            className="form-control form-control-lg"
                                            placeholder="Enter your goal..."
                                            autoFocus
                                        />
                                    </div>
                                    <div className="btn-group">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => { handleToggleGoal(true) }}
                                            disabled={!currentGoalText.trim()}
                                        >
                                            <i className="bi bi-check-lg me-1"></i>
                                            Save Goal
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setCurrentGoalText("");
                                                handleToggleGoal(false);
                                            }}
                                        >
                                            <i className="bi bi-x-lg me-1"></i>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}