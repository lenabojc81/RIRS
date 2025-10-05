import React from "react";
import { ITask } from "../../../interfaces/ITasks";
import { SlTrash, SlPencil } from "react-icons/sl";
import { redirect } from "next/navigation";
import { baseURL } from "../../../../global";
import { deleteTask, updateTask } from "../../../data/fetch_tasks";

interface TaskDetailsProps {
    task: ITask;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedTask, setEditedTask] = React.useState<ITask>(task);

    const handleDelete = async() => {
        const data = await deleteTask(task.id!);
        redirect('/tasks');
    };

    const handleEdit = async() => {
        setIsEditing(true);
    };

    const handleSave = async() => {
        // console.log(task.id);
        const ok = await updateTask(editedTask);
        if (ok) {
            setIsEditing(false);
            window.location.reload();
        }

        redirect('/tasks');
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
            <p><strong>Description:</strong> {task.description}</p>
            {/* <p><strong>Type:</strong> {task.expense ? "Expense" : "Income"}</p> */}
            <p><strong>Date:</strong> {new Date(task.date_start).toLocaleDateString()}</p>
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
                        type="text"
                        value={editedTask.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="form-control mb-2"
                    />
                    {/* <select
                        value={editedTask.expense ? "expense" : "income"}
                        onChange={(e) =>
                            handleChange("expense", e.target.value === "expense")
                        }
                        className="form-control mb-2"
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select> */}
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