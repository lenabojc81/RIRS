"use client";

import React, { useEffect, useState } from "react";
import { ITask } from "../../../interfaces/ITasks";
import { SlArrowUpCircle, SlInfo, SlCheck } from "react-icons/sl";
import { fetchTasks, updateTask } from "../../../data/fetch_tasks";
import { fetchLabels, Label } from "../../../data/fetch_labels";
import TaskViewModal from "../modals/taskViewModal";

type SortOption = 'due_date' | 'created_last' | 'created_first' | 'priority' | 'alphabetical';
type FilterOption = 'all' | 'done' | 'undone' | 'overdue' | 'today' | 'this_week' | 'no_due_date';

export default function TaskList() {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortOption>('due_date');
    const [filterBy, setFilterBy] = useState<FilterOption>('all');
    const [labelFilter, setLabelFilter] = useState<string>('all');
    const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
    const itemsPerPage = 10;

    // Preset labels that come with the system
    const presetLabels: Label[] = [
        { id: 'preset-1', name: 'Work', color: '#3b82f6' },
        { id: 'preset-2', name: 'Personal', color: '#10b981' },
        { id: 'preset-3', name: 'Urgent', color: '#ef4444' },
        { id: 'preset-4', name: 'Health', color: '#f59e0b' },
        { id: 'preset-5', name: 'Learning', color: '#8b5cf6' },
        { id: 'preset-6', name: 'Shopping', color: '#ec4899' },
        { id: 'preset-7', name: 'Finance', color: '#06b6d4' },
        { id: 'preset-8', name: 'Home', color: '#84cc16' },
    ];

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

    // Helper function to sanitize task dates
    const sanitizeTask = (task: any): ITask => {
        return {
            ...task,
            date_start: safeConvertDate(task.date_start) || new Date(),
            date_end: safeConvertDate(task.date_end),
            date_done: safeConvertDate(task.date_done),
            priority: task.priority || 3 // Default to medium priority if not set
        };
    };

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

    // Filtering function
    const filterTasks = (tasks: ITask[], filter: FilterOption): ITask[] => {
        switch (filter) {
            case 'done':
                return tasks.filter(task => task.date_done);
            case 'undone':
                return tasks.filter(task => !task.date_done);
            case 'overdue':
                return tasks.filter(task => isTaskOverdue(task));
            case 'today':
                return tasks.filter(task => isTaskDueToday(task));
            case 'this_week':
                return tasks.filter(task => isTaskDueThisWeek(task));
            case 'no_due_date':
                return tasks.filter(task => !task.date_end);
            case 'all':
            default:
                return tasks;
        }
    };

    // Label filtering function
    const filterTasksByLabel = (tasks: ITask[], labelId: string): ITask[] => {
        if (labelId === 'all') return tasks;
        
        return tasks.filter(task => {
            // Check if task has the selected label
            if (task.labels && task.labels.includes(labelId)) {
                return true;
            }
            // For backward compatibility, also check the old label field
            if (task.label && task.label === labelId) {
                return true;
            }
            return false;
        });
    };

    // Sorting function
    const sortTasks = (tasks: ITask[], sort: SortOption): ITask[] => {
        const sortedTasks = [...tasks];
        
        switch (sort) {
            case 'due_date':
                return sortedTasks.sort((a, b) => {
                    // Tasks without due dates go to the end
                    if (!a.date_end && !b.date_end) return 0;
                    if (!a.date_end) return 1;
                    if (!b.date_end) return -1;
                    
                    // Sort by due date (nearest first)
                    const dateA = new Date(a.date_end);
                    const dateB = new Date(b.date_end);
                    return dateA.getTime() - dateB.getTime();
                });
            
            case 'created_last':
                return sortedTasks.sort((a, b) => {
                    const dateA = new Date(a.date_start);
                    const dateB = new Date(b.date_start);
                    return dateB.getTime() - dateA.getTime(); // Newest first
                });
            
            case 'created_first':
                return sortedTasks.sort((a, b) => {
                    const dateA = new Date(a.date_start);
                    const dateB = new Date(b.date_start);
                    return dateA.getTime() - dateB.getTime(); // Oldest first
                });
            
            case 'alphabetical':
                return sortedTasks.sort((a, b) => a.name.localeCompare(b.name));
            
            case 'priority':
                return sortedTasks.sort((a, b) => {
                    // First, separate completed tasks (they go to the end)
                    if (a.date_done && !b.date_done) return 1;
                    if (!a.date_done && b.date_done) return -1;
                    
                    // If both are completed or both are active, sort by priority number (1 = highest priority)
                    const priorityA = a.priority || 3; // Default to medium if not set
                    const priorityB = b.priority || 3; // Default to medium if not set
                    
                    if (priorityA !== priorityB) {
                        return priorityA - priorityB; // Lower number = higher priority (1 comes before 5)
                    }
                    
                    // If same priority, sort by date urgency
                    const dateUrgencyA = isTaskOverdue(a) ? 4 : isTaskDueToday(a) ? 3 : isTaskDueThisWeek(a) ? 2 : 1;
                    const dateUrgencyB = isTaskOverdue(b) ? 4 : isTaskDueToday(b) ? 3 : isTaskDueThisWeek(b) ? 2 : 1;
                    
                    if (dateUrgencyA !== dateUrgencyB) {
                        return dateUrgencyB - dateUrgencyA; // Higher urgency first
                    }
                    
                    // If same priority and urgency, sort by due date (nearest first)
                    if (a.date_end && b.date_end) {
                        return new Date(a.date_end).getTime() - new Date(b.date_end).getTime();
                    }
                    
                    // If one has due date and other doesn't, prioritize the one with due date
                    if (a.date_end && !b.date_end) return -1;
                    if (!a.date_end && b.date_end) return 1;
                    
                    return 0;
                });
            
            default:
                return sortedTasks;
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchTasks();
                console.log("Raw tasks from DB:", data);
                
                // Sanitize all tasks to ensure proper date handling
                const sanitizedTasks = data.map(sanitizeTask);
                console.log("Sanitized tasks:", sanitizedTasks);
                
                setTasks(sanitizedTasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setTasks([]);
            }
        })();
    }, []);

    // Fetch labels
    useEffect(() => {
        const loadLabels = async () => {
            try {
                const userLabels = await fetchLabels();
                setAvailableLabels([...presetLabels, ...userLabels]);
            } catch (error) {
                console.error('Error fetching labels:', error);
                // Fallback to just preset labels
                setAvailableLabels(presetLabels);
            }
        };
        loadLabels();
    }, []);

    // Apply filtering and sorting when tasks, sortBy, filterBy, or labelFilter change
    useEffect(() => {
        const statusFiltered = filterTasks(tasks, filterBy);
        const labelFiltered = filterTasksByLabel(statusFiltered, labelFilter);
        const sorted = sortTasks(labelFiltered, sortBy);
        setFilteredTasks(sorted);
        setCurrentPage(1); // Reset to first page when filters change
    }, [tasks, sortBy, filterBy, labelFilter]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

    const handleInfoClick = (task: ITask) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedTask(null);
    };

    const handleToggleTaskStatus = async (task: ITask) => {
        let updatedTask: any;
        
        if (task.date_done) {
            // Task is completed, reopen it
            updatedTask = {
                ...task,
                date_done: null as any // Set to null to clear the field
            };
        } else {
            // Task is not completed, mark as done
            updatedTask = {
                ...task,
                date_done: new Date()
            };
        }

        const success = await updateTask(updatedTask as ITask);
        if (success) {
            // Update the local tasks state to reflect the change immediately
            setTasks(prevTasks => 
                prevTasks.map(t => 
                    t.id === task.id 
                        ? { ...t, date_done: updatedTask.date_done === null ? undefined : updatedTask.date_done }
                        : t
                )
            );
        }
    };

    return (
        <div>
            {/* Filter and Sort Controls */}
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                                     style={{width: '40px', height: '40px'}}>
                                    <i className="bi bi-funnel fs-6"></i>
                                </div>
                                <div>
                                    <h6 className="mb-1">Filter Tasks</h6>
                                    <select 
                                        className="form-select form-select-sm"
                                        value={filterBy}
                                        onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                                        style={{minWidth: '150px'}}
                                    >
                                        <option value="all">All Tasks ({tasks.length})</option>
                                        <option value="undone">Active Tasks ({tasks.filter(t => !t.date_done).length})</option>
                                        <option value="done">Completed Tasks ({tasks.filter(t => t.date_done).length})</option>
                                        <option value="overdue">Overdue ({tasks.filter(t => isTaskOverdue(t)).length})</option>
                                        <option value="today">Due Today ({tasks.filter(t => isTaskDueToday(t)).length})</option>
                                        <option value="this_week">Due This Week ({tasks.filter(t => isTaskDueThisWeek(t)).length})</option>
                                        <option value="no_due_date">No Due Date ({tasks.filter(t => !t.date_end).length})</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                                     style={{width: '40px', height: '40px'}}>
                                    <i className="bi bi-tags fs-6"></i>
                                </div>
                                <div>
                                    <h6 className="mb-1">Filter by Label</h6>
                                    <select 
                                        className="form-select form-select-sm"
                                        value={labelFilter}
                                        onChange={(e) => setLabelFilter(e.target.value)}
                                        style={{minWidth: '150px'}}
                                    >
                                        <option value="all">All Labels</option>
                                        {availableLabels.map((label) => (
                                            <option key={label.id} value={label.id}>
                                                {label.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                                     style={{width: '40px', height: '40px'}}>
                                    <i className="bi bi-sort-down fs-6"></i>
                                </div>
                                <div>
                                    <h6 className="mb-1">Sort Tasks</h6>
                                    <select 
                                        className="form-select form-select-sm"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        style={{minWidth: '150px'}}
                                    >
                                        <option value="due_date">Due Date (Nearest First)</option>
                                        <option value="priority">Priority (Smart Sort)</option>
                                        <option value="created_last">Recently Created</option>
                                        <option value="created_first">Oldest First</option>
                                        <option value="alphabetical">Alphabetical</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Results Summary */}
                    <div className="mt-3 pt-3 border-top">
                        <div className="d-flex justify-content-between align-items-center text-muted small">
                            <span>
                                Showing {filteredTasks.length} of {tasks.length} tasks
                                {filterBy !== 'all' && (
                                    <span className="badge bg-info ms-2">
                                        {filterBy.replace('_', ' ').toUpperCase()}
                                    </span>
                                )}
                                {labelFilter !== 'all' && (
                                    <span className="badge bg-warning text-dark ms-2">
                                        <i className="bi bi-tag me-1"></i>
                                        {availableLabels.find(l => l.id === labelFilter)?.name || 'Unknown Label'}
                                    </span>
                                )}
                            </span>
                            {filteredTasks.length === 0 && tasks.length > 0 && (
                                <span className="text-warning">
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    No tasks match the current filter
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-3 g-3">
                {currentTasks.map((task, idx) => {
                    const isOverdue = isTaskOverdue(task);
                    const isDueToday = isTaskDueToday(task);
                    const isDueThisWeek = isTaskDueThisWeek(task);
                    
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
                        cardClass += ' border-success border-2';
                        cardBodyClass += ' bg-success bg-opacity-10';
                        statusIndicator = 'completed';
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
                                draggable={!task.date_done && !task.daily_tracker_date} // Only allow dragging incomplete tasks not already in tracker
                                onDragStart={(e) => {
                                    if (!task.date_done && !task.daily_tracker_date) {
                                        e.dataTransfer.setData('application/json', JSON.stringify(task));
                                        e.dataTransfer.effectAllowed = 'move';
                                    }
                                }}
                                style={{ 
                                    cursor: (!task.date_done && !task.daily_tracker_date) ? 'grab' : 'default',
                                    opacity: task.daily_tracker_date ? 0.6 : 1
                                }}
                                title={task.daily_tracker_date ? 'Task is already in today\'s tracker' : ''}
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
                                        {/* Label Badges */}
                                        {task.labels && task.labels.length > 0 && (
                                            <div className="d-flex flex-wrap gap-1 ms-1">
                                                {task.labels.map((labelId: string, index: number) => {
                                                    const label = availableLabels.find(l => l.id === labelId);
                                                    if (!label) return null;
                                                    return (
                                                        <span 
                                                            key={index}
                                                            className="badge"
                                                            style={{
                                                                backgroundColor: label.color,
                                                                color: '#fff',
                                                                fontSize: '0.55rem',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            {label.name}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <p className="card-text mb-0 text-muted small">{task.label}</p>
                                    {task.date_end && (
                                        <p className="mb-0 text-muted" style={{fontSize: '0.75rem'}}>
                                            <i className="bi bi-calendar-event me-1"></i>
                                            Due: {(() => {
                                                const date = safeConvertDate(task.date_end);
                                                return date ? date.toLocaleDateString() : 'Invalid date';
                                            })()}
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
                                        onClick={() => handleInfoClick(task)}
                                        aria-label="View Details"
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

            {/* Pagination Card */}
            {totalPages > 1 && (
                <div className="card shadow-sm mt-4">
                    <div className="card-body">
                        <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-center mb-0">
                                <li key="prev" className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        aria-label="Previous"
                                    >
                                        <span aria-hidden="true">&laquo;</span>
                                    </button>
                                </li>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <li
                                        key={`page-${index + 1}`}
                                        className={`page-item ${currentPage === index + 1 ? "active" : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li key="next" className={`page-item ${currentPage === totalPages ? "disabled" : ""
                                    }`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        aria-label="Next"
                                    >
                                        <span aria-hidden="true">&raquo;</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}

            {showModal && selectedTask && (
                <TaskViewModal task={selectedTask} setShowModal={setShowModal} mode="view" />
            )}
        </div>
    );
}
