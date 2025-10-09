"use client";
import { useState, useEffect } from 'react';
import { ITask } from '../../../interfaces/ITasks';
import { IPlanner, IGoal } from '../../../interfaces/IPlanner';
import PlannerTaskCreateModal from './plannerTaskCreateModal';
import PlannerTaskEditModal from './plannerTaskEditModal';
import TaskActionModal from './taskActionModal';

interface PlannerCalendarProps {
    planner: IPlanner;
    onTaskUpdate?: (updatedTasks: ITask[]) => void;
}

type CalendarView = 'week' | 'month';

export default function PlannerCalendar({ planner, onTaskUpdate }: PlannerCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarView>('week');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [taskCreationDate, setTaskCreationDate] = useState<string | null>(null);
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState<ITask | null>(null);
    const [showTaskActionModal, setShowTaskActionModal] = useState(false);
    const [taskForAction, setTaskForAction] = useState<ITask | null>(null);
    const [showDayDetailsModal, setShowDayDetailsModal] = useState(false);
    const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);
    const [selectedDayTasks, setSelectedDayTasks] = useState<ITask[]>([]);

    // Get tasks from planner
    const plannerTasks = planner.tasks || [];
    
    // Get goals for different time periods based on category and date matching
    const getYearGoals = (): IGoal[] => {
        const currentYear = currentDate.getFullYear();

        return (planner.goals || []).filter(goal => {
            // Must be category "year"
            if (goal.category !== 'year') return false;
            
            // date_start must be the same year as current week/month
            const goalStart = new Date(goal.date_start);
            return goalStart.getFullYear() === currentYear;
        });
    };

    const getMonthGoals = (): IGoal[] => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        return (planner.goals || []).filter(goal => {
            // Must be category "month"
            if (goal.category !== 'month') return false;
            
            // date_start or date_end must be the same month as current week
            const goalStart = new Date(goal.date_start);
            const goalEnd = goal.date_end ? new Date(goal.date_end) : null;
            
            const startMatches = goalStart.getMonth() === currentMonth && goalStart.getFullYear() === currentYear;
            const endMatches = goalEnd && goalEnd.getMonth() === currentMonth && goalEnd.getFullYear() === currentYear;
            
            return startMatches || endMatches;
        });
    };

    const getWeekGoals = (): IGoal[] => {
        const startOfWeek = getStartOfWeek(currentDate);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return (planner.goals || []).filter(goal => {
            // Must be category "week"
            if (goal.category !== 'week') return false;
            
            // date_start must be the same as current week
            const goalStart = new Date(goal.date_start);
            return goalStart >= startOfWeek && goalStart <= endOfWeek;
        });
    };

    // Helper functions
    const getStartOfWeek = (date: Date): Date => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    };

    const getStartOfMonth = (date: Date): Date => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };

    const getDaysInMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const formatDateKey = (date: Date): string => {
        // Use local timezone to avoid timezone conversion issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // YYYY-MM-DD format
    };

    const getTasksForDate = (dateKey: string): ITask[] => {
        return plannerTasks.filter(task => task.scheduled_date === dateKey);
    };

    const isOverloaded = (dateKey: string): boolean => {
        return getTasksForDate(dateKey).length > 3;
    };

    // Navigation functions
    const navigatePrevious = () => {
        const newDate = new Date(currentDate);
        if (view === 'week') {
            newDate.setDate(currentDate.getDate() - 7);
        } else {
            newDate.setMonth(currentDate.getMonth() - 1);
        }
        setCurrentDate(newDate);
    };

    const navigateNext = () => {
        const newDate = new Date(currentDate);
        if (view === 'week') {
            newDate.setDate(currentDate.getDate() + 7);
        } else {
            newDate.setMonth(currentDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const navigateToday = () => {
        setCurrentDate(new Date());
    };

    // Task creation handlers
    const handleCreateTaskClick = (dateKey: string) => {
        setTaskCreationDate(dateKey);
        setShowCreateTaskModal(true);
    };

    const handleDayClick = (dateKey: string) => {
        const dayTasks = getTasksForDate(dateKey);
        setSelectedDayDate(dateKey);
        setSelectedDayTasks(dayTasks);
        setShowDayDetailsModal(true);
    };

    const handleTaskCreated = async (newTask: ITask) => {
        try {
            // Create planner task directly without adding to user's main task collection
            const taskWithSchedule: ITask = {
                ...newTask,
                scheduled_date: taskCreationDate || undefined,
                id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9), // Generate unique ID for planner task
                date_start: new Date()
            };

            // Add the task directly to the planner's task list
            const updatedTasks = [...plannerTasks, taskWithSchedule];

            if (onTaskUpdate) {
                onTaskUpdate(updatedTasks);
            }
        } catch (error) {
            console.error('Error creating planner task:', error);
            alert('Error creating task. Please try again.');
        }

        setShowCreateTaskModal(false);
        setTaskCreationDate(null);
    };

    const handleEditTaskClick = (task: ITask) => {
        setEditingTask(task);
        setShowEditTaskModal(true);
    };

    const handleTaskEdited = (editedTask: ITask) => {
        // Update the task in the planner's task list
        const updatedTasks = plannerTasks.map(t => 
            t.id === editedTask.id ? editedTask : t
        );

        if (onTaskUpdate) {
            onTaskUpdate(updatedTasks);
        }

        setShowEditTaskModal(false);
        setEditingTask(null);
    };

    const handleTaskDeleted = (taskId: string) => {
        // Remove the task from the planner's task list
        const updatedTasks = plannerTasks.filter(t => t.id !== taskId);

        if (onTaskUpdate) {
            onTaskUpdate(updatedTasks);
        }

        setShowEditTaskModal(false);
        setEditingTask(null);
    };

    // Render week view
    const renderWeekView = () => {
        const startOfWeek = getStartOfWeek(currentDate);
        const days = [];

        for (let i = 0; i < 7; i++) {
            // Create date object in local timezone to avoid UTC conversion issues
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateKey = formatDateKey(date);
            const dayTasks = getTasksForDate(dateKey);
            const overloaded = isOverloaded(dateKey);

            days.push(
                <div key={dateKey} className="col">
                    <div 
                        className={`card h-100 ${overloaded ? 'border-warning border-2' : 'border-light'}`}
                        style={{ minHeight: '200px' }}
                    >
                        <div className={`card-header text-center py-2 ${overloaded ? 'bg-warning text-dark' : 'bg-light'}`}>
                            <h6 className="mb-0">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </h6>
                            <small className="fw-bold">
                                {date.getDate()}
                            </small>
                            {overloaded && (
                                <div className="mt-1">
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    <small>Overloaded</small>
                                </div>
                            )}
                        </div>
                        <div className="card-body p-2" style={{ fontSize: '0.8rem' }}>
                            {dayTasks.map((task, idx) => (
                                <div key={task.id || idx} className="mb-1">
                                    <div className={`badge w-100 text-start p-2 ${
                                        task.date_done ? 'bg-success text-white' :
                                        task.priority === 1 ? 'bg-danger text-white' :
                                        task.priority === 2 ? 'bg-warning text-dark' :
                                        'bg-secondary text-white'
                                    }`} style={{ fontSize: '0.7rem' }}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="text-truncate me-1">{task.name}</span>
                                            <div className="d-flex gap-1">
                                                <button 
                                                    className="btn btn-sm p-0 text-white"
                                                    onClick={() => handleEditTaskClick(task)}
                                                    style={{ fontSize: '0.6rem' }}
                                                    title="Edit task"
                                                >
                                                    <i className="bi bi-info-circle"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-sm p-0 text-white"
                                                    onClick={() => handleTaskActionClick(task)}
                                                    style={{ fontSize: '0.6rem' }}
                                                    title="Task actions"
                                                >
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="mt-2">
                                <button 
                                    className="btn btn-outline-primary btn-sm w-100"
                                    onClick={() => handleCreateTaskClick(dateKey)}
                                    title="Create new task for this date"
                                >
                                    <i className="bi bi-plus-circle me-1"></i>
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return <div className="row g-2">{days}</div>;
    };

    // Render month view
    const renderMonthView = () => {
        const startOfMonth = getStartOfMonth(currentDate);
        const daysInMonth = getDaysInMonth(currentDate);
        const startDay = startOfMonth.getDay();
        const weeks = [];

        let date = 1;
        
        for (let week = 0; week < 6; week++) {
            const days = [];
            
            for (let day = 0; day < 7; day++) {
                if (week === 0 && day < startDay) {
                    days.push(<div key={`empty-${day}`} className="col p-1"></div>);
                } else if (date > daysInMonth) {
                    days.push(<div key={`empty-end-${day}`} className="col p-1"></div>);
                } else {
                    // Create date object in local timezone to avoid UTC conversion issues
                    const currentDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
                    const dateKey = formatDateKey(currentDateObj);
                    const dayTasks = getTasksForDate(dateKey);
                    const overloaded = isOverloaded(dateKey);

                    days.push(
                        <div key={dateKey} className="col p-1">
                            <div 
                                className={`card h-100 ${overloaded ? 'border-warning border-2' : 'border-light'} ${dayTasks.length > 0 ? 'calendar-day-clickable' : ''}`}
                                style={{ minHeight: '80px', cursor: dayTasks.length > 0 ? 'pointer' : 'default' }}
                                onClick={() => dayTasks.length > 0 && handleDayClick(dateKey)}
                                title={dayTasks.length > 0 ? `Click to view all ${dayTasks.length} task(s) for this date` : ''}
                            >
                                <div className={`card-header text-center py-1 ${overloaded ? 'bg-warning text-dark' : 'bg-light'}`}>
                                    <small className="fw-bold">{date}</small>
                                    {overloaded && <i className="bi bi-exclamation-triangle ms-1" style={{ fontSize: '0.7rem' }}></i>}
                                </div>
                                <div className="card-body p-1" style={{ fontSize: '0.65rem' }}>
                                    {dayTasks.slice(0, 1).map((task, idx) => (
                                        <div key={task.id || idx} className="mb-1">
                                            <div className={`badge w-100 text-truncate p-1 ${
                                                task.date_done ? 'bg-success text-white' : 'bg-primary text-white'
                                            }`} style={{ fontSize: '0.55rem' }}>
                                                {task.name}
                                            </div>
                                        </div>
                                    ))}
                                    {dayTasks.length > 1 && (
                                        <small className="text-muted d-block mb-1">+{dayTasks.length - 1} more</small>
                                    )}
                                    <button 
                                        className="btn btn-outline-primary btn-sm w-100 p-1"
                                        onClick={() => handleCreateTaskClick(dateKey)}
                                        style={{ fontSize: '0.6rem' }}
                                        title="Add task"
                                    >
                                        <i className="bi bi-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                    date++;
                }
            }
            
            weeks.push(<div key={week} className="row g-1 mb-1">{days}</div>);
            
            if (date > daysInMonth) break;
        }

        return <div>{weeks}</div>;
    };

    const handleTaskActionClick = (task: ITask) => {
        setTaskForAction(task);
        setShowTaskActionModal(true);
    };

    const handlePermanentDelete = (taskId: string) => {
        // Remove the task completely from the planner's task list
        const updatedTasks = plannerTasks.filter(t => t.id !== taskId);
        
        if (onTaskUpdate) {
            onTaskUpdate(updatedTasks);
        }

        setShowTaskActionModal(false);
        setTaskForAction(null);
    };

    const handleRemoveFromDate = (taskId: string) => {
        // Remove the scheduled_date, date_start, AND date_end to make it completely dateless
        // This will make it appear in today's planner tasks as an unscheduled task
        const updatedTasks = plannerTasks.map(task => 
            task.id === taskId ? { 
                ...task, 
                scheduled_date: undefined,
                date_start: new Date(), // Set to current date as creation date
                date_end: undefined
            } as ITask : task
        );
        
        if (onTaskUpdate) {
            onTaskUpdate(updatedTasks);
        }

        setShowTaskActionModal(false);
        setTaskForAction(null);
    };

    const handleCancelTaskAction = () => {
        setShowTaskActionModal(false);
        setTaskForAction(null);
    };

    // Get goals based on current view
    const yearGoals = getYearGoals();
    const monthGoals = getMonthGoals();
    const weekGoals = getWeekGoals();

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
                <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0">
                        <i className="bi bi-calendar3 me-2"></i>
                        Planner Calendar
                    </h5>
                    <div className="d-flex align-items-center gap-2">
                        <div className="btn-group" role="group">
                            <button 
                                className={`btn btn-sm ${view === 'week' ? 'btn-warning' : 'btn-outline-light'}`}
                                onClick={() => setView('week')}
                            >
                                Week
                            </button>
                            <button 
                                className={`btn btn-sm ${view === 'month' ? 'btn-warning' : 'btn-outline-light'}`}
                                onClick={() => setView('month')}
                            >
                                Month
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-body">
                {/* Navigation */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-outline-primary btn-sm" onClick={navigatePrevious}>
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={navigateToday}>
                            Today
                        </button>
                        <button className="btn btn-outline-primary btn-sm" onClick={navigateNext}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                    <h6 className="mb-0">
                        {view === 'week' 
                            ? `Week of ${getStartOfWeek(currentDate).toLocaleDateString()}`
                            : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        }
                    </h6>
                </div>

                {/* Goals Display Based on View */}
                {view === 'week' ? (
                    // Week View: Show Year, Month, and Week Goals
                    <>
                        {/* Year Goals */}
                        <div className="alert alert-primary mb-2">
                            <h6 className="alert-heading mb-2">
                                <i className="bi bi-calendar4-year me-2"></i>
                                This Year's Goals
                            </h6>
                            {yearGoals.length > 0 ? (
                                <ul className="mb-0 small">
                                    {yearGoals.slice(0, 3).map((goal: IGoal, idx: number) => (
                                        <li key={goal.id || idx}>
                                            <strong>{goal.text}</strong>
                                            {goal.date_end && (
                                                <small className="text-muted ms-2">
                                                    (Due: {new Date(goal.date_end).toLocaleDateString()})
                                                </small>
                                            )}
                                        </li>
                                    ))}
                                    {yearGoals.length > 3 && (
                                        <li className="text-muted">...and {yearGoals.length - 3} more</li>
                                    )}
                                </ul>
                            ) : (
                                <p className="mb-0 small text-muted">
                                    <i className="bi bi-info-circle me-2"></i>
                                    No yearly goals have been added yet. Create goals for this year to see them here.
                                </p>
                            )}
                        </div>
                        
                        {/* Month Goals */}
                        <div className="alert alert-success mb-2">
                            <h6 className="alert-heading mb-2">
                                <i className="bi bi-calendar3 me-2"></i>
                                This Month's Goals
                            </h6>
                            {monthGoals.length > 0 ? (
                                <ul className="mb-0 small">
                                    {monthGoals.map((goal: IGoal, idx: number) => (
                                        <li key={goal.id || idx}>
                                            <strong>{goal.text}</strong>
                                            {goal.date_end && (
                                                <small className="text-muted ms-2">
                                                    (Due: {new Date(goal.date_end).toLocaleDateString()})
                                                </small>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mb-0 small text-muted">
                                    <i className="bi bi-info-circle me-2"></i>
                                    No monthly goals have been added yet. Create goals for this month to see them here.
                                </p>
                            )}
                        </div>
                        
                        {/* Week Goals */}
                        <div className="alert alert-info mb-2">
                            <h6 className="alert-heading mb-2">
                                <i className="bi bi-calendar-week me-2"></i>
                                This Week's Goals
                            </h6>
                            {weekGoals.length > 0 ? (
                                <ul className="mb-0 small">
                                    {weekGoals.map((goal: IGoal, idx: number) => (
                                        <li key={goal.id || idx}>
                                            <strong>{goal.text}</strong>
                                            {goal.date_end && (
                                                <small className="text-muted ms-2">
                                                    (Due: {new Date(goal.date_end).toLocaleDateString()})
                                                </small>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mb-0 small text-muted">
                                    <i className="bi bi-info-circle me-2"></i>
                                    No weekly goals have been added yet. Create goals for this week to see them here.
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    // Month View: Show Year and Month Goals
                    <>
                        {/* Year Goals */}
                        <div className="alert alert-primary mb-2">
                            <h6 className="alert-heading mb-2">
                                <i className="bi bi-calendar4-year me-2"></i>
                                This Year's Goals
                            </h6>
                            {yearGoals.length > 0 ? (
                                <ul className="mb-0 small">
                                    {yearGoals.slice(0, 5).map((goal: IGoal, idx: number) => (
                                        <li key={goal.id || idx}>
                                            <strong>{goal.text}</strong>
                                            {goal.date_end && (
                                                <small className="text-muted ms-2">
                                                    (Due: {new Date(goal.date_end).toLocaleDateString()})
                                                </small>
                                            )}
                                        </li>
                                    ))}
                                    {yearGoals.length > 5 && (
                                        <li className="text-muted">...and {yearGoals.length - 5} more</li>
                                    )}
                                </ul>
                            ) : (
                                <p className="mb-0 small text-muted">
                                    <i className="bi bi-info-circle me-2"></i>
                                    No yearly goals have been added yet. Create goals for this year to see them here.
                                </p>
                            )}
                        </div>
                        
                        {/* Month Goals */}
                        <div className="alert alert-success mb-2">
                            <h6 className="alert-heading mb-2">
                                <i className="bi bi-calendar3 me-2"></i>
                                This Month's Goals
                            </h6>
                            {monthGoals.length > 0 ? (
                                <ul className="mb-0 small">
                                    {monthGoals.map((goal: IGoal, idx: number) => (
                                        <li key={goal.id || idx}>
                                            <strong>{goal.text}</strong>
                                            {goal.date_end && (
                                                <small className="text-muted ms-2">
                                                    (Due: {new Date(goal.date_end).toLocaleDateString()})
                                                </small>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mb-0 small text-muted">
                                    <i className="bi bi-info-circle me-2"></i>
                                    No monthly goals have been added yet. Create goals for this month to see them here.
                                </p>
                            )}
                        </div>
                    </>
                )}

                {/* Calendar View */}
                {view === 'week' ? renderWeekView() : renderMonthView()}

                {/* Instructions */}
                <div className="mt-3">
                    <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Click the "+" button on any day to create a new planner-specific task for that date. 
                        {view === 'month' && (
                            <span> In month view, <strong>click on any day with tasks</strong> to view all tasks for that date. </span>
                        )}
                        These tasks are separate from your main task collection and only exist within this planner.
                        Days with more than 3 tasks will be highlighted in yellow as a warning.
                    </small>
                </div>
            </div>

            {/* Task Creation Modal */}
            {showCreateTaskModal && taskCreationDate && (
                <PlannerTaskCreateModal
                    scheduledDate={taskCreationDate}
                    onTaskCreated={handleTaskCreated}
                    onClose={() => {
                        setShowCreateTaskModal(false);
                        setTaskCreationDate(null);
                    }}
                />
            )}

            {/* Task Edit Modal */}
            {showEditTaskModal && editingTask && (
                <PlannerTaskEditModal
                    task={editingTask}
                    onTaskEdited={handleTaskEdited}
                    onTaskDeleted={handleTaskDeleted}
                    onClose={() => {
                        setShowEditTaskModal(false);
                        setEditingTask(null);
                    }}
                />
            )}

            {/* Task Action Modal */}
            {showTaskActionModal && taskForAction && (
                <TaskActionModal
                    task={taskForAction}
                    onPermanentDelete={handlePermanentDelete}
                    onRemoveFromDate={handleRemoveFromDate}
                    onCancel={handleCancelTaskAction}
                />
            )}

            {/* Day Details Modal */}
            {showDayDetailsModal && selectedDayDate && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-calendar-day me-2"></i>
                                    Tasks for {new Date(selectedDayDate + 'T00:00:00').toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowDayDetailsModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {selectedDayTasks.length > 0 ? (
                                    <div className="row">
                                        {selectedDayTasks.map((task, idx) => (
                                            <div key={task.id || idx} className="col-12 mb-3">
                                                <div className="card border-0 shadow-sm">
                                                    <div className="card-body">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <div className={`badge me-3 ${
                                                                    task.date_done ? 'bg-success' :
                                                                    task.priority === 1 ? 'bg-danger' :
                                                                    task.priority === 2 ? 'bg-warning text-dark' :
                                                                    'bg-secondary'
                                                                }`} style={{ minWidth: '60px' }}>
                                                                    {task.date_done ? 'Done' :
                                                                     task.priority === 1 ? 'High' :
                                                                     task.priority === 2 ? 'Medium' : 'Low'}
                                                                </div>
                                                                <div>
                                                                    <h6 className={`mb-1 ${task.date_done ? 'text-decoration-line-through text-muted' : ''}`}>
                                                                        {task.name}
                                                                    </h6>
                                                                    {task.description && (
                                                                        <small className="text-muted">{task.description}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-outline-primary btn-sm"
                                                                    onClick={() => {
                                                                        setShowDayDetailsModal(false);
                                                                        handleEditTaskClick(task);
                                                                    }}
                                                                    title="Edit task"
                                                                >
                                                                    <i className="bi bi-pencil"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => {
                                                                        setShowDayDetailsModal(false);
                                                                        handleTaskActionClick(task);
                                                                    }}
                                                                    title="Task actions"
                                                                >
                                                                    <i className="bi bi-three-dots"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <i className="bi bi-calendar-x display-4 text-muted mb-3"></i>
                                        <h5 className="text-muted">No tasks for this date</h5>
                                        <p className="text-muted">Click the "Add Task" button to create a new task for this date.</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-success"
                                    onClick={() => {
                                        setShowDayDetailsModal(false);
                                        handleCreateTaskClick(selectedDayDate);
                                    }}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add New Task
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowDayDetailsModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}