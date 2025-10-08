import React from "react";
import { ITask } from "../../../interfaces/ITasks";
import { SlTrash, SlPencil, SlCheck, SlRefresh } from "react-icons/sl";
import { redirect } from "next/navigation";
import { baseURL } from "../../../../global";
import { createTask, deleteTask, updateTask } from "../../../data/fetch_tasks";

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

    React.useEffect(() => {
        setCurrentMode(mode);
    }, [mode]);

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
            ok = await createTask(editedTask);
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

            {/* label */}


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