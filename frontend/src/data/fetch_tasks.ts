"use client";

import { ITask } from "../interfaces/ITasks";
import { baseURL } from "../../global";

export async function fetchTasks(): Promise<ITask[]> {
    try {
        const response = await fetch(`${baseURL}/task/getTasks`, {
            credentials: 'include', // Include authentication cookies
        });
        if (!response.ok) {
            console.error("Failed to fetch tasks:", response.statusText);
            return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function deleteTask(id: string): Promise<boolean> {
    try {
        const response = await fetch(`${baseURL}/task/deleteTask/${id}`, {
            method: 'Delete',
            credentials: 'include', // Include authentication cookies
        });

        if (response.ok) {
            const data = await response.json();
            return data.success;
        } else {
            const errorData = await response.json();
            console.error('Error deleting task:', errorData.error);
            alert('Error: Failed to delete task.');
            return false;
        }
    } catch (error) {
        console.error(error);
        alert('Error: An error occurred while deleting the task.');
        return false;
    }
}

export async function createTask(task: ITask) {
    try {
        const response = await fetch(`${baseURL}/task/createTask`, {
            method: 'POST',
            credentials: 'include', // Include authentication cookies
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })

        if (response.status === 201) {
            const data = await response.json();
            return data.success;
        } else {
            const errorData = await response.json();
            console.error('Error creating task:', errorData.error);
            alert('Error: Failed to save task.');
            return false;
        }
    } catch (error) {
        alert('Error: An error occurred while saving the task.');
        console.error(error);
        return false;
    }
}

export async function updateTask(task: ITask) {
    try {
        console.log("Sending task update:", JSON.stringify(task, null, 2)); // Debug log
        const response = await fetch(`${baseURL}/task/editTask/${task.id}`, {
            method: 'PUT',
            credentials: 'include', // Include authentication cookies
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })

        console.log("Update response status:", response.status); // Debug log
        if (response.status === 200) {
            const data = await response.json();
            return data.success;
        } else {
            const errorData = await response.json();
            console.error("Update failed:", errorData.error); // Debug log
            alert('Error: Failed to save task.');
            return false;
        }
    } catch (error) {
        console.error("Update error:", error);
        return false;
    }
}

export async function fetchCompletedTasks(): Promise<ITask[]> {
    try {
        const response = await fetch(`${baseURL}/task/getCompletedTasks`, {
            credentials: 'include', // Include authentication cookies
        });
        if (!response.ok) {
            console.error("Failed to fetch completed tasks:", response.statusText);
            return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function deleteMultipleTasks(taskIds: string[]): Promise<{ success: boolean; deletedCount?: number; message?: string }> {
    try {
        const response = await fetch(`${baseURL}/task/deleteTasks`, {
            method: 'DELETE',
            credentials: 'include', // Include authentication cookies
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskIds }),
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: data.success,
                deletedCount: data.deletedCount,
                message: data.message
            };
        } else {
            const errorData = await response.json();
            console.error('Error deleting tasks:', errorData.error);
            return { success: false, message: errorData.error };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while deleting tasks.' };
    }
}