import { IPlanner } from '@/interfaces/IPlanner';
import React, { useState } from 'react';
import AddGoalBtnInput from '../elements/addGoalBtnInput';
import GoalListElement from '../elements/goalListElement';
import { SlStar, SlPencil, SlTrash, SlPaperPlane, SlClose } from 'react-icons/sl';

interface MilestoneGoalsProps {
    planner: IPlanner;
    setEditedPlanner: (planner: IPlanner) => void;
    onGoalAdded?: (updatedPlanner: IPlanner) => void;
    readOnly?: boolean;
}

type ViewType = 'year' | 'month' | 'week' | null;

export default function MilestoneGoals({ planner, setEditedPlanner, onGoalAdded, readOnly = false }: MilestoneGoalsProps) {
    const [activeView, setActiveView] = useState<ViewType>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [showAddGoal, setShowAddGoal] = useState<boolean>(false);
    const [selectedPeriod, setSelectedPeriod] = useState<{
        category: string;
        start_date: Date;
        end_date: Date;
    } | null>(null);
    const [selectedButton, setSelectedButton] = useState<{
        type: 'year' | 'month' | 'week';
        value: any;
    } | null>(null);
    const [editingGoalIndex, setEditingGoalIndex] = useState<number | null>(null);
    const [currentGoalText, setCurrentGoalText] = useState<string>("");

    const yearsInGoals = () => {
        const startYear = new Date(planner.date_start).getFullYear();
        const endYear = planner.date_end ? new Date(planner.date_end).getFullYear() : startYear;
        const years = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(year);
        }
        return years;
    }

    const monthsInGoals = (filterYear?: number) => {
        const start = new Date(planner.date_start);
        const end = planner.date_end ? new Date(planner.date_end) : start;
        const months: string[] = [];
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        const last = new Date(end.getFullYear(), end.getMonth(), 1);

        while (current <= last) {
            if (!filterYear || current.getFullYear() === filterYear) {
                months.push(current.toLocaleString('default', { month: 'long', year: 'numeric' }));
            }
            current.setMonth(current.getMonth() + 1);
        }
        return months;
    }

    const weeksInGoals = (filterYear?: number, filterMonth?: number) => {
        const weeks = [];
        const start = new Date(planner.date_start);
        start.setHours(0, 0, 0, 0);
        const end = planner.date_end ? new Date(planner.date_end) : new Date(start);
        end.setHours(0, 0, 0, 0);

        const firstMonday = new Date(start);
        const day = firstMonday.getDay();
        if (day !== 1) {
            firstMonday.setDate(firstMonday.getDate() + ((8 - day) % 7));
        }

        let weekStart = new Date(start);

        if (weekStart.getDay() !== 1) {
            const weekEnd = new Date(firstMonday);
            weekEnd.setDate(weekEnd.getDate() - 1);

            if (shouldIncludeWeek(new Date(weekStart), new Date(weekEnd), filterYear, filterMonth)) {
                weeks.push({ start: new Date(weekStart), end: new Date(weekEnd) });
            }
            weekStart = new Date(firstMonday);
        }

        while (weekStart <= end) {
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const actualWeekEnd = weekEnd < end ? new Date(weekEnd) : new Date(end);

            if (shouldIncludeWeek(new Date(weekStart), actualWeekEnd, filterYear, filterMonth)) {
                weeks.push({ start: new Date(weekStart), end: actualWeekEnd });
            }

            if (weekEnd >= end) {
                break;
            }

            weekStart.setDate(weekStart.getDate() + 7);
        }

        return weeks;
    }

    const shouldIncludeWeek = (weekStart: Date, weekEnd: Date, filterYear?: number, filterMonth?: number) => {
        if (!filterYear && filterMonth === undefined) return true;

        let current = new Date(weekStart);
        while (current <= weekEnd) {
            const currentYear = current.getFullYear();
            const currentMonth = current.getMonth();

            if (filterYear && currentYear !== filterYear) {
                current.setDate(current.getDate() + 1);
                continue;
            }

            if (filterMonth !== undefined && currentMonth !== filterMonth) {
                current.setDate(current.getDate() + 1);
                continue;
            }

            return true;
        }

        return false;
    }

    const getMonthsInYear = (year: number) => {
        const start = new Date(planner.date_start);
        const end = planner.date_end ? new Date(planner.date_end) : start;
        const months = [];

        for (let month = 0; month < 12; month++) {
            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month + 1, 0);

            if (monthEnd >= start && monthStart <= end) {
                months.push({
                    value: month,
                    name: monthStart.toLocaleString('default', { month: 'long' })
                });
            }
        }

        return months;
    }

    const handlePeriodClick = (type: 'year' | 'month' | 'week', value: any) => {
        let start_date: Date;
        let end_date: Date;
        let category: string;

        if (type === 'year') {
            const year = value as number;
            start_date = new Date(year, 0, 1); // January 1st
            end_date = new Date(year, 11, 31); // December 31st
            category = 'year';
        } else if (type === 'month') {
            // Parse month string like "January 2026"
            const monthStr = value as string;
            const [monthName, yearStr] = monthStr.split(' ');
            const year = parseInt(yearStr);
            const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
            start_date = new Date(year, monthIndex, 1); // First day of month
            end_date = new Date(year, monthIndex + 1, 0); // Last day of month
            category = 'month';
        } else { // week
            const week = value as { start: Date; end: Date };
            start_date = new Date(week.start);
            end_date = new Date(week.end);
            category = 'week';
        }

        // Ensure dates are within planner bounds
        const plannerStart = new Date(planner.date_start);
        const plannerEnd = planner.date_end ? new Date(planner.date_end) : plannerStart;

        if (start_date < plannerStart) start_date = plannerStart;
        if (end_date > plannerEnd) end_date = plannerEnd;

        setSelectedPeriod({ category, start_date, end_date });
        setSelectedButton({ type, value });
        setShowAddGoal(true);
    };

    const isButtonSelected = (type: 'year' | 'month' | 'week', value: any): boolean => {
        if (!selectedButton || selectedButton.type !== type) return false;

        if (type === 'year') {
            return selectedButton.value === value;
        } else if (type === 'month') {
            return selectedButton.value === value;
        } else { // week
            return selectedButton.value.start.getTime() === value.start.getTime() &&
                selectedButton.value.end.getTime() === value.end.getTime();
        }
    };

    const hasExistingGoals = (type: 'year' | 'month' | 'week', value: any): boolean => {
        if (!planner.goals || planner.goals.length === 0) return false;

        let start_date: Date;
        let end_date: Date;
        let category: string;

        if (type === 'year') {
            const year = value as number;
            start_date = new Date(year, 0, 1); // January 1st
            end_date = new Date(year, 11, 31); // December 31st
            category = 'year';
        } else if (type === 'month') {
            // Parse month string like "January 2026"
            const monthStr = value as string;
            const [monthName, yearStr] = monthStr.split(' ');
            const year = parseInt(yearStr);
            const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
            start_date = new Date(year, monthIndex, 1); // First day of month
            end_date = new Date(year, monthIndex + 1, 0); // Last day of month
            category = 'month';
        } else { // week
            const week = value as { start: Date; end: Date };
            start_date = new Date(week.start);
            end_date = new Date(week.end);
            category = 'week';
        }

        // Ensure dates are within planner bounds
        const plannerStart = new Date(planner.date_start);
        const plannerEnd = planner.date_end ? new Date(planner.date_end) : plannerStart;

        if (start_date < plannerStart) start_date = plannerStart;
        if (end_date > plannerEnd) end_date = plannerEnd;

        // Check if there are goals that match the category and date range exactly
        return planner.goals.some(goal => {
            // Must match the exact category
            if (goal.category !== category) return false;

            // Check if goal dates match the period dates exactly
            const goalStart = new Date(goal.date_start);
            const goalEnd = goal.date_end ? new Date(goal.date_end) : goalStart;

            // Normalize times to midnight for comparison
            goalStart.setHours(0, 0, 0, 0);
            goalEnd.setHours(0, 0, 0, 0);
            start_date.setHours(0, 0, 0, 0);
            end_date.setHours(0, 0, 0, 0);

            return goalStart.getTime() === start_date.getTime() &&
                goalEnd.getTime() === end_date.getTime();
        });
    };

    const getButtonClassName = (type: 'year' | 'month' | 'week', value: any): string => {
        const isSelected = isButtonSelected(type, value);
        const hasGoals = hasExistingGoals(type, value);

        if (isSelected) {
            return 'btn-success'; // Green for selected
        } else if (hasGoals) {
            return 'btn-secondary'; // Gray for existing goals
        } else {
            return 'btn-outline-dark'; // Default outline
        }
    };

    const getGoalsForSelectedPeriod = () => {
        if (!selectedPeriod || !planner.goals) return [];

        return planner.goals.filter(goal => {
            // Must match the exact category
            if (goal.category !== selectedPeriod.category) return false;

            // Check if goal dates match the period dates exactly
            const goalStart = new Date(goal.date_start);
            const goalEnd = goal.date_end ? new Date(goal.date_end) : goalStart;

            // Normalize times to midnight for comparison
            goalStart.setHours(0, 0, 0, 0);
            goalEnd.setHours(0, 0, 0, 0);
            const periodStart = new Date(selectedPeriod.start_date);
            const periodEnd = new Date(selectedPeriod.end_date);
            periodStart.setHours(0, 0, 0, 0);
            periodEnd.setHours(0, 0, 0, 0);

            return goalStart.getTime() === periodStart.getTime() && 
                   goalEnd.getTime() === periodEnd.getTime();
        });
    };

    const handleEdit = (goalIndex: number) => {
        const goalToEdit = planner.goals?.[goalIndex];
        if (goalToEdit) {
            setCurrentGoalText(goalToEdit.text);
            setEditingGoalIndex(goalIndex);
        }
    };

    const handleDelete = async (goalText: string) => {
        // Prevent deletion if planner is completed
        if (readOnly) {
            alert("Cannot delete goals from a completed planner.");
            return;
        }
        
        const updatedPlanner = {
            ...planner,
            goals: (planner.goals || []).filter((goal) => goal.text !== goalText)
        };

        setEditedPlanner(updatedPlanner);

        if (onGoalAdded) {
            onGoalAdded(updatedPlanner);
        }
    };

    const handleSaveGoalEdit = async (originalIndex: number) => {
        // Prevent saving edits if planner is completed
        if (readOnly) {
            alert("Cannot save changes to a completed planner.");
            return;
        }
        
        if (currentGoalText.trim() && editingGoalIndex !== null) {
            const updatedPlanner = {
                ...planner,
                goals: planner.goals?.map((goal, index) =>
                    index === editingGoalIndex ? { ...goal, text: currentGoalText.trim() } : goal
                ) || []
            };

            setEditedPlanner(updatedPlanner);
            setEditingGoalIndex(null);
            setCurrentGoalText("");

            if (onGoalAdded) {
                onGoalAdded(updatedPlanner);
            }
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'year':
                return (
                    <div className="row g-2">
                        {yearsInGoals().map((year, idx) => (
                            <div key={idx} className="col-6 col-md-4 col-lg-3">
                                <button
                                    type="button"
                                    className={`btn w-100 ${getButtonClassName('year', year)}`}
                                    onClick={() => handlePeriodClick('year', year)}
                                >
                                    {year}
                                </button>
                            </div>
                        ))}
                    </div>
                );
            case 'month':
                return (
                    <div className="row g-2">
                        {monthsInGoals(selectedYear || undefined).map((month, idx) => (
                            <div key={idx} className="col-12 col-md-6 col-lg-4">
                                <button
                                    type="button"
                                    className={`btn w-100 text-start ${getButtonClassName('month', month)}`}
                                    onClick={() => handlePeriodClick('month', month)}
                                >
                                    {month}
                                </button>
                            </div>
                        ))}
                    </div>
                );
            case 'week':
                return (
                    <div className="row g-2">
                        {weeksInGoals(selectedYear || undefined, selectedMonth !== null ? selectedMonth : undefined).map((week, idx) => (
                            <div key={idx} className="col-12 col-md-6 col-xl-4">
                                <button
                                    type="button"
                                    className={`btn w-100 text-start ${getButtonClassName('week', week)}`}
                                    onClick={() => handlePeriodClick('week', week)}
                                >
                                    {week.start.toLocaleDateString()} - {week.end.toLocaleDateString()}
                                </button>
                            </div>
                        ))}
                    </div>
                );
            case null:
                return (
                    <div className="text-center text-muted mt-4">
                        <p>Please select a view (Year, Month, or Week) to see milestone goals.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <h3>Milestone Goals</h3>

            <div className="btn-group mb-4" role="group" aria-label="View selector">
                <button
                    type="button"
                    onClick={() => {
                        setActiveView(activeView === 'year' ? null : 'year');
                        setSelectedYear(null);
                        setSelectedMonth(null);
                        setSelectedButton(null);
                    }}
                    className={`btn ${activeView === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                    Year
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setActiveView(activeView === 'month' ? null : 'month');
                        setSelectedYear(null);
                        setSelectedMonth(null);
                        setSelectedButton(null);
                    }}
                    className={`btn ${activeView === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                    Month
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setActiveView(activeView === 'week' ? null : 'week');
                        setSelectedYear(null);
                        setSelectedMonth(null);
                        setSelectedButton(null);
                    }}
                    className={`btn ${activeView === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                    Week
                </button>
            </div>

            {/* Year filter buttons for month view */}
            {activeView === 'month' && (
                <div className="mb-3">
                    <div className="btn-group" role="group" aria-label="Year filter">
                        <button
                            type="button"
                            onClick={() => setSelectedYear(null)}
                            className={`btn btn-sm ${selectedYear === null ? 'btn-secondary' : 'btn-outline-secondary'}`}
                        >
                            All Years
                        </button>
                        {yearsInGoals().map((year) => (
                            <button
                                key={year}
                                type="button"
                                onClick={() => setSelectedYear(year)}
                                className={`btn btn-sm ${selectedYear === year ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Year filter buttons for week view */}
            {activeView === 'week' && (
                <div className="mb-3">
                    <div className="btn-group" role="group" aria-label="Year filter for weeks">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedYear(null);
                                setSelectedMonth(null);
                            }}
                            className={`btn btn-sm ${selectedYear === null ? 'btn-secondary' : 'btn-outline-secondary'}`}
                        >
                            All Years
                        </button>
                        {yearsInGoals().map((year) => (
                            <button
                                key={year}
                                type="button"
                                onClick={() => {
                                    setSelectedYear(year);
                                    setSelectedMonth(null);
                                }}
                                className={`btn btn-sm ${selectedYear === year ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Month filter buttons for week view when year is selected */}
            {activeView === 'week' && selectedYear && (
                <div className="mb-3">
                    <div className="btn-group" role="group" aria-label="Month filter for weeks">
                        <button
                            type="button"
                            onClick={() => setSelectedMonth(null)}
                            className={`btn btn-sm ${selectedMonth === null ? 'btn-info' : 'btn-outline-info'}`}
                        >
                            All Months
                        </button>
                        {getMonthsInYear(selectedYear).map((month) => (
                            <button
                                key={month.value}
                                type="button"
                                onClick={() => setSelectedMonth(month.value)}
                                className={`btn btn-sm ${selectedMonth === month.value ? 'btn-info' : 'btn-outline-info'}`}
                            >
                                {month.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {renderContent()}

            {/* Add Goal Modal/Component */}
            {showAddGoal && selectedPeriod && (
                <div className="mt-4 p-3 border rounded bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>{readOnly ? 'Goals for Selected Period' : 'Add Goal for Selected Period'}</h5>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                                setShowAddGoal(false);
                                setSelectedPeriod(null);
                                setSelectedButton(null);
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-muted mb-3">
                        Period: {selectedPeriod.start_date.toLocaleDateString()} - {selectedPeriod.end_date.toLocaleDateString()}
                    </p>
                    
                    {/* Show existing goals for the selected period */}
                    <div className="mb-4">
                        <h6>Existing Goals for This Period</h6>
                        {getGoalsForSelectedPeriod().length > 0 ? (
                            <div className="mb-3">
                                {getGoalsForSelectedPeriod().map((goal, periodIndex) => {
                                    const originalIndex = planner.goals?.findIndex(g => g === goal) ?? -1;
                                    return (
                                        <div key={originalIndex} className="d-flex align-items-center p-3 border rounded bg-light mb-1">
                                            <div className="me-3">
                                                <SlStar size={40} className="text-primary" />
                                            </div>
                                            {editingGoalIndex !== originalIndex ? (
                                                <div className="transactionDetails flex-grow-1">
                                                    <div className="transactionName mb-1 fw-bold">{goal.text}</div>
                                                </div>
                                            ) : (
                                                <textarea
                                                    value={currentGoalText}
                                                    onChange={(e) => setCurrentGoalText(e.target.value)}
                                                    className="form-control me-2"
                                                    rows={2}
                                                    style={{ resize: 'vertical', minHeight: '50px', maxWidth: '400px' }}
                                                />
                                            )}
                                            {editingGoalIndex !== originalIndex ? (
                                                <div className="d-flex gap-1">
                                                    <button
                                                        className={`btn btn-sm btn-secondary ${readOnly ? 'disabled' : ''}`}
                                                        onClick={() => {
                                                            if (!readOnly) {
                                                                setCurrentGoalText(goal.text);
                                                                setEditingGoalIndex(originalIndex);
                                                            }
                                                        }}
                                                        aria-label="Edit Goal"
                                                        disabled={readOnly}
                                                    >
                                                        <SlPencil size={20} />
                                                    </button>
                                                    <button
                                                        className={`btn btn-sm btn-danger ${readOnly ? 'disabled' : ''}`}
                                                        onClick={() => !readOnly && handleDelete(goal.text)}
                                                        aria-label="Delete Goal"
                                                        disabled={readOnly}
                                                    >
                                                        <SlTrash size={20} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="d-flex gap-1">
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleSaveGoalEdit(originalIndex)}
                                                        aria-label="Save"
                                                    >
                                                        <SlPaperPlane size={20} />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => { 
                                                            setEditingGoalIndex(null); 
                                                            setCurrentGoalText(""); 
                                                        }}
                                                        aria-label="Cancel"
                                                    >
                                                        <SlClose size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-muted fst-italic">No goals for this time period</p>
                        )}
                    </div>

                    {/* Only show add goal input if planner is not completed */}
                    {!readOnly && (
                        <AddGoalBtnInput
                            planner={planner}
                            mode="edit"
                            category={selectedPeriod.category}
                            start_date={selectedPeriod.start_date}
                            end_date={selectedPeriod.end_date}
                            setEditedPlanner={setEditedPlanner}
                            onGoalAdded={(updatedPlanner) => {
                                if (onGoalAdded) {
                                    onGoalAdded(updatedPlanner);
                                }
                            }}
                        />
                    )}
                    
                    {/* Show read-only notice for completed planners */}
                    {readOnly && (
                        <div className="alert alert-info mt-3" role="alert">
                            <small>
                                <strong>Read-only mode:</strong> This planner is completed and cannot be modified.
                            </small>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}