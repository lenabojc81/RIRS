"use client";

import { IPlanner } from "../interfaces/IPlanner";
import { baseURL } from "../../global";

export async function createPlanner(planner: IPlanner) {
    try {
        const response = await fetch(`${baseURL}/planner/createPlanner`, {
            method: 'POST',
            credentials: 'include', // Include authentication cookies
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...planner, date_start: new Date() }),
        })

        if (response.status === 201) {
            return true;
        } else {
            alert('Error: Failed to save planner.');
            return false;
        }
    } catch (error) {
        alert('Error: An error occurred while saving the planner.');
        console.error(error);
        return false;
    }
}

export async function getPlanners() {
    try {
        const response = await fetch(`${baseURL}/planner/getUndonePlanners`, {
            method: 'GET',
            credentials: 'include', // Include authentication cookies
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.status === 200) {
            const data = await response.json();
            console.log("Fetched planners:", data);
            return data;
        } else {
            alert('Error: Failed to fetch planners.');
            return [];
        }
    } catch (error) {
        alert('Error: An error occurred while fetching planners.');
        console.error(error);
        return [];
    }
};

export async function updatePlanner(planner: IPlanner) {
    try {
        const response = await fetch(`${baseURL}/planner/editPlanner/${planner.id}`, {
            method: 'PUT',
            credentials: 'include', // Include authentication cookies
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(planner),
        })

        if (response.status === 200) {
            return true;
        } else {
            alert('Error: Failed to save planner.');
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function deletePlanner(plannerId: string) {
    try {
        const response = await fetch(`${baseURL}/planner/deletePlanner/${plannerId}`, {
            method: 'DELETE',
            credentials: 'include', // Include authentication cookies
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (response.status === 200) {
            return true;
        } else {
            alert('Error: Failed to delete planner.');
            return false;
        }
    } catch (error) {
        alert('Error: An error occurred while deleting the planner.');
        console.error(error);
        return false;
    }
}