export interface ITransaction {
    _id?: string;
    name: string;
    amount: number;
    expense: boolean;
    date: Date;
}

export const initialTransaction: ITransaction = {
    name: "",
    amount: 0,
    expense: false,
    date: new Date(),
};