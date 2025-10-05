"use client";

import { ITask } from "../interfaces/ITasks";
import { baseURL } from "../../global";

export async function fetchTasks(): Promise<ITask[]> {
    try {
        const response = await fetch(`${baseURL}/task/getTasks`);
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

export async function deleteTask(id: string): Promise<void> {
    try {
        const response = await fetch(`${baseURL}/task/deleteTask/${id}`, {
            method: 'Delete',
        });

        if (response.ok) {
            window.location.reload();
        } else {
            alert('Error: Failed to save task.');
        }
    } catch (error) {
        console.error(error);
    }
}

export async function createTask(task: ITask) {
    try {
        const response = await fetch(`${baseURL}/task/createTask`, {
            method: 'POST',
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
        const response = await fetch(`${baseURL}/task/editTask/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })

        if (response.status === 200) {
            return true;
        } else {
            alert('Error: Failed to save task.');
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}