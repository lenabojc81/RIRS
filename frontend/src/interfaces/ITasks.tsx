export interface ITask {
    id?: string;
    name: string;
    description?: string;
    date_end?: Date;
    date_start: Date;
    date_done?: Date;
    assigned_to?: [string];
    label?: string;
    estimated_time?: number;
}

export const initialTask: ITask = {
    name: "",
    description: "",
    date_start: new Date(),
    date_end: undefined,
    date_done: undefined,
    assigned_to: [""],
    label: "",
    estimated_time: 0,
};