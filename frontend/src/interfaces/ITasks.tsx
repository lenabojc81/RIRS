export interface ITask {
    _id?: string;
    name: string;
    amount: number;
    expense: boolean;
    date: Date;
}

export const initialTask: ITask = {
    name: "",
    amount: 0,
    expense: false,
    date: new Date(),
};