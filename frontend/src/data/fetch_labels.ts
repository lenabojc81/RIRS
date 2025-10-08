import { baseURL } from "../../global";

export interface Label {
    id: string;
    name: string;
    color: string;
}

export const fetchLabels = async (): Promise<Label[]> => {
    try {
        const response = await fetch(`${baseURL}/labels/getLabels`, {
            method: 'GET',
            credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const labels = await response.json();
        console.log("Labels fetched successfully:", labels);
        return labels;
    } catch (error) {
        console.error("Error fetching labels:", error);
        throw error;
    }
};

export const createLabel = async (labelData: { name: string; color: string }): Promise<boolean> => {
    try {
        const response = await fetch(`${baseURL}/labels/createLabel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(labelData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Label created successfully:", result);
        return result.success;
    } catch (error) {
        console.error("Error creating label:", error);
        throw error;
    }
};

export interface DeleteLabelResponse {
    success: boolean;
    affectedTasks?: number;
    message?: string;
}

export const deleteLabel = async (labelId: string): Promise<DeleteLabelResponse> => {
    try {
        const response = await fetch(`${baseURL}/labels/deleteLabel/${labelId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Label deleted successfully:", result);
        return {
            success: result.success,
            affectedTasks: result.affectedTasks,
            message: result.message
        };
    } catch (error) {
        console.error("Error deleting label:", error);
        throw error;
    }
};

export const updateLabel = async (labelId: string, labelData: { name?: string; color?: string }): Promise<boolean> => {
    try {
        const response = await fetch(`${baseURL}/labels/editLabel/${labelId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(labelData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Label updated successfully:", result);
        return result.success;
    } catch (error) {
        console.error("Error updating label:", error);
        throw error;
    }
};