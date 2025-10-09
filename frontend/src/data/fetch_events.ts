import { IEvent } from '../interfaces/IEvent';
import { baseURL } from '../../global';

// Create a new event in a specific planner
export const createEvent = async (plannerId: string, event: IEvent): Promise<IEvent | false> => {
    try {
        const response = await fetch(`${baseURL}/planner/addEvent/${plannerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating event:', errorData.error);
            return false;
        }

        const data = await response.json();
        console.log('Event created successfully:', data.event);
        return data.event;
    } catch (error) {
        console.error('Error creating event:', error);
        return false;
    }
};

// Update an existing event in a specific planner
export const updateEvent = async (plannerId: string, event: IEvent): Promise<boolean> => {
    try {
        if (!event.id) {
            console.error('Event ID is required for updating');
            return false;
        }

        const response = await fetch(`${baseURL}/planner/updateEvent/${plannerId}/${event.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating event:', errorData.error);
            return false;
        }

        const data = await response.json();
        console.log('Event updated successfully:', data.event);
        return true;
    } catch (error) {
        console.error('Error updating event:', error);
        return false;
    }
};

// Delete an event from a specific planner
export const deleteEvent = async (plannerId: string, eventId: string): Promise<boolean> => {
    try {
        const response = await fetch(`${baseURL}/planner/deleteEvent/${plannerId}/${eventId}`, {
            method: 'DELETE',
            credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting event:', errorData.error);
            return false;
        }

        console.log('Event deleted successfully');
        return true;
    } catch (error) {
        console.error('Error deleting event:', error);
        return false;
    }
};