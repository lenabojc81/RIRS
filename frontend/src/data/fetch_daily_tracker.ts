import { baseURL } from "../../global";

export async function cleanupDailyTracker(): Promise<{ success: boolean; cleanedCount?: number; message?: string }> {
    try {
        const response = await fetch(`${baseURL}/task/cleanupDailyTracker`, {
            method: 'POST',
            credentials: 'include', // Include authentication cookies
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: data.success,
                cleanedCount: data.cleanedCount,
                message: data.message
            };
        } else {
            const errorData = await response.json();
            console.error('Error cleaning up daily tracker:', errorData.error);
            return { success: false, message: errorData.error };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred while cleaning up daily tracker.' };
    }
}