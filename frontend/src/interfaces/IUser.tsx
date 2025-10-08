import { ITask } from './ITasks';
import { IPlanner } from './IPlanner';

export interface IUser {
    uid: string;
    email: string;
    username: string;
    createdAt?: Date;
    updatedAt?: Date;
    tasks: ITask[];
    planners: IPlanner[];
}

export const initialUser: IUser = {
    uid: '',
    email: '',
    username: '',
    tasks: [],
    planners: [],
};