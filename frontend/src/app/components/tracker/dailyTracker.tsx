"use client";
import { useState, useEffect } from 'react';
import { ITask } from '../../../interfaces/ITasks';
import { fetchTasks, updateTask } from '../../../data/fetch_tasks';
import { cleanupDailyTracker } from '../../../data/fetch_daily_tracker';

interface DailyTrackerProps {
    onTaskUpdate?: () => void;
}

export default function DailyTracker({ onTaskUpdate }: DailyTrackerProps) {
    const [dailyTasks, setDailyTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(true);
    const [dragOver, setDragOver] = useState(false);

    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    useEffect(() => {
        initializeDailyTracker();
    }, []);

    const initializeDailyTracker = async () => {
        try {
            // First, clean up any expired daily tracker tasks
            await cleanupDailyTracker();
            // Then load today's tasks
            await loadDailyTasks();
        } catch (error) {
            console.error('Error initializing daily tracker:', error);
            setLoading(false);
        }
    };

    const loadDailyTasks = async () => {
        try {
            const tasks = await fetchTasks();
            // Filter tasks that are assigned to today's tracker
            const todayTasks = tasks.filter((task: ITask) => 
                task.daily_tracker_date === todayString && !task.date_done
            );
            setDailyTasks(todayTasks);
        } catch (error) {
            console.error('Error loading daily tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        try {
            const taskData = e.dataTransfer.getData('application/json');
            const task: ITask = JSON.parse(taskData);

            // Add task to daily tracker
            const updatedTask = {
                ...task,
                daily_tracker_date: todayString
            };

            const result = await updateTask(updatedTask);
            
            if (result) {
                // Immediately add the task to local state for instant UI update
                setDailyTasks(prevTasks => [...prevTasks, updatedTask]);
                
                // Wait a moment for the backend to process, then refresh task list
                setTimeout(() => {
                    if (onTaskUpdate) onTaskUpdate();
                }, 200);
            } else {
                console.error('Failed to add task to daily tracker in backend');
            }
        } catch (error) {
            console.error('Error adding task to daily tracker:', error);
        }
    };

    const handleTaskComplete = async (taskId: string) => {
        try {
            const task = dailyTasks.find(t => t.id === taskId);
            if (task) {
                // Set daily_tracker_date to null and add completion date
                const updatedTask = {
                    ...task,
                    daily_tracker_date: null,
                    date_done: new Date()
                };
                const result = await updateTask(updatedTask);
                
                if (result) {
                    // Immediately remove the completed task from local state
                    setDailyTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
                    
                    // Wait a moment for the backend to process, then refresh task list
                    setTimeout(() => {
                        if (onTaskUpdate) onTaskUpdate();
                    }, 200);
                } else {
                    console.error('Failed to complete task in backend');
                }
            }
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    const handleRemoveFromTracker = async (taskId: string) => {
        try {
            console.log('Removing task from tracker:', taskId);
            const task = dailyTasks.find(t => t.id === taskId);
            if (task) {
                console.log('Found task to remove:', task);
                // Explicitly set daily_tracker_date to null to remove it from database
                const updatedTask = {
                    ...task,
                    daily_tracker_date: null
                };
                console.log('Updated task:', updatedTask);
                const result = await updateTask(updatedTask);
                console.log('Update result:', result);
                
                if (result) {
                    // Immediately remove the task from local state for instant UI update
                    setDailyTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
                    
                    // Wait a moment for the backend to process, then refresh task list
                    setTimeout(() => {
                        if (onTaskUpdate) onTaskUpdate();
                    }, 200);
                } else {
                    console.error('Failed to update task in backend');
                }
            } else {
                console.error('Task not found in dailyTasks:', taskId);
            }
        } catch (error) {
            console.error('Error removing task from tracker:', error);
        }
    };

    const getPriorityBadge = (priority?: number) => {
        if (!priority) return null;
        
        const priorityConfig = {
            1: { class: 'bg-danger', text: 'P1', label: 'Critical' },
            2: { class: 'bg-warning text-dark', text: 'P2', label: 'High' },
            3: { class: 'bg-secondary', text: 'P3', label: 'Medium' },
            4: { class: 'bg-info', text: 'P4', label: 'Low' },
            5: { class: 'bg-light text-dark border', text: 'P5', label: 'Very Low' }
        };

        const config = priorityConfig[priority as keyof typeof priorityConfig];
        return (
            <span className={`badge ${config.class} me-2`} title={config.label}>
                {config.text}
            </span>
        );
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading daily tracker...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <h5 className="mb-1 d-flex align-items-center">
                            <i className="bi bi-calendar-day me-2"></i>
                            Today's Focus
                        </h5>
                        <small className="text-warning">{formatDate(today)}</small>
                    </div>
                    <div className="badge bg-warning text-dark fs-6">
                        {dailyTasks.length} tasks
                    </div>
                </div>
            </div>

            <div 
                className={`card-body ${dragOver ? 'bg-primary bg-opacity-10 border-primary' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ minHeight: '450px', maxHeight: '500px' }}
            >
                {dragOver && (
                    <div className="text-center py-5">
                        <i className="bi bi-plus-circle text-primary" style={{ fontSize: '3rem' }}></i>
                        <p className="text-primary fw-bold mt-2">Drop task here to add to today's focus</p>
                    </div>
                )}

                {!dragOver && dailyTasks.length === 0 && (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-calendar-x" style={{ fontSize: '3rem' }}></i>
                        <h6 className="mt-3">No tasks for today</h6>
                        <p>Drag tasks from your task list to focus on them today</p>
                    </div>
                )}

                {!dragOver && dailyTasks.length > 0 && (
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {dailyTasks.map((task) => (
                            <div key={task.id} className="card border-0 shadow-sm bg-light">
                                <div className="card-body py-2 px-3">
                                    <div className="d-flex align-items-center justify-content-between mb-1">
                                        <div className="d-flex align-items-center flex-grow-1 min-w-0">
                                            {getPriorityBadge(task.priority)}
                                            <h6 className="mb-0 text-truncate flex-grow-1 fs-6">
                                                {task.name}
                                            </h6>
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            <button 
                                                className="btn btn-outline-success btn-sm py-0 px-2"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (task.id) {
                                                        handleTaskComplete(task.id);
                                                    }
                                                }}
                                                title="Mark Complete"
                                            >
                                                <i className="bi bi-check"></i>
                                            </button>
                                            <button 
                                                className="btn btn-outline-warning btn-sm py-0 px-2"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    console.log('Remove button clicked for task:', task.id);
                                                    if (task.id) {
                                                        handleRemoveFromTracker(task.id);
                                                    } else {
                                                        console.error('Task ID is missing:', task);
                                                    }
                                                }}
                                                title="Remove from Today"
                                            >
                                                <i className="bi bi-arrow-left"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {task.description && (
                                        <p className="text-muted small mb-1 text-truncate" style={{fontSize: '0.75rem'}}>
                                            {task.description}
                                        </p>
                                    )}

                                    <div className="d-flex align-items-center justify-content-between small text-muted">
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            {task.date_end && (
                                                <span className="badge bg-light text-dark border" style={{fontSize: '0.65rem'}}>
                                                    <i className="bi bi-calendar3 me-1"></i>
                                                    {new Date(task.date_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                            
                                            {task.labels && task.labels.length > 0 && (
                                                <div className="d-flex align-items-center gap-1">
                                                    {task.labels.slice(0, 1).map((labelId, index) => (
                                                        <span key={labelId} className="badge bg-secondary" style={{fontSize: '0.65rem'}}>
                                                            {labelId.replace('preset-', '').substring(0, 8)}
                                                        </span>
                                                    ))}
                                                    {task.labels.length > 1 && (
                                                        <span className="badge bg-outline-secondary border" style={{fontSize: '0.65rem'}}>
                                                            +{task.labels.length - 1}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {dailyTasks.length > 0 && (
                <div className="card-footer bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Drag & drop tasks from your task list
                        </small>
                        <div className="d-flex gap-2">
                            <span className="badge bg-success">
                                {dailyTasks.filter(t => t.date_done).length} completed
                            </span>
                            <span className="badge bg-primary">
                                {dailyTasks.filter(t => !t.date_done).length} remaining
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}