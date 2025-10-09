"use client";

import React from "react";
import { ITask } from "../../../interfaces/ITasks";
import { IPlanner } from "../../../interfaces/IPlanner";
import { SlInfo, SlCheck, SlArrowUpCircle } from "react-icons/sl";
import TaskViewModal from "../modals/taskViewModal";
import PlannerTaskEditModal from "./plannerTaskEditModal";

interface PlannerTaskListProps {
    planner: IPlanner;
    onTaskUpdate?: (updatedTasks: ITask[]) => void;
}

export default function PlannerTaskList({ planner, onTaskUpdate }: PlannerTaskListProps) {
    const [selectedTask, setSelectedTask] = React.useState<ITask | null>(null);
    const [showModal, setShowModal] = React.useState(false);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [editingTask, setEditingTask] = React.useState<ITask | null>(null);

    const allTasks = planner.tasks || [];

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

    // Filter tasks to show today's tasks + all dateless tasks
    const getTodaysTasks = (): ITask[] => {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        return allTasks.filter(task => {
            // Include tasks scheduled for today
            if (task.scheduled_date === todayString) {
                return true;
            }
            
            // Include tasks with due date today (and have date_start and date_end)
            if (task.date_end && task.date_start) {
                const dueDate = safeConvertDate(task.date_end);
                if (dueDate) {
                    const dueDateString = dueDate.toISOString().split('T')[0];
                    return dueDateString === todayString;
                }
            }
            
            // Include ALL tasks that are completely dateless (no date_start OR no date_end)
            // These are tasks that were removed from dates and need scheduling
            if (!task.date_start || !task.date_end) {
                return true;
            }
            
            return false;
        });
    };

    const tasks = getTodaysTasks();

    // Helper function to check if a task is overdue
    const isTaskOverdue = (task: ITask): boolean => {
        if (!task.date_end || task.date_done) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.date_end);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    };

    // Helper function to check if a task is due today
    const isTaskDueToday = (task: ITask): boolean => {
        if (!task.date_end) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.date_end);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
    };

    // Helper function to check if a task is due this week
    const isTaskDueThisWeek = (task: ITask): boolean => {
        if (!task.date_end) return false;
        const today = new Date();
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);
        weekFromNow.setHours(23, 59, 59, 999);
        
        const dueDate = new Date(task.date_end);
        return dueDate >= today && dueDate <= weekFromNow;
    };

    const handleInfoClick = (task: ITask) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleEditClick = (task: ITask) => {
        setEditingTask(task);
        setShowEditModal(true);
    };

    const handleTaskEdited = (editedTask: ITask) => {
        // Update the task in the planner's task list
        const updatedTasks = allTasks.map(t => 
            t.id === editedTask.id ? editedTask : t
        );

        if (onTaskUpdate) {
            onTaskUpdate(updatedTasks);
        }

        setShowEditModal(false);
        setEditingTask(null);
    };

    const handleTaskDeleted = (taskId: string) => {
        // Remove the task from the planner's task list
        const updatedTasks = allTasks.filter(t => t.id !== taskId);

        if (onTaskUpdate) {
            onTaskUpdate(updatedTasks);
        }

        setShowEditModal(false);
        setEditingTask(null);
    };

    const handleToggleTaskStatus = async (task: ITask) => {
        let updatedTask: ITask;
        
        if (task.date_done) {
            // Task is completed, reopen it
            updatedTask = {
                ...task,
                date_done: undefined
            };
        } else {
            // Task is not completed, mark as done
            updatedTask = {
                ...task,
                date_done: new Date()
            };
        }

        // Update the tasks in the planner
        const updatedTasks = tasks.map(t => 
            t.id === task.id ? updatedTask : t
        );

        if (onTaskUpdate) {
            onTaskUpdate(updatedTasks);
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-info text-white">
                    <h5 className="mb-0">
                        <i className="bi bi-list-task me-2"></i>
                        Planner Tasks
                    </h5>
                </div>
                <div className="card-body text-center py-5">
                    <i className="bi bi-clipboard-x display-4 text-muted mb-3"></i>
                    <h6 className="text-muted">No Tasks for Today</h6>
                    <p className="text-muted mb-0">
                        No tasks are scheduled for today. Use the "+" buttons on the calendar to create new tasks, or move existing tasks from other dates.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                    <i className="bi bi-calendar-day me-2"></i>
                    Today's Planner Tasks ({tasks.length})
                </h5>
                <small>Today's tasks & tasks without dates</small>
            </div>
            <div className="card-body">
                <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-3 g-3">
                    {tasks.map((task, idx) => {
                        const isOverdue = isTaskOverdue(task);
                        const isDueToday = isTaskDueToday(task);
                        const isDueThisWeek = isTaskDueThisWeek(task);
                        const isScheduled = task.scheduled_date;
                        const isUnscheduled = !task.date_start || !task.date_end;
                        
                        let cardClass = 'card shadow-sm h-100';
                        let cardBodyClass = 'card-body d-flex align-items-center position-relative';
                        let statusIndicator = '';
                        
                        // Priority-based styling (only for incomplete tasks)
                        if (!task.date_done && task.priority) {
                            if (task.priority === 1) {
                                cardClass += ' border-danger border-3';
                            } else if (task.priority === 2) {
                                cardClass += ' border-warning border-2';
                            }
                        }
                        
                        if (task.date_done) {
                            cardClass += ' border-success border-3';
                            cardBodyClass += ' bg-success bg-opacity-20';
                            statusIndicator = 'completed';
                        } else if (isUnscheduled) {
                            cardClass += ' border-secondary border-2 border-dashed';
                            cardBodyClass += ' bg-secondary bg-opacity-10';
                            statusIndicator = 'unscheduled';
                        } else if (isScheduled) {
                            cardClass += ' border-primary border-2';
                            cardBodyClass += ' bg-primary bg-opacity-10';
                            statusIndicator = 'scheduled';
                        } else if (isOverdue) {
                            cardClass += ' border-danger border-3';
                            cardBodyClass += ' bg-danger bg-opacity-10';
                            statusIndicator = 'overdue';
                        } else if (isDueToday) {
                            cardClass += ' border-warning border-2';
                            cardBodyClass += ' bg-warning bg-opacity-10';
                            statusIndicator = 'due-today';
                        } else if (isDueThisWeek) {
                            cardClass += ' border-info border-2';
                            cardBodyClass += ' bg-info bg-opacity-10';
                            statusIndicator = 'due-this-week';
                        } else {
                            cardClass += ' border-secondary border-1';
                            cardBodyClass += ' bg-light';
                            statusIndicator = 'no-due-date';
                        }
                        
                        return (
                            <div key={task.id ?? `task-${idx}`} className="col">
                                <div 
                                    className={cardClass}
                                    style={{ 
                                        opacity: task.date_done ? 0.7 : 1
                                    }}
                                >
                                    <div className={cardBodyClass}>
                                        <div className="me-3">
                                            <button
                                                className="btn btn-link p-0"
                                                onClick={() => handleToggleTaskStatus(task)}
                                                aria-label={task.date_done ? "Mark as undone" : "Mark as done"}
                                                title={task.date_done ? "Click to reopen task" : "Click to mark as complete"}
                                            >
                                                {task.date_done ? (
                                                    <SlCheck size={40} className="text-success" />
                                                ) : (
                                                    <SlArrowUpCircle size={40} className="text-success" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="transactionDetails flex-grow-1">
                                            <div className="d-flex align-items-center mb-1">
                                                <h6 className={`card-title mb-0 me-2 ${task.date_done ? 'text-decoration-line-through text-muted' : ''}`}>
                                                    {task.name}
                                                </h6>
                                                {statusIndicator === 'completed' && (
                                                    <span className="badge bg-success text-white" style={{fontSize: '0.6rem'}}>
                                                        <i className="bi bi-check-circle me-1"></i>Done
                                                    </span>
                                                )}
                                                {statusIndicator === 'unscheduled' && (
                                                    <span className="badge bg-secondary text-white" style={{fontSize: '0.6rem'}}>
                                                        <i className="bi bi-calendar-x me-1"></i>No Dates Set
                                                    </span>
                                                )}
                                                {statusIndicator === 'scheduled' && (
                                                    <span className="badge bg-primary text-white" style={{fontSize: '0.6rem'}}>
                                                        <i className="bi bi-calendar-check me-1"></i>Scheduled
                                                    </span>
                                                )}
                                                {statusIndicator === 'overdue' && (
                                                    <span className="badge bg-danger text-white" style={{fontSize: '0.6rem'}}>
                                                        <i className="bi bi-exclamation-triangle me-1"></i>Overdue
                                                    </span>
                                                )}
                                                {statusIndicator === 'due-today' && (
                                                    <span className="badge bg-warning text-dark" style={{fontSize: '0.6rem'}}>
                                                        <i className="bi bi-clock me-1"></i>Today
                                                    </span>
                                                )}
                                                {statusIndicator === 'due-this-week' && (
                                                    <span className="badge bg-info text-white" style={{fontSize: '0.6rem'}}>
                                                        <i className="bi bi-calendar-week me-1"></i>This Week
                                                    </span>
                                                )}
                                            </div>
                                            {task.date_end && (
                                                <p className="mb-0 text-muted" style={{fontSize: '0.75rem'}}>
                                                    <i className="bi bi-calendar-event me-1"></i>
                                                    Due: {(() => {
                                                        const date = safeConvertDate(task.date_end);
                                                        return date ? date.toLocaleDateString() : 'Invalid date';
                                                    })()}
                                                </p>
                                            )}
                                            {task.scheduled_date && (
                                                <p className="mb-0 text-primary" style={{fontSize: '0.75rem'}}>
                                                    <i className="bi bi-calendar-check me-1"></i>
                                                    Scheduled: {new Date(task.scheduled_date).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <div className="d-flex flex-column align-items-end">
                                            {/* Priority indicator */}
                                            {task.priority && (
                                                <div className="mb-1" title={`Priority ${task.priority}/5`}>
                                                    {task.priority === 1 && <span className="badge bg-danger">P1</span>}
                                                    {task.priority === 2 && <span className="badge bg-warning text-dark">P2</span>}
                                                    {task.priority === 3 && <span className="badge bg-secondary">P3</span>}
                                                    {task.priority === 4 && <span className="badge bg-info">P4</span>}
                                                    {task.priority === 5 && <span className="badge bg-light text-dark border">P5</span>}
                                                </div>
                                            )}
                                            <small className="text-muted mb-1">
                                                {(() => {
                                                    const date = safeConvertDate(task.date_start);
                                                    return date ? date.toLocaleDateString() : 'No date';
                                                })()}
                                            </small>
                                            <button
                                                className="btn btn-outline-info btn-sm"
                                                onClick={() => handleEditClick(task)}
                                                aria-label="Edit Task"
                                                disabled={!!task.date_done}
                                                title={task.date_done ? "Cannot edit completed tasks" : "Edit task"}
                                            >
                                                <SlInfo size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showModal && selectedTask && (
                <TaskViewModal task={selectedTask} setShowModal={setShowModal} mode="view" />
            )}

            {showEditModal && editingTask && (
                <PlannerTaskEditModal
                    task={editingTask}
                    onTaskEdited={handleTaskEdited}
                    onTaskDeleted={handleTaskDeleted}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingTask(null);
                    }}
                />
            )}
        </div>
    );
}