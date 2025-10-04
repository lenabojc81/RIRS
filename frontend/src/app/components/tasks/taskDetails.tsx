import React from "react";
import { ITask } from "../../../interfaces/ITasks";
import { SlTrash, SlPencil } from "react-icons/sl";
import { redirect } from "next/navigation";
import { baseURL } from "../../../../global";

interface TaskDetailsProps {
    task: ITask;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedTask, setEditedTask] = React.useState<ITask>(task);

    const handleDelete = async() => {
        try {
            const response = await fetch(`${baseURL}/task/deleteTask/${task._id}`, {
                method: 'Delete',
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error: Failed to save task.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            redirect('/');
        }
    };

    const handleEdit = async() => {
        setIsEditing(true);
    };

    const handleSave = async() => {
        try {
            const response = await fetch(`${baseURL}/task/editTask/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedTask),
            });

            if (response.ok) {
                setIsEditing(false);
                window.location.reload();
            } else {
                alert('Error: Failed to save task.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            redirect('/');
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
            <h3>{task.name}</h3>
            <p><strong>Amount:</strong> €{task.amount.toFixed(2)}</p>
            <p><strong>Type:</strong> {task.expense ? "Expense" : "Income"}</p>
            <p><strong>Date:</strong> {new Date(task.date).toLocaleDateString()}</p>
            <div className="row justify-content-center">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editedTask.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="form-control mb-2"
                    />
                    <input
                        type="number"
                        value={editedTask.amount}
                        onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                        className="form-control mb-2"
                    />
                    <select
                        value={editedTask.expense ? "expense" : "income"}
                        onChange={(e) =>
                            handleChange("expense", e.target.value === "expense")
                        }
                        className="form-control mb-2"
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <button className="btn btn-success" onClick={handleSave}>
                        OK
                    </button>
                </>
            ) : (
                <>
                    <div className="col-4 d-flex justify-content-center ">
                        <button
                            className="btn btn-link text-secondary"
                            onClick={() => handleEdit()}
                            aria-label="Edit Task"
                        >
                            <SlPencil size={24} />
                        </button>
                    </div>
                    <div className="col-4 d-flex justify-content-center">
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