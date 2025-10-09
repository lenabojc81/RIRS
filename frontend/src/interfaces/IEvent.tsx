export interface IEvent {
    id?: string;
    name: string;
    description?: string;
    date_start: Date;
    date_end?: Date;
    location?: string;
    color?: string;
    labels?: string[];
}

export const initialEvent: IEvent = {
    name: "",
    description: "",
    date_start: new Date(),
    date_end: undefined,
    location: "",
    color: "#3b82f6", // Default blue color
    labels: [],
}