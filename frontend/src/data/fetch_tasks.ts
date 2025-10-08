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
            return true;
        } else {
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
            body: JSON.stringify({ ...task, date_start: new Date() }),
        })

        if (response.status === 201) {
            return true;
        } else {
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
            return true;
        } else {
            const errorText = await response.text();
            console.error("Update failed:", errorText); // Debug log
            alert('Error: Failed to save task.');
            return false;
        }
    } catch (error) {
        console.error("Update error:", error);
        return false;
    }
}