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
        <div>
            <p><strong>Add goals for {mode} {category}</strong></p>
            {showAddGoalBtn ? (
                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-md btn-primary ms-2 mb-2"
                        onClick={() => { handleToggleGoal(false) }}
                        disabled={getGoalCountByCategory() >= 7}
                    >
                        Add Goal {getGoalCountByCategory() >= 7 ? "(Max 7)" : `(${getGoalCountByCategory()}/7)`}
                    </button>
                </div>
            ) : (
                <div className="mb-3">
                    <input
                        type="text"
                        value={currentGoalText}
                        onChange={(e) => setCurrentGoalText(e.target.value)}
                        className="form-control mb-2"
                        placeholder="Enter your goal..."
                    />
                    <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => { handleToggleGoal(true) }}
                        disabled={!currentGoalText.trim()}
                    >Save Goal</button>
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                            setCurrentGoalText("");
                            handleToggleGoal(false);
                        }}
                    >Cancel</button>
                </div>
            )}
        </div>
    )
}