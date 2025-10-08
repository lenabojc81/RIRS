import { ITask } from './ITasks';
import { IPlanner } from './IPlanner';

export interface ILabel {
    id: string;
    name: string;
    color: string;
}

export interface IUser {
    uid: string;
    email: string;
    username: string;
    createdAt?: Date;
    updatedAt?: Date;
    tasks: ITask[];
    planners: IPlanner[];
    labels: ILabel[];
}

export const initialUser: IUser = {
    uid: '',
    email: '',
    username: '',
    tasks: [],
    planners: [],
    labels: [],
};