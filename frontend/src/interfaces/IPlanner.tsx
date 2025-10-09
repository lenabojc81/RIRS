import { ITask } from "./ITasks";
import { IEvent } from "./IEvent";

export interface IGoal {
    id?: string;
    text: string;
    date_start: Date;
    date_end?: Date;
    date_done?: Date;
    category?: string;
    evaluation?: {
        text: string;
        rating: number;
        date: Date;
    }
}

export interface IPlanner {
    id?: string;
    title: string;
    date_end?: Date;
    date_start: Date;
    date_done?: Date;
    goals?: IGoal[];
    tasks?: ITask[];
    events?: IEvent[];
};

export const initialPlanner: IPlanner = {
    title: "",
    date_start: new Date(),
    date_end: undefined,
    date_done: undefined,
    goals: [],
    tasks: [],
    events: [],
}