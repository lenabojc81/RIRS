"use client";

import React, { useEffect, useState } from "react";
import { ITask } from "../../../interfaces/ITasks";
import { fetchCompletedTasks, deleteMultipleTasks } from "../../../data/fetch_tasks";
import { fetchLabels, Label } from "../../../data/fetch_labels";

type SortOption = 'completion_date' | 'created_date' | 'priority' | 'alphabetical';
type FilterOption = 'all' | 'this_week' | 'this_month' | 'last_month' | 'this_year';

export default function CompletedTasksList() {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<SortOption>('completion_date');
    const [filterBy, setFilterBy] = useState<FilterOption>('all');
    const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
    const [labelFilter, setLabelFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(false);

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

    // Load tasks and labels
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Load completed tasks
                const completedTasks = await fetchCompletedTasks();
                setTasks(completedTasks);
                
                // Load labels
                const userLabels = await fetchLabels();
                setAvailableLabels([...presetLabels, ...userLabels]);
            } catch (error) {
                console.error('Error loading data:', error);
                setAvailableLabels(presetLabels);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
    }, []);

    // Filter tasks by date range
    const filterTasks = (tasks: ITask[], filter: FilterOption): ITask[] => {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        switch (filter) {
            case 'this_week':
                return tasks.filter(task => {
                    const completionDate = safeConvertDate(task.date_done);
                    return completionDate && completionDate >= startOfWeek;
                });
            case 'this_month':
                return tasks.filter(task => {
                    const completionDate = safeConvertDate(task.date_done);
                    return completionDate && completionDate >= startOfMonth;
                });
            case 'last_month':
                return tasks.filter(task => {
                    const completionDate = safeConvertDate(task.date_done);
                    return completionDate && completionDate >= startOfLastMonth && completionDate <= endOfLastMonth;
                });
            case 'this_year':
                return tasks.filter(task => {
                    const completionDate = safeConvertDate(task.date_done);
                    return completionDate && completionDate >= startOfYear;
                });
            case 'all':
            default:
                return tasks;
        }
    };

    // Filter tasks by label
    const filterTasksByLabel = (tasks: ITask[], labelId: string): ITask[] => {
        if (labelId === 'all') return tasks;
        
        return tasks.filter(task => {
            if (task.labels && task.labels.includes(labelId)) {
                return true;
            }
            if (task.label && task.label === labelId) {
                return true;
            }
            return false;
        });
    };

    // Sort tasks
    const sortTasks = (tasks: ITask[], sort: SortOption): ITask[] => {
        const sortedTasks = [...tasks];
        
        switch (sort) {
            case 'completion_date':
                return sortedTasks.sort((a, b) => {
                    const dateA = safeConvertDate(a.date_done);
                    const dateB = safeConvertDate(b.date_done);
                    if (!dateA || !dateB) return 0;
                    return dateB.getTime() - dateA.getTime(); // Most recent first
                });
            case 'created_date':
                return sortedTasks.sort((a, b) => {
                    const dateA = safeConvertDate(a.date_start);
                    const dateB = safeConvertDate(b.date_start);
                    if (!dateA || !dateB) return 0;
                    return dateB.getTime() - dateA.getTime(); // Most recent first
                });
            case 'priority':
                return sortedTasks.sort((a, b) => {
                    const priorityA = a.priority || 3;
                    const priorityB = b.priority || 3;
                    return priorityA - priorityB; // Higher priority (lower number) first
                });
            case 'alphabetical':
                return sortedTasks.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return sortedTasks;
        }
    };

    // Apply filtering and sorting
    useEffect(() => {
        const dateFiltered = filterTasks(tasks, filterBy);
        const labelFiltered = filterTasksByLabel(dateFiltered, labelFilter);
        const sorted = sortTasks(labelFiltered, sortBy);
        setFilteredTasks(sorted);
    }, [tasks, sortBy, filterBy, labelFilter]);

    // Handle task selection
    const handleTaskSelect = (taskId: string, isSelected: boolean) => {
        const newSelection = new Set(selectedTasks);
        if (isSelected) {
            newSelection.add(taskId);
        } else {
            newSelection.delete(taskId);
        }
        setSelectedTasks(newSelection);
    };

    // Handle select all
    const handleSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            setSelectedTasks(new Set(filteredTasks.map(task => task.id!)));
        } else {
            setSelectedTasks(new Set());
        }
    };

    // Handle delete selected tasks
    const handleDeleteSelected = async () => {
        if (selectedTasks.size === 0) return;

        const confirmed = window.confirm(
            `⚠️ Delete ${selectedTasks.size} Task(s)?\n\n` +
            `This will permanently delete the selected completed tasks.\n` +
            `This action cannot be undone.\n\n` +
            `Are you sure you want to continue?`
        );

        if (confirmed) {
            setIsLoading(true);
            try {
                const taskIds = Array.from(selectedTasks);
                const result = await deleteMultipleTasks(taskIds);
                
                if (result.success) {
                    // Refresh tasks list
                    const updatedTasks = await fetchCompletedTasks();
                    setTasks(updatedTasks);
                    setSelectedTasks(new Set());
                    alert(`✅ Successfully deleted ${result.deletedCount} task(s)!`);
                } else {
                    alert(`❌ Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Error deleting tasks:', error);
                alert('❌ An error occurred while deleting tasks.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle delete all tasks
    const handleDeleteAll = async () => {
        if (filteredTasks.length === 0) return;

        const confirmed = window.confirm(
            `⚠️ Delete ALL ${filteredTasks.length} Completed Task(s)?\n\n` +
            `This will permanently delete ALL your completed tasks that match the current filters.\n` +
            `This action cannot be undone and will clear your task history.\n\n` +
            `Are you absolutely sure you want to continue?`
        );

        if (confirmed) {
            setIsLoading(true);
            try {
                const taskIds = filteredTasks.map(task => task.id!);
                const result = await deleteMultipleTasks(taskIds);
                
                if (result.success) {
                    // Refresh tasks list
                    const updatedTasks = await fetchCompletedTasks();
                    setTasks(updatedTasks);
                    setSelectedTasks(new Set());
                    alert(`✅ Successfully deleted all ${result.deletedCount} completed tasks!`);
                } else {
                    alert(`❌ Error: ${result.message}`);
                }
            } catch (error) {
                console.error('Error deleting all tasks:', error);
                alert('❌ An error occurred while deleting tasks.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading your completed tasks...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Filter and Sort Controls */}
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                    <div className="row g-3 align-items-center">
                        {/* Date Filter */}
                        <div className="col-md-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                                     style={{width: '40px', height: '40px'}}>
                                    <i className="bi bi-calendar fs-6"></i>
                                </div>
                                <div>
                                    <h6 className="mb-1">Date Range</h6>
                                    <select 
                                        className="form-select form-select-sm"
                                        value={filterBy}
                                        onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                                        style={{minWidth: '120px'}}
                                    >
                                        <option value="all">All Time ({tasks.length})</option>
                                        <option value="this_week">This Week</option>
                                        <option value="this_month">This Month</option>
                                        <option value="last_month">Last Month</option>
                                        <option value="this_year">This Year</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Label Filter */}
                        <div className="col-md-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                                     style={{width: '40px', height: '40px'}}>
                                    <i className="bi bi-tags fs-6"></i>
                                </div>
                                <div>
                                    <h6 className="mb-1">Label</h6>
                                    <select 
                                        className="form-select form-select-sm"
                                        value={labelFilter}
                                        onChange={(e) => setLabelFilter(e.target.value)}
                                        style={{minWidth: '120px'}}
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

                        {/* Sort */}
                        <div className="col-md-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                                     style={{width: '40px', height: '40px'}}>
                                    <i className="bi bi-sort-down fs-6"></i>
                                </div>
                                <div>
                                    <h6 className="mb-1">Sort By</h6>
                                    <select 
                                        className="form-select form-select-sm"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        style={{minWidth: '120px'}}
                                    >
                                        <option value="completion_date">Completion Date</option>
                                        <option value="created_date">Created Date</option>
                                        <option value="priority">Priority</option>
                                        <option value="alphabetical">Alphabetical</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="col-md-3">
                            <div className="d-flex align-items-center">
                                <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                                     style={{width: '40px', height: '40px'}}>
                                    <i className="bi bi-trash fs-6"></i>
                                </div>
                                <div>
                                    <h6 className="mb-1">Actions</h6>
                                    <div className="btn-group" role="group">
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={handleDeleteSelected}
                                            disabled={selectedTasks.size === 0 || isLoading}
                                        >
                                            Delete Selected ({selectedTasks.size})
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={handleDeleteAll}
                                            disabled={filteredTasks.length === 0 || isLoading}
                                        >
                                            Delete All
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Results Summary */}
                    <div className="mt-3 pt-3 border-top">
                        <div className="d-flex justify-content-between align-items-center text-muted small">
                            <span>
                                Showing {filteredTasks.length} of {tasks.length} completed tasks
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
                            {selectedTasks.size > 0 && (
                                <span className="text-primary">
                                    <i className="bi bi-check-square me-1"></i>
                                    {selectedTasks.size} task(s) selected
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Task List */}
            {filteredTasks.length === 0 ? (
                <div className="text-center py-5">
                    <i className="bi bi-check-circle display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">No Completed Tasks Found</h5>
                    <p className="text-muted mb-0">
                        {tasks.length === 0 
                            ? "You haven't completed any tasks yet. Complete some tasks to see them here!"
                            : "No tasks match the current filters. Try adjusting your search criteria."
                        }
                    </p>
                </div>
            ) : (
                <>
                    {/* Select All Checkbox */}
                    {filteredTasks.length > 0 && (
                        <div className="card mb-3 border-0 shadow-sm">
                            <div className="card-body py-2">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="selectAll"
                                        checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                    <label className="form-check-label fw-bold text-muted" htmlFor="selectAll">
                                        Select All ({filteredTasks.length} tasks)
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tasks */}
                    {filteredTasks.map((task) => (
                        <div key={task.id} className="card mb-3 border-0 shadow-sm">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-auto">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            checked={selectedTasks.has(task.id!)}
                                            onChange={(e) => handleTaskSelect(task.id!, e.target.checked)}
                                        />
                                    </div>
                                    <div className="col">
                                        <div className="d-flex align-items-center mb-2">
                                            <h6 className="card-title mb-0 me-2 text-decoration-line-through text-muted">
                                                {task.name}
                                            </h6>
                                            <span className="badge bg-success text-white me-2" style={{fontSize: '0.6rem'}}>
                                                <i className="bi bi-check-circle me-1"></i>Completed
                                            </span>
                                            {/* Priority Badge */}
                                            {task.priority && task.priority <= 2 && (
                                                <span className={`badge ms-1 ${task.priority === 1 ? 'bg-danger' : 'bg-warning text-dark'}`} style={{fontSize: '0.6rem'}}>
                                                    {task.priority === 1 ? '🔴 Critical' : '🟠 High'}
                                                </span>
                                            )}
                                            {/* Label Badges */}
                                            {task.labels && task.labels.length > 0 && (
                                                <div className="d-flex flex-wrap gap-1 ms-2">
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
                                        
                                        {task.description && (
                                            <p className="card-text text-muted mb-2 small">{task.description}</p>
                                        )}
                                        
                                        <div className="row text-muted small">
                                            <div className="col-md-6">
                                                <i className="bi bi-check-circle me-1 text-success"></i>
                                                Completed: {(() => {
                                                    const date = safeConvertDate(task.date_done);
                                                    return date ? date.toLocaleDateString() : 'Unknown date';
                                                })()}
                                            </div>
                                            {task.date_end && (
                                                <div className="col-md-6">
                                                    <i className="bi bi-calendar-event me-1"></i>
                                                    Due: {(() => {
                                                        const date = safeConvertDate(task.date_end);
                                                        return date ? date.toLocaleDateString() : 'Invalid date';
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}