import React from "react";
import { ITask } from "../../../interfaces/ITasks";
import { SlTrash, SlPencil, SlCheck, SlRefresh } from "react-icons/sl";
import { redirect } from "next/navigation";
import { baseURL } from "../../../../global";
import { createTask, deleteTask, updateTask } from "../../../data/fetch_tasks";
import { fetchLabels, Label } from "../../../data/fetch_labels";

interface TaskDetailsProps {
    task: ITask;
    mode: string;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, mode }) => {
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
    const sanitizeTask = (task: ITask): ITask => {
        return {
            ...task,
            date_start: safeConvertDate(task.date_start) || new Date(),
            date_end: safeConvertDate(task.date_end),
            date_done: safeConvertDate(task.date_done)
        };
    };

    const [editedTask, setEditedTask] = React.useState<ITask>(sanitizeTask(task));
    const [currentMode, setCurrentMode] = React.useState(mode);
    const [availableLabels, setAvailableLabels] = React.useState<Label[]>([]);
    const [presetLabels] = React.useState<Label[]>([
        { id: 'preset-1', name: 'Work', color: '#3b82f6' },
        { id: 'preset-2', name: 'Personal', color: '#10b981' },
        { id: 'preset-3', name: 'Urgent', color: '#ef4444' },
        { id: 'preset-4', name: 'Health', color: '#f59e0b' },
        { id: 'preset-5', name: 'Learning', color: '#8b5cf6' },
        { id: 'preset-6', name: 'Shopping', color: '#ec4899' },
        { id: 'preset-7', name: 'Finance', color: '#06b6d4' },
        { id: 'preset-8', name: 'Home', color: '#84cc16' },
    ]);

    React.useEffect(() => {
        setCurrentMode(mode);
    }, [mode]);

    React.useEffect(() => {
        // Fetch user labels and combine with preset labels
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
        
        // Load labels for all modes (view, create, edit) since view mode needs them to display labels
        loadLabels();
    }, [currentMode, presetLabels]);

    const handleDelete = async () => {
        const success = await deleteTask(task.id!);
        if (success) {
            // Redirect to tasks page
            window.location.href = '/tasks';
        }
    };

    const handleEdit = async () => {
        setCurrentMode("edit");
    };

    const handleMarkAsDone = async () => {
        const updatedTask = {
            ...task,
            date_done: new Date()
        };
        
        const success = await updateTask(updatedTask);
        if (success) {
            // Close modal and let parent component handle refresh
            window.location.href = '/tasks';
        }
    };

    const handleReopen = async () => {
        // Send the task with date_done explicitly set to null for the API
        const updatedTask = {
            ...task,
            date_done: null as any // Explicitly null to clear the field in the database
        };
        
        console.log("Reopening task:", updatedTask); // Debug log
        const success = await updateTask(updatedTask as ITask);
        console.log("Update success:", success); // Debug log
        if (success) {
            // Close modal and let parent component handle refresh
            window.location.href = '/tasks';
        }
    };

    const handleSave = async () => {
        // console.log(task.id);
        let ok;
        if (currentMode === "edit") {
            ok = await updateTask(editedTask);
        } else {
            const createdTask = await createTask(editedTask);
            ok = createdTask !== false; // createTask now returns the task or false
        }
        if (ok) {
            // Redirect to tasks page without reload
            window.location.href = '/tasks';
        }
    };

    const handleChange = (field: string, value: any) => {
        setEditedTask((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <div className="container mt-4">

            {/* name */}
            {currentMode === "view" && (
                <h2>{task.name.toUpperCase()}</h2>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Name</strong>
                    <input
                        type="text"
                        value={editedTask.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="form-control mb-2"
                    />
                </div>
            )}

            {/* date_end */}
            {(currentMode === "view" && task.date_end !== undefined) && (
                <p>
                    <strong>Due date: </strong>
                    {(() => {
                        const date = safeConvertDate(task.date_end);
                        return date ? date.toLocaleDateString() : 'No date set';
                    })()}
                </p>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Due date</strong>
                    <input
                        type="date"
                        value={(() => {
                            if (!editedTask.date_end) return "";
                            try {
                                const date = safeConvertDate(editedTask.date_end);
                                return date ? date.toISOString().split("T")[0] : "";
                            } catch (error) {
                                console.error("Error formatting date for input:", error);
                                return "";
                            }
                        })()}
                        onChange={(e) => {
                            const newDate = e.target.value ? new Date(e.target.value) : undefined;
                            handleChange("date_end", newDate);
                        }}
                        className="form-control mb-2"
                    />
                </div>
            )}

            {/* priority */}
            {currentMode === "view" && (
                <p>
                    <strong>Priority: </strong>
                    {(() => {
                        const priority = task.priority || 3;
                        switch (priority) {
                            case 1: return "🔴 Critical (1)";
                            case 2: return "🟠 High (2)";
                            case 3: return "🟡 Medium (3)";
                            case 4: return "🟢 Low (4)";
                            case 5: return "🔵 Very Low (5)";
                            default: return "🟡 Medium (3)";
                        }
                    })()}
                </p>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Priority</strong>
                    <select
                        value={editedTask.priority || 3}
                        onChange={(e) => handleChange("priority", parseInt(e.target.value))}
                        className="form-control mb-2"
                    >
                        <option value={1}>🔴 Critical (1) - Highest Priority</option>
                        <option value={2}>🟠 High (2) - High Priority</option>
                        <option value={3}>🟡 Medium (3) - Medium Priority</option>
                        <option value={4}>🟢 Low (4) - Low Priority</option>
                        <option value={5}>🔵 Very Low (5) - Lowest Priority</option>
                    </select>
                </div>
            )}

            {/* date_done */}
            {(currentMode === "view" && task.date_done !== undefined && task.date_done !== null) && (
                <p>
                    <strong>Completed date: </strong>
                    {(() => {
                        const date = safeConvertDate(task.date_done);
                        return date ? date.toLocaleDateString() : 'Invalid date';
                    })()}
                </p>
            )}
            {/* {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Completed date</strong>
                    <input
                        type="date"
                        value={
                            editedTask.date_done
                                ? typeof editedTask.date_done === "string"
                                    ? editedTask.date_done
                                    : editedTask.date_done.toISOString().split("T")[0]
                                : ""
                        }
                        onChange={(e) => handleChange("date_done", e.target.value)}
                        className="form-control mb-2"
                    />
                </div>
            )} */}

            {/* labels */}
            {currentMode === "view" && (task.labels && task.labels.length > 0) && (
                <div className="mb-3">
                    <strong>Labels: </strong>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {task.labels.map((labelId) => {
                            const label = availableLabels.find(l => l.id === labelId);
                            if (!label) return null;
                            return (
                                <span 
                                    key={labelId}
                                    className="badge d-flex align-items-center"
                                    style={{
                                        backgroundColor: label.color,
                                        color: '#fff',
                                        fontSize: '0.8rem',
                                        padding: '0.4rem 0.8rem'
                                    }}
                                >
                                    <i className="bi bi-tag-fill me-1"></i>
                                    {label.name}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Labels</strong>
                    <div className="mt-2">
                        <div className="row g-2">
                            {availableLabels.map((label) => {
                                const isSelected = editedTask.labels?.includes(label.id) || false;
                                return (
                                    <div key={label.id} className="col-sm-6 col-md-4">
                                        <div 
                                            className={`card cursor-pointer border-2 ${isSelected ? 'border-primary' : 'border-light'}`}
                                            onClick={() => {
                                                const currentLabels = editedTask.labels || [];
                                                if (isSelected) {
                                                    // Remove label
                                                    handleChange("labels", currentLabels.filter(id => id !== label.id));
                                                } else {
                                                    // Add label
                                                    handleChange("labels", [...currentLabels, label.id]);
                                                }
                                            }}
                                            style={{
                                                transition: 'all 0.2s ease',
                                                transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                                            }}
                                        >
                                            <div className="card-body p-2 d-flex align-items-center">
                                                <div 
                                                    className="rounded-circle me-2"
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        backgroundColor: label.color
                                                    }}
                                                ></div>
                                                <small className="flex-grow-1">{label.name}</small>
                                                {isSelected && (
                                                    <i className="bi bi-check-circle-fill text-primary"></i>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {availableLabels.length === 0 && (
                            <div className="text-center py-3 text-muted">
                                <i className="bi bi-tags display-6 mb-2"></i>
                                <p className="mb-0">No labels available. Create some in your profile!</p>
                            </div>
                        )}
                        {editedTask.labels && editedTask.labels.length > 0 && (
                            <div className="mt-3">
                                <small className="text-muted">Selected labels:</small>
                                <div className="d-flex flex-wrap gap-2 mt-1">
                                    {editedTask.labels.map((labelId) => {
                                        const label = availableLabels.find(l => l.id === labelId);
                                        if (!label) return null;
                                        return (
                                            <span 
                                                key={labelId}
                                                className="badge"
                                                style={{
                                                    backgroundColor: label.color,
                                                    color: '#fff',
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                {label.name}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* estimated_time */}
            {currentMode === "view" && task.estimated_time !== 0 && (
                <p>
                    <strong>Expected duration: </strong>
                    {task.estimated_time} hour(s)
                </p>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Expected duration (in hours)</strong>
                    <input
                        type="number"
                        value={editedTask.estimated_time}
                        onChange={(e) => handleChange("estimated_time", e.target.value)}
                        className="form-control mb-2"
                    />
                </div>
            )}

            {/* assigned to */}

            {/* group */}

            {/* planner */}


            {/* description */}
            {currentMode === "view" && task.description !== "" && (
                <p>
                    <strong>Description: </strong>
                    {task.description}
                </p>
            )}
            {(currentMode === "edit" || currentMode === "create") && (
                <div className="mb-3">
                    <strong>Description</strong>
                    <textarea
                        value={editedTask.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="form-control mb-2"
                    />
                </div>
            )}

            <div className="row justify-content-center">
                {(currentMode === "edit" || currentMode === "create") ? (
                        <button className="btn btn-success" onClick={handleSave}>
                            Save
                        </button>
                ) : (
                    <>
                        <div className="col-3 d-flex justify-content-center">
                            <button
                                className="btn btn-link text-secondary"
                                onClick={() => handleEdit()}
                                aria-label="Edit Task"
                            >
                                <SlPencil size={24} />
                            </button>
                        </div>
                        {/* Show Mark as Done button for incomplete tasks, Reopen button for completed tasks */}
                        {!task.date_done ? (
                            <div className="col-3 d-flex justify-content-center">
                                <button
                                    className="btn btn-link text-success"
                                    onClick={handleMarkAsDone}
                                    aria-label="Mark as Done"
                                >
                                    <SlCheck size={24} />
                                </button>
                            </div>
                        ) : (
                            <div className="col-3 d-flex justify-content-center">
                                <button
                                    className="btn btn-link text-warning"
                                    onClick={handleReopen}
                                    aria-label="Reopen Task"
                                >
                                    <SlRefresh size={24} />
                                </button>
                            </div>
                        )}
                        <div className="col-3 d-flex justify-content-center">
                            <button
                                className="btn btn-link text-danger"
                                onClick={() => handleDelete()}
                                aria-label="Delete Task"
                            >
                                <SlTrash size={24} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;